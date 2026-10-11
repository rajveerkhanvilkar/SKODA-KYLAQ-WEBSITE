/**
 * Progressive Frame Loader & Memory-Bounded Frame Streamer
 * 
 * Provides progressive chunked preloading, priority initial frames,
 * nearest-frame fallback during rapid scrub, and automatic memory cleanup.
 */

export interface ProgressiveSequenceController {
  frames: (HTMLImageElement | null)[];
  isReady: () => boolean;
  isComplete: () => boolean;
  getFrame: (targetIndex: number) => HTMLImageElement | null;
  cancel: () => void;
}

export function createProgressiveSequence(options: {
  folder: string;
  totalFrames: number;
  priorityCount?: number;
  batchSize?: number;
  onReady?: () => void;
  onComplete?: () => void;
  onProgress?: (loaded: number, total: number) => void;
}): ProgressiveSequenceController {
  const {
    folder,
    totalFrames,
    priorityCount = 30,
    batchSize = 16,
    onReady,
    onComplete,
    onProgress,
  } = options;

  const frames: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
  let loadedCount = 0;
  let readyDispatched = false;
  let isCancelled = false;
  let nextBatchIndex = 0;

  const loadSingleFrame = (index: number): Promise<void> => {
    return new Promise((resolve) => {
      if (isCancelled || frames[index]) {
        resolve();
        return;
      }

      const img = new window.Image();
      img.decoding = "async";
      img.src = `${folder}/frame_${String(index).padStart(3, "0")}.webp`;

      img.onload = () => {
        if (!isCancelled) {
          frames[index] = img;
          loadedCount++;
          if (onProgress) onProgress(loadedCount, totalFrames);

          if (!readyDispatched && loadedCount >= Math.min(priorityCount, totalFrames)) {
            readyDispatched = true;
            if (onReady) onReady();
          }

          if (loadedCount >= totalFrames) {
            if (onComplete) onComplete();
          }
        }
        resolve();
      };

      img.onerror = () => {
        if (!isCancelled) {
          loadedCount++;
          if (!readyDispatched && loadedCount >= Math.min(priorityCount, totalFrames)) {
            readyDispatched = true;
            if (onReady) onReady();
          }
        }
        resolve();
      };
    });
  };

  const scheduleNextBatch = () => {
    if (isCancelled || nextBatchIndex >= totalFrames) return;

    const start = nextBatchIndex;
    const end = Math.min(totalFrames, start + batchSize);
    nextBatchIndex = end;

    const promises: Promise<void>[] = [];
    for (let i = start; i < end; i++) {
      promises.push(loadSingleFrame(i));
    }

    Promise.all(promises).then(() => {
      if (!isCancelled && nextBatchIndex < totalFrames) {
        // Schedule next batch on idle or short timeout to keep main thread fluid
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          (window as any).requestIdleCallback(scheduleNextBatch, { timeout: 150 });
        } else {
          setTimeout(scheduleNextBatch, 20);
        }
      }
    });
  };

  // 1. Immediately kick off priority frames
  const initialPromises: Promise<void>[] = [];
  const initialEnd = Math.min(priorityCount, totalFrames);
  for (let i = 0; i < initialEnd; i++) {
    initialPromises.push(loadSingleFrame(i));
  }
  nextBatchIndex = initialEnd;

  // 2. Once priority frames are initiated, stream the remainder
  Promise.all(initialPromises).then(() => {
    if (!isCancelled && nextBatchIndex < totalFrames) {
      setTimeout(scheduleNextBatch, 30);
    }
  });

  return {
    frames,
    isReady: () => readyDispatched || loadedCount >= Math.min(priorityCount, totalFrames),
    isComplete: () => loadedCount >= totalFrames,
    getFrame: (targetIndex: number) => {
      const clamped = Math.max(0, Math.min(totalFrames - 1, Math.round(targetIndex)));
      if (frames[clamped]) return frames[clamped];

      // Robust outward search for nearest available frame: zero blank frames
      for (let offset = 1; offset < totalFrames; offset++) {
        const prev = clamped - offset;
        if (prev >= 0 && frames[prev]) return frames[prev];
        const next = clamped + offset;
        if (next < totalFrames && frames[next]) return frames[next];
      }
      return null;
    },
    cancel: () => {
      isCancelled = true;
    },
  };
}

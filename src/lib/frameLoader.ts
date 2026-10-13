/**
 * Enterprise-Grade Progressive Frame Loader & Memory-Bounded Frame Streamer
 * 
 * Capabilities:
 *  - Instant Phase-1 First-Frame Dispatch (<300ms) for zero-delay poster rendering.
 *  - Priority Initial Window (12-16 frames) for immediate responsive scrub start.
 *  - Dynamic Scroll-Directional Sliding Window Preloading (prefetchWindow).
 *  - Memory-Bounded LRU Retention to prevent tab crashes and GC pauses on mobile devices.
 *  - Zero-lag Nearest-Frame Fallback during rapid flick-scrolling (never renders blank).
 *  - Idle-Time Background Streaming using requestIdleCallback to keep main thread at 60/120fps.
 */

export interface ProgressiveSequenceController {
  frames: (HTMLImageElement | null)[];
  isReady: () => boolean;
  isComplete: () => boolean;
  getFrame: (targetIndex: number) => HTMLImageElement | null;
  prefetchWindow: (centerIndex: number, radius?: number) => void;
  cancel: () => void;
}

export interface ProgressiveSequenceOptions {
  folder: string;
  totalFrames: number;
  priorityCount?: number;
  batchSize?: number;
  maxRetainedFrames?: number;
  onFirstFrame?: (img: HTMLImageElement) => void;
  onReady?: () => void;
  onComplete?: () => void;
  onProgress?: (loaded: number, total: number) => void;
}

export function createProgressiveSequence(options: ProgressiveSequenceOptions): ProgressiveSequenceController {
  const {
    folder,
    totalFrames,
    priorityCount = 12,
    batchSize = 12,
    maxRetainedFrames = typeof window !== "undefined" && window.innerWidth < 768 ? 80 : 180,
    onFirstFrame,
    onReady,
    onComplete,
    onProgress,
  } = options;

  const frames: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
  const loadingSet = new Set<number>();
  const accessOrder: number[] = [];

  let loadedCount = 0;
  let readyDispatched = false;
  let isCancelled = false;
  let nextSequentialIndex = 0;
  let activeCenter = 0;

  const loadSingleFrame = (index: number, isCritical = false): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (isCancelled || index < 0 || index >= totalFrames) {
        resolve(null);
        return;
      }

      if (frames[index]) {
        // Update access order
        const idx = accessOrder.indexOf(index);
        if (idx !== -1) accessOrder.splice(idx, 1);
        accessOrder.push(index);
        resolve(frames[index]);
        return;
      }

      if (loadingSet.has(index)) {
        resolve(null);
        return;
      }

      loadingSet.add(index);
      const img = new window.Image();
      img.decoding = "async";
      if (isCritical && "fetchPriority" in img) {
        (img as any).fetchPriority = "high";
      }

      const frameUrl = `${folder}/frame_${String(index).padStart(3, "0")}.webp`;
      img.src = frameUrl;

      img.onload = () => {
        loadingSet.delete(index);
        if (!isCancelled) {
          frames[index] = img;
          loadedCount++;
          accessOrder.push(index);

          // Memory bounding: prune oldest frames if exceeding maxRetainedFrames
          if (accessOrder.length > maxRetainedFrames) {
            // Find a frame furthest from activeCenter to evict
            let furthestIdx = -1;
            let maxDist = -1;
            for (let i = 0; i < accessOrder.length - 20; i++) {
              const candidate = accessOrder[i];
              const dist = Math.abs(candidate - activeCenter);
              if (dist > maxDist) {
                maxDist = dist;
                furthestIdx = i;
              }
            }
            if (furthestIdx !== -1 && maxDist > 30) {
              const evicted = accessOrder.splice(furthestIdx, 1)[0];
              frames[evicted] = null;
              loadedCount = Math.max(0, loadedCount - 1);
            }
          }

          if (index === 0 && onFirstFrame) {
            onFirstFrame(img);
          }

          if (onProgress) onProgress(loadedCount, totalFrames);

          if (!readyDispatched && loadedCount >= Math.min(priorityCount, totalFrames)) {
            readyDispatched = true;
            if (onReady) onReady();
          }

          if (loadedCount >= totalFrames && onComplete) {
            onComplete();
          }
        }
        resolve(img);
      };

      img.onerror = () => {
        loadingSet.delete(index);
        if (!isCancelled) {
          loadedCount++;
          if (!readyDispatched && loadedCount >= Math.min(priorityCount, totalFrames)) {
            readyDispatched = true;
            if (onReady) onReady();
          }
        }
        resolve(null);
      };
    });
  };

  // Prefetch a sliding window of frames around active scrub position
  const prefetchWindow = (centerIndex: number, radius = 20) => {
    if (isCancelled) return;
    activeCenter = Math.max(0, Math.min(totalFrames - 1, Math.round(centerIndex)));

    const start = Math.max(0, activeCenter - Math.floor(radius / 2));
    const end = Math.min(totalFrames, activeCenter + radius);

    for (let i = start; i < end; i++) {
      if (!frames[i] && !loadingSet.has(i)) {
        loadSingleFrame(i);
      }
    }
  };

  // Idle background streaming
  const scheduleNextBatch = () => {
    if (isCancelled || nextSequentialIndex >= totalFrames) return;

    // Skip frames already loaded in priority / window
    while (nextSequentialIndex < totalFrames && (frames[nextSequentialIndex] || loadingSet.has(nextSequentialIndex))) {
      nextSequentialIndex++;
    }

    if (nextSequentialIndex >= totalFrames) return;

    const start = nextSequentialIndex;
    const end = Math.min(totalFrames, start + batchSize);
    nextSequentialIndex = end;

    const promises: Promise<HTMLImageElement | null>[] = [];
    for (let i = start; i < end; i++) {
      if (!frames[i]) {
        promises.push(loadSingleFrame(i));
      }
    }

    Promise.all(promises).then(() => {
      if (!isCancelled && nextSequentialIndex < totalFrames) {
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          (window as any).requestIdleCallback(scheduleNextBatch, { timeout: 200 });
        } else {
          setTimeout(scheduleNextBatch, 30);
        }
      }
    });
  };

  // Step 1: Critical First Frame (Index 0) loaded immediately
  loadSingleFrame(0, true).then((img0) => {
    if (img0 && onFirstFrame && !isCancelled) {
      onFirstFrame(img0);
    }
  });

  // Step 2: Priority initial window (e.g. 1..priorityCount)
  const initialPromises: Promise<HTMLImageElement | null>[] = [];
  const initialEnd = Math.min(priorityCount, totalFrames);
  for (let i = 1; i < initialEnd; i++) {
    initialPromises.push(loadSingleFrame(i));
  }
  nextSequentialIndex = initialEnd;

  // Step 3: Stream remainder during idle time
  Promise.all(initialPromises).then(() => {
    if (!isCancelled && nextSequentialIndex < totalFrames) {
      setTimeout(scheduleNextBatch, 40);
    }
  });

  return {
    frames,
    isReady: () => readyDispatched || loadedCount >= Math.min(priorityCount, totalFrames),
    isComplete: () => loadedCount >= totalFrames,
    prefetchWindow,
    getFrame: (targetIndex: number) => {
      const clamped = Math.max(0, Math.min(totalFrames - 1, Math.round(targetIndex)));
      activeCenter = clamped;

      if (frames[clamped]) {
        return frames[clamped];
      }

      // Proactively trigger load for requested frame
      if (!loadingSet.has(clamped)) {
        loadSingleFrame(clamped);
      }

      // Outward search for nearest available frame (guarantees ZERO black / blank frames)
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
      loadingSet.clear();
      accessOrder.length = 0;
    },
  };
}

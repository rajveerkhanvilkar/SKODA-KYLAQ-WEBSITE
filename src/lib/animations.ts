import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Preloads image frames into memory with high priority
 * for lag-free, instantaneous Canvas rendering during scroll scrubbing.
 */
export async function preloadFrames(
  totalFrames: number,
  getPath: (index: number) => string,
  onProgress?: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> {
  const images: HTMLImageElement[] = new Array(totalFrames);
  let loadedCount = 0;

  return new Promise((resolve) => {
    for (let i = 0; i < totalFrames; i++) {
      const img = new window.Image();
      img.src = getPath(i);
      img.onload = () => {
        loadedCount++;
        images[i] = img;
        if (onProgress) onProgress(loadedCount, totalFrames);
        if (loadedCount === totalFrames) {
          resolve(images);
        }
      };
      img.onerror = () => {
        loadedCount++;
        images[i] = img;
        if (onProgress) onProgress(loadedCount, totalFrames);
        if (loadedCount === totalFrames) {
          resolve(images);
        }
      };
    }
  });
}

/**
 * High-quality HD canvas renderer with image smoothing and high DPI support.
 */
export function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
  fit: "contain" | "cover" = "contain"
) {
  const imgWidth = img instanceof HTMLImageElement ? img.naturalWidth || 1920 : img.videoWidth || 1920;
  const imgHeight = img instanceof HTMLImageElement ? img.naturalHeight || 1080 : img.videoHeight || 1080;

  if (!imgWidth || !imgHeight) return;

  // High quality filtering settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawW = canvasWidth;
  let drawH = canvasHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (fit === "contain") {
    if (canvasRatio > imgRatio) {
      drawH = canvasHeight;
      drawW = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawW) / 2;
    } else {
      drawW = canvasWidth;
      drawH = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawH) / 2;
    }
  } else {
    // Cover mode
    if (canvasRatio > imgRatio) {
      drawW = canvasWidth;
      drawH = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawH) / 2;
    } else {
      drawH = canvasHeight;
      drawW = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawW) / 2;
    }
  }

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

/**
 * High-definition Canvas renderer (Single Crisp Frame, Zero Ghosting, 60FPS)
 */
export function drawBlendedFramesToCanvas(
  ctx: CanvasRenderingContext2D,
  imgA: HTMLImageElement,
  _imgB: HTMLImageElement | undefined | null,
  _blendAlpha: number,
  canvasWidth: number,
  canvasHeight: number,
  fit: "contain" | "cover" = "cover"
) {
  drawImageToCanvas(ctx, imgA, canvasWidth, canvasHeight, fit);
}


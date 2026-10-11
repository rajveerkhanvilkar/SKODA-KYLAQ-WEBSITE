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
 * Ultra-smooth sub-frame blended Canvas renderer.
 * Eliminates discrete frame stepping ("frames dikhna") by continuously blending
 * between frame A and frame B using sub-pixel fractional alpha crossfade.
 */
export function drawBlendedFramesToCanvas(
  ctx: CanvasRenderingContext2D,
  imgA: HTMLImageElement,
  imgB: HTMLImageElement | undefined | null,
  blendAlpha: number,
  canvasWidth: number,
  canvasHeight: number,
  fit: "contain" | "cover" = "cover"
) {
  const imgWidth = imgA.naturalWidth || 1280;
  const imgHeight = imgA.naturalHeight || 720;
  if (!imgWidth || !imgHeight) return;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

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

  // Draw base frame A fully opaque
  ctx.globalAlpha = 1.0;
  ctx.drawImage(imgA, offsetX, offsetY, drawW, drawH);

  // If there is a next frame and fractional progress > 0.005, blend it seamlessly
  if (imgB && blendAlpha > 0.005) {
    ctx.globalAlpha = Math.min(1.0, Math.max(0.0, blendAlpha));
    ctx.drawImage(imgB, offsetX, offsetY, drawW, drawH);
    ctx.globalAlpha = 1.0;
  }
}


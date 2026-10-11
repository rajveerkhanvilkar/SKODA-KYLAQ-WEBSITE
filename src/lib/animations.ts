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

  // Hardware-accelerated bilinear filtering for maximum sharpness and 60FPS fluid motion
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Clear canvas before drawing
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  // CASE 1: ULTRA-WIDE SCREENS (canvasRatio > imgRatio + 0.05, e.g. 21:9 monitors, laptop viewports)
  // Preserve 16:9 native car footage undistorted & uncropped in center ("contain"),
  // and fill wide flanks with a darkened ambient edge extension from the same footage.
  if (canvasRatio > imgRatio + 0.05) {
    // 1a. Background Ambient Extension: scaled duplicate filling the ultra-wide bounds
    const bgW = canvasWidth;
    const bgH = canvasWidth / imgRatio;
    const bgOffsetY = (canvasHeight - bgH) / 2;

    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.drawImage(img, 0, bgOffsetY, bgW, bgH);
    ctx.restore();

    // 1b. Dark Emerald Studio Vignette to gently fade ambient flanks into pure black
    const grad = ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight / 2,
      canvasHeight * 0.35,
      canvasWidth / 2,
      canvasHeight / 2,
      canvasWidth * 0.65
    );
    grad.addColorStop(0, "rgba(0, 0, 0, 0.3)");
    grad.addColorStop(0.65, "rgba(5, 11, 8, 0.85)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.98)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 1c. Primary Sharp Footage: 100% full height, perfectly centered, native 16:9 aspect ratio, uncropped
    const fgH = canvasHeight;
    const fgW = canvasHeight * imgRatio;
    const fgOffsetX = (canvasWidth - fgW) / 2;

    ctx.drawImage(img, fgOffsetX, 0, fgW, fgH);
  }
  // CASE 2: TALL / MOBILE PORTRAIT (canvasRatio < 1.0)
  // Fill 100% of mobile screen width, centered vertically without cropping car front/rear
  else if (canvasRatio < 1.0) {
    const drawW = canvasWidth;
    const drawH = canvasWidth / imgRatio;
    const offsetY = (canvasHeight - drawH) / 2;

    ctx.drawImage(img, 0, offsetY, drawW, drawH);
  }
  // CASE 3: STANDARD 16:9 / NEAR-16:9 DISPLAYS (Desktop 1920x1080, 2560x1440, etc.)
  // Naturally fills the screen edge-to-edge
  else {
    let drawW = canvasWidth;
    let drawH = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawW = canvasWidth;
      drawH = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawH) / 2;
    } else {
      drawH = canvasHeight;
      drawW = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawW) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }
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


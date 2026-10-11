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
 * Cinematic full-viewport canvas renderer.
 *
 * Strategy:
 *  - The canvas BACKING pixels = window.innerWidth × window.innerHeight (NO DPR multiplication).
 *    DPR upscaling causes a 1920-wide source to be drawn into a 3840px backing and then
 *    shrunk back by CSS — this wastes GPU memory and causes subtle blur on mid-range GPUs.
 *    At 1920×1080 source the native 1:1 pixel mapping on a 1080p monitor is already perfect.
 *  - CONTAIN: image is letterboxed (black bars) — the full car is always visible.
 *  - COVER: image is cropped to fill — nothing to the sides wasted (used for hero/parts where
 *    source is 16:9 and container is 16:9 so no cropping occurs in practice).
 *  - Ultra-wide (>16:9 container): draw ambient blurred extension on flanks + sharp 16:9 center.
 */
export function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
  fit: "contain" | "cover" = "contain"
) {
  const srcW =
    img instanceof HTMLImageElement
      ? img.naturalWidth || 1920
      : img.videoWidth || 1920;
  const srcH =
    img instanceof HTMLImageElement
      ? img.naturalHeight || 1080
      : img.videoHeight || 1080;

  if (!srcW || !srcH) return;

  // Maximum quality bilinear filtering — native GPU path, zero overhead
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const srcRatio = srcW / srcH;
  const canvasRatio = canvasWidth / canvasHeight;

  // ── ULTRA-WIDE SCREENS (e.g. 21:9, wider-than-16:9 laptops) ─────────────
  // Only apply ambient-extension when fit === "contain" (hero/parts).
  // When fit === "cover" (colorways), ALWAYS fill edge-to-edge — no black bars.
  if (fit === "contain" && canvasRatio > srcRatio + 0.03) {
    // 1. Background: stretched duplicate at very low opacity to fill width
    const bgH = canvasWidth / srcRatio;
    const bgOffY = (canvasHeight - bgH) / 2;
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.filter = "blur(8px)";
    ctx.drawImage(img, 0, bgOffY, canvasWidth, bgH);
    ctx.restore();

    // 2. Dark vignette over background to prevent distraction
    const vgn = ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight / 2,
      canvasHeight * 0.3,
      canvasWidth / 2,
      canvasHeight / 2,
      canvasWidth * 0.6
    );
    vgn.addColorStop(0, "rgba(0,0,0,0.15)");
    vgn.addColorStop(0.55, "rgba(0,0,0,0.80)");
    vgn.addColorStop(1, "rgba(0,0,0,0.97)");
    ctx.fillStyle = vgn;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 3. Primary footage: full height, perfectly centred, native 16:9
    const fgH = canvasHeight;
    const fgW = canvasHeight * srcRatio;
    const fgX = (canvasWidth - fgW) / 2;
    ctx.drawImage(img, fgX, 0, fgW, fgH);
    return;
  }


  // ── PORTRAIT / MOBILE (<1.0 ratio) ───────────────────────────────────────
  // Fill full width; centre vertically. Car proportions are never distorted.
  if (canvasRatio < 0.9) {
    const drawW = canvasWidth;
    const drawH = canvasWidth / srcRatio;
    const offY = (canvasHeight - drawH) / 2;
    ctx.drawImage(img, 0, offY, drawW, drawH);
    return;
  }

  // ── STANDARD / NEAR-16:9 DISPLAYS ────────────────────────────────────────
  // "contain" → never crop, letterbox if needed.
  // "cover"   → fill edge-to-edge, slight crop acceptable.
  let drawW: number, drawH: number, offX: number, offY: number;

  if (fit === "cover") {
    // Scale so the shorter axis fills the canvas
    if (canvasRatio > srcRatio) {
      drawW = canvasWidth;
      drawH = canvasWidth / srcRatio;
      offX = 0;
      offY = (canvasHeight - drawH) / 2;
    } else {
      drawH = canvasHeight;
      drawW = canvasHeight * srcRatio;
      offX = (canvasWidth - drawW) / 2;
      offY = 0;
    }
  } else {
    // contain: scale so the longer axis fits the canvas
    if (canvasRatio > srcRatio) {
      drawH = canvasHeight;
      drawW = canvasHeight * srcRatio;
      offX = (canvasWidth - drawW) / 2;
      offY = 0;
    } else {
      drawW = canvasWidth;
      drawH = canvasWidth / srcRatio;
      offX = 0;
      offY = (canvasHeight - drawH) / 2;
    }
  }

  ctx.drawImage(img, offX, offY, drawW, drawH);
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

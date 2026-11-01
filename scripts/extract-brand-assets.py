"""
Extract production brand assets from the approved company logo.

Source (untouched): assets/BloomCore Technologies Logo.png
Outputs:
  src/assets/brand/bloomcore-logo-white.png   full lockup, transparent
  src/assets/brand/bloomcore-c-symbol.png     the C element only, 512px, transparent
  public/favicon-16.png                       C only, 16px
  public/favicon-32.png                       C only, 32px
  public/apple-touch-icon.png                 C only, 180px, dark field
"""

from pathlib import Path

from PIL import Image
import numpy as np
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "BloomCore Technologies Logo.png"
OUT_BRAND = ROOT / "src" / "assets" / "brand"
OUT_PUBLIC = ROOT / "public"

im = Image.open(SOURCE).convert("RGBA")
arr = np.array(im)
alpha = arr[:, :, 3]

# --- Full lockup: crop to visible content, keep a small even margin ----------
ys, xs = np.where(alpha > 8)
pad = 8
box = (xs.min() - pad, ys.min() - pad, xs.max() + 1 + pad, ys.max() + 1 + pad)
lockup = im.crop(box)
lockup.save(OUT_BRAND / "bloomcore-logo-white.png", optimize=True)
print("lockup", lockup.size)

# --- C element: the main symbol component (separate from the accent chevron)
mask = alpha > 128
mask[:, 620:] = False  # exclude divider and wordmark
labels, count = ndimage.label(mask)
sizes = ndimage.sum(mask, labels, range(1, count + 1))
main = int(np.argmax(sizes)) + 1
component = labels == main
ys, xs = np.where(component)
c_crop = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
print("C crop", c_crop.size)


def square(canvas: int, scale: float, background=None) -> Image.Image:
    """Centre the C on a square canvas without changing its proportions."""
    w, h = c_crop.size
    target_h = int(canvas * scale)
    target_w = round(w * target_h / h)
    resized = c_crop.resize((target_w, target_h), Image.LANCZOS)
    if background is None:
        out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    else:
        out = Image.new("RGBA", (canvas, canvas), background)
    out.alpha_composite(resized, ((canvas - target_w) // 2, (canvas - target_h) // 2))
    return out


c512 = square(512, 0.82)
c512.save(OUT_BRAND / "bloomcore-c-symbol.png", optimize=True)

c32 = square(32, 0.9)
c32.save(OUT_PUBLIC / "favicon-32.png", optimize=True)

c16 = square(16, 0.94)
c16.save(OUT_PUBLIC / "favicon-16.png", optimize=True)

apple = square(180, 0.62, (8, 8, 8, 255))
apple.convert("RGB").save(OUT_PUBLIC / "apple-touch-icon.png", optimize=True)

print("favicons written")

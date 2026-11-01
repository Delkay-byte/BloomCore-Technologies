"""
Crop the supplied TillProof logo artwork for use on the corporate site.

Sources (untouched):
  assets/tillproof-selected-logo.png
  assets/tillproof-selected-logo-words.png

Outputs:
  src/assets/products/tillproof-mark.png
  src/assets/products/tillproof-logo.png

The artwork keeps its original warm off-white field, so the page presents it on
a matching light plate. No recolouring, retouching or vectorisation.
"""

from pathlib import Path

from PIL import Image, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "assets" / "products"
OUT.mkdir(parents=True, exist_ok=True)


def crop_artwork(source: Path, target: Path, padding: int = 24) -> None:
    image = Image.open(source).convert("RGB")
    sampled = np.array(image.filter(ImageFilter.MedianFilter(5))).astype(np.float32)

    corners = [sampled[0, 0], sampled[0, -1], sampled[-1, 0], sampled[-1, -1]]
    background = np.median(np.stack(corners), axis=0)
    distance = np.sqrt(((sampled - background) ** 2).sum(axis=2))

    mask = distance > 35
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    left = max(cols.min() - padding, 0)
    top = max(rows.min() - padding, 0)
    right = min(cols.max() + padding + 1, image.width)
    bottom = min(rows.max() + padding + 1, image.height)

    cropped = image.crop((left, top, right, bottom))
    cropped.save(target, optimize=True)
    print(target.name, cropped.size)


crop_artwork(ROOT / "assets" / "tillproof-selected-logo.png", OUT / "tillproof-mark.png")
crop_artwork(ROOT / "assets" / "tillproof-selected-logo-words.png", OUT / "tillproof-logo.png")

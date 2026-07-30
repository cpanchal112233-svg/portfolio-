"""Chroma-key the presenter poses into transparent WebP used by the actor stage.

Run: python3 scripts/build-actor-poses.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / "assets" / "pro"
OUT = ROOT / "public" / "actor"

POSES = {
    "about": "pose-about-pro.png",
    "projects": "pose-projects-pro.png",
    "skills": "pose-skills-pro.png",
    "experience": "pose-experience-pro.png",
    "contact": "pose-contact-pro.png",
}

CANVAS = (760, 1140)
PAD = 14


def key_out(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    # Green screen: the background is the only place green outruns both other
    # channels by a wide margin.
    rb_max = np.maximum(r, b)
    greenness = g - rb_max
    alpha = 255.0 - np.clip((greenness - 8.0) * 5.0, 0.0, 255.0)
    alpha = np.where((g > 90) & (g > r * 1.12) & (g > b * 1.12), 0.0, alpha)

    # Despill by pulling the green channel down to the other two. Clamping red
    # and blue instead would drag a navy suit (20, 31, 64) to olive, because
    # blue legitimately sits above green on the subject.
    spill = g > rb_max
    g = np.where(spill, rb_max + (g - rb_max) * 0.15, g)

    out = np.stack([r, g, b, alpha], axis=-1).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim_and_fit(im: Image.Image) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im

    cropped = im.crop(bbox)
    w, h = cropped.size
    target_w, target_h = CANVAS[0] - PAD * 2, CANVAS[1] - PAD * 2
    scale = min(target_w / w, target_h / h)
    resized = cropped.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.paste(
        resized,
        ((CANVAS[0] - resized.width) // 2, CANVAS[1] - resized.height - PAD // 2),
        resized,
    )
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for pose, filename in POSES.items():
        keyed = trim_and_fit(key_out(SOURCES / filename))
        keyed.save(OUT / f"{pose}.webp", "WEBP", quality=90, method=6)

        arr = np.asarray(keyed)
        visible = arr[..., 3] > 200
        r, g, b = (arr[..., i][visible].astype(int) for i in range(3))
        green_dominant = int(((g > r) & (g > b)).sum())
        print(
            f"{pose:11s} opaque={visible.sum():7d} "
            f"mean_rgb={arr[..., :3][visible].mean(axis=0).astype(int)} "
            f"green_dominant={green_dominant}"
        )


if __name__ == "__main__":
    main()

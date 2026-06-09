#!/usr/bin/env python3
"""
Redact (blur) the FIN codes visible in the "How to use" screenshots.

Usage:
    1. Drop the 7 raw screenshots into  how-to-use-src/  (repo root) with these
       exact names. This folder is git-ignored and lives OUTSIDE public/ so the
       unblurred originals (with real FIN codes) are never committed or served:
           1-register.png
           2-login.png
           3-dashboard.png
           4-new-plan.png
           5-my-plans.png
           6-my-reports.png
           7-report-details.png
    2. Run:  python3 public/images/how-to-use/blur_finkods.py
    3. Finished (redacted) images are written to public/images/how-to-use/<name>.png

Boxes are expressed as fractions of width/height so they scale with the
source resolution. Tune the numbers below if a code is not fully covered.
"""
import os
import shutil
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
# repo root = public/images/how-to-use/../../.. ; sources live in how-to-use-src/
RAW = os.path.normpath(os.path.join(HERE, "..", "..", "..", "how-to-use-src"))

# filename -> list of (x0, y0, x1, y1) as fractions of (width, height)
# Boxes measured against the actual uploaded screenshots.
REDACTIONS = {
    "1-register.png": [],  # no FIN code visible
    "2-login.png": [(0.080, 0.430, 0.165, 0.500)],
    "3-dashboard.png": [],  # no FIN code visible
    "4-new-plan.png": [(0.225, 0.365, 0.315, 0.420)],
    "5-my-plans.png": [
        (0.238, 0.413, 0.302, 0.463),
        (0.238, 0.505, 0.302, 0.555),
    ],
    "6-my-reports.png": [
        (0.240, 0.423, 0.300, 0.467),
        (0.240, 0.522, 0.300, 0.566),
    ],
    "7-report-details.png": [(0.248, 0.705, 0.320, 0.755)],
}


def redact_region(img, box):
    w, h = img.size
    x0, y0, x1, y1 = (
        int(box[0] * w),
        int(box[1] * h),
        int(box[2] * w),
        int(box[3] * h),
    )
    region = img.crop((x0, y0, x1, y1))
    rw, rh = region.size
    if rw < 2 or rh < 2:
        return
    # pixelate, then soften -> unreadable but still "blurred" looking
    small = region.resize((max(1, rw // 18), max(1, rh // 9)), Image.BILINEAR)
    region = small.resize((rw, rh), Image.NEAREST)
    region = region.filter(ImageFilter.GaussianBlur(radius=max(3, rh // 6)))
    img.paste(region, (x0, y0))


def main():
    if not os.path.isdir(RAW):
        raise SystemExit(f"Missing raw folder: {RAW}")
    for name, boxes in REDACTIONS.items():
        src = os.path.join(RAW, name)
        dst = os.path.join(HERE, name)
        if not os.path.exists(src):
            print(f"[skip] {name} (not found in raw/)")
            continue
        if not boxes:
            shutil.copyfile(src, dst)
            print(f"[copy] {name}")
            continue
        img = Image.open(src).convert("RGB")
        for box in boxes:
            redact_region(img, box)
        img.save(dst)
        print(f"[blur] {name} ({len(boxes)} region(s))")


if __name__ == "__main__":
    main()

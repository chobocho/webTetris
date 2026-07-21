#!/usr/bin/env bash
#
# build.sh — Bundle the web Tetris game into a single, self-contained index.html.
#
# It inlines every <script src="js/*.js"> and embeds all referenced images
# (img/*, favicon, etc.) as base64 data URIs, producing release/index.html
# that runs standalone with no external files.
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${ROOT_DIR}/tetris"
OUT_DIR="${ROOT_DIR}/release"
OUT_FILE="${OUT_DIR}/index.html"

if [[ ! -f "${SRC_DIR}/index.html" ]]; then
    echo "[build] ERROR: ${SRC_DIR}/index.html not found" >&2
    exit 1
fi

mkdir -p "${OUT_DIR}"

SRC_DIR="${SRC_DIR}" OUT_FILE="${OUT_FILE}" python3 - <<'PY'
import base64
import os
import re
import sys

src_dir = os.environ["SRC_DIR"]
out_file = os.environ["OUT_FILE"]

MIME = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
}

def data_uri(path):
    ext = os.path.splitext(path)[1].lower()
    mime = MIME.get(ext, "application/octet-stream")
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    return f"data:{mime};base64,{b64}"

# --- read entry html ---
with open(os.path.join(src_dir, "index.html"), encoding="utf-8") as f:
    html = f.read()

# --- inline <script src="js/xxx.js"></script> ---
def inline_script(m):
    rel = m.group(1)
    js_path = os.path.join(src_dir, rel)
    with open(js_path, encoding="utf-8") as jf:
        code = jf.read()
    return "<script>\n" + code + "\n</script>"

html = re.sub(
    r'<script\s+src=["\']([^"\']+)["\']\s*>\s*</script>',
    inline_script,
    html,
)

# --- embed images: replace every local "img/<file>" reference with a data URI ---
# Covers both CSS url(img/..) and JS string literals "img/..".
img_dir = os.path.join(src_dir, "img")
embedded = 0
if os.path.isdir(img_dir):
    # Longest names first so prefixes never shadow longer filenames.
    for name in sorted(os.listdir(img_dir), key=len, reverse=True):
        ref = f"img/{name}"
        if ref in html:
            html = html.replace(ref, data_uri(os.path.join(img_dir, name)))
            embedded += 1

with open(out_file, "w", encoding="utf-8") as f:
    f.write(html)

remaining = re.findall(r'(?:src=|url\()\s*["\']?((?:img|js)/[^"\')\s]+)', html)
print(f"[build] inlined scripts + embedded {embedded} images")
if remaining:
    print(f"[build] WARNING: unresolved local references: {sorted(set(remaining))}", file=sys.stderr)
print(f"[build] wrote {out_file}")
PY

BYTES=$(wc -c < "${OUT_FILE}")
echo "[build] done: ${OUT_FILE} (${BYTES} bytes)"

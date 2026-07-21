@echo off
rem =====================================================================
rem build.bat - Bundle the web Tetris game into a single index.html.
rem
rem Windows counterpart of build.sh. It inlines every <script src="js/*.js">
rem and embeds all referenced images (img/*, favicon, etc.) as base64 data
rem URIs, producing release\index.html that runs standalone with no external
rem files.
rem =====================================================================
setlocal EnableExtensions
chcp 949 >nul

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "SRC_DIR=%ROOT_DIR%\tetris"
set "OUT_DIR=%ROOT_DIR%\release"
set "OUT_FILE=%OUT_DIR%\index.html"

if not exist "%SRC_DIR%\index.html" (
    echo [build] ERROR: %SRC_DIR%\index.html not found 1>&2
    exit /b 1
)

if not exist "%OUT_DIR%" mkdir "%OUT_DIR%"

rem --- find which Python launcher is available ---
set "PY_CMD="
where py >nul 2>&1 && set "PY_CMD=py -3"
if not defined PY_CMD (
    where python >nul 2>&1 && set "PY_CMD=python"
)
if not defined PY_CMD (
    where python3 >nul 2>&1 && set "PY_CMD=python3"
)
if not defined PY_CMD (
    echo [build] ERROR: Python not found on PATH 1>&2
    exit /b 1
)

rem --- extract the embedded Python (lines after the #===PYTHON=== marker) ---
set "PY_TMP=%TEMP%\webtetris_build_%RANDOM%%RANDOM%.py"
for /f "delims=:" %%L in ('findstr /n /b /c:"#===PYTHON===" "%~f0"') do set "SKIP=%%L"
more +%SKIP% "%~f0" > "%PY_TMP%"

set "SRC_DIR=%SRC_DIR%"
set "OUT_FILE=%OUT_FILE%"
%PY_CMD% "%PY_TMP%"
set "RC=%ERRORLEVEL%"
del "%PY_TMP%" >nul 2>&1

if not "%RC%"=="0" exit /b %RC%

for %%A in ("%OUT_FILE%") do set "BYTES=%%~zA"
echo [build] done: %OUT_FILE% (%BYTES% bytes)
exit /b 0

#===PYTHON===
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

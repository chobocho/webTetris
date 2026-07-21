/*
 * popup.js — Custom modal dialogs to replace the browser's native
 * alert() / confirm() / prompt() popups.
 *
 * The game runs on a single <canvas>, so these dialogs are lightweight DOM
 * overlays injected on demand. Unlike the native (blocking) dialogs, they are
 * asynchronous: pass an onOk (and optional onCancel) callback.
 *
 *   Popup.confirm("Quit game?", () => { ... });
 *   Popup.prompt("Input board", "", (value) => { ... });
 *   Popup.alert("Saved!", () => { ... });
 *
 * While a dialog is open Popup.isOpen() returns true so the game input
 * handlers can ignore keyboard / gamepad / mouse events.
 */
const Popup = (function () {
  let _overlay = null;   // backdrop element
  let _box = null;       // dialog box element
  let _input = null;     // <input> for prompt(), else null
  let _onOk = null;
  let _onCancel = null;
  let _keyHandler = null;
  let _stylesInjected = false;

  function injectStyles() {
    if (_stylesInjected) return;
    _stylesInjected = true;
    const css = `
      .cbo-popup-overlay {
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0, 0, 0, 0.6);
        -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
        font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
        animation: cbo-fade 0.12s ease-out;
      }
      .cbo-popup-box {
        min-width: 260px; max-width: 86vw;
        padding: 22px 20px 18px;
        background: #1c1e2a;
        border: 2px solid #3da9fc;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        color: #f2f4f8; text-align: center;
        animation: cbo-pop 0.14s ease-out;
      }
      .cbo-popup-msg {
        font-size: 17px; line-height: 1.4; margin: 0 0 16px;
        white-space: pre-line; word-break: break-word;
      }
      .cbo-popup-input {
        width: 100%; box-sizing: border-box;
        padding: 9px 11px; margin: 0 0 16px;
        font-size: 15px; color: #f2f4f8;
        background: #0f1018; border: 1px solid #3a3f52;
        border-radius: 7px; outline: none;
      }
      .cbo-popup-input:focus { border-color: #3da9fc; }
      .cbo-popup-btns {
        display: flex; gap: 10px; justify-content: center;
      }
      .cbo-popup-btn {
        flex: 1 1 0; min-width: 84px;
        padding: 10px 14px; font-size: 15px; font-weight: 600;
        border: none; border-radius: 8px; cursor: pointer;
        transition: filter 0.1s ease, transform 0.05s ease;
      }
      .cbo-popup-btn:active { transform: translateY(1px); }
      .cbo-popup-btn.ok { background: #3da9fc; color: #0b1220; }
      .cbo-popup-btn.ok:hover { filter: brightness(1.1); }
      .cbo-popup-btn.cancel { background: #363b4d; color: #f2f4f8; }
      .cbo-popup-btn.cancel:hover { filter: brightness(1.2); }
      @keyframes cbo-fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes cbo-pop {
        from { opacity: 0; transform: scale(0.94); }
        to   { opacity: 1; transform: scale(1); }
      }
    `;
    const style = document.createElement("style");
    style.id = "cbo-popup-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function close() {
    if (!_overlay) return;
    if (_keyHandler) {
      window.removeEventListener("keydown", _keyHandler, true);
      _keyHandler = null;
    }
    if (_overlay.parentNode) {
      _overlay.parentNode.removeChild(_overlay);
    }
    _overlay = _box = _input = null;
    _onOk = _onCancel = null;
  }

  function confirmChoice() {
    const value = _input ? _input.value : undefined;
    const cb = _onOk;
    close();
    if (cb) cb(value);
  }

  function cancelChoice() {
    const cb = _onCancel;
    close();
    if (cb) cb();
  }

  function onKeyDown(e) {
    // Handle dialog keys ourselves; keep them away from the game handlers.
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      confirmChoice();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      cancelChoice();
    }
  }

  // opts: { message, showInput, defaultValue, okText, cancelText, showCancel }
  function open(opts, onOk, onCancel) {
    close(); // only one dialog at a time
    injectStyles();

    _onOk = onOk || null;
    _onCancel = onCancel || null;

    _overlay = document.createElement("div");
    _overlay.className = "cbo-popup-overlay";

    _box = document.createElement("div");
    _box.className = "cbo-popup-box";

    const msg = document.createElement("div");
    msg.className = "cbo-popup-msg";
    msg.textContent = opts.message || "";
    _box.appendChild(msg);

    if (opts.showInput) {
      _input = document.createElement("input");
      _input.className = "cbo-popup-input";
      _input.type = "text";
      _input.value = opts.defaultValue || "";
      _box.appendChild(_input);
    } else {
      _input = null;
    }

    const btns = document.createElement("div");
    btns.className = "cbo-popup-btns";

    if (opts.showCancel) {
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "cbo-popup-btn cancel";
      cancelBtn.textContent = opts.cancelText || "Cancel";
      cancelBtn.addEventListener("click", cancelChoice);
      btns.appendChild(cancelBtn);
    }

    const okBtn = document.createElement("button");
    okBtn.className = "cbo-popup-btn ok";
    okBtn.textContent = opts.okText || "OK";
    okBtn.addEventListener("click", confirmChoice);
    btns.appendChild(okBtn);

    _box.appendChild(btns);
    _overlay.appendChild(_box);

    // Click on the backdrop (outside the box) cancels.
    _overlay.addEventListener("mousedown", function (e) {
      if (e.target === _overlay) cancelChoice();
    });

    document.body.appendChild(_overlay);

    _keyHandler = onKeyDown;
    window.addEventListener("keydown", _keyHandler, true);

    if (_input) {
      _input.focus();
      _input.select();
    } else {
      okBtn.focus();
    }
  }

  return {
    confirm: function (message, onOk, onCancel) {
      open({ message: message, showCancel: true, okText: "OK", cancelText: "Cancel" },
           onOk, onCancel);
    },
    prompt: function (message, defaultValue, onOk, onCancel) {
      open({ message: message, showInput: true, defaultValue: defaultValue,
             showCancel: true, okText: "OK", cancelText: "Cancel" },
           onOk, onCancel);
    },
    alert: function (message, onOk) {
      open({ message: message, showCancel: false, okText: "OK" }, onOk, null);
    },
    isOpen: function () {
      return _overlay !== null;
    },
    close: close,
  };
})();

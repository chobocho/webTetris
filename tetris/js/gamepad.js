// Gamepad API 지원.
// 표준 게임패드의 버튼/스틱 입력을 기존 keyCode로 변환해 processEvent()로 넘긴다.
// 브라우저는 게임패드 이벤트를 보내주지 않으므로 매 프레임 poll() 해야 한다.

// 표준 매핑(https://w3c.github.io/gamepad/#remapping) 기준 버튼 인덱스 -> keyCode
const GAMEPAD_BUTTON_MAP = {
    0: 32,  // A      : 바닥까지 내리고 고정 (게임 시작)
    1: 38,  // B      : 오른쪽 회전
    2: 90,  // X      : 왼쪽 회전
    3: 17,  // Y      : hold
    4: 17,  // LB     : hold
    5: 17,  // RB     : hold
    8: 80,  // Back   : 일시정지
    9: 13,  // Start  : 시작 / 재개
    12: 38, // D-pad 위    : 회전
    13: 40, // D-pad 아래  : 아래로
    14: 37, // D-pad 왼쪽  : 왼쪽
    15: 39, // D-pad 오른쪽: 오른쪽
};

// 왼쪽 스틱(axes 0, 1)도 D-pad와 동일하게 동작시킨다.
const GAMEPAD_AXIS_MAP = [
    {axis: 0, negative: 37, positive: 39},
    {axis: 1, negative: 38, positive: 40},
];

class GamepadManager {
    constructor(onCode) {
        this._onCode = onCode;
        this._pressed = new Map(); // keyCode -> 다음 반복 입력 시각(ms)
        // 이동 키만 꾹 누르면 반복 입력되게 한다. 회전/드롭은 한 번만.
        this._repeatCodes = new Set([37, 39, 40]);
        this._firstRepeatDelay = 200;
        this._repeatDelay = 60;
        this._deadZone = 0.5;
    }

    isSupported() {
        return typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function';
    }

    listen() {
        if (!this.isSupported()) {
            printf("[Gamepad]", "Gamepad API is not supported");
            return;
        }
        window.addEventListener('gamepadconnected', e => {
            printf("[Gamepad] connected", e.gamepad.index + ": " + e.gamepad.id);
        });
        window.addEventListener('gamepaddisconnected', e => {
            printf("[Gamepad] disconnected", e.gamepad.index + ": " + e.gamepad.id);
            this._pressed.clear();
        });
    }

    poll(now) {
        if (!this.isSupported()) {
            return;
        }

        const activeCodes = new Set();
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            const pad = gamepads[i];
            if (pad === null || !pad.connected) {
                continue;
            }
            this._collectButtons(pad, activeCodes);
            this._collectAxes(pad, activeCodes);
        }

        // 뗀 버튼은 상태에서 제거해 다음에 다시 누르면 즉시 반응하게 한다.
        for (const code of this._pressed.keys()) {
            if (!activeCodes.has(code)) {
                this._pressed.delete(code);
            }
        }

        activeCodes.forEach(code => {
            if (!this._pressed.has(code)) {
                this._pressed.set(code, now + this._firstRepeatDelay);
                this._onCode(code);
                return;
            }
            if (!this._repeatCodes.has(code)) {
                return;
            }
            if (now >= this._pressed.get(code)) {
                this._pressed.set(code, now + this._repeatDelay);
                this._onCode(code);
            }
        });
    }

    _collectButtons(pad, activeCodes) {
        for (const index in GAMEPAD_BUTTON_MAP) {
            const button = pad.buttons[index];
            if (button === undefined) {
                continue;
            }
            // 아날로그 트리거는 boolean이 아닌 value로 들어오는 경우가 있다.
            const isPressed = typeof button === 'object' ? button.pressed : button > 0.5;
            if (isPressed) {
                activeCodes.add(GAMEPAD_BUTTON_MAP[index]);
            }
        }
    }

    _collectAxes(pad, activeCodes) {
        GAMEPAD_AXIS_MAP.forEach(e => {
            const value = pad.axes[e.axis];
            if (value === undefined) {
                return;
            }
            if (value <= -this._deadZone) {
                activeCodes.add(e.negative);
            } else if (value >= this._deadZone) {
                activeCodes.add(e.positive);
            }
        });
    }
}

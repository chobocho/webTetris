# 코드 리뷰 TODO (2026-07-20)

전체 JS/HTML 코드 리뷰 결과입니다. 우선순위별로 정리했습니다.

## 1. 버그 (우선순위: 높음)

- [x] **줄 삭제 시 맨 윗줄이 제대로 지워지지 않음** — `board_manager.js:66`, `item_board_manager.js:592`
  - `board[m][0] = 0;` 은 `board[m][x] = 0;` 이어야 함. 현재는 매 열마다 (0,0)만 지워서, 맨 윗줄(0행)의 1~9열이 줄 삭제 후 그대로 남음. 블록이 천장 근처까지 쌓인 상태에서 줄을 지우면 0행 내용이 복제됨.

- [x] **`_handleThunder`에서 이펙트 누수** — `item_board_manager.js:169~183`
  - `insertEffect()` 호출 후 THUNDER 아이템이 없으면 `popEffect()` 없이 `return`. 아이템 모드에서 블록이 고정될 때마다 유령 이펙트가 큐에 남아 보드가 잠깐 멈추고 입력이 차단됨.

- [x] **`_handleBlackThunder`의 `boomCount` 변수 섀도잉** — `item_board_manager.js:434`
  - 안쪽 `for (let ty = 0, boomCount = 0; ...)` 가 바깥 `boomCount`를 가려서 바깥 값이 항상 0 → 아이템이 발동해도 마지막에 `popEffect()`가 호출되어 이펙트 표시가 꼬임.

- [x] **`GameEngine.init()`이 전역 `tetris`를 참조** — `game_engine.js:115, 117`
  - `tetris.resumeGame(...)` / `tetris.idle()` 은 `this.tetris.…` 이어야 함. 지금은 호출 순서(전역 교체 후 init) 덕분에 우연히 동작하지만, 호출 순서가 바뀌면 다른 모드의 게임이 로드됨.

- [x] **저장 데이터 키 오타 `gameSate`** — `tetris.js:332`, `game_engine.js:114`
  - `util.js`의 `createEmptyBoard()`는 `gameState`, 저장/로드 코드는 `gameSate`를 사용. 현재는 "빈 보드에는 키가 없어서 undefined ≠ 3" 으로 우연히 동작. `gameState`로 통일하고 버전 마이그레이션 고려 필요.

- [x] **`createEmptyBoard()`의 board가 2차원 배열이 아님** — `util.js:25`
  - `'board': new Array(18).fill(0)` → 행이 숫자 0. 이 데이터가 `TetrisBoard.set()`에 들어가면 `line[j]`가 undefined가 되어 보드 전체가 깨짐(잠재 크래시). `Array.from({length: 18}, () => new Array(10).fill(0))` 형태로 수정.

- [x] **`LocalDB.getScore()`가 문자열 반환** — `util.js:36`
  - localStorage 값은 문자열인데 그대로 반환 → `Score.highscore`가 문자열로 시작. 비교 연산은 암묵적 형변환으로 대부분 동작하지만 타입이 오염됨. `parseInt(score, 10) || 0` 으로 수정.

- [x] **`LocalDB.getBoard()`에 JSON.parse 예외 처리 없음** — `util.js:52`
  - localStorage가 손상되면 게임 시작 자체가 크래시. try/catch 후 `createEmptyBoard()` 반환.

- [x] **생성자에 남은 백틱 찌꺼기** — `draw_engine.js:31, 262`
  - `constructor() {``` 형태로 빈 템플릿 리터럴이 남아 있음(동작엔 무해하나 명백한 오타). 제거.

- [x] **이펙트 중 조작 시 반환값 불일치** — `state.js` (rotate/left_rotate/moveLeft/moveRight/moveDown/moveBottom)
  - `hasEffect()`일 때 `return;` (undefined) → 다른 경로는 boolean 반환. `return false;`로 통일. `Tetris.moveDown()`에서 `!result && isClear()` 판정에 undefined가 섞이는 것도 함께 정리됨.

- [x] **아이템 모드 점수 테이블 범위 초과 가능** — `score.js:27`, `item_board_manager.js:51`
  - 아이템 연쇄로 `removedLines`가 `scoreTable` 길이(23)를 넘으면 `undefined`가 더해져 점수가 NaN이 됨. `Math.min(removeLines, this.scoreTable.length - 1)` 방어 필요.

- [x] **hold 실패(UnHold) 시 holdBlock 좌표 오염** — `state.js:214~226`
  - 스왑 시도 중 `this.currentBlock.x/y = tmpBlock.x/y` 로 holdBlock의 좌표를 먼저 바꾸는데, 실패해서 되돌릴 때 좌표는 복원하지 않음. 다음 스왑 시 위치가 어긋날 수 있음.

## 2. 동작 / UX 개선 (우선순위: 중간)

- [x] **키 입력 시 페이지 스크롤 방지** — `game.js:96`
  - 스페이스/화살표 키에 `e.preventDefault()`가 없어 페이지가 스크롤됨. 또한 `e.keyCode`는 deprecated → `e.code` 기반으로 전환 권장.

- [x] **편향된 셔플** — `defaultBlock.js:382, 390`, `item_board_manager.js:46`, `board_map.js:130`
  - `sort(() => Math.random() - 0.5)` 는 균등하지 않음. Fisher–Yates 셔플 유틸 하나 만들어 공용화.

- [ ] **`setInterval(OnDraw, 20)` → requestAnimationFrame** — `game.js:228`
  - 백그라운드 탭/저사양 기기에서 프레임과 게임 속도가 같이 흔들림. rAF + 경과 시간 기반 틱으로 전환 권장.

- [x] **오디오 자동재생 rejection 미처리** — `tetris.js:54, 63, 72`
  - 첫 사용자 상호작용 전 `play()`가 reject되어 콘솔 에러 발생. `.play().catch(() => {})` 처리. 또한 `audio.js`에 base64 사운드가 인라인(파일 1.7MB 수준)되어 있어 별도 오디오 파일 로드 방식 검토.

- [x] **점수 표시 경계값 오류** — `draw_engine.js:618, 632`
  - `score > 1000000` 은 정확히 1,000,000일 때 7자리를 그림. `>= 1000000` 으로 수정 (또는 자릿수 기반 클램프).

- [x] **보드 폭 하드코딩** — `tetris_board.js:10, 102`
  - `new Array(10)` → `this.width` 사용. `util.js:25`의 18도 상수화.

## 3. 중복 제거 / 리팩터링 (우선순위: 낮음)

- [ ] **`game.js` / `game2.js` 중복** — 아래 방향키 처리 한 줄(`moveBottom` vs `moveDown`)만 다르고 완전 동일. 설정값(옵션)으로 분기해 파일 하나로 통합.

- [ ] **`index.html` / `tetris.html` 완전 동일, `nhk.html`도 스크립트 하나만 다름** — 중복 페이지 정리.

- [ ] **`draw_engine.js` 내 복붙 코드** — `#drawBoard` 3벌, `__drawKeypad` 6벌이 클래스마다 반복. 공통 베이스 클래스나 헬퍼 함수로 추출.

- [ ] **아이템 매직 넘버 산재** — RED=12, BLUE=10, GREEN=11, THUNDER=14 등이 `item_board_manager.js` 각 함수와 `defaultBlock.js`, `draw_engine.js`에 따로 정의됨. `values.js`에 상수로 모아 공용화 (START_BOOM/END_BOOM처럼).

- [ ] **과도한 console.log** — `Button.in()`은 클릭마다 4줄, 이동/그림자 갱신마다 로그 출력. DEBUG 플래그(`printf` 유틸)로 일원화하고 기본 off.

- [ ] **데드 코드 정리** — `game_engine.js:25~29` (`hasClearedLine`은 항상 false), `tetris_board.js:30~36`, `state.js`의 TODO 스텁들, `values.js:12~14`의 미사용 변수(`gStartX`와 `blockSize` 40 중복 등).

- [ ] **깨진 테스트 복구** — `test.js`
  - `new PlayState(null)` 은 blockFactory가 없어 즉시 크래시. 현재 생성자 시그니처와 불일치. 테스트를 현행화하거나 제거.

- [ ] **`ItemBoardManager.isSolve()` 중복** — `PuzzleBoardManager.isSolve()`와 동일 구현. 공통 부모로 이동.

- [ ] **`__drawScore` 이름과 다른 역할의 `Button` 남용** — score/next 등 클릭 불가 UI도 Button(code=0)으로 표현. 표시 전용 요소 분리 검토.

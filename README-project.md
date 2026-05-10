# 《妖境說》第一階段原型

## 怎麼跑

直接用瀏覽器打開 `index.html` 即可。

> 因為遊戲使用 ES Module 載入 `game.js`，部分瀏覽器在 `file://` 直接開啟時會擋 module，
> 若遇到空白畫面，請開個本地伺服器：
>
> ```powershell
> cd C:\TreeDesk\妖境說\game
> python -m http.server 8000
> # 然後在瀏覽器打開 http://localhost:8000
> ```
>
> 或用 VS Code 的 Live Server / Node 的 `npx serve .`。

## 操作

**視覺小說階段**
- `Space` 或 `Enter` 或滑鼠左鍵：推進對話
- 選項用滑鼠點選

**戰鬥階段**
- `←` / `→`：左右移動
- `Space`：跳躍
- `Z`：墨影斬擊（普攻）
- `X`：閃避翻滾
- `C`：墨影妖力（消耗妖力槽）

## 結構

```
game/
├── index.html      # 入口
├── style.css       # UI Skin
├── game.js         # 核心：場景管理、VN、戰鬥、CG、劇本
├── HANDOFF.md      # 美術交接清單（必讀）
├── PROGRESS.md     # 目前進度、驗證狀況與下一輪注意事項
├── README.md       # 本文件
└── assets/         # 占位圖（請依 HANDOFF.md 替換）
    ├── bg/
    ├── char/
    ├── battle/
    └── ui/
```

## 內容範圍

對應企劃案《§ 10 第一階段原型》：

- ✓ 30 秒開場 CG（Canvas 程式繪製）
- ✓ 水墨山水主畫面 + 起始選單
- ✓ 視覺小說序章（博物館 → 墜落 → 醒於霧村）
- ✓ 主角立繪 4 種表情
- ✓ 夥伴 1 名（白綾，含 2 種表情）
- ✓ 霧村場景含 3 處互動點（古井 / 殘碑 / 霧中異影）
- ✓ 橫向捲軸戰鬥 1 段關卡（3 波小妖 + Boss）
- ✓ 小妖 3 種行為（衝撞、跳擊、遠程）
- ✓ Boss 兩階段（50% HP 觸發第二階段）
- ✓ 劇情選項 2 個關鍵分歧（已紀錄信任度 flag）
- ✓ 章節結尾過場 + 下章鉤子
- ✓ UI Skin（卷軸對話框、印章按鈕、妖力槽）

## 美術交接

**請看 [HANDOFF.md](HANDOFF.md)**。
所有占位圖都已放在對應位置，覆蓋同名檔案即可換圖；不會因為缺圖而當掉。

## 進度接續

**請看 [PROGRESS.md](PROGRESS.md)**。
近期 UI、開場 CG、BGM/SFX、戰鬥打擊感與 Boss 出場調整都記錄在這裡。

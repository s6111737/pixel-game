# Pixel Quiz Game (像素風闖關問答遊戲)

這是一個以 2000 年代復古街機像素風格打造的 React 闖關問答遊戲。前端使用 React + Vite 構建，後端使用 Google Apps Script (GAS) 搭配 Google Sheets 作為資料庫與計分伺服器。

## 系統需求

- [Node.js](https://nodejs.org/) (用於執行本地開發伺服器，若只需使用 `index_standalone.html` 則不需要)
- Google 帳號 (用於建立 Google Sheets 與 Apps Script)

---

## 🚀 後端設定教學 (Google Sheets + Apps Script)

遊戲的題目與玩家成績皆儲存在您的 Google 雲端硬碟中。請依照以下步驟設定您的專屬後端：

### 步驟 1：建立 Google Sheets 資料庫

1. 前往 [Google 試算表](https://sheets.google.com/) 並建立一份**全新的空白試算表**。
2. 將工作表（最下方的分頁）名稱重新命名為 **`題目`**。
3. 在 `題目` 工作表的第一列（A1~G1）填入以下欄位名稱：
   - A1: `題號`
   - B1: `題目`
   - C1: `A`
   - D1: `B`
   - E1: `C`
   - F1: `D`
   - G1: `解答`
4. 點擊試算表左下角的「+」號，新增第二個工作表，並重新命名為 **`回答`**。
5. 在 `回答` 工作表的第一列（A1~G1）填入以下欄位名稱：
   - A1: `ID`
   - B1: `闖關次數`
   - C1: `總分`
   - D1: `最高分`
   - E1: `第一次通關分數`
   - F1: `花了幾次通關`
   - G1: `最近遊玩時間`
6. 在 `題目` 工作表填入您的題目（請參考下方範例或對話中提供的表格），儲存後即可進入下一步。

### 步驟 2：設定 Google Apps Script

1. 在試算表上方的選單列，點擊 **擴充功能 (Extensions)** -> **Apps Script**。
2. 系統會開啟一個新的程式碼編輯器。請將裡面的預設程式碼全部刪除。
3. 打開本專案提供的 [`Code.gs`](./Code.gs) 檔案，將所有內容複製，並貼上到 Apps Script 的編輯器中。
4. 點擊編輯器上方的 💾 (儲存專案) 按鈕。

### 步驟 3：部署並取得 API URL

1. 在 Apps Script 編輯器右上角，點擊藍色按鈕 **部署 (Deploy)** -> **新增部署作業 (New deployment)**。
2. 點擊左上角的齒輪圖示 ⚙️，選擇 **網頁應用程式 (Web app)**。
3. 在設定區塊：
   - 說明 (Description)：可以隨意填寫，例如 `v1.0`
   - 執行身分 (Execute as)：請選擇 **我 (Me)**
   - 誰可以存取 (Who has access)：**這非常重要，請務必選擇「所有人 (Anyone)」**。若未開啟將導致前端抓不到資料。
4. 點擊 **部署 (Deploy)**。
5. (第一次部署時，Google 會要求授權。點擊「授權存取」，選擇您的帳號 -> 點擊「進階」 -> 點擊「前往未命名專案(不安全)」，最後點擊「允許」。)
6. 部署完成後，您會看到一串 **網頁應用程式網址 (Web app URL)**。**請將這串網址複製起來**。

---

## 🎮 前端設定教學 (React Vite)

### 方法 A：使用完整的 React 專案 (推薦)

1. 確認您的電腦已安裝 Node.js。
2. 打開終端機 (cmd / PowerShell / Terminal)，切換到本專案目錄。
3. 開啟專案根目錄下的 `.env` 檔案。
4. 將剛才複製的 Web app URL 貼到 `VITE_GOOGLE_APP_SCRIPT_URL=` 的後面：
   ```env
   VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/...您的ID.../exec
   ```
5. 儲存檔案後，在終端機執行：
   ```bash
   npm install
   npm run dev
   ```
6. 瀏覽器會自動開啟，或者您可以手動前往終端機提示的 `http://localhost:5173` 開始遊戲！

### 方法 B：使用 Standalone 單檔測試版

如果您沒有安裝 Node.js，可以直接使用 `index_standalone.html`。
1. 使用文字編輯器 (例如 VS Code 或記事本) 打開 `index_standalone.html`。
2. 找到程式碼約 50 行左右的 `const SCRIPT_URL = '';`。
3. 將您的 Web app URL 填入單引號中：
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/...您的ID.../exec';
   ```
4. 儲存後，直接用瀏覽器打開 `index_standalone.html` 即可執行。

---

## 🌍 部署到 GitHub Pages (自動化)

本專案已經設定好 GitHub Actions，只要將程式碼推送到 GitHub 上，就可以自動部署成公開網頁：

1. 在你的 GitHub 建立一個新的 Repository，並將本專案的程式碼 `git push` 上去。
2. 前往你的 GitHub Repository 頁面，點選 **Settings** -> 左側選單的 **Secrets and variables** -> **Actions**。
3. 在 **Secrets** 分頁中，點擊 **New repository secret**，新增以下 Secret：
   - Name: `VITE_GOOGLE_APP_SCRIPT_URL`
   - Secret: 填入你的 Google Apps Script Web App URL
4. （可選）在 **Variables** 分頁中，點擊 **New repository variable**，可以自訂以下變數（若未設定則使用預設值）：
   - `VITE_PASS_THRESHOLD` (通關門檻，預設為 3)
   - `VITE_QUESTION_COUNT` (總題數，預設為 5)
5. 前往 **Settings** -> 左側選單的 **Pages**。
6. 在 **Build and deployment** 區塊，將 **Source** 選擇為 **GitHub Actions**。
7. 以後只要有新的程式碼推送到 `main` 或 `master` 分支，GitHub 就會自動幫你打包並發布網頁！

---
## 自訂遊戲設定

如果您想要修改過關門檻或是每次出現的題數，可以修改以下地方：
- **前端 (.env)**：修改 `VITE_PASS_THRESHOLD` 與 `VITE_QUESTION_COUNT`。
- **後端 (Code.gs)**：同步修改前方的 `QUESTION_COUNT`, `SCORE_PER_QUESTION` 與 `PASS_THRESHOLD` 常數。

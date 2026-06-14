// 部署前請確認已經建立「題目」與「回答」兩個工作表
// 「題目」欄位：題號, 題目, A, B, C, D, 解答
// 「回答」欄位：ID, 闖關次數, 總分, 最高分, 第一次通關分數, 花了幾次通關, 最近遊玩時間

const QUESTION_COUNT = 5; // 每次抓幾題
const SCORE_PER_QUESTION = 20; // 每題幾分
const PASS_THRESHOLD = 3; // 答對幾題算通關

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getQuestions') {
    return ContentService.createTextOutput(JSON.stringify(getQuestions()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput("Hello Pixel Quiz Game!");
}

function doPost(e) {
  // CORS 處理與接收前端傳來的 text/plain data
  const data = JSON.parse(e.postData.contents);
  const playerId = data.id;
  const answers = data.answers; // [{id: 1, answer: 'A'}, ...]

  const result = calculateAndSaveScore(playerId, answers);

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getQuestions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  // 整理題目 (排除解答)
  let questions = rows.map(row => {
    return {
      id: row[0],
      question: row[1],
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    };
  });

  // 隨機打亂並取前 QUESTION_COUNT 題
  questions.sort(() => Math.random() - 0.5);
  return questions.slice(0, QUESTION_COUNT);
}

function calculateAndSaveScore(playerId, userAnswers) {
  const sheetQ = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  const dataQ = sheetQ.getDataRange().getValues();
  
  // 建立解答 Mapping
  const answerMap = {};
  for (let i = 1; i < dataQ.length; i++) {
    answerMap[dataQ[i][0]] = dataQ[i][6]; // id -> 解答
  }

  // 計算分數
  let correctCount = 0;
  userAnswers.forEach(ans => {
    if (answerMap[ans.id] === ans.answer) {
      correctCount++;
    }
  });

  const score = correctCount * SCORE_PER_QUESTION;
  const isPass = correctCount >= PASS_THRESHOLD;

  // 儲存到「回答」工作表
  const sheetA = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("回答");
  const dataA = sheetA.getDataRange().getValues();
  let rowIndex = -1;

  for (let i = 1; i < dataA.length; i++) {
    if (dataA[i][0] == playerId) {
      rowIndex = i + 1; // 1-based array for sheet row
      break;
    }
  }

  const now = new Date();
  let firstClearScore = "";
  let clearAttempts = "";
  let attempts = 1;
  let totalScore = score;
  let highScore = score;

  if (rowIndex === -1) {
    // 新玩家
    if (isPass) {
      firstClearScore = score;
      clearAttempts = 1;
    }
    sheetA.appendRow([playerId, attempts, totalScore, highScore, firstClearScore, clearAttempts, now]);
  } else {
    // 舊玩家更新
    let rowData = dataA[rowIndex - 1];
    attempts = parseInt(rowData[1] || 0) + 1;
    totalScore = parseInt(rowData[2] || 0) + score;
    highScore = Math.max(parseInt(rowData[3] || 0), score);
    
    firstClearScore = rowData[4];
    clearAttempts = rowData[5];

    // 如果之前沒通關，但這次通關了
    if (isPass && (!firstClearScore || firstClearScore === "")) {
      firstClearScore = score;
      clearAttempts = attempts;
    }

    const range = sheetA.getRange(rowIndex, 2, 1, 6);
    range.setValues([[attempts, totalScore, highScore, firstClearScore, clearAttempts, now]]);
  }

  return {
    score: score,
    correct: correctCount,
    total: QUESTION_COUNT,
    highScore: highScore,
    firstClearScore: firstClearScore,
    clearAttempts: clearAttempts,
    attempts: attempts
  };
}

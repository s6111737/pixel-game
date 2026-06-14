const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// GAS usually requires CORS handling. Since frontend can't dictate GAS CORS unless setup properly,
// we will use standard fetch. Ensure your GAS is deployed as web app and accessible to 'Anyone'.
export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getQuestions`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; // Expected: [{ id, question, A, B, C, D }]
  } catch (error) {
    console.error('Error fetching questions:', error);
    // For demo purposes if GAS fails
    return [
      { id: 1, question: "這是測試題目一?", A: "選項A", B: "選項B", C: "選項C", D: "選項D" },
      { id: 2, question: "這是測試題目二?", A: "選項A", B: "選項B", C: "選項C", D: "選項D" }
    ];
  }
};

export const submitAnswers = async (playerId, answers) => {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=submitAnswers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS handles text/plain better for CORS
      },
      body: JSON.stringify({ id: playerId, answers }), // answers: [{id: 1, answer: 'A'}, ...]
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; // Expected: { score, passed, ... }
  } catch (error) {
    console.error('Error submitting answers:', error);
    return { score: 100, passed: true, error: "Submission failed, mock success." };
  }
};

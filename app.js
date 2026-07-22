// Use the categories object defined earlier
let currentCategoryKey = null;
let currentWordIndex = 0;
let quizState = {
  questions: [],
  currentIndex: 0,
  score: 0
};

const categoriesContainer = document.getElementById("categories");
const learningSection = document.getElementById("learning");
const learningTitle = document.getElementById("learning-title");
const wordDisplay = document.getElementById("word-display");
const quizSection = document.getElementById("quiz");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");
const scenariosSection = document.getElementById("scenarios");
const scenarioList = document.getElementById("scenario-list");
const scenarioDialogue = document.getElementById("scenario-dialogue");
const aiSection = document.getElementById("ai-agent");
const agentLog = document.getElementById("agent-log");
const agentInput = document.getElementById("agent-input");

document.getElementById("prev-word").addEventListener("click", () => changeWord(-1));
document.getElementById("next-word").addEventListener("click", () => changeWord(1));
document.getElementById("start-quiz").addEventListener("click", startQuiz);
document.getElementById("submit-answer").addEventListener("click", submitAnswer);
document.getElementById("agent-send").addEventListener("click", handleAgentMessage);

// Initialize category buttons
Object.keys(categories).forEach(key => {
  const cat = categories[key];
  const btn = document.createElement("button");
  btn.textContent = cat.name;
  btn.addEventListener("click", () => selectCategory(key, btn));
  categoriesContainer.appendChild(btn);
});

function selectCategory(key, btn) {
  currentCategoryKey = key;
  currentWordIndex = 0;

  // highlight selected
  Array.from(categoriesContainer.children).forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const cat = categories[key];
  learningTitle.textContent = `Learning: ${cat.name}`;
  learningSection.classList.remove("hidden");
  quizSection.classList.add("hidden");
  scenariosSection.classList.add("hidden");
  aiSection.classList.add("hidden");

  showCurrentWord();
}

function showCurrentWord() {
  const cat = categories[currentCategoryKey];
  const word = cat.words[currentWordIndex];
  wordDisplay.innerHTML = `
    <p><strong>Italian:</strong> ${word.it}</p>
    <p><strong>English:</strong> ${word.en}</p>
  `;
}

function changeWord(delta) {
  const cat = categories[currentCategoryKey];
  currentWordIndex = (currentWordIndex + delta + cat.words.length) % cat.words.length;
  showCurrentWord();
}

function startQuiz() {
  const cat = categories[currentCategoryKey];
  quizState.questions = cat.words.map(w => ({
    it: w.it,
    correct: w.en,
    options: generateOptions(w.en, cat.words)
  }));
  quizState.currentIndex = 0;
  quizState.score = 0;

  learningSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  quizFeedback.textContent = "";
  showQuizQuestion();
}

function generateOptions(correct, words) {
  const options = [correct];
  while (options.length < 4 && options.length < words.length) {
    const random = words[Math.floor(Math.random() * words.length)].en;
    if (!options.includes(random)) options.push(random);
  }
  return options.sort(() => Math.random() - 0.5);
}

function showQuizQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  quizQuestion.textContent = `What does "${q.it}" mean?`;
  quizOptions.innerHTML = "";
  q.options.forEach(opt => {
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz-option";
    radio.value = opt;
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + opt));
    quizOptions.appendChild(label);
    quizOptions.appendChild(document.createElement("br"));
  });
}

function submitAnswer() {
  const selected = document.querySelector('input[name="quiz-option"]:checked');
  if (!selected) {
    quizFeedback.textContent = "Please select an answer.";
    return;
  }
  const q = quizState.questions[quizState.currentIndex];
  if (selected.value === q.correct) {
    quizState.score++;
    quizFeedback.textContent = "Correct!";
  } else {
    quizFeedback.textContent = `Incorrect. The correct answer is "${q.correct}".`;
  }

  quizState.currentIndex++;
  if (quizState.currentIndex < quizState.questions.length) {
    setTimeout(() => {
      quizFeedback.textContent = "";
      showQuizQuestion();
    }, 800);
  } else {
    const total = quizState.questions.length;
    quizFeedback.textContent = `Quiz finished. Score: ${quizState.score}/${total}.`;
    if (quizState.score >= Math.ceil(total * 0.7)) {
      unlockScenarios();
    }
  }
}

function unlockScenarios() {
  const cat = categories[currentCategoryKey];
  scenariosSection.classList.remove("hidden");
  aiSection.classList.remove("hidden");

  scenarioList.innerHTML = "";
  cat.scenarios.forEach((sc, index) => {
    const btn = document.createElement("button");
    btn.textContent = sc.title;
    btn.addEventListener("click", () => showScenarioDialogue(index));
    scenarioList.appendChild(btn);
  });

  scenarioDialogue.innerHTML = "<p>Select a scenario to view the dialogue.</p>";
  agentLog.innerHTML = "";
  logAgent(`You unlocked scenarios for ${cat.name}. Try practicing with me!`);
}

function showScenarioDialogue(index) {
  const cat = categories[currentCategoryKey];
  const sc = cat.scenarios[index];
  scenarioDialogue.innerHTML = `<h3>${sc.title}</h3>`;
  sc.dialogue.forEach(line => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${line.speaker}:</strong> ${line.text}`;
    scenarioDialogue.appendChild(p);
  });
}

function logAgent(text, fromUser = false) {
  const p = document.createElement("p");
  p.innerHTML = fromUser ? `<strong>You:</strong> ${text}` : `<strong>Agent:</strong> ${text}`;
  agentLog.appendChild(p);
  agentLog.scrollTop = agentLog.scrollHeight;
}

function handleAgentMessage() {
  const msg = agentInput.value.trim();
  if (!msg) return;
  logAgent(msg, true);
  agentInput.value = "";

  // Simple “AI” behavior: respond based on current category and encourage Italian usage
  const cat = categories[currentCategoryKey];
  let reply = "";

  if (!cat) {
    reply = "Choose a category first, then we can practice relevant phrases.";
  } else if (/[a-zA-Z]/.test(msg) && msg.toLowerCase().includes("?")) {
    reply = `Good question. In ${cat.name}, try using one of these words: ` +
            cat.words.slice(0, 3).map(w => `"${w.it}" (${w.en})`).join(", ") + ".";
  } else if (/[àèéìòù]/.test(msg) || /[a-zA-Z]/.test(msg)) {
    reply = `Nice! Keep speaking. Can you say a full sentence using "${cat.words[0].it}"?`;
  } else {
    reply = "Try writing a short sentence in Italian or English about this situation.";
  }

  logAgent(reply);
}


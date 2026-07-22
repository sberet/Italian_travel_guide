document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {

    // ===============================
    // Italian Travel Companion App
    // ===============================

    // ---- CATEGORY DATA ----
    const categories = {
        airports: {
            name: "Airports",
            words: [
                { it: "biglietto", en: "ticket" },
                { it: "passaporto", en: "passport" },
                { it: "bagaglio", en: "luggage" },
                { it: "imbarco", en: "boarding" },
                { it: "uscita", en: "exit" }
            ],
            scenarios: [
                {
                    title: "Checking In",
                    dialogue: [
                        { speaker: "Staff", text: "Buongiorno, il suo passaporto per favore." },
                        { speaker: "You", text: "Ecco il mio passaporto." }
                    ]
                }
            ]
        },

        hotels: {
            name: "Hotels",
            words: [
                { it: "prenotazione", en: "reservation" },
                { it: "chiave", en: "key" },
                { it: "camera", en: "room" },
                { it: "colazione", en: "breakfast" },
                { it: "ascensore", en: "elevator" }
            ],
            scenarios: [
                {
                    title: "Checking In",
                    dialogue: [
                        { speaker: "You", text: "Buonasera, ho una prenotazione a nome Samil." },
                        { speaker: "Staff", text: "Perfetto, la sua camera è la 305." }
                    ]
                }
            ]
        },

        public_transport: {
            name: "Public Transportation",
            words: [
                { it: "autobus", en: "bus" },
                { it: "biglietteria", en: "ticket office" },
                { it: "fermata", en: "stop" },
                { it: "treno", en: "train" },
                { it: "orario", en: "schedule" }
            ],
            scenarios: [
                {
                    title: "Buying a Ticket",
                    dialogue: [
                        { speaker: "You", text: "Un biglietto per favore." },
                        { speaker: "Staff", text: "Certo, dove deve andare?" }
                    ]
                }
            ]
        },

        restaurants: {
            name: "Restaurants",
            words: [
                { it: "menu", en: "menu" },
                { it: "acqua", en: "water" },
                { it: "conto", en: "bill" },
                { it: "prenotare", en: "to reserve" },
                { it: "cameriere", en: "waiter" }
            ],
            scenarios: [
                {
                    title: "Ordering Food",
                    dialogue: [
                        { speaker: "Waiter", text: "Cosa desidera ordinare?" },
                        { speaker: "You", text: "Vorrei la pasta, per favore." }
                    ]
                }
            ]
        },

        museums: {
            name: "Museums",
            words: [
                { it: "biglietto", en: "ticket" },
                { it: "guida", en: "guide" },
                { it: "mostra", en: "exhibit" },
                { it: "arte", en: "art" },
                { it: "mappa", en: "map" }
            ],
            scenarios: [
                {
                    title: "Asking for Directions",
                    dialogue: [
                        { speaker: "You", text: "Dov'è la mostra di arte moderna?" },
                        { speaker: "Staff", text: "Al secondo piano, a destra." }
                    ]
                }
            ]
        },

        friends: {
            name: "Meeting New Friends",
            words: [
                { it: "ciao", en: "hello" },
                { it: "piacere", en: "nice to meet you" },
                { it: "come ti chiami?", en: "what is your name?" },
                { it: "amico", en: "friend" },
                { it: "dove vivi?", en: "where do you live?" }
            ],
            scenarios: [
                {
                    title: "Introducing Yourself",
                    dialogue: [
                        { speaker: "You", text: "Ciao, mi chiamo Samil." },
                        { speaker: "Friend", text: "Piacere, io sono Marco." }
                    ]
                }
            ]
        }
    };

    // ---- STATE ----
    let currentCategoryKey = null;
    let currentWordIndex = 0;

    let quizState = {
        questions: [],
        currentIndex: 0,
        score: 0
    };

    // ---- DOM ELEMENTS ----
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

    // ---- BUTTON LISTENERS ----
    document.getElementById("prev-word").addEventListener("click", () => changeWord(-1));
    document.getElementById("next-word").addEventListener("click", () => changeWord(1));
    document.getElementById("start-quiz").addEventListener("click", startQuiz);
    document.getElementById("submit-answer").addEventListener("click", submitAnswer);
    document.getElementById("agent-send").addEventListener("click", handleAgentMessage);

    // ---- CATEGORY BUTTONS ----
    Object.keys(categories).forEach(key => {
        const cat = categories[key];
        const btn = document.createElement("button");
        btn.textContent = cat.name;
        btn.addEventListener("click", () => selectCategory(key, btn));
        categoriesContainer.appendChild(btn);
    });

    // ---- CATEGORY SELECTION ----
    function selectCategory(key, btn) {
        currentCategoryKey = key;
        currentWordIndex = 0;

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

    // ---- WORD LEARNING ----
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

    // ---- QUIZ ----
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

    // ---- SCENARIOS ----
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
        logAgent(`You unlocked scenarios for ${cat.name}. Let's practice!`);
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

    // ---- AI AGENT ----
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

        const cat = categories[currentCategoryKey];
        let reply = "";

        if (!cat) {
            reply = "Choose a category first so I know what situation you're practicing.";
        } else if (msg.toLowerCase().includes("?")) {
            reply = `Good question. In ${cat.name}, try using words like ${cat.words
                .slice(0, 3)
                .map(w => `"${w.it}" (${w.en})`)
                .join(", ")}.`;
        } else {
            reply = `Nice! Can you make a full sentence using "${cat.words[0].it}"?`;
        }

        logAgent(reply);
    }
}

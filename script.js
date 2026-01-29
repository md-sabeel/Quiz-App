const questionEl = document.getElementById("question");
const optionBtns = document.querySelectorAll(".option");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progress-bar");
const timerBar = document.getElementById("timer-bar");

const quizBox = document.getElementById("quizBox");
const categoryBox = document.getElementById("categoryBox");
const resultBox = document.getElementById("result");
const scoreText = document.getElementById("scoreText");

let quizData = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;
let selected = false;

/* Decode HTML entities */
function decodeHTML(text) {
    const t = document.createElement("textarea");
    t.innerHTML = text;
    return t.value;
}

/* Start Quiz */
function startQuiz() {
    const category = document.getElementById("categorySelect").value;
    categoryBox.classList.add("hidden");
    fetchQuiz(category);
}

/* Fetch Questions */
async function fetchQuiz(category) {
    const res = await fetch(
        `https://opentdb.com/api.php?amount=10&type=multiple&category=${category}`
    );
    const data = await res.json();

    quizData = data.results.map(q => {
        const options = [...q.incorrect_answers, q.correct_answer]
            .map(decodeHTML)
            .sort(() => Math.random() - 0.5);

        return {
            question: decodeHTML(q.question),
            options,
            correct: decodeHTML(q.correct_answer)
        };
    });

    quizBox.classList.remove("hidden");
    loadQuestion();
}

/* Load Question */
function loadQuestion() {
    selected = false;
    nextBtn.style.display = "none";
    resetTimer();

    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;

    optionBtns.forEach((btn, i) => {
        btn.textContent = q.options[i];
        btn.style.background = "rgba(255,255,255,0.25)";
    });

    progressBar.style.width =
        ((currentQuestion + 1) / quizData.length) * 100 + "%";

    startTimer();
}

/* Timer */
function startTimer() {
    timeLeft = 10;
    timerBar.style.width = "100%";

    timer = setInterval(() => {
        timeLeft--;
        timerBar.style.width = (timeLeft / 10) * 100 + "%";

        if (timeLeft === 0) {
            clearInterval(timer);
            nextBtn.style.display = "block";
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
}

/* Select Answer */
function selectAnswer(index) {
    if (selected) return;
    selected = true;
    resetTimer();

    const correct = quizData[currentQuestion].correct;

    optionBtns.forEach(btn => {
        if (btn.textContent === correct) {
            btn.style.background = "#4caf50";
        }
    });

    if (optionBtns[index].textContent !== correct) {
        optionBtns[index].style.background = "#e53935";
    } else {
        score++;
    }

    nextBtn.style.display = "block";
}

/* Next Question */
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

/* Show Result */
function showResult() {
    quizBox.classList.add("hidden");
    resultBox.classList.remove("hidden");
    scoreText.textContent = `Your Score: ${score} / ${quizData.length}`;
}

/* Restart */
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    resultBox.classList.add("hidden");
    categoryBox.classList.remove("hidden");
}

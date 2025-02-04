const API_URL = "https://opentdb.com/api.php?amount=1&type=multiple"; // API URL for fetching quiz questions
const questionContainer = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");

let currentQuestion = null;

// Fetch a new question from the API
async function fetchQuestion() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayQuestion(data.results[0]);
        } else {
            questionContainer.textContent = "No more questions available.";
        }
    } catch (error) {
        questionContainer.textContent = "Error loading question. Please try again.";
        console.error(error);
    }
}

// Display the question and answers
function displayQuestion(questionData) {
    currentQuestion = questionData;

    // Display question
    questionContainer.innerHTML = questionData.question;

    // Display answers
    const answers = [...questionData.incorrect_answers, questionData.correct_answer];
    shuffleArray(answers); // Shuffle answers

    answersContainer.innerHTML = ""; // Clear previous answers
    answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.addEventListener("click", () => checkAnswer(button, answer));
        answersContainer.appendChild(button);
    });

    nextButton.disabled = true;
}

// Shuffle array (utility function)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Check the answer
function checkAnswer(button, selectedAnswer) {
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    if (isCorrect) {
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
    }
    // Disable all buttons
    const allButtons = answersContainer.querySelectorAll("button");
    allButtons.forEach((btn) => (btn.disabled = true));

    nextButton.disabled = false; // Enable "Next" button
}

// Load the next question
nextButton.addEventListener("click", fetchQuestion);

// Initial question load
fetchQuestion();


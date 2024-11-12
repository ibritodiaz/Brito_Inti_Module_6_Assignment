/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Cookie management functions
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Initialize the game
    checkUsername();
    fetchQuestions();
    displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        if (username) {
            setCookie("username", username, 7); // Store username for 7 days
            checkUsername(); // Update UI after setting cookie
            
            // Calculate score
            let score = calculateScore();
            
            // Save score
            saveScore(username, score);
            
            // Display updated scores
            displayScores();
            
            // Fetch new questions
            fetchQuestions();
        } else {
            alert("Please enter a username");
        }
    }

    /**
     * Calculates the score based on correct answers.
     * @returns {number} The calculated score.
     */
    function calculateScore() {
        let score = 0;
        const questions = document.querySelectorAll('#question-container > div');
        questions.forEach((question, index) => {
            const selectedAnswer = question.querySelector(`input[name="answer${index}"]:checked`);
            if (selectedAnswer && selectedAnswer.hasAttribute('data-correct')) {
                score++;
            }
        });
        return score;
    }

    /**
     * Saves the score to localStorage.
     * @param {string} username - The player's username.
     * @param {number} score - The player's score.
     */
    function saveScore(username, score) {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push({player: username, score: score});
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    /**
     * Checks for existing username cookie and updates UI accordingly.
     */
    function checkUsername() {
        const username = getCookie("username");
        if (username) {
            document.getElementById("username").value = username;
            document.getElementById("username").disabled = true;
            document.getElementById("new-player").classList.remove("hidden");
        }
    }

    /**
     * Handles starting a new player session.
     */
    function newPlayer() {
        setCookie("username", "", -1); // Clear the cookie
        document.getElementById("username").value = "";
        document.getElementById("username").disabled = false;
        document.getElementById("new-player").classList.add("hidden");
    }

    /**
     * Displays scores from localStorage.
     */
    function displayScores() {
        const scoreTable = document.getElementById("score-table").getElementsByTagName('tbody')[0];
        scoreTable.innerHTML = ''; // Clear existing scores
        const scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.forEach(score => {
            const row = scoreTable.insertRow();
            row.insertCell(0).textContent = score.player;
            row.insertCell(1).textContent = score.score;
        });
    }
});
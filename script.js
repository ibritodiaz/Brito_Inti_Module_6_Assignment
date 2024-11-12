/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Get references to important HTML elements
    const form = document.getElementById("trivia-form"); // The form where users submit their answers
    const questionContainer = document.getElementById("question-container"); // The area where questions will be displayed
    const newPlayerButton = document.getElementById("new-player"); // Button to start a new player session

    // Cookie management functions
    function setCookie(name, value, days) {
        let expires = ""; // Initialize expiration variable
        if (days) { // Check if days are provided
            const date = new Date(); // Create a new date object
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set the expiration time
            expires = "; expires=" + date.toUTCString(); // Format the expiration date for cookies
        }
        // Set the cookie with name, value, and expiration
        document.cookie = `${name}=${value || ""}${expires}; path=/`;
    }

    function getCookie(name) {
        const nameEQ = `${name}=`; // Prepare the cookie name for comparison
        const ca = document.cookie.split(';'); // Split all cookies into an array
        for (let i = 0; i < ca.length; i++) { // Loop through each cookie
            let c = ca[i].trim(); // Remove whitespace from the cookie string
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length); // Return the value if found
        }
        return null; // Return null if the cookie is not found
    }

    // Initialize the game by checking for existing user data and fetching questions
    checkUsername(); 
    fetchQuestions(); 
    displayScores(); 

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple") // Fetch questions from API
            .then(response => response.json()) // Convert response to JSON format
            .then(data => {
                displayQuestions(data.results); // Display the questions retrieved from API
                showLoading(false); // Hide loading state after questions are fetched
            })
            .catch(error => {
                console.error("Error fetching questions:", error); // Log any errors to the console
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList.toggle("hidden", !isLoading); // Show or hide loading container based on isLoading
        document.getElementById("question-container").classList.toggle("hidden", isLoading); // Show or hide question container based on isLoading
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions in the container
        questions.forEach((question, index) => { // Loop through each question in the array
            const questionDiv = document.createElement("div"); // Create a new div for each question
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(question.correct_answer, question.incorrect_answers, index)} 
            `; 
            questionContainer.appendChild(questionDiv); // Add the new question div to the container
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(correctAnswer, incorrectAnswers, questionIndex) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5); // Combine and shuffle answers randomly
        return allAnswers.map(answer => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${answer === correctAnswer ? 'data-correct="true"' : ""}>
                ${answer}
            </label>
        `).join(""); // Create radio buttons for each answer option and return as a string
    }

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit); // Listen for form submissions to handle them with handleFormSubmit function
    newPlayerButton.addEventListener("click", newPlayer); // Listen for clicks on new player button

    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior
        
        const username = document.getElementById("username").value; // Get username from input field
        
        if (!username) { 
            alert("Please enter your name"); 
            return; 
        } 
        
        if (!getCookie("username")) { 
            setCookie("username", username, 7); // Store username in cookies for 7 days 
        } 
        
        checkUsername(); // Update UI after setting cookie
        
        const score = calculateScore(); // Calculate score based on user answers
        
        saveScore(username, score); // Save score in localStorage
        
        displayScores(); // Update displayed scores
        
        fetchQuestions(); // Fetch new questions for next round
        
        alert(`Thanks for playing! Your score is ${score} out of ${document.querySelectorAll('#question-container > div').length}.`); 
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
        
       scores.sort((a, b) => b.score - a.score); 
        
       if (scores.length > 10) { 
           scores.pop(); 
       } 
        
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
       setCookie("username", "", -1); 
        
       document.getElementById("username").value = ""; 
       document.getElementById("username").disabled = false; 
       document.getElementById("new-player").classList.add("hidden"); 
   }

   /**
     * Displays scores from localStorage.
     */
   function displayScores() {
       const scoreTable = document.getElementById("score-table").getElementsByTagName('tbody')[0]; 
        
       scoreTable.innerHTML = ''; 
        
       const scores = JSON.parse(localStorage.getItem('scores')) || []; 
        
       scores.forEach((score, index) => { 
           const row = scoreTable.insertRow(); 
           
           row.insertCell(0).textContent = index + 1;  // Rank column with index + 1 for ranking players  
           row.insertCell(1).textContent = score.player;  // Player's name column  
           row.insertCell(2).textContent = score.score;  // Player's score column  
       }); 
   }
});
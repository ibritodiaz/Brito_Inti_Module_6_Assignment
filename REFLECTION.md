## Project Overview

In this project, I create a trivia game that lets users answer questions and keeps track of their scores. The game uses the Open Trivia Database API to get trivia questions and saves user data using cookies and localStorage.

## Code Explanation

Cookie Management

The cookie management functions help remember the player:

setCookie(name, value, days): This function creates a cookie with a name, value, and expiration days. It saves the username when a player starts playing.
getCookie(name): This function retrieves the value of a cookie by its name. It checks all cookies and returns the value if it finds the right one.

## User Session Initialization

When the game starts, it checks if there's already a user:

In the checkUsername() function (lines 100-111), it looks for a cookie with the username. If it finds one, it updates the UI to show that the user is back.

## Form Submission Handling

The handleFormSubmit(event) function (lines 70-94) does several things when a player submits their name:

1- Prevent Default Submission: Stops the form from submitting normally.
2- Username Management: Checks if a username was entered and saves it in cookies if it's new.
3- Score Calculation: Calls calculateScore() to see how many answers were correct.
4- Score Saving: Uses saveScore(username, score) to store the score in localStorage.
5- UI Updates: Calls displayScores() to show updated scores and fetches new questions.

## Score Calculation Logic

The calculateScore() function (lines 122-136) counts how many answers were correct:

 It checks each question to see if the selected answer matches the correct one.

## Score Persistence

The saveScore(username, score) function (lines 141-153) saves scores in localStorage:

 Scores are stored as an array of objects with player names and scores.
 The scores are sorted so that only the top 10 scores are kept.

The displayScores() function (lines 156-171) reads from localStorage and shows current scores in a table format with ranks.

## Reflection on Coding Process

I began by planning how to build the game. I broke down tasks into smaller parts like setting up HTML structure, writing JavaScript for fetching questions, managing cookies, calculating scores, and saving them.

I organized my work by creating functions for each task. This made debugging easier and helped me understand how everything works together.

## Challenges Faced

One challenge was making sure returning users were recognized correctly. I had issues where users were not remembered because of mistakes in cookie handling. I fixed this by checking my code in checkUsername() and ensuring cookies were set properly in handleFormSubmit().

Another challenge was saving scores correctly without overwriting previous entries in localStorage. I solved this by sorting scores in saveScore() to keep only the top 10 scores.

## Improvements

From this project, I learned about managing user sessions with cookies and localStorage. If I started over, I would consider adding features like:

 User Accounts: Allowing users to create accounts for better session management.
 
 Better UI/UX: Improving how the game looks with better styles or animations.

 Error Handling: Adding more error handling for API calls to let users know when something goes wrong.


Overall, this project helped me understand more about managing data in web applications while giving me practical experience with JavaScript coding practices.

## Acknowledgment

I received help from AI during different stages of development, especially when structuring my code and debugging issues related to session management and score persistence. 
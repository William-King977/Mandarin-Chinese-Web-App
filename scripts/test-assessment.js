// Shuffles the array contents.
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

// Chinese characters are in their unicode representation.
var ni = '\u4F60';
var nin = '\u60A8';
var hao = '\u597D';
var wo = '\u6211';
var hen = '\u5F88';
var ma = '\u5417';

// Current number of questions answered.
var questionsAnswered = 0;

// Current number of correct answers.
var correct = 0;

// Holds the questions for the test.
var testQuestions = [];
const NUM_OF_QUESTIONS = 10;

// Holds the user's answer and also holds if it was correct (or incorrect).
// Used for displaying the user's answers in the results table.
// NOTE: This is a 2-D array where each input is [answer, "(In)Correct"].
var userAnswer = [];

// Translate questions for sentences. They have the question, then the possible answers.
// Each question set is stored in a 2-D array.
var questionSet1 = [
	["Translate: \u4F60\u597D ", ["hello", "hi"]],
	["Translate: \u4F60\u597D\u5417?", ["how are you?", "how are you"]],
	["Translate: \u6211\u5F88\u597D", ["i'm good", "i'm fine", "i am good", "i am fine"]]
];

// Translate questions for single characters. They have the question, then the possible answers.
var questionSet2 = [
	["Translate: \u4F60", ["you"]],
	["Translate: \u60A8", ["you (polite version)", "you"]],
	["Translate: \u597D", ["good, fine", "good", "fine"]],
	["Translate: \u6211", ["i, me", "i", "me"]],
	["Translate: \u5F88", ["very"]],
	["Translate: \u5417", ["interrogative word (used at the end of a statement to form a question)", "interrogative word"]]
];

// Multiple choice questions. They have the question, choices, then the correct answer.
var questionSet3 = [
	["Select the word matching: \u4F60", ["You (Polite Version)", "You", "I, me", "Very", "Interrogative word (used at the end of a statement to form a question)", "Good, fine"], "You"],
	["Select the word matching: \u60A8", ["I, me", "Interrogative word (used at the end of a statement to form a question)", "You", "You (Polite Version)", "Good, fine", "Very"], "You (Polite Version)"],
	["Select the word matching: \u597D", ["You (Polite Version)", "Very", "Good, fine", "I, me", "Interrogative word (used at the end of a statement to form a question)", "You"], "Good, fine"],
	["Select the word matching:\u6211", ["Very", "You", "Good, fine", "Interrogative word (used at the end of a statement to form a question)", "I, me", "You (Polite Version)"], "I, me"],
	["Select the word matching: \u5F88", ["Very", "Good, fine", "Interrogative word (used at the end of a statement to form a question)", "You", "I, me", "You (Polite Version)"], "Very"],
	["Select the word matching: \u5417", ["You (Polite Version)", "Good, fine", "You", "I, me", "Very", "Interrogative word (used at the end of a statement to form a question)"], "Interrogative word (used at the end of a statement to form a question)"],
	["Select the character matching: You", [wo, ni, nin, hao, ma, hen], ni],
	["Select the character matching: You (Polite Version)", [nin, hen, wo, ma, ni, hao], nin],
	["Select the character matching: Good, fine", [ma, hao, nin, ni, hen, wo], hao],
	["Select the character matching: I, me", [hen, nin, ni, hao, ma, wo], wo],
	["Select the character matching: Very", [hao, wo, ma, hen, ni, nin], hen],
	["Select the character matching: Interrogative word (used at the end of a statement to form a question)", [ni, hao, ma, hen, wo, nin], ma]
];

// Shuffles each question and the options for the multiple choice questions.
function randomiseQuestions() {
	// Shuffle the options for the multiple choice questions.
	for (var i = 0; i < questionSet3.length; i++) {
		shuffleArray(questionSet3[i][1]);
	}
	
	// Shuffle each question set.
	shuffleArray(questionSet1);
	shuffleArray(questionSet2);
	shuffleArray(questionSet3);
}

// Selects the questions for the test.
function selectQuestions() {
	// Shuffle the question sets.
	randomiseQuestions();
	
	for (var i = 0; testQuestions.length < NUM_OF_QUESTIONS; i++) {
		// Favours question set 2.
		if (testQuestions.length == 9) {
			testQuestions.push(questionSet2[i]);
		} else {
			testQuestions.push(questionSet1[i]);
			testQuestions.push(questionSet2[i]);
			testQuestions.push(questionSet3[i]);
		}
	}
	
	// Shuffle the questions for the test.
	shuffleArray(testQuestions);
}

// Display the current question onto the page.
function renderQuestion() {
	// Get the current question.
	var question = testQuestions[questionsAnswered][0];
	
	// Fetch HTML components.
	var testCont = document.getElementById("testCont");
	var mainHeader = document.getElementById("mainHeader");
	
	// Display number of questions answered.
	mainHeader.innerHTML = "Question " + (questionsAnswered + 1) + " of " + NUM_OF_QUESTIONS;

	// If it's a multiple choice question.
	if (question.indexOf("Select the") >= 0) {
		testCont.innerHTML = "<h3>" + question + "</h3>";
		
		// Display each option.
		for (var i = 0; i < testQuestions[questionsAnswered][1].length; i++) {
			var radioBox = testQuestions[questionsAnswered][1][i];
			testCont.innerHTML += "<label><input type='radio' name='option' value='" + radioBox + "'>" + radioBox + "</label><br>";
		}
		// Used to insert text for invalid input.
		testCont.innerHTML += "<div id = 'invalid-input'></div><br>";
		
		// Submit button.
		testCont.innerHTML += "<button onclick='checkSelectAnswer()'> Submit Answer </button>";

	// This applies if the question has the text 'Translate:'.
	} else if (question.indexOf("Translate:") >= 0) {
		testCont.innerHTML = "<h3>" + question + "</h3>";

		// Textbox for input.
		testCont.innerHTML += "<input type='text' id='Translate'>";

		// Used to insert text for invalid input.
		testCont.innerHTML += "<div id = 'invalid-input'></div><br>";

		// Submit button.
		testCont.innerHTML += "<button onclick ='checkTranslateAnswer()'> Submit Answer </button>";
	}
}

// Checks the user's answer for a multiple choice question.
function checkSelectAnswer() {
	// Stores each radio button as an array.
	var options = document.getElementsByName("option");
	// Fetch the div to insert the a message if the user's input is invalid.
	var invalidInputDiv = document.getElementById("invalid-input");
	
	var option_selected;
	var answerSelected = false;

	// Checks if the user has selected an answer (radio button).
	// Their answer will be stored if they have.
	for (var i = 0; i < options.length; i++) {
		if (options[i].checked) {
			// Get the user's selected answer.
			option_selected = options[i].value;
			answerSelected = true;
			break;
		}
	}

	// If there's no input.
	if (!answerSelected) {
		invalidInputDiv.innerText = "Please select an answer.";
		// User stays on the same question.
		return false;
	}

	// If the user's answer is correct.
	if (option_selected == testQuestions[questionsAnswered][2]) {
		correct++;
		userAnswer.push([option_selected, "Correct"]);

	// If it was incorrect.
	} else {
		userAnswer.push([option_selected, "Incorrect"]);
	}

	questionsAnswered++;
	progressNextQuestion();
}

// Checks the user's answer for a translation question.
function checkTranslateAnswer() {
	// A regex allowing spaces, apostrophes, lowercase and uppercase letters.
	var lettersSpaces = /^[a-zA-Z-' ]+$/;

	// A regex that allows spaces or no inputs.
	var spacesOrNoInput = /^ *$/;

	// The answer the user typed in is retrieved by ID and it's all set to lowercase.
	var translate_answer = (document.getElementById("Translate").value).toLowerCase();
	// Fetch the div to insert the a message if the user's input is invalid.
	var invalidInputDiv = document.getElementById("invalid-input");

	// If the answer is correct.
	if (testQuestions[questionsAnswered][1].includes(translate_answer)) {
		correct++;
		userAnswer.push([translate_answer, "Correct"]);
		
	// If the input is over the character limit.
	} else if (translate_answer.length > 70) {
		invalidInputDiv.innerText = "Please enter a suitable length answer that is less than 70 characters.";
		return false;

	// If there is no input.
	} else if (spacesOrNoInput.test(translate_answer)){
		invalidInputDiv.innerText = "Please enter an answer.";
		return false;

	// If non-alphabetic characters were entered.
	} else if (!lettersSpaces.test(translate_answer)){
		invalidInputDiv.innerText = "Please enter a valid answer with letters and suitable spaces only.";
		return false;

	// If it's incorrect.
	} else {
		userAnswer.push([translate_answer, "Incorrect"]);
	}

	questionsAnswered++;
	progressNextQuestion();
}

// Determines the progress based on the number of questions answered.
function progressNextQuestion() {
	// Show the next question if all questions haven't been answered.
	if (questionsAnswered < NUM_OF_QUESTIONS) {
		renderQuestion();
		
	// Show the results when all questions have been answered.
	} else {
		renderResults();
	}
}

// Shows the user's results.
function renderResults() {
	// Update the header to indicate the test completion.
	document.getElementById("mainHeader").innerHTML = "Test Completed";
	
	// Show how the user's result.
	var testCont = document.getElementById("testCont");
	testCont.innerHTML = "<h2>You got " + correct + " of " + NUM_OF_QUESTIONS +" questions correct</h2>";
	
	// Options for a retest or to view their results in more detail.
	testCont.innerHTML += '<button onclick="showResults()"> View Results </a>';
	testCont.innerHTML += '<br><br><button onclick="location.reload()"> Retest </a> ';
}

// Displays the user's results for each question in a tabular form.
function showResults() {
	// Create a table object.
	var tblResults = document.createElement('table');
	tblResults.style.border = "solid";
	
	// Insert the row and columns for the headers.
	// NOTE: Numbers aren't really needed. Only for specific insertion spots.
	var row = tblResults.insertRow();
	var colQuestion = row.insertCell(0);
	var colUserAnswer = row.insertCell(1);
	var colCorrectAnswer = row.insertCell(2);
		
	// Ajust the cell boarders.
	colQuestion.style.border = "solid";
	colUserAnswer.style.border = "solid";
	colCorrectAnswer.style.border = "solid";
		
	// Set the headers in the cells.
	colQuestion.innerHTML = '<b> Question </b>';
	colUserAnswer.innerHTML = '<b> Your Answer </b>';
	colCorrectAnswer.innerHTML = '<b> Correct Answer </b>';
	
	// Add a row for each question.
	for (var i = 0; i < NUM_OF_QUESTIONS; i++) {
		var row = tblResults.insertRow();
		
		// Insert the columns for the row.
		var colQuestion = row.insertCell(0);
		var colUserAnswer = row.insertCell(1);
		var colCorrectAnswer = row.insertCell(2);
		
		// Ajust the cell boarders.
		colQuestion.style.border = "solid";
		colUserAnswer.style.border = "solid";
		colCorrectAnswer.style.border = "solid";
		
		colQuestion.innerHTML = testQuestions[i][0];
		colUserAnswer.innerHTML = userAnswer[i][0];
			
		// If it's a translate question, then show the first correct answer.
		if (testQuestions[i][0].indexOf("Translate:") >= 0) {
			colCorrectAnswer.innerHTML = testQuestions[i][1][0];
		} else {
			colCorrectAnswer.innerHTML = testQuestions[i][2];
		}
			
		// Colour the cell based on the user's answer.
		// Colour it green if it was correct.
		if (userAnswer[i][1] == "Correct") {
			colUserAnswer.style.border += "#008000";
		// Otherwise, colour it red (for incorrect).
		} else {
			colUserAnswer.style.border += "#FF0000";
		}
	}
	
	// Get the tag to insert the table.
	var testCont = document.getElementById('testCont');

	// Show the user's score and some text to help the user understand what's shown/highlighted on the table.
	testCont.innerHTML = "<h2>You got " + correct + " of " + NUM_OF_QUESTIONS + " questions correct</h2>";
	testCont.innerHTML += "<h5>The answers you entered that are highlighted <span style ='color:#008000'> GREEN </span> are CORRECT. " +
					  "The answers highlighted in <span style ='color:#FF0000'> RED </span> are INCORRECT.</h5>"
	
	// Show the table on the page.
	testCont.appendChild(tblResults);
	testCont.innerHTML += '<br><button onclick="location.reload()"> Re-Test </a>';
}

// Run the functions stated when the page is loaded.
window.onload = function() {
	selectQuestions();
	progressNextQuestion();
}
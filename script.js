let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let timer;
let totalTime = 60; // Set total time for quiz

// Function to start the quiz after entering the name
function startQuiz() {
    const name = document.getElementById('student-name').value;
    if (name.trim() !== '') {
        document.getElementById('name-page').classList.remove('active');
        document.getElementById('question-count-page').classList.add('active');
    } else {
        alert('Please enter your name');
    }
}

// Function to generate random math questions
function generateMathQuestions(count) {
    const operations = ['+', '-', '*'];
    const questions = [];
    for (let i = 0; i < count; i++) {
        const num1 = Math.floor(Math.random() * 20) + 1; // Random number between 1 and 20
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let question;
        let answer;

        if (operation === '+') {
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
        } else if (operation === '-') {
            question = `${num1} - ${num2}`;
            answer = num1 - num2;
        } else {
            question = `${num1} * ${num2}`;
            answer = num1 * num2;
        }

        questions.push({
            question: question,
            options: generateOptions(answer),
            answer: answer
        });
    }
    return questions;
}

// Function to generate answer options
function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        const randomOption = correctAnswer + (Math.floor(Math.random() * 10) - 5);
        if (randomOption > 0) {
            options.add(randomOption);
        }
    }

    return Array.from(options).sort(() => Math.random() - 0.5); // Shuffle options
}

// Function to select number of questions and start the quiz
function selectQuestions() {
    const count = parseInt(document.getElementById('question-count').value);
    selectedQuestions = generateMathQuestions(count); // Generate math questions

    currentQuestionIndex = 0; // Reset question index
    score = 0; // Reset score

    document.getElementById('question-count-page').classList.remove('active');
    document.getElementById('quiz-page').classList.add('active');
    startTimer();
    showQuestion();
}

// Function to display the current question
function showQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const questionText = document.createElement('h2');
    questionText.textContent = currentQuestion.question;

    const optionsList = document.createElement('ul');
    currentQuestion.options.forEach((option) => {
        const optionItem = document.createElement('li');
        optionItem.textContent = option;
        optionItem.onclick = () => selectAnswer(option);
        optionsList.appendChild(optionItem);
    });

    questionContainer.appendChild(questionText);
    questionContainer.appendChild(optionsList);
}

// Function to handle answer selection
function selectAnswer(selectedOption) {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    if (currentQuestion.answer === selectedOption) {
        score++;
    }
    document.querySelectorAll('#question-container ul li').forEach((li) => {
        li.style.pointerEvents = 'none';
        if (li.textContent == currentQuestion.answer) {
            li.style.backgroundColor = 'green';
        } else if (li.textContent == selectedOption) {
            li.style.backgroundColor = 'red';
        }
    });
}

// Function to move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < selectedQuestions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

// Function to start the quiz timer
function startTimer() {
    let timeLeft = totalTime;
    timer = setInterval(() => {
        const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const seconds = String(timeLeft % 60).padStart(2, '0');
        document.getElementById('time-left').textContent = `${minutes}:${seconds}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

// Function to end the quiz and show the result page
function endQuiz() {
    clearInterval(timer);
    document.getElementById('quiz-page').classList.remove('active');
    document.getElementById('result-page').classList.add('active');

    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = `<p>You scored ${score} out of ${selectedQuestions.length}</p>`;

    selectedQuestions.forEach((question, index) => {
        const resultItem = document.createElement('p');
        resultItem.textContent = `Q${index + 1}: ${question.question} - ${question.answer} (${question.answer === question.options.indexOf(question.answer) ? 'Correct' : 'Wrong'})`;
        resultContainer.appendChild(resultItem);
    });
}

// Function to generate the certificate
function generateCertificate() {
    const certificateContainer = document.getElementById('certificate-container');
    certificateContainer.innerHTML = `<h2>Congratulations, ${document.getElementById('student-name').value}!</h2>
                                      <p>You scored ${score} out of ${selectedQuestions.length}</p>`;
    document.getElementById('result-page').classList.remove('active');
    document.getElementById('certificate-page').classList.add('active');
}

// Function to download the certificate as PDF
function downloadCertificate() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const name = document.getElementById('student-name').value;
    const scoreText = `You scored ${score} out of ${selectedQuestions.length}`;
    doc.text(`Certificate of Completion`, 20, 20);
    doc.text(`Congratulations, ${name}!`, 20, 40);
    doc.text(scoreText, 20, 60);
    doc.save('certificate.pdf');
}

// Function to restart the quiz
function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById('certificate-page').classList.remove('active');
    document.getElementById('name-page').classList.add('active');
}

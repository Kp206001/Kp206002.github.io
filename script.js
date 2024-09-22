document.addEventListener("DOMContentLoaded", function() {
    let currentQuestion;
    let score = 0;
    let totalQuestions = 5; // Set default number of questions
    let currentQuestionIndex = 0;

    // Function to start the quiz after entering the name and selecting question count
    window.startQuiz = function() {
        const name = document.getElementById('student-name').value;
        const count = parseInt(document.getElementById('question-count').value);

        if (name.trim() !== '' && count > 0 && count <= 50) {
            totalQuestions = count; // Update totalQuestions based on user input
            document.getElementById('name-page').classList.remove('active');
            document.getElementById('quiz-page').classList.add('active');
            generateQuestion();
        } else {
            alert('Please enter your name and select a valid number of questions (1-50).');
        }
    };

    // Function to generate a random question
    function generateQuestion() {
        const num1 = Math.floor(Math.random() * 30) + 1;
        const num2 = Math.floor(Math.random() * 30) + 1;
        const operations = ['+', '-', '*', '/'];
        const operation = operations[Math.floor(Math.random() * operations.length)];

        currentQuestion = {
            question: `${num1} ${operation} ${num2}`,
            answer: calculateAnswer(num1, num2, operation)
        };

        document.getElementById('question-container').textContent = currentQuestion.question;
        document.getElementById('answer').value = '';
        document.getElementById('next-question').style.display = 'none';
    }

    // Function to calculate the correct answer
    function calculateAnswer(num1, num2, operation) {
        switch (operation) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                return num1 / num2;
        }
    }

    // Function to submit the answer
    window.submitAnswer = function() {
        const userAnswer = parseFloat(document.getElementById('answer').value);
        if (userAnswer === currentQuestion.answer) {
            score++;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            document.getElementById('next-question').style.display = 'inline';
            document.getElementById('answer').disabled = true;
        } else {
            endQuiz();
        }
    };

    // Function to show the next question
    window.nextQuestion = function() {
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('answer').disabled = false;
        generateQuestion();
    };

    // Function to end the quiz and show the result page
    function endQuiz() {
        document.getElementById('quiz-page').classList.remove('active');
        document.getElementById('result-page').classList.add('active');

        const resultContainer = document.getElementById('result-container');
        resultContainer.innerHTML = `<p>You scored ${score} out of ${totalQuestions}</p>`;
    }

    // Function to generate the certificate
    window.generateCertificate = function() {
        const { jsPDF } = window.jspdf; // Accessing jsPDF from the global window object
        const name = document.getElementById('student-name').value;
        const resultText = `This certificate is awarded to\n\n${name}\n\nfor scoring ${score} out of ${totalQuestions} in the Quiz.`;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1200;
        canvas.height = 800;

        // Background color
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        ctx.strokeStyle = '#8A2BE2';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, canvas.width - 15, canvas.height - 15);

        // Certificate Title
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Achievement', canvas.width / 2, 50);

        // Result Text
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(resultText, canvas.width / 2, 150);

        // Add decorative elements (optional)
        ctx.fillStyle = '#8A2BE2';
        ctx.fillRect(10, 320, canvas.width - 20, 5);
        ctx.fillText('Date: ' + new Date().toLocaleDateString(), canvas.width / 2, 350);

        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 size
        pdf.save(`${name}_certificate.pdf`);
    };

    // Function to restart the quiz
    window.restartQuiz = function() {
        score = 0;
        currentQuestionIndex = 0;
        document.getElementById('result-page').classList.remove('active');
        document.getElementById('name-page').classList.add('active');
        document.getElementById('question-count').value = 5; // Reset question count to default
    };
});

let givenQuestions = new Array();
let givenAns;

let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let userScorePercent = document.querySelector('.userScorePercent');
let nmbrOfQuestion = document.querySelector('.nmbrOfQuestion');
let categoryOfQuestion = document.querySelector('.categoryOfQuestion');
let sec = document.getElementById('seconds')
let next = document.querySelector('.next');
let previous = document.querySelector('.previous');
let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let report = document.querySelector('.report');
let pointsAvg = document.querySelector('.pointsAvg');
let percentAvg = document.querySelector('.percentAvg');
let progressBar = document.querySelector('.progress-bar');
let timer = document.querySelector('.timer');
let effects = document.querySelector('.effects');

const TIME = 600;
let index = 0;
let points = 0;
let numberOfGames = 0;
let nmbrOfNotAnsweredQuestion = 0;
let localStoragePoints = 0;//localStorage.getItem('points')
let allPercentage = 0;
let timeleft = TIME;

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;

        for (let i = 0; i < answers.length; i++) {
            answers[i].addEventListener('click', doAction);
        }

        function markCorrect(elem) {
            nmbrOfNotAnsweredQuestion++;
            elem.classList.add('correct');
            points++;
        }

        function markInCorrect(elem) {
            nmbrOfNotAnsweredQuestion++;
            elem.classList.add('incorrect');
        }

        function doAction(event) {
            let givenQ = {
                "nmbr": index + 1,
                "category": preQuestions[index].category,
                "question": preQuestions[index].question,
                "yourAnswer": event.target.innerHTML,
                "correctAnswer": preQuestions[index].correct_answer
            }

            givenQuestions.push(givenQ);
            console.log(givenQ);

            //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
            if (event.target.innerHTML === preQuestions[index].correct_answer) {
                if (nmbrOfNotAnsweredQuestion == index) {
                    markCorrect(event.target);
                    // points++;
                    pointsElem.innerText = points;
                }
            }
            else {
                markInCorrect(event.target);
            }
            disableAnswers();
        }

        function clearAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].classList.remove('correct');
                answers[i].classList.remove('incorrect');
            }
        }

        function setCategory() {
            categoryOfQuestion.innerHTML = preQuestions[index].category;
        }

        function showProgressBar(questNmbr) {
            let widthProgressBar = questNmbr * 5;
            progressBar.style.width = widthProgressBar + '%';
        }

        function setTimerBar(time) {
            let widthTimerBar = time / 6
            timer.style.width = widthTimerBar + '%';
        }

        function setQuestion(index) {
            clearAnswers();
            setCategory();

            let questNmbr = index + 1;
            showProgressBar(questNmbr);

            nmbrOfQuestion.innerHTML = questNmbr + ' of ' + preQuestions.length;
            question.innerHTML = preQuestions[index].question;
            answers[0].innerHTML = preQuestions[index].answers[0];
            answers[1].innerHTML = preQuestions[index].answers[1];

            if (preQuestions[index].answers.length === 2) {
                answers[2].style.display = 'none';
                answers[3].style.display = 'none';

            } else {
                answers[2].style.display = 'block';
                answers[3].style.display = 'block';
            }
            answers[2].innerHTML = preQuestions[index].answers[2];
            answers[3].innerHTML = preQuestions[index].answers[3];
        }

        function activateAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].addEventListener('click', doAction);
            }
        }

        function disableAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].removeEventListener('click', doAction);
            }
        }

        function showResults() {
            timeleft = null;
            list.style.display = 'none';
            results.style.display = 'block';

            let testPercentage = (points / preQuestions.length) * 100;
            allPercentage += testPercentage;
            userScorePoint.innerHTML = points;
            userScorePercent.innerHTML = Math.round(testPercentage);
            localStoragePoints += points;

            localStorage.setItem('games', ++numberOfGames);
            localStorage.setItem('points', localStoragePoints);
            localStorage.setItem('percent', allPercentage);
            let pointsLS = localStorage.getItem('points');
            let percentageLS = localStorage.getItem('percent');

            pointsAvg.innerHTML = Math.round(pointsLS / numberOfGames);
            percentAvg.innerHTML = Math.round(percentageLS / numberOfGames);
        }

        function nextQuestion() {
            index++;

            if (index >= preQuestions.length) {
                showResults();

            } else {
                setQuestion(index);
                activateAnswers();
            }
        }

        function showReport(item) {
            let correctnessColor;
            if (item.yourAnswer == item.correctAnswer) {
                correctnessColor = "style = \"background-color: #289a27;\""
            } else {
                correctnessColor = "style = \"background-color: #c41a21;\""
            }

            effects.innerHTML += '<div style="padding-top: 3%;">' +
                '<h4>Question: <span>' + item.nmbr + '</span></h4>' +
                '<h4>Category - <span>' + item.category + '</span></h4>' +
                '<h4>Question: ' + item.question + '</h4>' +
                '<ul class="list-group">' +
                '<li class="list-group-item disabled " ' +
                correctnessColor + '><span style="color: white;">Your Answer: '
                + item.yourAnswer + '</span></li>' +
                '<li class="list-group-item disabled" ' +
                'style="background-color: #289a27;"><span style="color: white;">Correct Answer: '
                + item.correctAnswer + '</span></li>' +
                '</ul>' +
                '</div>';
        }

        function allReports() {
            givenQuestions.forEach(showReport);
        }

        function startCountdownTimer(duration) {
            timeleft = duration;
            let countdownT = setInterval(function () {
                if (timeleft < 0) {
                    clearInterval(countdownT);
                    // alert("Sorry..Time's up!");
                    showResults();
                } else {
                    setTimerBar(timeleft);
                    timeleft -= 1;
                }
            }, 1000);
        }

        function resetTimer() {
            startCountdownTimer(TIME)
        }

        activateAnswers();
        setQuestion(index);
        startCountdownTimer(TIME);

        next.addEventListener('click', nextQuestion)

        previous.addEventListener('click', function () {
            // sprawdzenie czy index nie jest liczba ujemną
            console.log('index', index);
            if (index > 0) {
                index--;
                setQuestion(index);
            }
        })

        restart.addEventListener('click', function (event) {
            event.preventDefault();

            index = 0;
            points = 0;
            nmbrOfNotAnsweredQuestion = 0;
            resetTimer();
            clearAnswers();
            pointsElem.innerHTML = points;
            effects.innerHTML = '<div></div>';

            setQuestion(index);
            activateAnswers();
            list.style.display = 'block';
            results.style.display = 'none';
        });

        report.addEventListener('click', allReports);
    });

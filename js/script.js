
let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let nmbrOfQuestion = document.querySelector('.nmbrOfQuestion');
let categoryOfQuestion = document.querySelector('.categoryOfQuestion');
let averagePoints = document.querySelector('.average');

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
console.log('odpowiedzi', answers);

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;
let numberOfGames = 0;
let nmbrOfNotAnsweredQuestion = 0;
let localStoragePoints = 0;//localStorage.getItem('points')


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
            // localStorage.setItem('points', points);
        }

        function markInCorrect(elem) {
            nmbrOfNotAnsweredQuestion++;
            elem.classList.add('incorrect');
        }

        function doAction(event) {
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


        function setQuestion(index) {
            // clearClass();
            clearAnswers();
            setCategory();

            let questNmbr = index + 1;
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
            list.style.display = 'none';
            results.style.display = 'block';
            userScorePoint.innerHTML = points;

            localStoragePoints += points;
            localStorage.setItem('games', ++numberOfGames);
            localStorage.setItem('points', localStoragePoints);

            let pointsLS = localStorage.getItem('points');


            let avgPoints = pointsLS / (numberOfGames * preQuestions.length);
            averagePoints.innerHTML = avgPoints;
        }

        // elem.classList.remove('correct');
        activateAnswers();


        setQuestion(index);

        next.addEventListener('click', function () {
            // spraawdzenie, czy nie wychodzimy poza zakres tablicy
            console.log('index', index);
            index++;

            if (index >= preQuestions.length) {
                showResults();

            } else {
                setQuestion(index);
                console.log('PUNKTY: ', points);
                activateAnswers();
            }
        })

        previous.addEventListener('click', function () {
            // sprawdzenie czy index nie jest liczba ujemną
            console.log('index', index);
            if (index > 0) {
                index--;
                setQuestion(index);
            }
        })
        // question.innerHTML = index + 1;

        restart.addEventListener('click', function (event) {
            event.preventDefault();

            index = 0;
            points = 0;
            nmbrOfNotAnsweredQuestion = 0;
            // pointsElem = document.querySelector('.score');
            clearAnswers();
            pointsElem.innerHTML = points;
            setQuestion(index);
            activateAnswers();
            list.style.display = 'block';
            results.style.display = 'none';
        });

        // localStorage.setItem('points', points);
        // console.log('punkty', localStorage.getItem('points'));
        // localStorage.removeItem('points');

    });
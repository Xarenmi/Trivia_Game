import Category from './db.js';

let score = 0;

let catID = '';
let difficulty = '';
let questionType = '';
let questionSet = [];
let currentQuestion = 0;

//Index
const index = document.getElementById('index');
const display = document.getElementById('display');
const catButtons = index.querySelectorAll('section');
display.style.display = 'none';
index.style.display = 'grid';

/* setTimeout(() => {
    const audio = new Audio('../audio/Einstein Kleinigkeiten.wav');
    audio.play();
}, 1000); */

catButtons.forEach(button => {
    //add select sound onMouseover
    button.addEventListener('click', () => {
        const cat = button.getAttribute('cat');
        catID = cat;
        loadOptions();
    });
});

function loadOptions() {

    index.style.display = 'none';
    display.style.display = 'grid';

    const types = document.querySelectorAll('#type img');

    types.forEach(element => {
        element.addEventListener('click', () => {
            types.forEach(item => {
                item.style.width = '120px';
            });
            element.style.width = '200px';

            let type = element.getAttribute('alt');
            if (type !== 'any') {
                questionType = type;

            } else {
                questionType = '';
            }
        });
    });


    let arrows = document.querySelectorAll('#difficulty img');
    const currentDifficulty = document.querySelector('#difficulty p');
    const possibleLevels = ['any', 'easy', 'medium', 'hard'];

    let currentIndex = 0;
    arrows[0].alt = possibleLevels[currentIndex];
    currentDifficulty.innerText = arrows[0].alt.toUpperCase()

    arrows[1].addEventListener('click', () => {
        if (currentIndex < 1) {
            arrows[1].disabled = true;
        } else {
            arrows[1].disabled = false;
            currentIndex--;
            arrows[0].src = `./img/${possibleLevels[currentIndex]}.png`;
            arrows[0].alt = possibleLevels[currentIndex];
            currentDifficulty.innerText = arrows[0].alt.toUpperCase()

            if (arrows[0].alt !== 'any') {
                difficulty = arrows[0].alt;
            } else {
                difficulty = '';
            }
        }
    });

    arrows[2].addEventListener('click', () => {
        if (currentIndex >= possibleLevels.length - 1) {
            arrows[2].disabled = true;
        } else {
            arrows[2].disabled = false;
            currentIndex++;
            arrows[0].src = `./img/${possibleLevels[currentIndex]}.png`;
            arrows[0].alt = possibleLevels[currentIndex];
            currentDifficulty.innerText = arrows[0].alt.toUpperCase()

            if (arrows[0].alt !== 'any') {
                difficulty = arrows[0].alt;
            } else {
                difficulty = '';
            }
        }
    });

    const continueBtn = document.querySelector('button');
    continueBtn.onclick = () => {
        setQuestions();
    };

}

function setQuestions() {
    display.style.display = 'flex';
    display.style.flexDirection = 'column';
    display.innerHTML = '<p id="score">SCORE: ' + score + '</p>';
    display.innerHTML += '<h1 class="question"></h1> <div class="answer-container"></div>'
    console.log(display);
    let set = new Category(catID, difficulty, questionType);
    set.fetchQuestions().then((questions) => {
        questionSet = questions;
        loadQuestion(questionSet[currentQuestion]);
    });
}

function loadQuestion(that) {
    //play thinking sound, arrange volume
    const board = document.querySelector('h1');
    board.innerText = that.question;
    setOptions(that);
}


function setOptions(question) {
    const answerContainer = document.getElementsByClassName('answer-container');
    let options = Category.shuffle(question);

    if (question.type === 'multiple') {
        answerContainer[0].innerHTML = '<div name="opcion1">' + options[0] + '</div>';
        answerContainer[0].innerHTML += '<div name="opcion2">' + options[1] + '</div>';
        answerContainer[0].innerHTML += '<div name="opcion3">' + options[2] + '</div>';
        answerContainer[0].innerHTML += '<div name="opcion4">' + options[3] + '</div>';
    } else {
        answerContainer[0].innerHTML = '<div name="opcion1">' + options[0] + '</div>';
        answerContainer[0].innerHTML += '<div name="opcion2">' + options[1] + '</div>';
    }

    let match = options.filter(option => option === question.correct_answer);
    isCorrect(match[0]);
}

function isCorrect(answer) {
    let scoreParagraph = document.getElementById('score');
    scoreParagraph.innerHTML = 'SCORE: ' + score;
    let buttons = Array.from(document.querySelectorAll('div'));
    buttons.splice(0, 1);
    let isClicked = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (!isClicked) {
                const chosen = button.innerText;

                //add select sound & background music
                if (chosen === answer) {
                    button.style.border = 'solid 5px #7ee069';
                    score += 10;
                } else {
                    button.style.border = 'solid 5px #e0697e';
                    buttons.forEach(b => {
                        if (b.innerText === answer) {
                            b.style.border = 'solid 5px #7ee069';
                        }
                    })
                }

                //display correct or wrong img
                currentQuestion++;

                buttons.forEach(b => {
                    b.disabled = true;
                });

                isClicked = true;

                if (currentQuestion < 10) {
                    setTimeout(() => {
                        loadQuestion(questionSet[currentQuestion]);
                    }, 1500);
                } else {
                    displayResults(score);
                }
            }

        });
    });
}


function displayResults(score) {
    display.style.display = 'grid';
    display.style.gridTemplate = 'repeat(6, 140px)/repeat(6, 1fr)';
    let message = '';
    /* let audio = new Audio('../audio/nochEinmal/vielleicht nachstes mal.wav'); */

    if (score >= 30 && score <= 60) {
        message = 'Need a little more practice.';
        /* audio = new Audio('../audio/nochEinmal/Du musst dich mehr anstrengen.wav');
        audio.play(); */
    } else if (score == 70 || score == 80) {
        message = 'GOOD JOB! Keep going!'
        /* audio = new Audio('../audio/gutGemacht/Toll.wav');
        audio.play(); */
    } else if (score >= 90) {
        message = 'MARVELOUS!';
        /* audio = new Audio('../audio/gutGemacht/wunderbar.wav');
        audio.play(); */
    } else {
        message = "You could've done better... Maybe next time.";
        /* audio.play();  */
    }

    display.innerHTML = `
    <img src="./img/Score.png" alt="einstein" id="score_img"/>
    <aside id="score_message">
        ${message} <br> 
        You scored <strong> ${score} </strong> points! 
    </aside> 
    <aside class="two_buttons">
        <button>RETRY</button>
        <button>QUIT</button>
    </aside>`;
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = "#9eceff";
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = "#0427c1";
        });

        if (button.innerText === 'RETRY') {
            button.onclick = function () {
                location.reload();
            };
        } else {
            button.onclick = function () {
                window.close();
            };
        }
    });

    //play farewell sound
    console.log(score);
}


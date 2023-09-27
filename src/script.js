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
display.hidden = true;
index.style.display = 'grid';

setTimeout(() => {
    const audio = new Audio('../audio/Einstein Kleinigkeiten.wav');
    audio.play();
}, 1000);

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
    display.hidden = false;
    display.innerHTML = '<div id="typeSelect"><aside id="multiple">MULTIPLE</aside><aside id="boolean">BOOLEAN</aside><aside id="any">A BIT OF EVERYTHING</aside></div>';
    let multiple = document.getElementById('multiple');
    let boolean = document.getElementById('boolean');
    let any = document.getElementById('any');
    const options = [multiple, boolean, any];

    options.forEach(option => {
        option.addEventListener('click', () => {
           let typeID = option.getAttribute('id');
           if(typeID !== 'any'){
                questionType = typeID;
           } else {
                questionType = '';
           }
           
           setQuestions();

        })
    })
    
}


function setQuestions() {
    display.innerHTML = '<p id="score">SCORE: ' + score + '</p>';
    display.innerHTML += '<h1 class="question"></h1> <div class="answer-container"></div>' 
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
    //add score
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
    scoreParagraph.innerHTML = 'SCORE ' + score;
    let buttons = Array.from(document.querySelectorAll('div'));
    buttons.splice(0, 1);
    let isClicked = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (!isClicked) {
                const chosen = button.innerText;

                //add select sound
                if (chosen === answer) {
                    button.style.border = 'solid 5px #7ee069';
                    score += 10;
                } else {
                    button.style.border = 'solid 5px #e0697e';
                    buttons.forEach(b => {
                        if(b.innerText === answer){
                            b.style.border = 'solid 5px #7ee069';
                        }
                    })
                }
                
                //display correct or wrong img
                //update score
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
                    displayResults(100);
                }
            }

        });
    });
}

//complete
function displayResults(score){
    //add quit or restar button
    //play result sound
} 


const MAX_LEVEL = 5;

const audio1 = new Audio('./audios/quiz/correct-audio.mp3');
const audio2 = new Audio('./audios/quiz/wrong-audio.mp3');
const audio3 = new Audio('./audios/quiz/aww-audio.mp3');
const audio4 = new Audio('./audios/quiz/wow-audio.mp3');

const audios = [audio1, audio2, audio3, audio4];

/*  Timer */
let sec = 0;
let min = 0;
let hrs = 0;
let timeText = '00:00:00';
let t;

function tick(){
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hrs++;
        }
    }
}

function add() {
    tick();
    timeText = (hrs > 9 ? hrs : "0" + hrs) 
        	 + ":" + (min > 9 ? min : "0" + min)
       		 + ":" + (sec > 9 ? sec : "0" + sec);
    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

function stopTimer(){
    clearTimeout(t);
}

function resetTimer(){
    timeText = '00:00:00';
    min = 0;
    sec = 0;
    hrs = 0;
}

function refreshTimer(){
    stopTimer();
    resetTimer();
    timer();
}

class Quiz{
    constructor(type = '', difficulty = 0, score = 0, maxScore = 0){
        this.type = type;
        this.difficulty = difficulty;
        this.maxScore = maxScore;
        this.heart = 2;
        this.mathSign = null;
        this.score = score;
        this.pointer = 0;
        this.tasks = [];
    }
}

let quiz = new Quiz();

function addDifficulty(difficulty){
    quiz.difficulty = difficulty;
    quiz.maxScore = (MAX_LEVEL - difficulty)*3;
    document.querySelector('.difficulty-container').classList.remove('isVisible');
    setTimeout(() => {
        document.querySelector('.math-zone').classList.add('isVisible');
        document.querySelector('.math-score').classList.add('isVisible');
        document.querySelector('.life-bar').classList.add('isVisible');
    }, 300);

    createQuiz();
}

function pauseAudio(){
    audios.forEach( (audio) => {
        audio.pause();
    });
}

function addType(type){
    document.querySelector('.math-container').classList.remove('isVisible');
    document.querySelector('.math-menu').classList.add('isVisible');
    quiz.type = type;
    setTimeout(() => {
        document.querySelector('.difficulty-container').classList.add('isVisible');
    }, 300);
}

function goBack(){
    document.querySelector('.math-zone').classList.remove('isVisible');
    document.querySelector('.math-menu').classList.remove('isVisible');
    document.querySelector('.math-score').classList.remove('isVisible');
    document.querySelector('.life-bar').classList.remove('isVisible');
    document.querySelector('.difficulty-container').classList.remove('isVisible');
    document.querySelector('.math-container').classList.add('isVisible');
    document.querySelector('.result-screen').classList.remove('isVisible');
    resetQuiz();
    stopTimer();
    resetTimer();
}

function resetQuiz(){
    quiz = new Quiz();
}

function convertArray(arr){
    let str = '';
    arr.splice(arr.length - 1, 1);

    arr.forEach( (element) => {
        str = str + ' ' + element;
    });
    return str;
}

function verifyAnswer(){
    if (Math.abs(quiz.tasks[quiz.pointer].answer) === Math.abs(parseInt(document.querySelector('input').value))){ // correct answer
        quiz.score++;
        audios[0].play();
        animateCorrect();
    } else { // wrong answer
        quiz.heart--;
        updateLifeBar();
        if (quiz.heart >= 0){
            audios[1].play();
        }
        document.querySelector('.correct-answer-value').innerHTML = `${quiz.tasks[quiz.pointer].answer}`;
        animateWrong();
    }

    if (quiz.pointer === quiz.tasks.length - 1 || quiz.heart < 0){
        showResults();
    } else {
        quiz.pointer++;
    }

    document.querySelector('.math-score').innerHTML = `${quiz.score}/${quiz.maxScore}`;
    document.querySelector('input').value = '';
    document.querySelector('.math-question').innerHTML = quiz.tasks[quiz.pointer].question;    
}

function animateCorrect(){
    document.querySelector('.math-zone').classList.add('isCorrect');

    setTimeout( ()=>{
        document.querySelector('.math-zone').classList.remove('isCorrect');
    }, 1000);
}

function animateWrong(){
    document.querySelector('.math-zone').classList.add('isWrong');
    document.querySelector('.correct-answer').classList.add('isVisible');
    
    setTimeout( ()=>{
        document.querySelector('.math-zone').classList.remove('isWrong');
        document.querySelector('.correct-answer').classList.remove('isVisible');
    }, 1500);
}

function showResults(){
    if (quiz.score/quiz.maxScore < .1 ){
        document.querySelector('.result-value').style.marginLeft = '35px';

    } else if (quiz.score === quiz.maxScore) {
        document.querySelector('.result-value').style.fontSize = '3rem';
    } else {
        document.querySelector('.result-value').style.marginLeft = '12px';
    }

    if (quiz.score === quiz.maxScore){
        audios[3].play();
    } else if (quiz.heart < 0){
        audios[2].play();
    }

    document.querySelector('.result-time').innerHTML = timeText;
    stopTimer();
    resetTimer();
    document.querySelector('.result-value').innerHTML = `${Math.floor((quiz.score/quiz.maxScore)*100)}%`;
    document.querySelector('.result-screen').classList.add('isVisible');
}

function tryAgain(){
    quiz.score = 0;
    quiz.heart = 2;
    quiz.pointer = 0;
    restoreLife();
    pauseAudio();
    refreshTimer();
    document.querySelector('.result-screen').classList.remove('isVisible');
    document.querySelector('input').value = '';
    document.querySelector('.math-score').innerHTML = `${quiz.score}/${quiz.maxScore}`;
    document.querySelector('.math-question').innerHTML = quiz.tasks[quiz.pointer].question;
}

function restoreLife(){
    const lifeBar = document.querySelector('.life-bar');
    for (let i = 0; i < 3; i++){
        lifeBar.children[i].classList.remove('depleted');
    }
}

function updateLifeBar(){
    const lifeBar = document.querySelector('.life-bar');
    for (let i = 0; i < 2 - quiz.heart; i++){
        lifeBar.children[i].classList.add('depleted');
    }
}

function createQuestions(numberOfOperations, mathSign, isInt, MaxValue){
    quiz.mathSign = mathSign;
    for (let j = 0; j < quiz.maxScore; j++){
        let question = [];
        let answer = (mathSign === 'x' || mathSign === '/') ? 1 : 0;
        let randomValue = 0;
        for (let i = 0; i < Math.floor(Math.random()*(numberOfOperations) + 2); i++){
            randomValue = (Math.random()*MaxValue + 1).toFixed(2);

            if (isInt){
                randomValue = Math.floor(randomValue);
            }

            switch(mathSign){
                case 'x':
                    answer = randomValue * answer;
                    break;
                case '+':
                    answer = randomValue + answer;
                    break;
                case '-':
                    answer = randomValue - answer;
                    break;
                case '/':
                    answer = randomValue / answer;
                    break;
                default:
                    break;
            }

            question.push(`${randomValue}`);
            question.push(mathSign);
        }

        if (!isInt){
            //answer = answer.toFixed(2);
        }

        question = convertArray(question);
        quiz.tasks.push({question: question, answer: answer});
    }
    document.querySelector('.math-question').innerHTML = quiz.tasks[quiz.pointer].question;
    timer();
    restoreLife();
}

function createQuiz(){
    document.querySelector('.math-score').innerHTML = `${quiz.score}/${quiz.maxScore}`;
    
    let MaxValue = 0;
    let isInt = true;
    let numberOfOperations = 0;

    let multiply = 'x';
    let plus = '+';
    let divide = '/';
    let minus = '-';
    let randomSign = [plus, minus, divide, multiply];

    switch(quiz.difficulty){
        case 1:
            MaxValue = 10;
            numberOfOperations = 1;
            break;
        case 2:
            MaxValue = 100;
            numberOfOperations = 2;
            break;
        case 3:
            MaxValue = 1000;
            numberOfOperations = 1;
            break;
        case 4:
            MaxValue = 100;
            numberOfOperations = 2;
            isInt = false;
            break;
    }

    switch(quiz.type){
        case 'multiplication':
            createQuestions(numberOfOperations, multiply, isInt, MaxValue);
            break;
        case 'addition':
            createQuestions(numberOfOperations, plus, isInt, MaxValue);
            break;
        case 'soustraction':
            createQuestions(numberOfOperations, minus, isInt, MaxValue);
            break;
        case 'division':
            createQuestions(numberOfOperations, divide, isInt, MaxValue);
            break;
        case 'tout-en-un':
            createQuestions(numberOfOperations, randomSign, isInt, MaxValue);
            break;
        default:
            break;
    }

    restoreLife();
}

document.querySelector('.addition').addEventListener('click', () => {addType('addition');});
document.querySelector('.multiplication').addEventListener('click', () => {addType('multiplication');});
document.querySelector('.soustraction').addEventListener('click', () => {addType('soustraction');});
// document.querySelector('.division').addEventListener('click', () => {addType('division');});
// document.querySelector('.tout-en-un').addEventListener('click', () => {addType('tout-en-un');});
document.querySelector('.star1').addEventListener('click', () => {addDifficulty(1);});
document.querySelector('.star2').addEventListener('click', () => {addDifficulty(2);});
document.querySelector('.star3').addEventListener('click', () => {addDifficulty(3);});
document.querySelector('.star4').addEventListener('click', () => {addDifficulty(4);});


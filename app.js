import { questions, archetypes } from './data.js';

let currentQuestionIndex = 0;
let answers = new Array(questions.length).fill(null);

const els = {
    homeScreen: document.getElementById('home-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),
    startBtn: document.getElementById('start-btn'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    restartBtn: document.getElementById('restart-btn'),
    progressText: document.getElementById('progress-text'),
    progressBar: document.getElementById('progress-bar'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container')
};

function init() {
    lucide.createIcons();
    
    els.startBtn.addEventListener('click', startQuiz);
    els.prevBtn.addEventListener('click', prevQuestion);
    els.nextBtn.addEventListener('click', nextQuestion);
    els.restartBtn.addEventListener('click', resetQuiz);
}

function startQuiz() {
    els.homeScreen.classList.add('hidden');
    els.quizScreen.classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    els.progressText.innerText = `${currentQuestionIndex + 1} / ${questions.length}`;
    els.progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    
    els.questionText.innerText = q.question;
    els.optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = `option-btn w-full text-left p-4 rounded-xl border-2 border-gray-100 bg-white shadow-sm font-medium text-gray-700 hover:border-indigo-300 ${answers[currentQuestionIndex] === opt.type ? 'selected' : ''}`;
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(opt.type);
        els.optionsContainer.appendChild(btn);
    });

    updateNavButtons();
}

function selectOption(type) {
    answers[currentQuestionIndex] = type;
    renderQuestion();
    

    if (currentQuestionIndex < questions.length - 1) {
        setTimeout(nextQuestion, 300);
    } else {
        updateNavButtons();
    }
}

function updateNavButtons() {
    els.prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === questions.length - 1) {
        els.nextBtn.innerText = '查看结果';
        els.nextBtn.disabled = answers[currentQuestionIndex] === null;
    } else {
        els.nextBtn.innerHTML = '下一题 <i data-lucide="arrow-right" class="w-4 h-4"></i>';
        els.nextBtn.disabled = answers[currentQuestionIndex] === null;
    }
    lucide.createIcons();
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (answers[currentQuestionIndex] === null) return;
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    els.quizScreen.classList.add('hidden');
    els.resultScreen.classList.remove('hidden');
    
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(ans => { if(ans) counts[ans]++ });
    
    let topType = 'A';
    let max = 0;
    for (const [type, count] of Object.entries(counts)) {
        if (count > max) {
            max = count;
            topType = type;
        }
    }
    
    const result = archetypes[topType];
    
    document.getElementById('result-title').innerText = result.title;
    document.getElementById('result-subtitle').innerText = result.subtitle;
    document.getElementById('result-desc').innerText = result.desc;
    
    const prosContainer = document.getElementById('result-pros');
    prosContainer.innerHTML = '';
    result.pros.forEach(pro => {
        const li = document.createElement('li');
        li.innerText = pro;
        prosContainer.appendChild(li);
    });
    
    const careersContainer = document.getElementById('result-careers');
    careersContainer.innerHTML = '';
    result.careers.forEach(career => {
        const span = document.createElement('span');
        span.className = 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold';
        span.innerText = career;
        careersContainer.appendChild(span);
    });
    
    els.resultScreen.classList.add('fade-in');
    document.querySelector('#result-screen > div:nth-child(2)').classList.add('slide-up');
}

function resetQuiz() {
    currentQuestionIndex = 0;
    answers = new Array(questions.length).fill(null);
    els.resultScreen.classList.add('hidden');
    els.homeScreen.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', init);

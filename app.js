import { questions, profiles } from './data.js';

let currentQuestionIndex = 0;
let answers = {};
let traitsScore = { risk: 0, innovation: 0, execution: 0, social: 0, analysis: 0 };

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

function initApp() {
    document.getElementById('btn-start').addEventListener('click', () => {
        switchScreen('screen-question');
        renderQuestion();
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question-counter').innerText = `${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById('question-text').innerText = q.text;
    
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    document.getElementById('btn-prev').disabled = currentQuestionIndex === 0;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = `option-btn ${answers[q.id] === idx ? 'selected' : ''}`;
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(q.id, idx, opt.trait, opt.value);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(qId, optIdx, trait,
value) {
    const optionsContainer = document.getElementById('options-container');
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach((btn, idx) => {
        if (idx === optIdx) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    answers[qId] = { idx: optIdx, trait: trait, value: value };

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            finishTest();
        }
    }, 250);
}

function finishTest() {
    switchScreen('screen-loading');
    
    setTimeout(() => {
        calculateAndRenderResult();
    }, 2000);
}

function calculateAndRenderResult() {
    let scores = { risk: 0, innovation: 0, execution: 0, social: 0, analysis: 0 };
    
    Object.values(answers).forEach(ans => {
        if (scores[ans.trait] !== undefined) {
            scores[ans.trait] += ans.value;
        }
    });

    let maxTrait = 'execution';
    let maxScore = -1;

    for (const [t, s] of Object.entries(scores)) {
        if (s > maxScore) {
            maxScore = s;
            maxTrait = t;
        }
    }

    const profile = profiles[maxTrait] || profiles['execution'];

    document.getElementById('result-title').innerText = profile.title;
    document.getElementById('result-subtitle').innerText = profile.subtitle;
    document.getElementById('result-desc').innerText = profile.desc;

    const recsContainer = document.getElementById('result-recs');
    recsContainer.innerHTML = '';
    profile.recs.forEach(rec => {
        const li = document.createElement('li');
        li.className = 'flex items-center text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100';
        li.innerHTML = `<i data-lucide="check-circle-2" class="w-5 h-5 text-green-500 mr-3"></i>${rec}`;
        recsContainer.appendChild(li);
    });

    lucide.createIcons();
    
    document.getElementById('progress-bar').style.width = '100%';
    switchScreen('screen-result');
    renderChart(scores);
}

function renderChart(scores) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['风险博弈', '创新思维', '执行落地', '资源整合', '逻辑分析'],
            datasets: [{
                label: '能力维度',
                data: [scores.risk, scores.innovation, scores.execution, scores.social, scores.analysis],
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.9)',
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                    grid: { color: 'rgba(255, 255, 255, 0.2)' },
                    pointLabels: { 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        font: { size: 12, family: 'Inter', weight: '500' } 
                    },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            maintainAspectRatio: false
        }
    });
}

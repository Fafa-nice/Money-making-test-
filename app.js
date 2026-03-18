import { questions, resultsData } from './data.js';

lucide.createIcons();

const els = {
    startScreen: document.getElementById('start-screen'),
    questionScreen: document.getElementById('question-screen'),
    resultScreen: document.getElementById('result-screen'),
    startBtn: document.getElementById('start-btn'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    restartBtn: document.getElementById('restart-btn'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    currentQNum: document.getElementById('current-q-num'),
    progressBar: document.getElementById('progress-bar'),
    resultTitle: document.getElementById('result-title'),
    resultDesc: document.getElementById('result-desc'),
    resultPros: document.getElementById('result-pros'),
    resultCons: document.getElementById('result-cons'),
    resultPaths: document.getElementById('result-paths')
};

let currentQIndex = 0;
const answers = new Array(questions.length).fill(null);
let radarChartInstance = null;

const init = () => {
    els.startBtn.addEventListener('click', startTest);
    els.prevBtn.addEventListener('click', prevQuestion);
    els.nextBtn.addEventListener('click', nextQuestion);
    els.restartBtn.addEventListener('click', restartTest);
};

const switchScreen = (hideEl, showEl) => {
    hideEl.classList.add('fade-out');
    setTimeout(() => {
        hideEl.classList.add('hidden');
        hideEl.classList.remove('fade-out');
        showEl.classList.remove('hidden');
        showEl.classList.add('fade-in');
    }, 300);
};

const startTest = () => {
    switchScreen(els.startScreen, els.questionScreen);
    renderQuestion();
};

const renderQuestion = () => {
    const q = questions[currentQIndex];
    els.currentQNum.textContent = q.id;
    els.questionText.textContent = q.text;
    els.progressBar.style.width = `${((currentQIndex) / questions.length) * 100}%`;
    
    els.optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = `option-btn w-full text-left p-5 rounded-2xl border-2 border-gray-100 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 text-gray-700 font-medium flex items-center gap-4 group ${answers[currentQIndex] === index ? 'option-selected' : ''}`;
        
        const letter = String.fromCharCode(65 + index);
        const iconBg = answers[currentQIndex] === index ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600';
        
        btn.innerHTML = `
            <div class="w-8 h-8 rounded-full ${iconBg} flex items-center justify-center font-bold text-sm transition-colors">
                ${letter}
            </div>
            <span class="flex-1">${opt.text}</span>
        `;
        
        btn.onclick = () => selectOption(index);
        els.optionsContainer.appendChild(btn);
    });

    els.prevBtn.disabled = currentQIndex === 0;
    els.nextBtn.disabled = answers[currentQIndex] === null;
    
    if (currentQIndex === questions.length - 1) {
        els.nextBtn.innerHTML = '生成报告 <i data-lucide="sparkles" class="w-4 h-4"></i>';
    } else {
        els.nextBtn.innerHTML = '下一题 <i data-lucide="arrow-right" class="w-4 h-4"></i>';
    }
    lucide.createIcons();
    
    els.optionsContainer.classList.remove('slide-up');
    void els.optionsContainer.offsetWidth;
    els.optionsContainer.classList.add('slide-up');
};

const selectOption = (index) => {
    answers[currentQIndex] = index;
    renderQuestion();
    setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
            nextQuestion();
        } else {
            els.nextBtn.disabled = false;
        }
    }, 300);
};

const prevQuestion = () => {
    if (currentQIndex > 0) {
        currentQIndex--;
        renderQuestion();
    }
};

const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
        currentQIndex++;
        renderQuestion();
    } else {
        generateResult();
    }
};

const generateResult = () => {
    const scores = { risk: 0, exec: 0, innov: 0, social: 0 };
    
    answers.forEach((ansIndex, qIndex) => {
        if (ansIndex !== null) {
            const opt = questions[qIndex].options[ansIndex];
            scores.risk += opt.scores.risk;
            scores.exec += opt.scores.exec;
            scores.innov += opt.scores.innov;
            scores.social += opt.scores.social;
        }
    });

    const maxTrait = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const result = resultsData[maxTrait];

    els.resultTitle.textContent = result.title;
    els.resultDesc.textContent = result.desc;
    
    els.resultPros.innerHTML = result.pros.map(p => `<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span><span>${p}</span></li>`).join('');
    els.resultCons.innerHTML = result.cons.map(c => `<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span><span>${c}</span></li>`).join('');
    
    els.resultPaths.innerHTML = result.paths.map(p => `
        <div class="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <h4 class="font-bold text-white mb-1">${p.name}</h4>
            <p class="text-indigo-100 text-sm">${p.desc}</p>
        </div>
    `).join('');

    switchScreen(els.questionScreen, els.resultScreen);
    renderChart(scores);
};

const renderChart = (scores) => {
    const ctx = document.getElementById('radar-chart').getContext('2d');
    
    if (radarChartInstance) {
        radarChartInstance.destroy();
    }

    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels:['风险偏好', '执行毅力', '创新洞察', '资源整合'],
            datasets: [{
                label: '能力维度',
                data:[scores.risk, scores.exec, scores.innov, scores.social],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                pointBackgroundColor: 'rgba(168, 85, 247, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 2,
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    pointLabels: {
                        font: { family: "'Inter', sans-serif", size: 12, weight: 'bold' },
                        color: '#4b5563'
                    },
                    ticks: { display: false, beginAtZero: true }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
};

const restartTest = () => {
    currentQIndex = 0;
    answers.fill(null);
    switchScreen(els.resultScreen, els.startScreen);
};

init();

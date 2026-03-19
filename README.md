**Description**: Mobile-friendly "Money-making Talent" personality test with 50 questions, colorful UI, prev/next navigation, and data-backed result analysis.
**Files**:
- index.html: Main application layout and mobile container. Refs: Tailwind CSS, Chart.js, Lucide Icons.
- style.css: Custom animations, mobile constraints, and colorful gradients.
- data.js: Contains the 50 test questions and result profiles.
- app.js: Core logic for state management, question navigation, scoring, and rendering results.
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>搞钱天赋测试</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen text-gray-800">
    <div id="app-container" class="relative w-full h-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col">
        
        <!-- Welcome Screen -->
        <div id="screen-welcome" class="screen active flex flex-col items-center justify-center p-6 h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
            <div class="w-24 h-24 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center mb-8 shadow-lg">
                <i data-lucide="gem" class="w-12 h-12 text-yellow-300"></i>
            </div>
            <h1 class="text-3xl font-bold mb-4 text-center tracking-tight">搞钱天赋深度测评</h1>
            <p class="text-center text-white/90 mb-8 leading-relaxed">基于行为经济学与大五人格理论，包含50道精选题，深度解析你最适合的搞钱赛道。</p>
            <button id="btn-start" class="w-full max-w-xs py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform">
                开始测试
            </button>
            <p class="text-xs text-white/60 mt-6">预计需要 3-5 分钟</p>
        </div>

        <!-- Question Screen -->
        <div id="screen-question" class="screen flex flex-col h-full bg-slate-50">
            <div class="px-6 py-4 bg-white shadow-sm flex items-center justify-between z-10">
                <button id="btn-prev" class="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30">
                    <i data-lucide="arrow-left" class="w-6 h-6"></i>
                </button>
                <div class="flex-1 mx-4">
                    <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div id="progress-bar" class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 w-0"></div>
                    </div>
                </div>
                <span id="question-counter" class="text-sm font-medium text-gray-500">1/50</span>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 flex flex-col">
                <h2 id="question-text" class="text-xl font-bold text-gray-800 mb-8 leading-relaxed">加载中...</h2>
                <div id="options-container" class="flex flex-col gap-4">
                    <!-- Options injected via JS -->
                </div>
            </div>
        </div>

        <!-- Loading Screen -->
        <div id="screen-loading" class="screen flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-500 to-teal-400 text-white p-6">
            <i data-lucide="loader-2" class="w-16 h-16 animate-spin mb-6"></i>
            <h2 class="text-2xl font-bold mb-2">正在生成您的搞钱图谱</h2>
            <p class="text-white/80 text-center">综合分析50项决策维度...</p>
        </div>

        <!-- Result Screen -->
        <div id="screen-result" class="screen flex flex-col h-full bg-gray-50 overflow-y-auto">
            <div class="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-b-3xl shadow-lg">
                <h2 class="text-sm font-medium text-white/80 uppercase tracking-widest mb-1">你的核心搞钱角色</h2>
                <h1 id="result-title" class="text-4xl font-extrabold mb-2">加载中</h1>
                <p id="result-subtitle" class="text-white/90 text-sm leading-relaxed mb-6">加载中...</p>
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <canvas id="radarChart" class="w-full h-48"></canvas>
                </div>
            </div>
            
            <div class="p-6 pb-12 flex flex-col gap-6">
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 class="flex items-center text-lg font-bold text-gray-800 mb-3">
                        <i data-lucide="target" class="w-5 h-5 mr-2 text-indigo-500"></i>
                        深度分析
                    </h3>
                    <p id="result-desc" class="text-gray-600 text-sm leading-relaxed"></p>
                </div>
                
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 class="flex items-center text-lg font-bold text-gray-800 mb-3">
                        <i data-lucide="compass" class="w-5 h-5 mr-2 text-teal-500"></i>
                        推荐搞钱方向
                    </h3>
                    <ul id="result-recs" class="space-y-3">
                        <!-- Recs injected via JS -->
                    </ul>
                </div>
                
                <button onclick="location.reload()" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-md active:scale-95 transition-transform mt-4">
                    重新测试
                </button>
            </div>
        </div>

    </div>

    <script type="module" src="data.js"></script>
    <script type="module" src="app.js"></script>
</body>
</html>

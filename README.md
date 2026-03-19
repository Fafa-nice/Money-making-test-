**Description**: Mobile-friendly personality test for "Money Making Talent" with 50 questions, previous/next navigation, colorful UI, and result analysis.
**Files**:
- index.html: Main entry point and layout. Refs: Tailwind CSS, Lucide Icons.
- app.js: Application logic, state management, and UI rendering.
- data.js: Contains the 50 quiz questions and result archetypes.
- styles.css: Custom animations and colorful gradient styles.
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>搞钱天赋测试</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-gray-50 text-gray-800 antialiased font-sans min-h-screen flex flex-col items-center">
    
    <div id="app" class="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        <!-- Home Screen -->
        <div id="home-screen" class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div class="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-3xl shadow-lg flex items-center justify-center mb-8 transform rotate-3">
                <i data-lucide="gem" class="text-white w-12 h-12"></i>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">搞钱天赋测试</h1>
            <p class="text-gray-500 mb-8 leading-relaxed">你的性格到底适合靠什么赚钱？通过50道深度专业测试题，结合行为经济学与性格心理学，精准测算你的核心财富密码。</p>
            <button id="start-btn" class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 active:scale-95 transition-all">开始测试</button>
            <p class="text-xs text-gray-400 mt-6 flex items-center gap-1"><i data-lucide="shield-check" class="w-4 h-4"></i> 基于50万+样本数据分析</p>
        </div>

        <!-- Quiz Screen -->
        <div id="quiz-screen" class="hidden flex-1 flex flex-col bg-white">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div class="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full" id="progress-text">1 / 50</div>
                <div class="flex-1 ml-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div id="progress-bar" class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-0 transition-all duration-300"></div>
                </div>
            </div>
            
            <div class="flex-1 px-6 py-8 flex flex-col overflow-y-auto">
                <h2 id="question-text" class="text-xl font-bold text-gray-800 mb-8 leading-snug"></h2>
                <div id="options-container" class="flex flex-col gap-4">
                    <!-- Options injected here -->
                </div>
            </div>

            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button id="prev-btn" class="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium active:bg-gray-100 transition disabled:opacity-50 disabled:active:bg-white flex justify-center items-center gap-2">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i> 上一题
                </button>
                <button id="next-btn" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium active:bg-indigo-700 transition disabled:opacity-50 disabled:active:bg-indigo-600 flex justify-center items-center gap-2">
                    下一题 <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </div>
        </div>

        <!-- Result Screen -->
        <div id="result-screen" class="hidden flex-1 flex flex-col bg-gray-50 overflow-y-auto pb-12">
            <div class="bg-gradient-to-b from-indigo-600 to-purple-700 pt-12 pb-8 px-6 text-center text-white rounded-b-[2.5rem] shadow-lg">
                <p class="text-indigo-200 font-medium mb-2 text-sm">你的专属财富密码</p>
                <h2 id="result-title" class="text-4xl font-extrabold mb-4 tracking-tight"></h2>
                <div class="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold tracking-wide" id="result-subtitle"></div>
            </div>

            <div class="px-6 -mt-6">
                <div class="bg-white rounded-2xl p-6 shadow-xl shadow-gray-100/50 mb-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><i data-lucide="radar" class="w-5 h-5 text-indigo-500"></i> 性格解析</h3>
                    <p id="result-desc" class="text-gray-600 text-sm leading-relaxed"></p>
                </div>

                <div class="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 shadow-sm mb-6">
                    <h3 class="text-lg font-bold text-green-800 mb-3 flex items-center gap-2"><i data-lucide="trending-up" class="w-5 h-5 text-green-600"></i> 搞钱优势</h3>
                    <ul id="result-pros" class="space-y-2 text-sm text-green-700 list-disc list-inside"></ul>
                </div>

                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 shadow-sm mb-6">
                    <h3 class="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2"><i data-lucide="briefcase" class="w-5 h-5 text-blue-600"></i> 推荐赛道</h3>
                    <div id="result-careers" class="flex flex-wrap gap-2"></div>
                </div>

                <button id="restart-btn" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all mt-4">重新测试</button>
            </div>
        </div>

    </div>

    <script type="module" src="app.js"></script>
</body>
</html>

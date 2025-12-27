/* ===== GAMIFICATION MODULE - Real Data Version ===== */

document.addEventListener('DOMContentLoaded', () => {
    initGamification();
});

function initGamification() {
    console.log('🎮 Gamification Module Initialized');

    // ===== DOM Elements =====

    // Welcome
    const welcomeMessage = document.getElementById('welcome-message');
    const welcomeSubtitle = document.getElementById('welcome-subtitle');
    const currentDay = document.getElementById('current-day');
    const currentMonthYear = document.getElementById('current-month-year');
    const daysRemaining = document.getElementById('days-remaining');

    // Stats
    const statTotalGoals = document.getElementById('stat-total-goals');
    const statCompletedGoals = document.getElementById('stat-completed-goals');
    const statVisionItems = document.getElementById('stat-vision-items');
    const statJarNotes = document.getElementById('stat-jar-notes');
    const statSubgoals = document.getElementById('stat-subgoals');

    // Level
    const userLevelEl = document.getElementById('user-level');
    const totalPointsEl = document.getElementById('total-points');
    const levelProgressBar = document.getElementById('level-progress-bar');
    const currentLevelName = document.getElementById('current-level-name');
    const pointsNeededEl = document.getElementById('points-needed');
    const streakCountEl = document.getElementById('streak-count');

    // Charts
    const categoryChartCanvas = document.getElementById('category-chart');
    const progressChartCanvas = document.getElementById('progress-chart');

    // Badges
    const badgesContainer = document.getElementById('badges-container');
    const badgesCount = document.getElementById('badges-count');

    // Urgent Goals
    const urgentGoalsList = document.getElementById('urgent-goals-list');

    // Activity
    const activityTimeline = document.getElementById('activity-timeline');

    // Quote
    const dailyQuoteEl = document.getElementById('daily-quote');
    const quoteAuthorEl = document.getElementById('quote-author');

    // Progress Rates
    const completionRate = document.getElementById('completion-rate');
    const completionBar = document.getElementById('completion-bar');
    const subgoalRate = document.getElementById('subgoal-rate');
    const subgoalBar = document.getElementById('subgoal-bar');
    const yearRate = document.getElementById('year-rate');
    const yearBar = document.getElementById('year-bar');

    // Heatmap
    const heatmapGrid = document.getElementById('heatmap-grid');
    const totalActivities = document.getElementById('total-activities');

    // ===== Constants =====

    const LEVELS = [
        { name: 'Başlangıç', min: 0, icon: '🌱' },
        { name: 'Çırak', min: 100, icon: '🔰' },
        { name: 'Gezgin', min: 300, icon: '🚀' },
        { name: 'Kaşif', min: 600, icon: '🧭' },
        { name: 'Mimar', min: 1000, icon: '🏗️' },
        { name: 'Usta', min: 2000, icon: '⚡' },
        { name: 'Efsane', min: 5000, icon: '👑' }
    ];

    const BADGES = [
        { id: 'first-goal', name: 'İlk Adım', icon: '🎯', description: 'İlk hedefini oluştur', condition: (data) => data.totalGoals >= 1 },
        { id: 'five-goals', name: 'Hedef Avcısı', icon: '🏹', description: '5 hedef oluştur', condition: (data) => data.totalGoals >= 5 },
        { id: 'ten-goals', name: 'Kararlı', icon: '💪', description: '10 hedef oluştur', condition: (data) => data.totalGoals >= 10 },
        { id: 'first-complete', name: 'Başarı', icon: '🏆', description: 'Bir hedefi tamamla', condition: (data) => data.completedGoals >= 1 },
        { id: 'five-complete', name: 'Şampiyon', icon: '🥇', description: '5 hedef tamamla', condition: (data) => data.completedGoals >= 5 },
        { id: 'streak-7', name: 'Tutarlı', icon: '🔥', description: '7 gün streak', condition: (data) => data.streak >= 7 },
        { id: 'streak-30', name: 'Bağımlı', icon: '💎', description: '30 gün streak', condition: (data) => data.streak >= 30 },
        { id: 'vision-5', name: 'Hayalperest', icon: '✨', description: '5 vision board öğesi', condition: (data) => data.visionItems >= 5 },
        { id: 'jar-10', name: 'Anı Toplayıcı', icon: '📝', description: '10 kavanoz notu', condition: (data) => data.jarNotes >= 10 },
        { id: 'level-kasif', name: 'Kaşif', icon: '🧭', description: 'Kaşif seviyesine ulaş', condition: (data) => data.points >= 600 },
        { id: 'level-usta', name: 'Usta', icon: '⚡', description: 'Usta seviyesine ulaş', condition: (data) => data.points >= 2000 },
        { id: 'perfectionist', name: 'Mükemmeliyetçi', icon: '🌟', description: '%100 hedef tamamla', condition: (data) => data.totalGoals > 0 && data.completedGoals === data.totalGoals }
    ];

    const QUOTES = [
        { text: "Gelecek, bugünden hazırlananlara aittir.", author: "Malcolm X" },
        { text: "Başlamak için mükemmel olmak zorunda değilsin, ama mükemmel olmak için başlamak zorundasın.", author: "Zig Ziglar" },
        { text: "Hayallerinize ulaşmak için uyanmanız gerekir.", author: "Paul Valery" },
        { text: "Bin millik bir yolculuk tek bir adımla başlar.", author: "Lao Tzu" },
        { text: "Yapabileceğine inan, yolun yarısını geçtin demektir.", author: "Theodore Roosevelt" },
        { text: "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.", author: "Robert Collier" },
        { text: "Bugün yaptıkların, yarın olacağın kişiyi belirler.", author: "Anonim" },
        { text: "Hedefleriniz hayallerinizden büyük değilse, yeterince büyük düşünmüyorsunuz.", author: "Anonim" },
        { text: "Disiplin, hedefler ile başarılar arasındaki köprüdür.", author: "Jim Rohn" },
        { text: "Asla pes etme. Bugünün zor günleri, yarının en güzel anıları olacak.", author: "Anonim" }
    ];

    const CATEGORY_COLORS = {
        'Kariyer': '#8B5CF6',
        'Sağlık': '#10B981',
        'Finans': '#F59E0B',
        'Eğitim': '#3B82F6',
        'Kişisel': '#EC4899',
        'İlişkiler': '#EF4444'
    };

    // ===== Initialize =====
    updateDateTime();
    calculateAllStats();
    updateStreak();
    setDailyQuote();

    // ===== Functions =====

    function updateDateTime() {
        const now = new Date();
        const options = { month: 'long', year: 'numeric' };

        if (currentDay) currentDay.textContent = now.getDate();
        if (currentMonthYear) currentMonthYear.textContent = now.toLocaleDateString('tr-TR', options);

        // Days remaining in year
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        const remaining = Math.ceil((endOfYear - now) / (1000 * 60 * 60 * 24));
        if (daysRemaining) daysRemaining.textContent = remaining;

        // Year progress
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const yearProgress = Math.round(((now - startOfYear) / (endOfYear - startOfYear)) * 100);
        if (yearRate) yearRate.textContent = `${yearProgress}%`;
        if (yearBar) yearBar.style.width = `${yearProgress}%`;

        // Welcome message based on time
        const hour = now.getHours();
        let greeting = 'Merhaba';
        let subtitle = 'Bugün hedeflerine bir adım daha yaklaş.';

        if (hour >= 5 && hour < 12) {
            greeting = 'Günaydın';
            subtitle = 'Yeni bir gün, yeni fırsatlar! 🌅';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'İyi günler';
            subtitle = 'Günün geri kalanını verimli geçir! ☀️';
        } else if (hour >= 18 && hour < 22) {
            greeting = 'İyi akşamlar';
            subtitle = 'Bugün neler başardın? 🌆';
        } else {
            greeting = 'İyi geceler';
            subtitle = 'Yarın için planlarını hazırla. 🌙';
        }

        if (welcomeMessage) {
            const levelName = getCurrentLevel().name;
            welcomeMessage.innerHTML = `${greeting}, <span>${levelName}!</span>`;
        }
        if (welcomeSubtitle) welcomeSubtitle.textContent = subtitle;
    }

    function calculateAllStats() {
        // Get data from storage
        const visionItems = Storage.get('visionBoardItems') || [];
        const jarNotes = Storage.get('jarNotes') || [];
        const goals = Storage.get('yearlyGoals') || [];
        const activityLog = Storage.get('activityLog') || [];

        // Calculate stats
        const totalGoals = goals.length;
        const completedGoals = goals.filter(g => {
            if (g.subgoals && g.subgoals.length > 0) {
                return g.subgoals.every(s => s.completed);
            }
            return g.completed;
        }).length;

        let totalSubgoals = 0;
        let completedSubgoals = 0;
        goals.forEach(g => {
            if (g.subgoals) {
                totalSubgoals += g.subgoals.length;
                completedSubgoals += g.subgoals.filter(s => s.completed).length;
            }
        });

        // Update stat cards with animation
        animateCounter(statTotalGoals, totalGoals);
        animateCounter(statCompletedGoals, completedGoals);
        animateCounter(statVisionItems, visionItems.length);
        animateCounter(statJarNotes, jarNotes.length);
        animateCounter(statSubgoals, completedSubgoals);

        // Calculate points
        let points = 0;
        points += visionItems.length * 10;
        points += jarNotes.length * 5;
        points += completedGoals * 50;
        points += completedSubgoals * 10;

        // Update level UI
        updateLevelUI(points);

        // Update progress rates
        const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
        const subgoalCompletionRate = totalSubgoals > 0 ? Math.round((completedSubgoals / totalSubgoals) * 100) : 0;

        if (completionRate) completionRate.textContent = `${goalCompletionRate}%`;
        if (completionBar) completionBar.style.width = `${goalCompletionRate}%`;
        if (subgoalRate) subgoalRate.textContent = `${subgoalCompletionRate}%`;
        if (subgoalBar) subgoalBar.style.width = `${subgoalCompletionRate}%`;

        // Generate charts with REAL data
        generateCategoryChart(goals);
        generateProgressChart(goals, activityLog);

        // Generate heatmap with REAL data
        generateHeatmap(activityLog, goals, jarNotes, visionItems);

        // Generate badges
        const streak = Storage.get('streak') || 1;
        generateBadges({
            totalGoals,
            completedGoals,
            visionItems: visionItems.length,
            jarNotes: jarNotes.length,
            streak,
            points
        });

        // Generate urgent goals
        generateUrgentGoals(goals);

        // Generate activity feed with REAL data
        generateActivityFeed(activityLog, goals, jarNotes, visionItems);
    }

    function animateCounter(element, target) {
        if (!element) return;

        const duration = 1000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    function getCurrentLevel() {
        const visionItems = Storage.get('visionBoardItems') || [];
        const jarNotes = Storage.get('jarNotes') || [];
        const goals = Storage.get('yearlyGoals') || [];

        let points = 0;
        points += visionItems.length * 10;
        points += jarNotes.length * 5;

        goals.forEach(g => {
            if (g.completed || (g.subgoals && g.subgoals.every(s => s.completed))) {
                points += 50;
            }
            if (g.subgoals) {
                points += g.subgoals.filter(s => s.completed).length * 10;
            }
        });

        let currentLevel = LEVELS[0];
        for (let i = 0; i < LEVELS.length; i++) {
            if (points >= LEVELS[i].min) {
                currentLevel = LEVELS[i];
            }
        }
        return currentLevel;
    }

    function updateLevelUI(points) {
        if (!userLevelEl) return;

        let currentLevel = LEVELS[0];
        let nextLevel = LEVELS[1];

        for (let i = 0; i < LEVELS.length; i++) {
            if (points >= LEVELS[i].min) {
                currentLevel = LEVELS[i];
                nextLevel = LEVELS[i + 1] || null;
            } else {
                break;
            }
        }

        userLevelEl.textContent = `${currentLevel.icon} ${currentLevel.name}`;
        if (totalPointsEl) totalPointsEl.textContent = `${points} Puan`;
        if (currentLevelName) currentLevelName.textContent = currentLevel.name;

        if (nextLevel) {
            const range = nextLevel.min - currentLevel.min;
            const progress = points - currentLevel.min;
            const percentage = Math.min(100, Math.max(0, (progress / range) * 100));

            if (levelProgressBar) levelProgressBar.style.width = `${percentage}%`;
            if (pointsNeededEl) pointsNeededEl.textContent = `${nextLevel.min - points} Puan → ${nextLevel.name}`;
        } else {
            if (levelProgressBar) levelProgressBar.style.width = '100%';
            if (pointsNeededEl) pointsNeededEl.textContent = 'Maksimum Seviye! 👑';
        }
    }

    function updateStreak() {
        if (!streakCountEl) return;

        const lastVisit = Storage.get('lastVisit');
        let streak = Storage.get('streak') || 1;
        const today = new Date().toDateString();

        if (lastVisit !== today) {
            if (lastVisit) {
                const lastDate = new Date(lastVisit);
                const diffTime = Math.abs(new Date() - lastDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    streak++;
                } else if (diffDays > 1) {
                    streak = 1;
                }
            }
            Storage.save('lastVisit', today);
            Storage.save('streak', streak);

            // Log activity for streak
            logActivity('streak', 'Giriş yapıldı');
        }

        streakCountEl.textContent = streak;
    }

    function setDailyQuote() {
        if (!dailyQuoteEl) return;

        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quote = QUOTES[dayOfYear % QUOTES.length];

        dailyQuoteEl.textContent = `"${quote.text}"`;
        if (quoteAuthorEl) quoteAuthorEl.textContent = `— ${quote.author}`;
    }

    function generateCategoryChart(goals) {
        if (!categoryChartCanvas) return;

        const categoryCounts = {};
        goals.forEach(g => {
            const cat = g.category || 'Diğer';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);
        const colors = labels.map(l => CATEGORY_COLORS[l] || '#6B7280');

        // Destroy existing chart if exists
        if (window.categoryChartInstance) {
            window.categoryChartInstance.destroy();
        }

        // Show empty state if no data
        if (labels.length === 0) {
            categoryChartCanvas.parentElement.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-chart-pie"></i>
                    <p>Henüz hedef eklenmedi</p>
                    <small style="color: var(--text-muted);">Hedef ekledikçe burada görünecek</small>
                </div>
            `;
            return;
        }

        window.categoryChartInstance = new Chart(categoryChartCanvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#9CA3AF',
                            padding: 15,
                            usePointStyle: true,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    function generateProgressChart(goals, activityLog) {
        if (!progressChartCanvas) return;

        // Generate last 7 days labels
        const labels = [];
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
            labels.push(dayName);
            dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
        }

        // Count REAL completed items per day
        const completedData = new Array(7).fill(0);
        const addedData = new Array(7).fill(0);

        // Count from goals
        goals.forEach(goal => {
            // Check goal creation date
            if (goal.createdAt) {
                const createdDate = new Date(goal.createdAt).toISOString().split('T')[0];
                const dayIndex = dates.indexOf(createdDate);
                if (dayIndex !== -1) {
                    addedData[dayIndex]++;
                }
            }

            // Check subgoal completions
            if (goal.subgoals) {
                goal.subgoals.forEach(sub => {
                    if (sub.completed && sub.completedAt) {
                        const completedDate = new Date(sub.completedAt).toISOString().split('T')[0];
                        const dayIndex = dates.indexOf(completedDate);
                        if (dayIndex !== -1) {
                            completedData[dayIndex]++;
                        }
                    }
                });
            }
        });

        // Count from activity log
        activityLog.forEach(activity => {
            if (activity.timestamp) {
                const actDate = new Date(activity.timestamp).toISOString().split('T')[0];
                const dayIndex = dates.indexOf(actDate);
                if (dayIndex !== -1) {
                    if (activity.type === 'goal_created' || activity.type === 'vision_added' || activity.type === 'jar_note_added') {
                        addedData[dayIndex]++;
                    }
                    if (activity.type === 'subgoal_completed' || activity.type === 'goal_completed') {
                        completedData[dayIndex]++;
                    }
                }
            }
        });

        // Destroy existing chart if exists
        if (window.progressChartInstance) {
            window.progressChartInstance.destroy();
        }

        // Check if there's any data
        const hasData = completedData.some(v => v > 0) || addedData.some(v => v > 0);

        if (!hasData) {
            progressChartCanvas.parentElement.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-chart-line"></i>
                    <p>Henüz haftalık veri yok</p>
                    <small style="color: var(--text-muted);">Hedef ekleyip tamamladıkça grafik dolacak</small>
                </div>
            `;
            return;
        }

        window.progressChartInstance = new Chart(progressChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Tamamlanan',
                        data: completedData,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Eklenen',
                        data: addedData,
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#9CA3AF',
                            usePointStyle: true,
                            font: { size: 12 }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6B7280' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(107, 114, 128, 0.1)' },
                        ticks: {
                            color: '#6B7280',
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    function generateBadges(data) {
        if (!badgesContainer) return;

        badgesContainer.innerHTML = '';
        let unlockedCount = 0;

        BADGES.forEach(badge => {
            const isUnlocked = badge.condition(data);
            if (isUnlocked) unlockedCount++;

            const badgeEl = document.createElement('div');
            badgeEl.className = `badge-item ${isUnlocked ? '' : 'locked'}`;
            badgeEl.title = badge.description;
            badgeEl.innerHTML = `
                <span class="badge-icon">${badge.icon}</span>
                <span class="badge-name">${badge.name}</span>
            `;
            badgesContainer.appendChild(badgeEl);
        });

        if (badgesCount) {
            badgesCount.textContent = `${unlockedCount}/${BADGES.length} Kazanıldı`;
        }
    }

    function generateUrgentGoals(goals) {
        if (!urgentGoalsList) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter and sort goals by deadline
        const upcomingGoals = goals
            .filter(g => {
                const isCompleted = g.subgoals && g.subgoals.length > 0
                    ? g.subgoals.every(s => s.completed)
                    : g.completed;
                return !isCompleted && g.deadline;
            })
            .map(g => {
                const deadline = new Date(g.deadline);
                const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                return { ...g, daysRemaining };
            })
            .sort((a, b) => a.daysRemaining - b.daysRemaining)
            .slice(0, 4);

        if (upcomingGoals.length === 0) {
            urgentGoalsList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-calendar-check"></i>
                    <p>Yaklaşan hedef yok</p>
                    <small style="color: var(--text-muted);">Deadline'lı hedef ekle</small>
                </div>
            `;
            return;
        }

        urgentGoalsList.innerHTML = '';

        upcomingGoals.forEach(goal => {
            let statusClass = 'safe';
            let daysText = `${goal.daysRemaining} gün`;

            if (goal.daysRemaining < 0) {
                statusClass = 'overdue';
                daysText = `${Math.abs(goal.daysRemaining)} gün gecikti`;
            } else if (goal.daysRemaining === 0) {
                statusClass = 'warning';
                daysText = 'Bugün!';
            } else if (goal.daysRemaining <= 7) {
                statusClass = 'warning';
            }

            const item = document.createElement('div');
            item.className = `urgent-goal-item ${statusClass}`;
            item.innerHTML = `
                <div class="goal-info">
                    <h4>${escapeHtml(goal.title)}</h4>
                    <p>${goal.category || 'Genel'}</p>
                </div>
                <span class="goal-days ${statusClass}">${daysText}</span>
            `;
            urgentGoalsList.appendChild(item);
        });
    }

    function generateActivityFeed(activityLog, goals, jarNotes, visionItems) {
        if (!activityTimeline) return;

        let activities = [];

        // Get activities from activity log
        activityLog.forEach(act => {
            activities.push({
                type: act.type,
                icon: getActivityIcon(act.type),
                color: getActivityColor(act.type),
                text: act.text,
                time: act.timestamp
            });
        });

        // If no activity log, fallback to inferring from data
        if (activities.length === 0) {
            // Add from goals
            goals.forEach(g => {
                if (g.createdAt) {
                    activities.push({
                        type: 'goal',
                        icon: 'fa-bullseye',
                        color: '#8B5CF6',
                        text: `"${g.title}" hedefi oluşturuldu`,
                        time: g.createdAt
                    });
                }

                if (g.subgoals) {
                    g.subgoals.filter(s => s.completed).forEach(s => {
                        activities.push({
                            type: 'subgoal',
                            icon: 'fa-check',
                            color: '#10B981',
                            text: `"${s.text}" adımı tamamlandı`,
                            time: s.completedAt || g.updatedAt || Date.now()
                        });
                    });
                }
            });

            // Add from jar notes
            jarNotes.forEach(note => {
                activities.push({
                    type: 'jar',
                    icon: 'fa-jar',
                    color: '#F59E0B',
                    text: 'Kavanoza yeni not eklendi',
                    time: note.date ? new Date(note.date).getTime() : Date.now()
                });
            });

            // Add from vision items
            visionItems.forEach(item => {
                activities.push({
                    type: 'vision',
                    icon: 'fa-image',
                    color: '#3B82F6',
                    text: 'Vision Board\'a öğe eklendi',
                    time: item.addedAt || Date.now()
                });
            });
        }

        // Sort by time and take latest 5
        activities.sort((a, b) => (b.time || 0) - (a.time || 0));
        activities = activities.slice(0, 5);

        if (activities.length === 0) {
            activityTimeline.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-clock"></i>
                    <p>Henüz aktivite yok</p>
                    <small style="color: var(--text-muted);">İlk hedefini ekle!</small>
                </div>
            `;
            return;
        }

        activityTimeline.innerHTML = '';

        activities.forEach(act => {
            const timeAgo = getTimeAgo(act.time);
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.style.setProperty('--timeline-color', act.color);
            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4><i class="fa-solid ${act.icon}"></i> ${escapeHtml(act.text)}</h4>
                    <p>${timeAgo}</p>
                </div>
            `;
            activityTimeline.appendChild(item);
        });
    }

    function generateHeatmap(activityLog, goals, jarNotes, visionItems) {
        if (!heatmapGrid) return;

        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // Create activity count map by date
        const activityByDate = {};

        // Count activities from activity log
        activityLog.forEach(act => {
            if (act.timestamp) {
                const dateKey = new Date(act.timestamp).toISOString().split('T')[0];
                activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
            }
        });

        // Count from goals
        goals.forEach(goal => {
            if (goal.createdAt) {
                const dateKey = new Date(goal.createdAt).toISOString().split('T')[0];
                activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
            }
            if (goal.subgoals) {
                goal.subgoals.forEach(sub => {
                    if (sub.completed && sub.completedAt) {
                        const dateKey = new Date(sub.completedAt).toISOString().split('T')[0];
                        activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
                    }
                });
            }
        });

        // Count from jar notes
        jarNotes.forEach(note => {
            if (note.date) {
                const dateKey = new Date(note.date).toISOString().split('T')[0];
                activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
            }
        });

        // Count from vision items
        visionItems.forEach(item => {
            if (item.addedAt) {
                const dateKey = new Date(item.addedAt).toISOString().split('T')[0];
                activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
            }
        });

        heatmapGrid.innerHTML = '';

        // Calculate days from start of year
        const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
        let totalActivityCount = 0;

        // Generate cells for each day (7 rows x 53 columns = 371 cells)
        for (let i = 0; i < 371; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';

            // Calculate the date for this cell
            const cellDate = new Date(startOfYear);
            cellDate.setDate(startOfYear.getDate() + i);
            const dateKey = cellDate.toISOString().split('T')[0];

            // Only show activity for past/present dates
            if (cellDate <= today) {
                const activityCount = activityByDate[dateKey] || 0;
                totalActivityCount += activityCount;

                if (activityCount > 0) {
                    // Determine level based on activity count
                    let level = 0;
                    if (activityCount >= 5) level = 5;
                    else if (activityCount >= 4) level = 4;
                    else if (activityCount >= 3) level = 3;
                    else if (activityCount >= 2) level = 2;
                    else if (activityCount >= 1) level = 1;

                    if (level > 0) {
                        cell.classList.add(`level-${level}`);
                    }
                }

                // Add tooltip
                cell.title = `${cellDate.toLocaleDateString('tr-TR')}: ${activityCount} aktivite`;
            } else {
                // Future dates - slightly different style
                cell.style.opacity = '0.3';
            }

            heatmapGrid.appendChild(cell);
        }

        if (totalActivities) {
            totalActivities.textContent = `${totalActivityCount} aktivite bu yıl`;
        }
    }

    function getActivityIcon(type) {
        const icons = {
            'goal_created': 'fa-bullseye',
            'goal_completed': 'fa-trophy',
            'subgoal_completed': 'fa-check',
            'vision_added': 'fa-image',
            'jar_note_added': 'fa-jar',
            'streak': 'fa-fire'
        };
        return icons[type] || 'fa-circle';
    }

    function getActivityColor(type) {
        const colors = {
            'goal_created': '#8B5CF6',
            'goal_completed': '#10B981',
            'subgoal_completed': '#22C55E',
            'vision_added': '#3B82F6',
            'jar_note_added': '#F59E0B',
            'streak': '#EF4444'
        };
        return colors[type] || '#6B7280';
    }

    function logActivity(type, text) {
        const activityLog = Storage.get('activityLog') || [];
        activityLog.push({
            type,
            text,
            timestamp: Date.now()
        });
        // Keep only last 100 activities
        if (activityLog.length > 100) {
            activityLog.shift();
        }
        Storage.save('activityLog', activityLog);
    }

    function getTimeAgo(timestamp) {
        if (!timestamp) return 'Bilinmiyor';

        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return 'Az önce';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} dakika önce`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat önce`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} gün önce`;
        if (seconds < 2592000) return `${Math.floor(seconds / 604800)} hafta önce`;
        return `${Math.floor(seconds / 2592000)} ay önce`;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Expose logActivity globally for other modules to use
    window.VisionFlowActivity = {
        log: logActivity
    };
}

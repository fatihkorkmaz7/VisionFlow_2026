/* ===== GAMIFICATION MODULE ===== */

document.addEventListener('DOMContentLoaded', () => {
    initGamification();
});

function initGamification() {
    console.log('Gamification Module Initialized');

    // DOM Elements
    const userLevelEl = document.getElementById('user-level');
    const totalPointsEl = document.getElementById('total-points');
    const levelProgressBar = document.getElementById('level-progress-bar');
    const pointsNeededEl = document.getElementById('points-needed');
    const streakCountEl = document.getElementById('streak-count');

    const statsVisionCount = document.getElementById('stats-vision-count');
    const statsJarCount = document.getElementById('stats-jar-count');
    const statsGoalsCompleted = document.getElementById('stats-goals-completed');

    const dailyQuoteEl = document.getElementById('daily-quote');
    const quoteAuthorEl = document.getElementById('quote-author');
    const activityListEl = document.getElementById('activity-list');

    // Constants
    const LEVELS = [
        { name: 'Başlangıç', min: 0 },
        { name: 'Çırak', min: 100 },
        { name: 'Gezgin', min: 300 },
        { name: 'Kaşif', min: 600 },
        { name: 'Mimar', min: 1000 },
        { name: 'Usta', min: 2000 },
        { name: 'Efsane', min: 5000 }
    ];

    const QUOTES = [
        { text: "Gelecek, bugünden hazırlananlara aittir.", author: "Malcolm X" },
        { text: "Başlamak için mükemmel olmak zorunda değilsin, ama mükemmel olmak için başlamak zorundasın.", author: "Zig Ziglar" },
        { text: "Hayallerinize ulaşmak için uyanmanız gerekir.", author: "Paul Valery" },
        { text: "Bin millik bir yolculuk tek bir adımla başlar.", author: "Lao Tzu" },
        { text: "Yapabileceğine inan, yolun yarısını geçtin demektir.", author: "Theodore Roosevelt" }
    ];

    // Calculate Points & Stats
    calculateStats();
    updateStreak();
    setDailyQuote();

    function calculateStats() {
        // Get data from storage
        const visionItems = Storage.get('visionBoardItems') || [];
        const jarNotes = Storage.get('jarNotes') || [];
        const goals = Storage.get('yearlyGoals') || [];

        // Calculate Counts
        if (statsVisionCount) statsVisionCount.innerText = visionItems.length;
        if (statsJarCount) statsJarCount.innerText = jarNotes.length;

        const completedGoals = goals.filter(g => g.completed).length;
        if (statsGoalsCompleted) statsGoalsCompleted.innerText = completedGoals;

        // Calculate Points
        let points = 0;

        // 10 points per vision item
        points += visionItems.length * 10;

        // 5 points per jar note
        points += jarNotes.length * 5;

        // 50 points per completed goal
        points += completedGoals * 50;

        // 10 points per completed subgoal
        goals.forEach(g => {
            points += g.subgoals.filter(s => s.completed).length * 10;
        });

        // Update UI
        updateLevelUI(points);

        // Generate Activity Feed (Mock based on data)
        generateActivityFeed(visionItems, jarNotes, goals);
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

        userLevelEl.innerText = currentLevel.name;
        totalPointsEl.innerText = `${points} Puan`;

        if (nextLevel) {
            const range = nextLevel.min - currentLevel.min;
            const progress = points - currentLevel.min;
            const percentage = Math.min(100, Math.max(0, (progress / range) * 100));

            levelProgressBar.style.width = `${percentage}%`;
            pointsNeededEl.innerText = `${nextLevel.min - points} Puan Kaldı`;
        } else {
            levelProgressBar.style.width = '100%';
            pointsNeededEl.innerText = 'Maksimum Seviye!';
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
        }

        streakCountEl.innerText = streak;
    }

    function setDailyQuote() {
        if (!dailyQuoteEl) return;

        // Simple daily rotation based on date
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quote = QUOTES[dayOfYear % QUOTES.length];

        dailyQuoteEl.innerText = `"${quote.text}"`;
        quoteAuthorEl.innerText = `- ${quote.author}`;
    }

    function generateActivityFeed(visionItems, jarNotes, goals) {
        if (!activityListEl) return;

        // Combine all activities with timestamps (mocking timestamps for now as they aren't fully saved in all objects)
        // In a real app, we'd save 'createdAt' for everything.
        // Here we'll just show the latest items if available.

        let activities = [];

        // Add latest vision item
        if (visionItems.length > 0) {
            activities.push({
                type: 'vision',
                text: 'Vision Board\'a yeni bir öğe ekledi.',
                time: 'Yakın zamanda'
            });
        }

        // Add latest jar note
        if (jarNotes.length > 0) {
            // Sort by date if possible, or just take last
            const lastNote = jarNotes[jarNotes.length - 1];
            activities.push({
                type: 'jar',
                text: 'Kavanoza yeni bir not attı.',
                time: lastNote.date || 'Yakın zamanda'
            });
        }

        // Add latest goal
        if (goals.length > 0) {
            const lastGoal = goals[goals.length - 1];
            activities.push({
                type: 'goal',
                text: `"${lastGoal.title}" hedefini belirledi.`,
                time: 'Yakın zamanda'
            });
        }

        // Render
        if (activities.length > 0) {
            activityListEl.innerHTML = '';
            activities.reverse().forEach(act => {
                const li = document.createElement('li');
                li.className = 'activity-item';

                let icon = 'fa-check';
                if (act.type === 'vision') icon = 'fa-image';
                if (act.type === 'jar') icon = 'fa-jar';
                if (act.type === 'goal') icon = 'fa-bullseye';

                li.innerHTML = `
                    <div class="activity-icon"><i class="fa-solid ${icon}"></i></div>
                    <div class="activity-content">
                        <h4>${act.text}</h4>
                        <span class="activity-time">${act.time}</span>
                    </div>
                `;
                activityListEl.appendChild(li);
            });
        }
    }
}

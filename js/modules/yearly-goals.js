/* ===== YEARLY GOALS MODULE ===== */

document.addEventListener('DOMContentLoaded', () => {
    initYearlyGoals();
});

function initYearlyGoals() {
    console.log('Yearly Goals Module Initialized');

    // DOM Elements
    const goalsContainer = document.getElementById('goals-container');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const totalProgressCircle = document.getElementById('total-progress-circle');
    const totalProgressText = document.getElementById('total-progress-text');

    // Modal
    const goalModal = document.getElementById('goal-modal');
    const closeGoalModal = document.getElementById('close-goal-modal');
    const confirmAddGoal = document.getElementById('confirm-add-goal');
    const addSubgoalBtn = document.getElementById('add-subgoal-btn');
    const subgoalInputsContainer = document.getElementById('subgoal-inputs');

    // Inputs
    const goalTitle = document.getElementById('goal-title');
    const goalCategory = document.getElementById('goal-category');
    const goalDeadline = document.getElementById('goal-deadline');

    // State
    let goals = [];

    // Load Goals
    loadGoals();

    // --- Event Listeners ---

    if (addGoalBtn) addGoalBtn.addEventListener('click', () => openModal(goalModal));
    if (closeGoalModal) closeGoalModal.addEventListener('click', () => closeModal(goalModal));

    window.addEventListener('click', (e) => {
        if (e.target === goalModal) closeModal(goalModal);
    });

    // Add Subgoal Input
    if (addSubgoalBtn) {
        addSubgoalBtn.addEventListener('click', () => {
            const div = document.createElement('div');
            div.className = 'subgoal-input-group';
            div.innerHTML = `
                <input type="text" class="form-input subgoal-input" placeholder="Sonraki Adım">
                <button class="btn btn--outline btn--sm" onclick="this.parentElement.remove()" style="padding: 0 0.5rem;"><i class="fa-solid fa-times"></i></button>
            `;
            subgoalInputsContainer.appendChild(div);
        });
    }

    // Add Goal
    if (confirmAddGoal) {
        confirmAddGoal.addEventListener('click', () => {
            const title = goalTitle.value.trim();
            const category = goalCategory.value;
            const deadline = goalDeadline.value;

            // Collect subgoals
            const subgoalInputs = document.querySelectorAll('.subgoal-input');
            const subgoals = [];
            subgoalInputs.forEach(input => {
                if (input.value.trim()) {
                    subgoals.push({
                        id: Date.now() + Math.random(),
                        text: input.value.trim(),
                        completed: false
                    });
                }
            });

            if (title) {
                const goal = {
                    id: Date.now(),
                    title,
                    category,
                    deadline,
                    subgoals,
                    completed: false,
                    progress: 0
                };

                goals.push(goal);
                saveGoals();
                renderGoals();

                // Reset form
                goalTitle.value = '';
                goalDeadline.value = '';
                subgoalInputsContainer.innerHTML = '<div class="subgoal-input-group"><input type="text" class="form-input subgoal-input" placeholder="Adım 1"></div>';
                closeModal(goalModal);
            }
        });
    }

    // --- Functions ---

    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    function saveGoals() {
        Storage.save('yearlyGoals', goals);
        updateTotalProgress();
    }

    function loadGoals() {
        const savedGoals = Storage.get('yearlyGoals');
        if (savedGoals && Array.isArray(savedGoals)) {
            goals = savedGoals;
            renderGoals();
        }
    }

    function renderGoals() {
        goalsContainer.innerHTML = '';

        if (goals.length === 0) {
            goalsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Henüz hiç hedef eklemedin. Yeni bir tane ekleyerek başla!</p>';
            updateTotalProgress();
            return;
        }

        goals.forEach(goal => {
            const card = document.createElement('div');
            card.className = 'goal-card fade-in-up';

            // Calculate progress
            const totalSub = goal.subgoals.length;
            const completedSub = goal.subgoals.filter(s => s.completed).length;
            const progress = totalSub === 0 ? (goal.completed ? 100 : 0) : Math.round((completedSub / totalSub) * 100);
            goal.progress = progress; // Update internal state

            // Subgoals HTML
            let subgoalsHtml = '';
            goal.subgoals.forEach(sub => {
                subgoalsHtml += `
                    <div class="subgoal-item ${sub.completed ? 'completed' : ''}" data-id="${sub.id}" data-goal-id="${goal.id}">
                        <div class="checkbox"></div>
                        <span class="subgoal-text">${sub.text}</span>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="goal-header">
                    <div>
                        <div class="goal-category">${goal.category}</div>
                        <h3 class="goal-title">${goal.title}</h3>
                        <div class="goal-deadline"><i class="fa-regular fa-calendar"></i> ${goal.deadline ? formatDate(goal.deadline) : 'Tarih yok'}</div>
                    </div>
                    <div class="goal-actions">
                        <button class="btn btn--outline btn--sm delete-goal-btn" data-id="${goal.id}" style="padding: 0.5rem;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="goal-body">
                    <div class="subgoals-list">
                        ${subgoalsHtml}
                    </div>
                    <div class="goal-progress">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem;">
                            <span>İlerleme</span>
                            <span>${progress}%</span>
                        </div>
                        <div class="goal-progress-bar">
                            <div class="goal-progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
            `;

            goalsContainer.appendChild(card);
        });

        // Add event listeners for dynamic elements
        document.querySelectorAll('.subgoal-item').forEach(item => {
            item.addEventListener('click', () => {
                const goalId = parseInt(item.dataset.goalId);
                const subId = parseFloat(item.dataset.id);
                toggleSubgoal(goalId, subId);
            });
        });

        document.querySelectorAll('.delete-goal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Bu hedefi silmek istediğine emin misiniz?')) {
                    deleteGoal(parseInt(btn.dataset.id));
                }
            });
        });

        updateTotalProgress();
    }

    function toggleSubgoal(goalId, subId) {
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            const sub = goal.subgoals.find(s => s.id === subId);
            if (sub) {
                sub.completed = !sub.completed;

                // Check if all completed
                const allCompleted = goal.subgoals.every(s => s.completed);
                if (allCompleted && !goal.completed) {
                    goal.completed = true;
                    celebrate();
                } else if (!allCompleted) {
                    goal.completed = false;
                }

                saveGoals();
                renderGoals();
            }
        }
    }

    function deleteGoal(id) {
        goals = goals.filter(g => g.id !== id);
        saveGoals();
        renderGoals();
    }

    function updateTotalProgress() {
        if (goals.length === 0) {
            totalProgressCircle.style.setProperty('--progress', '0%');
            totalProgressText.innerText = '0%';
            return;
        }

        const totalProgress = goals.reduce((acc, curr) => acc + curr.progress, 0) / goals.length;
        const rounded = Math.round(totalProgress);

        totalProgressCircle.style.setProperty('--progress', `${rounded}%`);
        totalProgressText.innerText = `${rounded}%`;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    function celebrate() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
}

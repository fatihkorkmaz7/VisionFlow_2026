/* ===== YEARLY GOALS MODULE - Enhanced Version ===== */

document.addEventListener('DOMContentLoaded', () => {
    initYearlyGoals();
});

function initYearlyGoals() {
    console.log('🎯 Yearly Goals Module Initialized');

    // ===== DOM Elements =====
    const goalsContainer = document.getElementById('goals-container');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const totalProgressCircle = document.getElementById('total-progress-circle');
    const totalProgressText = document.getElementById('total-progress-text');

    // Stats
    const statTotal = document.getElementById('stat-total');
    const statCompleted = document.getElementById('stat-completed');
    const statInProgress = document.getElementById('stat-inprogress');
    const statOverdue = document.getElementById('stat-overdue');
    const statRemainingDays = document.getElementById('stat-remaining-days');

    // Breakdown
    const breakdownCompleted = document.getElementById('breakdown-completed');
    const breakdownInProgress = document.getElementById('breakdown-inprogress');
    const breakdownOverdue = document.getElementById('breakdown-overdue');
    const categoryChart = document.getElementById('category-chart');

    // Filters & Sorting
    const filterCategory = document.getElementById('filter-category');
    const filterStatus = document.getElementById('filter-status');
    const sortBy = document.getElementById('sort-by');

    // View Toggle
    const viewGridBtn = document.getElementById('view-grid');
    const viewListBtn = document.getElementById('view-list');

    // Modal Elements
    const goalModal = document.getElementById('goal-modal');
    const closeGoalModal = document.getElementById('close-goal-modal');
    const cancelGoalBtn = document.getElementById('cancel-goal-btn');
    const goalForm = document.getElementById('goal-form');
    const modalTitle = document.getElementById('modal-title');
    const addSubgoalBtn = document.getElementById('add-subgoal-btn');
    const subgoalInputsContainer = document.getElementById('subgoal-inputs');

    // Delete Modal
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const deleteGoalName = document.getElementById('delete-goal-name');

    // Form Inputs
    const goalTitle = document.getElementById('goal-title');
    const goalDescription = document.getElementById('goal-description');
    const goalCategory = document.getElementById('goal-category');
    const goalPriority = document.getElementById('goal-priority');
    const goalDeadline = document.getElementById('goal-deadline');

    // ===== State =====
    let goals = [];
    let currentView = 'grid';
    let editingGoalId = null;
    let deletingGoalId = null;

    // ===== Category Config =====
    const categoryConfig = {
        'Kariyer': { color: '#8B5CF6', icon: '💼', class: 'category-kariyer' },
        'Sağlık': { color: '#10B981', icon: '🏃', class: 'category-saglik' },
        'Finans': { color: '#F59E0B', icon: '💰', class: 'category-finans' },
        'Eğitim': { color: '#3B82F6', icon: '📚', class: 'category-egitim' },
        'Kişisel': { color: '#EC4899', icon: '🌟', class: 'category-kisisel' },
        'İlişkiler': { color: '#EF4444', icon: '❤️', class: 'category-iliskiler' }
    };

    const priorityConfig = {
        'low': { label: 'Düşük', class: 'low', order: 1 },
        'medium': { label: 'Orta', class: 'medium', order: 2 },
        'high': { label: 'Yüksek', class: 'high', order: 3 },
        'critical': { label: 'Kritik', class: 'critical', order: 4 }
    };

    // ===== Initialize =====
    loadGoals();
    updateRemainingDays();

    // ===== Event Listeners =====

    // Add Goal Button
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => {
            editingGoalId = null;
            resetForm();
            modalTitle.textContent = 'Yeni Hedef Ekle';
            openModal(goalModal);
        });
    }

    // Close Modal
    if (closeGoalModal) closeGoalModal.addEventListener('click', () => closeModal(goalModal));
    if (cancelGoalBtn) cancelGoalBtn.addEventListener('click', () => closeModal(goalModal));

    // Click outside modal
    window.addEventListener('click', (e) => {
        if (e.target === goalModal) closeModal(goalModal);
        if (e.target === deleteModal) closeModal(deleteModal);
    });

    // Add Subgoal
    if (addSubgoalBtn) {
        addSubgoalBtn.addEventListener('click', () => {
            addSubgoalInput();
        });
    }

    // Form Submit
    if (goalForm) {
        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveGoal();
        });
    }

    // Filters & Sorting
    if (filterCategory) filterCategory.addEventListener('change', renderGoals);
    if (filterStatus) filterStatus.addEventListener('change', renderGoals);
    if (sortBy) sortBy.addEventListener('change', renderGoals);

    // View Toggle
    if (viewGridBtn) {
        viewGridBtn.addEventListener('click', () => {
            setView('grid');
        });
    }

    if (viewListBtn) {
        viewListBtn.addEventListener('click', () => {
            setView('list');
        });
    }

    // Delete Modal
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => closeModal(deleteModal));
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (deletingGoalId) {
                deleteGoal(deletingGoalId);
                closeModal(deleteModal);
            }
        });
    }

    // ===== Functions =====

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function resetForm() {
        goalTitle.value = '';
        goalDescription.value = '';
        goalCategory.value = 'Kariyer';
        goalPriority.value = 'medium';
        goalDeadline.value = '';
        subgoalInputsContainer.innerHTML = `
            <div class="subgoal-input-group">
                <input type="text" class="form-input subgoal-input" placeholder="Adım 1">
                <button type="button" class="remove-subgoal-btn" onclick="this.parentElement.remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;
    }

    function addSubgoalInput(value = '') {
        const div = document.createElement('div');
        div.className = 'subgoal-input-group';
        div.innerHTML = `
            <input type="text" class="form-input subgoal-input" placeholder="Sonraki adım..." value="${value}">
            <button type="button" class="remove-subgoal-btn" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        subgoalInputsContainer.appendChild(div);
    }

    function saveGoal() {
        const title = goalTitle.value.trim();
        if (!title) return;

        const description = goalDescription.value.trim();
        const category = goalCategory.value;
        const priority = goalPriority.value;
        const deadline = goalDeadline.value;

        // Collect subgoals
        const subgoalInputs = document.querySelectorAll('.subgoal-input');
        const subgoals = [];
        subgoalInputs.forEach((input, index) => {
            if (input.value.trim()) {
                subgoals.push({
                    id: Date.now() + index + Math.random(),
                    text: input.value.trim(),
                    completed: false
                });
            }
        });

        if (editingGoalId) {
            // Update existing goal
            const goalIndex = goals.findIndex(g => g.id === editingGoalId);
            if (goalIndex !== -1) {
                // Preserve completed status of existing subgoals
                const existingSubgoals = goals[goalIndex].subgoals;
                subgoals.forEach(newSub => {
                    const existing = existingSubgoals.find(s => s.text === newSub.text);
                    if (existing) {
                        newSub.completed = existing.completed;
                        newSub.id = existing.id;
                    }
                });

                goals[goalIndex] = {
                    ...goals[goalIndex],
                    title,
                    description,
                    category,
                    priority,
                    deadline,
                    subgoals,
                    updatedAt: Date.now()
                };
            }
        } else {
            // Create new goal
            const goal = {
                id: Date.now(),
                title,
                description,
                category,
                priority,
                deadline,
                subgoals,
                completed: false,
                progress: 0,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            goals.push(goal);

            // Log activity
            logActivity('goal_created', `"${title}" hedefi oluşturuldu`);
        }

        persistGoals();
        renderGoals();
        closeModal(goalModal);
    }

    function editGoal(id) {
        const goal = goals.find(g => g.id === id);
        if (!goal) return;

        editingGoalId = id;
        modalTitle.textContent = 'Hedefi Düzenle';

        goalTitle.value = goal.title;
        goalDescription.value = goal.description || '';
        goalCategory.value = goal.category;
        goalPriority.value = goal.priority || 'medium';
        goalDeadline.value = goal.deadline || '';

        // Populate subgoals
        subgoalInputsContainer.innerHTML = '';
        if (goal.subgoals.length > 0) {
            goal.subgoals.forEach(sub => {
                addSubgoalInput(sub.text);
            });
        } else {
            addSubgoalInput();
        }

        openModal(goalModal);
    }

    function showDeleteConfirmation(id) {
        const goal = goals.find(g => g.id === id);
        if (!goal) return;

        deletingGoalId = id;
        deleteGoalName.textContent = `"${goal.title}" hedefini silmek istediğine emin misin?`;
        openModal(deleteModal);
    }

    function deleteGoal(id) {
        goals = goals.filter(g => g.id !== id);
        persistGoals();
        renderGoals();
    }

    function toggleSubgoal(goalId, subId) {
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            const sub = goal.subgoals.find(s => s.id === subId);
            if (sub) {
                sub.completed = !sub.completed;

                // Set completion timestamp
                if (sub.completed) {
                    sub.completedAt = Date.now();
                    logActivity('subgoal_completed', `"${sub.text}" adımı tamamlandı`);
                } else {
                    delete sub.completedAt;
                }

                // Check if all completed
                const allCompleted = goal.subgoals.length > 0 && goal.subgoals.every(s => s.completed);
                if (allCompleted && !goal.completed) {
                    goal.completed = true;
                    goal.completedAt = Date.now();
                    logActivity('goal_completed', `"${goal.title}" hedefi tamamlandı! 🎉`);
                    celebrate();
                } else if (!allCompleted) {
                    goal.completed = false;
                    delete goal.completedAt;
                }

                persistGoals();
                renderGoals();
            }
        }
    }

    function persistGoals() {
        Storage.save('yearlyGoals', goals);
        updateStats();
    }

    function loadGoals() {
        const savedGoals = Storage.get('yearlyGoals');
        if (savedGoals && Array.isArray(savedGoals)) {
            // Migrate old goals to new format
            goals = savedGoals.map(goal => ({
                ...goal,
                priority: goal.priority || 'medium',
                description: goal.description || '',
                createdAt: goal.createdAt || Date.now(),
                updatedAt: goal.updatedAt || Date.now()
            }));
            renderGoals();
        }
    }

    function getFilteredAndSortedGoals() {
        let filtered = [...goals];

        // Filter by category
        const categoryFilter = filterCategory?.value || 'all';
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(g => g.category === categoryFilter);
        }

        // Filter by status
        const statusFilter = filterStatus?.value || 'all';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (statusFilter !== 'all') {
            filtered = filtered.filter(g => {
                const isCompleted = g.completed || (g.subgoals.length > 0 && g.subgoals.every(s => s.completed));
                const isOverdue = g.deadline && new Date(g.deadline) < today && !isCompleted;

                switch (statusFilter) {
                    case 'completed': return isCompleted;
                    case 'inprogress': return !isCompleted && !isOverdue;
                    case 'overdue': return isOverdue;
                    default: return true;
                }
            });
        }

        // Sort
        const sortValue = sortBy?.value || 'date-desc';
        filtered.sort((a, b) => {
            switch (sortValue) {
                case 'date-desc':
                    return (b.createdAt || 0) - (a.createdAt || 0);
                case 'date-asc':
                    return (a.createdAt || 0) - (b.createdAt || 0);
                case 'deadline-asc':
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'deadline-desc':
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(b.deadline) - new Date(a.deadline);
                case 'progress-desc':
                    return (b.progress || 0) - (a.progress || 0);
                case 'progress-asc':
                    return (a.progress || 0) - (b.progress || 0);
                case 'priority-desc':
                    return (priorityConfig[b.priority]?.order || 0) - (priorityConfig[a.priority]?.order || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }

    function renderGoals() {
        const filteredGoals = getFilteredAndSortedGoals();

        // Update view class
        goalsContainer.className = currentView === 'list' ? 'goals-list fade-in-up' : 'goals-grid fade-in-up';

        if (filteredGoals.length === 0) {
            goalsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-bullseye"></i>
                    <h3>Henüz hedef eklemedin</h3>
                    <p>Yeni bir hedef ekleyerek 2026 yılına güçlü bir başlangıç yap!</p>
                    <button class="btn btn--primary" onclick="document.getElementById('add-goal-btn').click()">
                        <i class="fa-solid fa-plus"></i> İlk Hedefini Ekle
                    </button>
                </div>
            `;
            updateStats();
            return;
        }

        goalsContainer.innerHTML = '';

        filteredGoals.forEach(goal => {
            const card = createGoalCard(goal);
            goalsContainer.appendChild(card);
        });

        // Add event listeners
        attachCardEventListeners();
        updateStats();
    }

    function createGoalCard(goal) {
        const card = document.createElement('div');
        const catConfig = categoryConfig[goal.category] || categoryConfig['Kariyer'];
        const priConfig = priorityConfig[goal.priority] || priorityConfig['medium'];

        // Calculate progress
        const totalSub = goal.subgoals.length;
        const completedSub = goal.subgoals.filter(s => s.completed).length;
        const progress = totalSub === 0 ? (goal.completed ? 100 : 0) : Math.round((completedSub / totalSub) * 100);
        goal.progress = progress;

        // Calculate remaining days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
        let daysRemaining = null;
        let daysStatus = '';

        if (deadlineDate) {
            daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
            if (daysRemaining < 0) {
                daysStatus = 'overdue';
            } else if (daysRemaining <= 7) {
                daysStatus = 'warning';
            } else {
                daysStatus = 'safe';
            }
        }

        const isCompleted = progress === 100;

        card.className = `goal-card ${catConfig.class} ${isCompleted ? 'completed' : ''} fade-in-up`;
        card.style.setProperty('--category-color', catConfig.color);

        // Subgoals HTML
        let subgoalsHtml = '';
        goal.subgoals.forEach(sub => {
            subgoalsHtml += `
                <div class="subgoal-item ${sub.completed ? 'completed' : ''}" data-sub-id="${sub.id}" data-goal-id="${goal.id}">
                    <div class="checkbox"></div>
                    <span class="subgoal-text">${escapeHtml(sub.text)}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="goal-header">
                <div class="goal-top-row">
                    <div class="goal-badges">
                        <span class="goal-badge badge-category">${catConfig.icon} ${goal.category}</span>
                        <span class="goal-badge badge-priority ${priConfig.class}">${priConfig.label}</span>
                    </div>
                    <div class="goal-actions">
                        <button class="goal-action-btn edit-goal-btn" data-id="${goal.id}" title="Düzenle">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="goal-action-btn delete delete-goal-btn" data-id="${goal.id}" title="Sil">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h3 class="goal-title">${escapeHtml(goal.title)}</h3>
                ${goal.description ? `<p class="goal-description">${escapeHtml(goal.description)}</p>` : ''}
                <div class="goal-meta">
                    ${goal.deadline ? `
                        <div class="goal-meta-item ${daysStatus}">
                            <i class="fa-regular fa-calendar"></i>
                            ${formatDate(goal.deadline)}
                        </div>
                        ${daysRemaining !== null ? `
                            <div class="goal-meta-item ${daysStatus}">
                                <i class="fa-solid fa-hourglass-half"></i>
                                ${daysRemaining < 0 ? `${Math.abs(daysRemaining)} gün gecikti` :
                        daysRemaining === 0 ? 'Bugün!' :
                            `${daysRemaining} gün kaldı`}
                            </div>
                        ` : ''}
                    ` : ''}
                </div>
            </div>
            <div class="goal-body">
                ${goal.subgoals.length > 0 ? `
                    <div class="subgoals-header">
                        <span class="subgoals-title">Alt Hedefler</span>
                        <span class="subgoals-count">${completedSub}/${totalSub}</span>
                    </div>
                    <div class="subgoals-list">
                        ${subgoalsHtml}
                    </div>
                ` : ''}
                <div class="goal-progress">
                    <div class="progress-header">
                        <span>İlerleme</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    function attachCardEventListeners() {
        // Subgoal toggle
        document.querySelectorAll('.subgoal-item').forEach(item => {
            item.addEventListener('click', () => {
                const goalId = parseInt(item.dataset.goalId);
                const subId = parseFloat(item.dataset.subId);
                toggleSubgoal(goalId, subId);
            });
        });

        // Edit button
        document.querySelectorAll('.edit-goal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                editGoal(parseInt(btn.dataset.id));
            });
        });

        // Delete button
        document.querySelectorAll('.delete-goal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteConfirmation(parseInt(btn.dataset.id));
            });
        });
    }

    function updateStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let completed = 0;
        let inProgress = 0;
        let overdue = 0;

        const categoryCounts = {};

        goals.forEach(goal => {
            // Calculate progress
            const totalSub = goal.subgoals.length;
            const completedSub = goal.subgoals.filter(s => s.completed).length;
            const progress = totalSub === 0 ? (goal.completed ? 100 : 0) : Math.round((completedSub / totalSub) * 100);
            goal.progress = progress;

            const isCompleted = progress === 100;
            const isOverdue = goal.deadline && new Date(goal.deadline) < today && !isCompleted;

            if (isCompleted) {
                completed++;
            } else if (isOverdue) {
                overdue++;
            } else {
                inProgress++;
            }

            // Category count
            const cat = goal.category;
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        // Update stat cards
        if (statTotal) statTotal.textContent = goals.length;
        if (statCompleted) statCompleted.textContent = completed;
        if (statInProgress) statInProgress.textContent = inProgress;
        if (statOverdue) statOverdue.textContent = overdue;

        // Update breakdown
        if (breakdownCompleted) breakdownCompleted.textContent = `${completed} tamamlandı`;
        if (breakdownInProgress) breakdownInProgress.textContent = `${inProgress} devam ediyor`;
        if (breakdownOverdue) breakdownOverdue.textContent = `${overdue} gecikmiş`;

        // Update total progress
        updateTotalProgress();

        // Update category chart
        updateCategoryChart(categoryCounts);
    }

    function updateTotalProgress() {
        if (goals.length === 0) {
            if (totalProgressCircle) totalProgressCircle.style.setProperty('--progress', '0%');
            if (totalProgressText) totalProgressText.textContent = '0%';
            return;
        }

        const totalProgress = goals.reduce((acc, curr) => acc + (curr.progress || 0), 0) / goals.length;
        const rounded = Math.round(totalProgress);

        if (totalProgressCircle) totalProgressCircle.style.setProperty('--progress', `${rounded}%`);
        if (totalProgressText) totalProgressText.textContent = `${rounded}%`;
    }

    function updateCategoryChart(categoryCounts) {
        if (!categoryChart) return;

        categoryChart.innerHTML = '';

        Object.entries(categoryCounts).forEach(([cat, count]) => {
            const config = categoryConfig[cat] || categoryConfig['Kariyer'];
            const item = document.createElement('div');
            item.className = 'category-item';
            item.innerHTML = `
                <span class="category-color" style="background: ${config.color}"></span>
                <span>${config.icon} ${cat}: ${count}</span>
            `;
            categoryChart.appendChild(item);
        });
    }

    function updateRemainingDays() {
        const now = new Date();
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        const remaining = Math.ceil((endOfYear - now) / (1000 * 60 * 60 * 24));
        if (statRemainingDays) statRemainingDays.textContent = remaining;
    }

    function setView(view) {
        currentView = view;

        if (view === 'grid') {
            viewGridBtn?.classList.add('active');
            viewListBtn?.classList.remove('active');
        } else {
            viewGridBtn?.classList.remove('active');
            viewListBtn?.classList.add('active');
        }

        renderGoals();
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function celebrate() {
        if (typeof confetti === 'function') {
            // First burst
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Side bursts
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 200);
        }
    }

    // Log activity for dashboard tracking
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
}

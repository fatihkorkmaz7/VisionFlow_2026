/* ===== JAR GOALS MODULE ===== */

document.addEventListener('DOMContentLoaded', () => {
    initJarGoals();
});

function initJarGoals() {
    console.log('Jar Goals Module Initialized');

    // DOM Elements
    const jar = document.getElementById('memory-jar');
    const addNoteBtn = document.getElementById('add-note-btn');
    const shakeJarBtn = document.getElementById('shake-jar-btn');

    // Modals
    const noteModal = document.getElementById('note-modal');
    const randomNoteModal = document.getElementById('random-note-modal');
    const closeNoteModal = document.getElementById('close-note-modal');
    const closeRandomModal = document.getElementById('close-random-modal');

    // Form Inputs
    const noteText = document.getElementById('note-text');
    const noteDate = document.getElementById('note-date');
    const confirmAddNote = document.getElementById('confirm-add-note');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Stats
    const totalNotesEl = document.getElementById('total-notes');
    const memoriesCountEl = document.getElementById('memories-count');
    const achievementsCountEl = document.getElementById('achievements-count');
    const gratitudeCountEl = document.getElementById('gratitude-count');

    // State
    let notes = [];
    let selectedCategory = 'memory';
    let selectedColor = 'var(--accent-1)';

    // Set default date to today
    if (noteDate) noteDate.valueAsDate = new Date();

    // Load Notes
    loadNotes();

    // --- Event Listeners ---

    if (addNoteBtn) addNoteBtn.addEventListener('click', () => openModal(noteModal));
    if (closeNoteModal) closeNoteModal.addEventListener('click', () => closeModal(noteModal));
    if (closeRandomModal) closeRandomModal.addEventListener('click', () => closeModal(randomNoteModal));

    window.addEventListener('click', (e) => {
        if (e.target === noteModal) closeModal(noteModal);
        if (e.target === randomNoteModal) closeModal(randomNoteModal);
    });

    // Category Selection
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Update state
            selectedCategory = btn.dataset.cat;
            selectedColor = btn.dataset.color;
        });
    });

    // Add Note
    if (confirmAddNote) {
        confirmAddNote.addEventListener('click', () => {
            const text = noteText.value.trim();
            const date = noteDate.value;

            if (text) {
                const note = {
                    id: Date.now(),
                    text: text,
                    date: date,
                    category: selectedCategory,
                    color: selectedColor,
                    createdAt: Date.now()
                };

                addNoteToJar(note);
                notes.push(note);
                saveNotes();
                updateStats();

                // Log activity for dashboard
                logActivity('jar_note_added', `Kavanoza yeni not eklendi: "${text.substring(0, 30)}..."`);

                // Reset form
                noteText.value = '';
                closeModal(noteModal);
            }
        });
    }

    // Shake Jar / Random Note
    if (shakeJarBtn) {
        shakeJarBtn.addEventListener('click', () => {
            if (notes.length === 0) {
                alert('Kavanoz boş! Önce bir not ekle.');
                return;
            }

            // Animation
            jar.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                jar.style.animation = '';
                showRandomNote();
            }, 500);
        });
    }

    // --- Functions ---

    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    function addNoteToJar(note) {
        const noteEl = document.createElement('div');
        noteEl.classList.add('jar-note');

        // Random position within jar
        // Jar size is approx 200px width, 300px height
        // Note size is 40px
        const randomLeft = Math.floor(Math.random() * 140) + 10; // 10px to 150px
        const randomBottom = Math.floor(Math.random() * 200) + 10; // 10px to 210px
        const randomRotation = Math.floor(Math.random() * 360);

        noteEl.style.setProperty('--left', `${randomLeft}px`);
        noteEl.style.setProperty('--bottom', `${randomBottom}px`);
        noteEl.style.setProperty('--rotation', `${randomRotation}deg`);
        noteEl.style.backgroundColor = note.color;

        noteEl.title = note.text.substring(0, 20) + '...';

        jar.appendChild(noteEl);
    }

    function showRandomNote() {
        const randomIndex = Math.floor(Math.random() * notes.length);
        const note = notes[randomIndex];

        document.getElementById('random-note-content').innerText = note.text;
        document.getElementById('random-note-meta').innerText = `${formatDate(note.date)} • ${getCategoryName(note.category)}`;

        openModal(randomNoteModal);

        // Log activity for dashboard
        logActivity('jar_note_opened', `Kavanozdan bir anı hatırlandı: "${note.text.substring(0, 30)}..."`);
    }

    function saveNotes() {
        Storage.save('jarNotes', notes);
    }

    function loadNotes() {
        const savedNotes = Storage.get('jarNotes');
        if (savedNotes && Array.isArray(savedNotes)) {
            notes = savedNotes;
            notes.forEach(note => addNoteToJar(note));
            updateStats();
        }
    }

    function updateStats() {
        if (totalNotesEl) totalNotesEl.innerText = notes.length;

        const memories = notes.filter(n => n.category === 'memory').length;
        const achievements = notes.filter(n => n.category === 'achievement').length;
        const gratitude = notes.filter(n => n.category === 'gratitude').length;

        if (memoriesCountEl) memoriesCountEl.innerText = memories;
        if (achievementsCountEl) achievementsCountEl.innerText = achievements;
        if (gratitudeCountEl) gratitudeCountEl.innerText = gratitude;
    }

    function getCategoryName(cat) {
        const map = {
            'memory': 'Anı',
            'achievement': 'Başarı',
            'gratitude': 'Minnettarlık',
            'goal': 'Hedef'
        };
        return map[cat] || cat;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    // Log activity for dashboard tracking
    function logActivity(type, text) {
        const activityLog = Storage.get('activityLog') || [];
        activityLog.push({
            type,
            text,
            timestamp: Date.now()
        });
        if (activityLog.length > 100) {
            activityLog.shift();
        }
        Storage.save('activityLog', activityLog);
    }
}

// Add shake animation style dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(5deg); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
}
`;
document.head.appendChild(style);

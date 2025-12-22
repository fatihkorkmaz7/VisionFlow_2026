/* ===== VISION BOARD MODULE ===== */

document.addEventListener('DOMContentLoaded', () => {
    initVisionBoard();
});

function initVisionBoard() {
    console.log('Vision Board Module Initialized');

    // DOM Elements
    const board = document.getElementById('vision-board');
    const addImageBtn = document.getElementById('add-image-btn');
    const addTextBtn = document.getElementById('add-text-btn');
    const clearBoardBtn = document.getElementById('clear-board-btn');
    const saveBoardBtn = document.getElementById('save-board-btn');

    // Modals
    const imageModal = document.getElementById('image-modal');
    const textModal = document.getElementById('text-modal');
    const closeImageModal = document.getElementById('close-image-modal');
    const closeTextModal = document.getElementById('close-text-modal');

    // Inputs
    const imageUrlInput = document.getElementById('image-url-input');
    const imageFileInput = document.getElementById('image-file-input');
    const confirmAddImage = document.getElementById('confirm-add-image');
    const textInput = document.getElementById('text-input');
    const confirmAddText = document.getElementById('confirm-add-text');
    const fileDropArea = document.querySelector('.file-drop-area');

    // State
    let draggedItem = null;
    let items = [];

    // Load saved items
    loadItems();

    // --- Event Listeners ---

    // Modals
    if (addImageBtn) addImageBtn.addEventListener('click', () => openModal(imageModal));
    if (addTextBtn) addTextBtn.addEventListener('click', () => openModal(textModal));
    if (closeImageModal) closeImageModal.addEventListener('click', () => closeModal(imageModal));
    if (closeTextModal) closeTextModal.addEventListener('click', () => closeModal(textModal));

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === imageModal) closeModal(imageModal);
        if (e.target === textModal) closeModal(textModal);
    });

    // Add Image Logic
    if (confirmAddImage) {
        confirmAddImage.addEventListener('click', () => {
            const url = imageUrlInput.value.trim();
            if (url) {
                addItem({ type: 'image', content: url });
                imageUrlInput.value = '';
                closeModal(imageModal);
            }
        });
    }

    // File Upload Logic
    if (fileDropArea) {
        fileDropArea.addEventListener('click', () => imageFileInput.click());

        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addItem({ type: 'image', content: event.target.result });
                    closeModal(imageModal);
                };
                reader.readAsDataURL(file);
            }
        });

        // Drag over drop area
        fileDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropArea.style.borderColor = 'var(--primary)';
            fileDropArea.style.background = 'rgba(var(--primary-hue), 100%, 65%, 0.1)';
        });

        fileDropArea.addEventListener('dragleave', () => {
            fileDropArea.style.borderColor = 'var(--border-color)';
            fileDropArea.style.background = 'transparent';
        });

        fileDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropArea.style.borderColor = 'var(--border-color)';
            fileDropArea.style.background = 'transparent';

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addItem({ type: 'image', content: event.target.result });
                    closeModal(imageModal);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Add Text Logic
    if (confirmAddText) {
        confirmAddText.addEventListener('click', () => {
            const text = textInput.value.trim();
            if (text) {
                addItem({ type: 'text', content: text });
                textInput.value = '';
                closeModal(textModal);
            }
        });
    }

    // Clear Board
    if (clearBoardBtn) {
        clearBoardBtn.addEventListener('click', () => {
            if (confirm('Tüm panoyu temizlemek istediğinize emin misiniz?')) {
                board.innerHTML = '';
                items = [];
                saveItems();
            }
        });
    }

    // Save Board (Manual Trigger)
    if (saveBoardBtn) {
        saveBoardBtn.addEventListener('click', () => {
            saveItems();
            alert('Vision Board kaydedildi!');
        });
    }

    // --- Functions ---

    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    function addItem(data) {
        const item = document.createElement('div');
        item.classList.add('board-item');
        item.draggable = true;

        // Unique ID
        const id = Date.now().toString();
        item.dataset.id = id;

        if (data.type === 'image') {
            item.innerHTML = `
                <img src="${data.content}" alt="Vision Item">
                <div class="board-item__delete"><i class="fa-solid fa-times"></i></div>
            `;
        } else if (data.type === 'text') {
            item.innerHTML = `
                <div class="board-item__content" style="background: var(--bg-card); color: var(--text-primary);">
                    ${data.content}
                </div>
                <div class="board-item__delete"><i class="fa-solid fa-times"></i></div>
            `;
        }

        // Delete Event
        item.querySelector('.board-item__delete').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag start
            item.remove();
            saveItems();
        });

        // Drag Events
        setupDragEvents(item);

        board.appendChild(item);
        saveItems();
    }

    function setupDragEvents(item) {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            setTimeout(() => item.style.opacity = '0.5', 0);
        });

        item.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedItem.style.opacity = '1';
                draggedItem = null;
            }, 0);
            saveItems(); // Save order after drag
        });

        // Touch support (basic) could be added here
    }

    // Board Drag Over
    board.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(board, e.clientY);
        if (afterElement == null) {
            board.appendChild(draggedItem);
        } else {
            board.insertBefore(draggedItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.board-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveItems() {
        const currentItems = [];
        const boardItems = document.querySelectorAll('.board-item');

        boardItems.forEach(item => {
            const img = item.querySelector('img');
            const textDiv = item.querySelector('.board-item__content');

            if (img) {
                currentItems.push({ type: 'image', content: img.src });
            } else if (textDiv) {
                currentItems.push({ type: 'text', content: textDiv.innerText });
            }
        });

        Storage.save('visionBoardItems', currentItems);
    }

    function loadItems() {
        const savedItems = Storage.get('visionBoardItems');
        if (savedItems && Array.isArray(savedItems)) {
            // Clear default sample if saved items exist
            if (savedItems.length > 0) board.innerHTML = '';

            savedItems.forEach(data => {
                addItem(data);
            });
        }
    }
}

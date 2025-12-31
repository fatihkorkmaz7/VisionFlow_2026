export class DragDropManager {
    constructor(boardId) {
        this.board = document.getElementById(boardId);
        this.placeholder = document.getElementById('board-placeholder');
        this.init();
    }

    init() {
        if (!this.board) return;

        // Board events
        this.board.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.board.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.board.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.board.classList.add('drag-over');
    }

    handleDragLeave(e) {
        this.board.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.board.classList.remove('drag-over');

        // Hide placeholder
        if (this.placeholder) {
            this.placeholder.style.display = 'none';
        }

        // Handle text/uri-list (Image URL from sidebar)
        const imageUrl = e.dataTransfer.getData('text/plain');
        if (imageUrl) {
            this.addImageToBoard(imageUrl);
            return;
        }

        // Handle Files (Upload from desktop)
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            this.handleFiles(files);
        }
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addImageToBoard(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addImageToBoard(src) {
        const item = document.createElement('div');
        item.className = 'board-item';
        item.draggable = true;
        
        // Random rotation for natural feel
        const rotation = Math.random() * 6 - 3; // -3 to 3 degrees
        item.style.transform = `rotate(${rotation}deg)`;

        item.innerHTML = `
            <img src="${src}" alt="Vision Item">
            <div class="board-item__delete"><i class="fa-solid fa-times"></i></div>
        `;

        // Add delete functionality
        item.querySelector('.board-item__delete').addEventListener('click', () => {
            item.remove();
            this.checkEmptyState();
        });

        // Add drag functionality for reordering (basic)
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', src);
            item.classList.add('dragging');
            // We might want to remove the original on drop if moving, 
            // but for now let's treat sidebar -> board as copy, board -> board as move?
            // To keep it simple, we just allow copying for now or assume new add.
        });

        this.board.appendChild(item);
    }

    checkEmptyState() {
        if (this.board.querySelectorAll('.board-item').length === 0) {
            if (this.placeholder) this.placeholder.style.display = 'block';
        }
    }
}

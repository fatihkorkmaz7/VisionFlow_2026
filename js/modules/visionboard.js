import { DragDropManager } from './drag-drop.js';

class VisionBoard {
    constructor() {
        this.boardId = 'vision-board';
        this.assetsGrid = document.getElementById('assets-grid');
        this.categoryBtns = document.querySelectorAll('.vb-cat-btn');
        this.dragDropManager = new DragDropManager(this.boardId);

        // Local Assets Data
        this.assets = {
            health: [
                '../assets/Saglik/b530c903911965dd00891c30653c8939.jpg',
                '../assets/Saglik/f71632a0f4afd7964296b7390f895d38.jpg'
            ],
            love: [
                '../assets/Ask/472b9d93edb641c3830924f57ef6e524.jpg',
                '../assets/Ask/9d3f76a33494860fed1f6500539224f1.jpg'
            ],
            career: [
                '../assets/Kariyer/9df8a66f5465297b17e0b86072b6493d.jpg',
                '../assets/Kariyer/aa921170285944a2a6e9122f0c6bd29c.jpg',
                '../assets/Kariyer/afed346eaf62ee0cb36bea93debeb216.jpg'
            ],
            finance: [
                '../assets/Finans/0e9e516bb8b75293d839824b7c56b4db.jpg',
                '../assets/Finans/605e0302a096d2bb60945078f137a9bb.jpg',
                '../assets/Finans/8be3eea129068edbe90ce059b4f42d9e.jpg',
                '../assets/Finans/8d0c53de90ad215393dd9e15c463db30.jpg',
                '../assets/Finans/d9b344a7ae1a42c849803753c2eed773.jpg'
            ],
            travel: [
                '../assets/Seyahat/3ba262008be146010197d998eefd5ff2.jpg',
                '../assets/Seyahat/42275cbc627b3d5a6d105c4fdf695897.jpg',
                '../assets/Seyahat/4350a3f314f79ea74d13df4b18b4cf96.jpg',
                '../assets/Seyahat/7e83b121ee359f91a2b8220fcc2e0351.jpg',
                '../assets/Seyahat/84e3a71effe1a7010284f46164262617.jpg',
                '../assets/Seyahat/a7329457024b53534b39c901a4d2c4ad.jpg',
                '../assets/Seyahat/b45c6d99f30caf0e4b2627e976285ddc.jpg',
                '../assets/Seyahat/b6247a7e16886b81a2d7df29a3f8eb74.jpg',
                '../assets/Seyahat/ec927e592be3152780053fd3bc3c13b5.jpg'
            ],
            family: [
                '../assets/Aile/03325a1ef921ea5e550d2e76ab25bd2c.jpg',
                '../assets/Aile/b2f52e1e7c3235d7bae42554c3f1819d.jpg',
                '../assets/Aile/f348a134a38599eccc17d9a1828d103d.jpg'
            ]
        };

        this.init();
    }

    init() {
        this.initCategorySelection();
        this.initFileUpload();
        this.initUrlInput();
        this.initActions();

        // Load initial category
        this.loadAssets('health');
        this.categoryBtns[0].classList.add('active');
    }

    initCategorySelection() {
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                // Add to clicked
                btn.classList.add('active');
                // Load assets
                const category = btn.dataset.category;
                this.loadAssets(category);
            });
        });
    }

    loadAssets(category) {
        this.assetsGrid.innerHTML = '';
        const images = this.assets[category] || [];

        images.forEach(src => {
            const item = document.createElement('div');
            item.className = 'asset-item';
            item.draggable = true;
            item.innerHTML = `<img src="${src}" alt="${category}">`;



            this.assetsGrid.appendChild(item);
        });
    }

    initFileUpload() {
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.dragDropManager.handleFiles(e.target.files);
                    // Reset input
                    fileInput.value = '';
                }
            });
        }
    }

    initUrlInput() {
        const urlInput = document.getElementById('url-input');
        const addBtn = document.getElementById('add-url-btn');

            }
        };

        if (addBtn) addBtn.addEventListener('click', addUrl);
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addUrl();
            });
        }
    }

    initActions() {
        // Clear Board
        const clearBtn = document.getElementById('clear-board-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Vision Board\'u temizlemek istediğinize emin misiniz?')) {
                    const board = document.getElementById(this.boardId);
                    // Remove all board-items but keep placeholder
                    const items = board.querySelectorAll('.board-item');
                    items.forEach(item => item.remove());
                    this.dragDropManager.checkEmptyState();
                }
            });
        }


            });
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
        if (activityLog.length > 100) {
            activityLog.shift();
        }
        Storage.save('activityLog', activityLog);
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    new VisionBoard();
});

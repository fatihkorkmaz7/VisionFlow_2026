import { DragDropManager } from './drag-drop.js';

class VisionBoard {
    constructor() {
        this.boardId = 'vision-board';
        this.assetsGrid = document.getElementById('assets-grid');
        this.categoryBtns = document.querySelectorAll('.vb-cat-btn');
        this.dragDropManager = new DragDropManager(this.boardId);

        // Local Assets Data - All category images
        this.assets = {
            health: [
                '../assets/Saglik/009175535856352f0d8b67f94afaa93f.jpg',
                '../assets/Saglik/0337673fe0fa690d8ba47de608d5a3dc.jpg',
                '../assets/Saglik/0ba830f5f9a1535e9373ce89928b20f6.jpg',
                '../assets/Saglik/11907885e40778edb4db8e8a4eb0bae6.jpg',
                '../assets/Saglik/2015c454e77c3541cd84569224e577bf.jpg',
                '../assets/Saglik/2315f17bc9278963b780e09f1b32fc7c.jpg',
                '../assets/Saglik/49b3735fe6d1f4ffc45765d614481188.jpg',
                '../assets/Saglik/7a790c9f1cdf55e83506eb4b2a71fe92.jpg',
                '../assets/Saglik/7c1d45d99dd6315d474cd69396387943.jpg',
                '../assets/Saglik/9ff9b5512e4bac3b825473ce1e6b11d8.jpg',
                '../assets/Saglik/b530c903911965dd00891c30653c8939.jpg',
                '../assets/Saglik/bea14c4ed63165a1ad7161570aa92caf.jpg',
                '../assets/Saglik/d0b1040dca3645a08d6177bb20907b8c.jpg',
                '../assets/Saglik/db31028258a4a51639f598dde6c0d4b2.jpg',
                '../assets/Saglik/f71632a0f4afd7964296b7390f895d38.jpg',
                '../assets/Saglik/feaf27d8a8331266553bc87c9064e12b.jpg'
            ],
            love: [
                '../assets/Ask/02dc53c99d09a8076d8b10d1e2e30025.jpg',
                '../assets/Ask/1dfb43e64aef61d4f36fd2f0bebdf3fb.jpg',
                '../assets/Ask/1fc3d82dc7c528f0153056847f3dc0eb.jpg',
                '../assets/Ask/472b9d93edb641c3830924f57ef6e524.jpg',
                '../assets/Ask/4803095eb1b27802c86e2052b0056ebc.jpg',
                '../assets/Ask/5cc454ffe3ad7dca9e2052b072700dad.jpg',
                '../assets/Ask/711983ca76c47a4bf7ed666ae31e471d.jpg',
                '../assets/Ask/8ba7a62969aeb9991223168d3581bdc8.jpg',
                '../assets/Ask/9d3f76a33494860fed1f6500539224f1.jpg',
                '../assets/Ask/a20409afbd18858ea3bc9e386a94daf5.jpg',
                '../assets/Ask/ad5085d0499ef3c6696c287eb75bacdf.jpg',
                '../assets/Ask/af107b1f38085b252ad307a3391e0f56.jpg',
                '../assets/Ask/c19aebffac62fb7a8eed3c99d4310f8d.jpg',
                '../assets/Ask/c52b909b8855933bdf4edab6b14ece27.jpg',
                '../assets/Ask/c6c8c7a493fe4d205264ce9bd9556ff2.jpg',
                '../assets/Ask/cd99da2428e9c6796023f94522fcfe3f.jpg',
                '../assets/Ask/d81abd6b1c81ad1dac26a49446620d11.jpg',
                '../assets/Ask/d929ebea3095c85da93bed68fa6c0464.jpg',
                '../assets/Ask/e6120c7e2197159a1964bd44387c03ca.jpg',
                '../assets/Ask/f3ff066da7d5b5c96ec5cf94976ab486.jpg',
                '../assets/Ask/f584c73a60d565d557b31525fcd41737.jpg'
            ],
            career: [
                '../assets/Kariyer/00b4a63578fa3ac8001e1d0504fea0da.jpg',
                '../assets/Kariyer/1350ece7563b416e91046eb7edbb283e.jpg',
                '../assets/Kariyer/5add2b76eb511342178fc8fe1ba933da.jpg',
                '../assets/Kariyer/61c7d88b5c8ba61a0a00cf704113efd5.jpg',
                '../assets/Kariyer/894af0d84080fd9a59847b3ae306f258.jpg',
                '../assets/Kariyer/979446a617b2519a150460818060f6a0.jpg',
                '../assets/Kariyer/9df8a66f5465297b17e0b86072b6493d.jpg',
                '../assets/Kariyer/aa921170285944a2a6e9122f0c6bd29c.jpg',
                '../assets/Kariyer/ae9bf9c05e09cbc5ec3264e3dc6a161a.jpg',
                '../assets/Kariyer/afed346eaf62ee0cb36bea93debeb216.jpg',
                '../assets/Kariyer/b1aba2201261f492df7cc67941058c30.jpg',
                '../assets/Kariyer/b9643e8f48b3ed9910d119732d8dc0e4.jpg',
                '../assets/Kariyer/b9c55f02e1f05474cc8d89953c0eab82.jpg',
                '../assets/Kariyer/c977631eb29668aeb7022fced9db24a5.jpg',
                '../assets/Kariyer/cbd047b2981fb5285e6bf95971ac84fd.jpg',
                '../assets/Kariyer/e16d241c3ac6b2dd544a425196ca210e.jpg',
                '../assets/Kariyer/f0c301c2aead21ecce4f35f45aa22770.jpg',
                '../assets/Kariyer/f9dbca0cade28fd6d3e87f9fec75016e.jpg'
            ],
            finance: [
                '../assets/Finans/05971f58c9968af143dece26461d993b.jpg',
                '../assets/Finans/0ab29e8b05a0d8aebee5b51ff7deb4e3.jpg',
                '../assets/Finans/0e9e516bb8b75293d839824b7c56b4db.jpg',
                '../assets/Finans/278421c86d11983332a6902a1d6ceb73.jpg',
                '../assets/Finans/4aab8fd54941354ca39bdfc2cc3761b2.jpg',
                '../assets/Finans/4be308799a60e30b975caefe8fe61ded.jpg',
                '../assets/Finans/581562522a401ad58c2d2566347dbd46.jpg',
                '../assets/Finans/5d1c8267d98775387b73b121c7412eb7.jpg',
                '../assets/Finans/5d2d3a1f340b9bfcb11be8362b86de5d.jpg',
                '../assets/Finans/605e0302a096d2bb60945078f137a9bb.jpg',
                '../assets/Finans/70e24bc28be28e1d5571260060d27da5.jpg',
                '../assets/Finans/8be3eea129068edbe90ce059b4f42d9e.jpg',
                '../assets/Finans/8d0c53de90ad215393dd9e15c463db30.jpg',
                '../assets/Finans/91cbacd70f4214a0fc36c9a90560f990.jpg',
                '../assets/Finans/a4fe4a3c645f12ccb548a7615868dd5e.jpg',
                '../assets/Finans/a6750bdd277d12fc603171f42e13cddd.jpg',
                '../assets/Finans/aeedaa586b1015c536ba4ef2796a7a74.jpg',
                '../assets/Finans/b34413d49da8c5b4ad6de7a393a9629d.jpg',
                '../assets/Finans/d39298a7631bea15749e32124529718e.jpg',
                '../assets/Finans/d3e154a6fb6bd594497ded9b71e88edf.jpg',
                '../assets/Finans/d9b344a7ae1a42c849803753c2eed773.jpg',
                '../assets/Finans/f7681805637b58b0abe3e4ac2a6fae03.jpg'
            ],
            travel: [
                '../assets/Seyahat/3ba262008be146010197d998eefd5ff2.jpg',
                '../assets/Seyahat/3dd978297f6087851fb5e1fe4f6cf4ad.jpg',
                '../assets/Seyahat/42275cbc627b3d5a6d105c4fdf695897.jpg',
                '../assets/Seyahat/4350a3f314f79ea74d13df4b18b4cf96.jpg',
                '../assets/Seyahat/4b782a5fb63dc0a6472c5fe1f36fa14d.jpg',
                '../assets/Seyahat/5a450bb2cda456c6907b985b83ee7d1e.jpg',
                '../assets/Seyahat/5dcd5d724b7fd8008c3b913850bc87d3.jpg',
                '../assets/Seyahat/5ee23be1cf96bc02658a1ebd269315de.jpg',
                '../assets/Seyahat/62d21b0483116b1057da7a5939f95a90.jpg',
                '../assets/Seyahat/70f7edc8a6a6a0869affae18fa55d208.jpg',
                '../assets/Seyahat/734cd7bd10ee717fa394c991dadb2edf.jpg',
                '../assets/Seyahat/770db81ce02e9fd7368fda433bc5cc47.jpg',
                '../assets/Seyahat/78622683140f8e7f59fc20393be55159.jpg',
                '../assets/Seyahat/7e83b121ee359f91a2b8220fcc2e0351.jpg',
                '../assets/Seyahat/84e3a71effe1a7010284f46164262617.jpg',
                '../assets/Seyahat/8aa2fcbd75dc100c364785cacd4a1c08.jpg',
                '../assets/Seyahat/a4f26daa5aa10868b60f69e609e449aa.jpg',
                '../assets/Seyahat/a7329457024b53534b39c901a4d2c4ad.jpg',
                '../assets/Seyahat/ac94878145079de50ff4f9f42010c12b.jpg',
                '../assets/Seyahat/adda21b67687941b81122b9aa66a2152.jpg',
                '../assets/Seyahat/b45c6d99f30caf0e4b2627e976285ddc.jpg',
                '../assets/Seyahat/b6247a7e16886b81a2d7df29a3f8eb74.jpg',
                '../assets/Seyahat/cc579e969b1013c029ab10020ca98fa5.jpg',
                '../assets/Seyahat/cd0a505fbb3849f78ee6c50f6970b153.jpg',
                '../assets/Seyahat/d6ea23581369f92fb5e2467e83e58f16.jpg',
                '../assets/Seyahat/da5137cbb1fefac02d91be925a7f0550.jpg',
                '../assets/Seyahat/e40c3f137d066889012aea4d8e4f0495.jpg',
                '../assets/Seyahat/e927ca6f07f4374fbe12d00634d4be54.jpg',
                '../assets/Seyahat/ec927e592be3152780053fd3bc3c13b5.jpg',
                '../assets/Seyahat/f747377b157a8b18f6c88781a5c29d2d.jpg'
            ],
            family: [
                '../assets/Aile/03325a1ef921ea5e550d2e76ab25bd2c.jpg',
                '../assets/Aile/043f4e67ce282e904190e59a488b7aee.jpg',
                '../assets/Aile/05de2f4d91aee7764fdb54db9a89d8e6.jpg',
                '../assets/Aile/111567fc2910c42fd7e8676b694a2bc9.jpg',
                '../assets/Aile/22393bb186b8be115cd7b2549ebccd4c.jpg',
                '../assets/Aile/35620b58f7e614b8599c4a5a1e16de31.jpg',
                '../assets/Aile/492e2219b8ba6a8d72ee9566adb13a3e.jpg',
                '../assets/Aile/61c388ed7ab3f169b84f48fd6eac834a.jpg',
                '../assets/Aile/669aa14d78a105f6194e5f30831edb6f.jpg',
                '../assets/Aile/6b714c24e5c0ea347dc957f2c9c7ae37.jpg',
                '../assets/Aile/908a85f18306b80a93200320d2772118.jpg',
                '../assets/Aile/9f560bbe0b2fae52733e50f6d8a873ac.jpg',
                '../assets/Aile/aae66471e3568674778e4c13243bbd04.jpg',
                '../assets/Aile/b2f52e1e7c3235d7bae42554c3f1819d.jpg',
                '../assets/Aile/d77b0b2b9332f3e964f4922999a575d4.jpg',
                '../assets/Aile/e52059e3c05c47a5edcaee961a467f1a.jpg',
                '../assets/Aile/f348a134a38599eccc17d9a1828d103d.jpg',
                '../assets/Aile/f48ab9e6e2521360416f93d7eb1535ae.jpg'
            ],
            hobbies: [
                '../assets/Hobiler/1de78d6de9f6082fa4916323510c0c74.jpg',
                '../assets/Hobiler/282581bbeddd13ec9702122fee56a602.jpg',
                '../assets/Hobiler/29e6cdd844860f6e91c44d397a50825e.jpg',
                '../assets/Hobiler/3d15aa939be00c0090a568dc6732e26c.jpg',
                '../assets/Hobiler/434dc625465afe56b520e45af345ed81.jpg',
                '../assets/Hobiler/45115ab0638bba1ed396d59a03a8ea20.jpg',
                '../assets/Hobiler/52fc90739183142917661a961b3d00a1.jpg',
                '../assets/Hobiler/7c9f820525693ba531b06ae12a019ee8.jpg',
                '../assets/Hobiler/90d6fc526847cb879189620dd019205c.jpg',
                '../assets/Hobiler/9e4dff8768166fa04af54f1aabd46674.jpg',
                '../assets/Hobiler/a85604c514ea24b297256e7526a54e63.jpg',
                '../assets/Hobiler/ae3476b91deb90530deb9d57ff044c24.jpg',
                '../assets/Hobiler/c072c9f79b32e200cadaf96b185c6b21.jpg',
                '../assets/Hobiler/c1878d5edf036fb0968e2b2b2dd4fe79.jpg',
                '../assets/Hobiler/d24d871ac0bc19b63a9d9387ea775826.jpg',
                '../assets/Hobiler/e1810d9bc83bda5124a618a7bd4ae105.jpg',
                '../assets/Hobiler/e3bad43db4840f7e11a36063ea4d2389.jpg',
                '../assets/Hobiler/ef4c527fe41afed269e97cfb6f8fda2a.jpg',
                '../assets/Hobiler/ffc29b5cb47a1310190f22b6fcb59cd3.jpg'
            ],
            quotes: [
                '../assets/Ilham Veren Sozler/04802c7372d5648bbf81397651b0f831.jpg',
                '../assets/Ilham Veren Sozler/1f4e6184f94fe21323e22adb8d8f2483.jpg',
                '../assets/Ilham Veren Sozler/21588ed3cdf5ce126d13f5e66611746e.jpg',
                '../assets/Ilham Veren Sozler/31ca018e551d75ffc8f7cc7e0744b2e7.jpg',
                '../assets/Ilham Veren Sozler/4434ba0527000cd184135f8ca1694778.jpg',
                '../assets/Ilham Veren Sozler/46d3767a408cbedaaf861db201014016.jpg',
                '../assets/Ilham Veren Sozler/4f1a002733570053ba53fd295d7deed7.jpg',
                '../assets/Ilham Veren Sozler/68eed8760e85ce3d9b6415c98bf2e76c.jpg',
                '../assets/Ilham Veren Sozler/7c842276c7a7e92a8e2db708a6d7a45d.jpg',
                '../assets/Ilham Veren Sozler/9e050894cab1db208f1815be5235994a.jpg',
                '../assets/Ilham Veren Sozler/a3e8db7e33b0b4da90c338a2cc6b5ea0.jpg',
                '../assets/Ilham Veren Sozler/be6368ad82292795f637498373327777.jpg',
                '../assets/Ilham Veren Sozler/c121ee3c3fadeee3e6b51571cffd4ea8.jpg',
                '../assets/Ilham Veren Sozler/cc1ed182d86ca77f06c050cfa7fa5f40.jpg',
                '../assets/Ilham Veren Sozler/d3cb17c36da260d42f5096318c75ec84.jpg',
                '../assets/Ilham Veren Sozler/d42bee58e275d0593b64eefa849de19a.jpg',
                '../assets/Ilham Veren Sozler/d6866ec74d34853ea420603e41538ef9.jpg',
                '../assets/Ilham Veren Sozler/e64d0a0a666a753b574339bc1fb755bf.jpg',
                '../assets/Ilham Veren Sozler/ef3440cdf40d1f7f8672a036b237f6d3.jpg',
                '../assets/Ilham Veren Sozler/f948c6bad051a608aab39b115b1b735d.jpg'
            ],
            education: [
                '../assets/Egitim/04c06dcd936bdd82c983675135a780a4.jpg',
                '../assets/Egitim/0536fda396b1dd3e7c6d86ddbf78cabb.jpg',
                '../assets/Egitim/09e6636b483931980e64636984cc457f.jpg',
                '../assets/Egitim/11e9105f8abb2eac92d415adb3f7e71c.jpg',
                '../assets/Egitim/2981341e9909ac56263e681ad2e9a718.jpg',
                '../assets/Egitim/3d41e551dae5d3e6a4dc3676769bea7d.jpg',
                '../assets/Egitim/432630d917f4c08f9e95a2343bf792c7.jpg',
                '../assets/Egitim/6d2069df4e96108cce64c2f9433bfee9.jpg',
                '../assets/Egitim/76e38caa5116391b0cfea3c464e74383.jpg',
                '../assets/Egitim/8ab02d16fe2c7ff0c84c186b4198f9ac.jpg',
                '../assets/Egitim/8d0dc8e9131dee943e5aea359cbf78a5.jpg',
                '../assets/Egitim/90ae68953338f386028bb02ad95ff809.jpg',
                '../assets/Egitim/98220edce909476f12ac055691c84b93.jpg',
                '../assets/Egitim/9c923e76ef26dc3c907d52bbcdc2e353.jpg',
                '../assets/Egitim/b2b496447033c5c365f87982d12490e6.jpg',
                '../assets/Egitim/d393d9d309d6f71bc6b6eed031933f9a.jpg',
                '../assets/Egitim/d9e028f71b71a4356899d7e23d08ead7.jpg',
                '../assets/Egitim/f854ea95d19b00b59388fc2356f87de7.jpg'
            ],
            social: [
                '../assets/Sosyal Hayat/28301b5d16d0fd6e2ec3c9c6f2451bf4.jpg',
                '../assets/Sosyal Hayat/2f9d515dd7b2bb42d4aafa213dc95e6c.jpg',
                '../assets/Sosyal Hayat/35df4ce604621b0aa8fb7e194da210b9.jpg',
                '../assets/Sosyal Hayat/45763b08a7183aec0fe039d131526b44.jpg',
                '../assets/Sosyal Hayat/45ba66f15c0fec62827cd0bd38a17f54.jpg',
                '../assets/Sosyal Hayat/4b15e6a28870a5cbce622262d25b02a5.jpg',
                '../assets/Sosyal Hayat/4b59dffab674adcc8f3e775ef1a9eb23.jpg',
                '../assets/Sosyal Hayat/5131849648e8f2690312999bfa168f67.jpg',
                '../assets/Sosyal Hayat/64dbf61465d7ee9e43819efb8d3af083.jpg',
                '../assets/Sosyal Hayat/74e2893fac3fb682835ebf1c708f4880.jpg',
                '../assets/Sosyal Hayat/8526d98b816a2c695cad21a443362887.jpg',
                '../assets/Sosyal Hayat/88dcc3f9ca08fda20703c4b74dd239b5.jpg',
                '../assets/Sosyal Hayat/8eacda2f1458a422aa89da22c7f380b1.jpg',
                '../assets/Sosyal Hayat/a760db320f5142e7507c04fa7be987f4.jpg',
                '../assets/Sosyal Hayat/c445fda6a68ac4209361b80fd21b6d54.jpg',
                '../assets/Sosyal Hayat/c7f6dc39dd07076d013c33741b49065f.jpg',
                '../assets/Sosyal Hayat/d76ad7e9b55c1d0895bdbcc6f48c4bc8.jpg',
                '../assets/Sosyal Hayat/e7e8c897b5251ddb170492e69ef6cd90.jpg',
                '../assets/Sosyal Hayat/eeac1639ffb914b607936c774c14d2dc.jpg'
            ],
            '2026': [
                '../assets/2026/b746484163aa8cd92a4ab2b8ab521d78.jpg',
                '../assets/2026/f8371ba6d4af29247ea5d5d93f63e2db.jpg'
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
        if (!this.assetsGrid) return;
        this.assetsGrid.innerHTML = '';
        const images = this.assets[category] || [];

        images.forEach(src => {
            const item = document.createElement('div');
            item.className = 'asset-item';
            item.draggable = true;
            item.innerHTML = `<img src="${src}" alt="${category}">`;
            item.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', src));
            item.addEventListener('click', () => this.dragDropManager.addImageToBoard(src));
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
        const addUrl = () => {
            const url = urlInput.value.trim();
            if (url) {
                this.dragDropManager.addImageToBoard(url);
                urlInput.value = '';
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
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    new VisionBoard();
});

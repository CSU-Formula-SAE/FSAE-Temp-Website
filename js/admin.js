
document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    let appData = loadData();

    // --- Login Logic ---
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginBtn = document.getElementById('login-btn');
    const passInput = document.getElementById('admin-pass');
    const errorMsg = document.getElementById('login-error');

    loginBtn.onclick = checkPassword;
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    async function checkPassword() {
        const input = passInput.value;
        // Hash for 'admin123'
        const correctHash = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

        const hash = await sha256(input);

        if (hash === correctHash) {
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            initDashboard();
        } else {
            errorMsg.classList.remove('hidden');
        }
    }

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // --- Data Functions ---

    function loadData() {
        const stored = localStorage.getItem('formulaVikesData');
        if (stored) {
            return JSON.parse(stored);
        }
        return window.initialAppData; // from data.js
    }

    function saveData(newData) {
        try {
            localStorage.setItem('formulaVikesData', JSON.stringify(newData));
            appData = newData; // update local state
            renderEditors(appData); // re-render to show updates
            alert('Changes Saved!');
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('Storage Limit Exceeded! The images are too large for Local Storage. Please use smaller images or external URLs.');
            } else {
                alert('Error saving data: ' + e.message);
            }
        }
    }

    // --- Dashboard Logic ---

    function initDashboard() {
        renderEditors(appData);

        document.getElementById('save-all-btn').onclick = () => {
            const newData = scrapeAdminData();
            saveData(newData);
        };

        document.getElementById('export-btn').onclick = () => {
            const json = JSON.stringify(appData, null, 2);
            console.log(json);
            alert('Data logged to console and copied to clipboard!');
            navigator.clipboard.writeText(json);
        };
    }

    // --- Editor Rendering ---

    function renderEditors(data) {
        // Leadership
        const leadList = document.getElementById('admin-leadership-list');
        leadList.innerHTML = data.leadership.map((item, index) => createPersonRow(item, index, 'leadership')).join('');

        // Dept Leads
        const deptList = document.getElementById('admin-dept-list');
        deptList.innerHTML = data.departmentLeads.map((item, index) => createPersonRow(item, index, 'departmentLeads')).join('');

        // Sponsors
        const sponsorList = document.getElementById('admin-sponsor-list');
        sponsorList.innerHTML = data.sponsors.map((item, index) => createSponsorRow(item, index)).join('');

        // Updates
        const updatesList = document.getElementById('admin-updates-list');
        updatesList.innerHTML = data.updates.map((url, index) => createUpdateRow(url, index)).join('');

        // Add delete listeners
        addDeleteListeners();
        // Add Drag & Drop listeners
        addDragAndDropListeners();
    }

    function createPersonRow(item, index, type) {
        return `
            <div class="flex gap-4 items-start bg-primary-bg p-4 rounded border border-white/5" data-type="${type}" data-index="${index}">
                <div class="flex-1 space-y-2">
                    <input type="text" value="${item.name}" placeholder="Name" class="w-full bg-black/50 border border-white/10 p-2 rounded text-white item-name" />
                    <input type="text" value="${item.role}" placeholder="Role" class="w-full bg-black/50 border border-white/10 p-2 rounded text-white item-role" />
                    <input type="text" value="${item.image}" placeholder="Image URL / Path" class="w-full bg-black/50 border border-white/10 p-2 rounded text-gray-400 text-sm item-image" />
                </div>
                <div class="w-24 h-24 bg-black/50 rounded overflow-hidden drop-zone relative cursor-pointer border-2 border-transparent hover:border-vikes-green-neon transition-all" title="Drag & Drop Image Here">
                    <img src="${item.image}" class="w-full h-full object-cover pointer-events-none" />
                    <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity text-xs text-white text-center pointer-events-none">Drop Image</div>
                </div>
                <button class="text-red-500 hover:text-red-300 font-bold delete-btn px-2">X</button>
            </div>
        `;
    }

    function createSponsorRow(item, index) {
        return `
            <div class="flex gap-4 items-start bg-primary-bg p-4 rounded border border-white/5" data-type="sponsors" data-index="${index}">
                <div class="flex-1 space-y-2">
                    <input type="text" value="${item.name}" placeholder="Sponsor Name" class="w-full bg-black/50 border border-white/10 p-2 rounded text-white item-name" />
                    <input type="text" value="${item.glowColor}" placeholder="Glow Color (rgba...)" class="w-full bg-black/50 border border-white/10 p-2 rounded text-white item-glow" />
                    <input type="text" value="${item.image}" placeholder="Logo URL / Path" class="w-full bg-black/50 border border-white/10 p-2 rounded text-gray-400 text-sm item-image" />
                </div>
                 <div class="w-24 h-16 bg-black/50 rounded flex items-center justify-center drop-zone relative cursor-pointer border-2 border-transparent hover:border-vikes-green-neon transition-all" title="Drag & Drop Image Here">
                    <img src="${item.image}" class="max-w-full max-h-full pointer-events-none" />
                    <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity text-xs text-white text-center pointer-events-none">Drop Image</div>
                </div>
                <button class="text-red-500 hover:text-red-300 font-bold delete-btn px-2">X</button>
            </div>
        `;
    }

    function createUpdateRow(url, index) {
        return `
             <div class="flex gap-4 items-center bg-primary-bg p-4 rounded border border-white/5" data-type="updates" data-index="${index}">
                 <div class="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0">
                     <img src="images/Soical_icon/Instagram_Glyph_Gradient.svg" class="w-5 h-5" alt="Instagram" />
                 </div>
                 <input type="text" value="${url}" placeholder="Instagram Post Link (https://www.instagram.com/p/...)" class="flex-1 bg-black/50 border border-white/10 p-2.5 rounded text-white text-sm item-url focus:border-vikes-green-neon outline-none" />
                 <a href="${url}" target="_blank" class="text-xs text-vikes-green-neon hover:underline shrink-0 px-2.5 py-1.5 rounded bg-white/5 border border-white/10 font-mono flex items-center gap-1">Test Link ↗</a>
                 <button class="text-red-500 hover:text-red-300 font-bold delete-btn px-2">X</button>
             </div>
        `;
    }

    function addDeleteListeners() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = (e) => {
                const row = e.target.closest('div[data-type]');
                if (confirm('Delete this item?')) {
                    const type = row.dataset.type;
                    const index = parseInt(row.dataset.index);

                    if (type === 'updates') {
                        appData.updates.splice(index, 1);
                    } else {
                        appData[type].splice(index, 1);
                    }
                    renderEditors(appData);
                }
            };
        });
    }

    function addDragAndDropListeners() {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            const row = zone.closest('div[data-type]');
            const input = row.querySelector('.item-image') || row.querySelector('.item-url');
            const img = zone.querySelector('img');

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('border-vikes-green-neon', 'bg-white/10');
            });

            zone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                zone.classList.remove('border-vikes-green-neon', 'bg-white/10');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('border-vikes-green-neon', 'bg-white/10');

                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (!file.type.startsWith('image/')) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const base64 = e.target.result;
                        input.value = base64;
                        img.src = base64;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // Exposed global function for onclick handlers in HTML
    window.addItem = function (type) {
        if (type === 'leadership' || type === 'departmentLeads') {
            appData[type].push({ name: 'New Person', role: 'Role', image: 'https://placehold.co/400' });
        } else if (type === 'sponsors') {
            appData[type].push({ name: 'New Sponsor', image: 'https://placehold.co/200x100', glowColor: 'rgba(255,255,255,0.5)' });
        } else if (type === 'updates') {
            appData.updates.push('https://www.instagram.com/p/Dcv7xipNC5q/');
        }
        renderEditors(appData);
    }

    function scrapeAdminData() {
        const newData = {
            leadership: [],
            departmentLeads: [],
            sponsors: [],
            updates: []
        };

        document.querySelectorAll('#admin-leadership-list > div').forEach(row => {
            newData.leadership.push({
                name: row.querySelector('.item-name').value,
                role: row.querySelector('.item-role').value,
                image: row.querySelector('.item-image').value,
            });
        });

        document.querySelectorAll('#admin-dept-list > div').forEach(row => {
            newData.departmentLeads.push({
                name: row.querySelector('.item-name').value,
                role: row.querySelector('.item-role').value,
                image: row.querySelector('.item-image').value,
            });
        });

        document.querySelectorAll('#admin-sponsor-list > div').forEach(row => {
            newData.sponsors.push({
                name: row.querySelector('.item-name').value,
                glowColor: row.querySelector('.item-glow').value,
                image: row.querySelector('.item-image').value,
            });
        });

        document.querySelectorAll('#admin-updates-list > div').forEach(row => {
            newData.updates.push(row.querySelector('.item-url').value);
        });

        return newData;
    }

});


document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Data
    let appData = loadData();

    // 2. Initial Render
    renderAll(appData);

    // 3. Admin logic is now in admin.html


    // --- Data Functions ---

    function loadData() {
        const stored = localStorage.getItem('formulaVikesData');
        if (stored) {
            return JSON.parse(stored);
        }
        return window.initialAppData; // from data.js
    }

    function saveData(newData) {
        localStorage.setItem('formulaVikesData', JSON.stringify(newData));
        appData = newData;
        renderAll(appData);
        alert('Changes Saved!');
    }

    function renderAll(data) {
        renderLeadership(data.leadership);
        renderDepartmentLeads(data.departmentLeads);
        renderSponsors(data.sponsors);
        renderUpdates(data.updates);
    }

    // --- Render Functions ---

    function renderLeadership(items) {
        const container = document.getElementById('leadership-container');
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="bg-primary-bg p-6 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 hover:border-vikes-green-neon transition-colors group">
                <img src="${item.image}" class="w-full h-64 rounded-md mb-4 object-cover grayscale group-hover:grayscale-0 transition-all" alt="${item.name}" />
                <h3 class="text-2xl font-semibold text-white">${item.name}</h3>
                <p class="text-vikes-green-neon">${item.role}</p>
            </div>
        `).join('');
    }

    function renderDepartmentLeads(items) {
        const container = document.getElementById('dept-leads-container');
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="text-center group">
                <div class="w-24 h-24 rounded-full mx-auto bg-primary-bg flex items-center justify-center border border-white/10 group-hover:border-vikes-green-neon transition-colors">
                    <img src="${item.image}" class="w-full h-full rounded-full object-cover" alt="${item.name}" />
                </div>
                <h3 class="text-lg text-white font-semibold mt-4">${item.name}</h3>
                <p class="text-gray-500">${item.role}</p>
            </div>
        `).join('');
    }

    function renderSponsors(items) {
        const container = document.getElementById('sponsors-container');
        if (!container) return;

        // Helper to adjust alpha for hover effect (simple string replacement since format is known in data.js)
        const getHoverColor = (color) => color.replace('0.45', '0.8').replace('0.5', '0.8');

        let html = items.map(item => {
            const hoverColor = getHoverColor(item.glowColor);
            return `
            <div class="group relative rounded-xl overflow-hidden bg-secondary-bg shadow-[0_0_30px_${item.glowColor}] hover:shadow-[0_0_50px_${hoverColor}] transition-all duration-500 border border-white/10 hover:border-white/30 cursor-pointer h-64 flex flex-col">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-90"></div>
                
                <div class="flex-1 flex items-center justify-center p-6 z-0">
                    <img src="${item.image}" alt="${item.name}" class="max-w-full max-h-32 object-contain transform group-hover:scale-105 transition-transform duration-700 ${item.classes || ''}" />
                </div>

                <div class="absolute bottom-0 left-0 p-6 z-20 w-full">
                    <span class="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1 block drop-shadow-md">Sponsor</span>
                    <h3 class="text-white text-lg font-black uppercase tracking-tighter drop-shadow-xl truncate">${item.name}</h3>
                </div>
            </div>
            `;
        }).join('');

        // Placeholder card
        const placeholderColor = 'rgba(194,24,7,0.45)';
        const placeholderHover = 'rgba(194,24,7,0.8)';
        html += `
            <div class="group relative rounded-xl overflow-hidden bg-secondary-bg shadow-[0_0_30px_${placeholderColor}] hover:shadow-[0_0_50px_${placeholderHover}] transition-all duration-500 border border-white/10 hover:border-white/30 cursor-pointer h-64 flex flex-col">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-90"></div>
                
                <div class="flex-1 flex items-center justify-center p-6 z-0">
                    <span class="text-gray-500 text-sm font-bold">[ YOUR LOGO ]</span>
                </div>

                <div class="absolute bottom-0 left-0 p-6 z-20 w-full">
                    <span class="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1 block drop-shadow-md">Future Sponsor</span>
                     <h3 class="text-white text-lg font-black uppercase tracking-tighter drop-shadow-xl truncate">Join Us</h3>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    function renderUpdates(images) {
        const container = document.querySelector('.swiper-wrapper');
        if (!container) return;
        if (!images || !Array.isArray(images) || images.length === 0) return;
        container.innerHTML = images.map((img, idx) => `
            <div class="swiper-slide relative rounded-xl overflow-hidden group/slide">
                <img src="${img}" class="w-full h-80 sm:h-96 object-cover transform group-hover/slide:scale-105 transition-transform duration-700" alt="Update ${idx + 1}" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                    
                    <span class="text-gray-300 drop-shadow">CSU Formula SAE</span>
                </div>
            </div>
        `).join('');

        if (window.mySwiperInstance) {
            window.mySwiperInstance.update();
        }
    }


    // --- Admin Logic ---

    function checkHash() {
        if (window.location.hash === '#admin') {
            showLoginModal();
        } else {
            document.getElementById('admin-modal')?.remove();
            document.getElementById('admin-dashboard')?.remove();
        }
    }

    function showLoginModal() {
        if (document.getElementById('admin-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'admin-modal';
        modal.className = 'fixed inset-0 bg-black/90 z-[100] flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-secondary-bg p-8 rounded-lg border border-vikes-green shadow-[0_0_50px_rgba(1,107,77,0.5)] max-w-sm w-full text-center">
                <h2 class="text-2xl font-bold text-white mb-6">Admin Access</h2>
                <input type="password" id="admin-pass" placeholder="Enter Password" class="w-full p-3 mb-4 bg-primary-bg border border-white/20 rounded text-white focus:border-vikes-green-neon outline-none" />
                <button id="admin-login-btn" class="w-full bg-vikes-green-neon text-black font-bold py-3 rounded hover:bg-white transition-colors">Login</button>
                <button id="admin-cancel-btn" class="mt-4 text-gray-400 hover:text-white text-sm underline">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('admin-login-btn').onclick = () => {
            const pass = document.getElementById('admin-pass').value;
            if (pass === 'admin123') { // Simple hardcoded password
                modal.remove();
                showAdminDashboard();
            } else {
                alert('Incorrect Password');
            }
        };

        document.getElementById('admin-cancel-btn').onclick = () => {
            window.location.hash = '';
        };
    }

    function showAdminDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'admin-dashboard';
        dashboard.className = 'fixed inset-0 bg-black/95 z-[100] overflow-y-auto p-6';
        dashboard.innerHTML = `
            <div class="container mx-auto relative">
                <div class="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h1 class="text-4xl font-bold text-vikes-green-neon">Admin Dashboard</h1>
                    <div class="space-x-4">
                        <button id="export-btn" class="text-vikes-green hover:text-white border border-vikes-green px-4 py-2 rounded">Export Data (JSON)</button>
                        <button id="close-admin" class="text-red-500 hover:text-red-400 font-bold px-4 py-2">Close X</button>
                    </div>
                </div>

                <!-- Sections -->
                <div class="space-y-12">
                    
                    <!-- Leadership -->
                    <div class="bg-secondary-bg p-6 rounded-lg border border-white/10">
                        <h2 class="text-2xl font-bold text-white mb-4">Leadership & Leads</h2>
                        <div id="admin-leadership-list" class="space-y-4"></div>
                        <button id="add-leader-btn" class="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">+ Add Leader</button>
                    </div>

                    <!-- Dept Leads -->
                    <div class="bg-secondary-bg p-6 rounded-lg border border-white/10">
                        <h2 class="text-2xl font-bold text-white mb-4">Department Leads</h2>
                        <div id="admin-dept-list" class="space-y-4"></div>
                        <button id="add-dept-btn" class="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">+ Add Dept Lead</button>
                    </div>

                    <!-- Sponsors -->
                    <div class="bg-secondary-bg p-6 rounded-lg border border-white/10">
                        <h2 class="text-2xl font-bold text-white mb-4">Sponsors</h2>
                        <div id="admin-sponsor-list" class="space-y-4"></div>
                        <button id="add-sponsor-btn" class="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">+ Add Sponsor</button>
                    </div>

                     <!-- Updates -->
                    <div class="bg-secondary-bg p-6 rounded-lg border border-white/10">
                        <h2 class="text-2xl font-bold text-white mb-4">Updates (Slideshow)</h2>
                        <div id="admin-updates-list" class="space-y-4"></div>
                        <button id="add-update-btn" class="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">+ Add Update Image</button>
                    </div>

                    <!-- Save Actions -->
                    <div class="fixed bottom-6 right-6 flex gap-4">
                         <button id="save-all-btn" class="bg-vikes-green-neon text-black font-black text-xl px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,255,127,0.4)] hover:scale-105 transition-transform">SAVE CHANGES</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dashboard);

        // Render Editors
        renderEditors(appData);

        // Event Listeners
        document.getElementById('close-admin').onclick = () => window.location.hash = '';
        document.getElementById('save-all-btn').onclick = () => {
            const newData = scrapeAdminData();
            saveData(newData);
        };
        document.getElementById('export-btn').onclick = () => {
            const json = JSON.stringify(appData, null, 2);
            console.log(json);
            alert('Data logged to console (copy it from there) and copied to clipboard!');
            navigator.clipboard.writeText(json);
        };

        // Add Button Listeners
        document.querySelector('#add-leader-btn').onclick = () => addItem('leadership');
        document.querySelector('#add-dept-btn').onclick = () => addItem('departmentLeads');
        document.querySelector('#add-sponsor-btn').onclick = () => addItem('sponsors');
        document.querySelector('#add-update-btn').onclick = () => addItem('updates');

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
    }

    function createPersonRow(item, index, type) {
        return `
            <div class="flex gap-4 items-start bg-primary-bg p-4 rounded border border-white/5" data-type="${type}" data-index="${index}">
                <div class="flex-1 space-y-2">
                    <input type="text" value="${item.name}" placeholder="Name" class="w-full bg-black/50 border border-white/10 p-2 rounded text-white item-name" />
                    <input type="text" value="${item.role}" placeholder="Role" class="w-full bg-black/50 border border-white/10 p-2 rounded text-white item-role" />
                    <input type="text" value="${item.image}" placeholder="Image URL / Path" class="w-full bg-black/50 border border-white/10 p-2 rounded text-gray-400 text-sm item-image" />
                </div>
                <div class="w-24 h-24 bg-black/50 rounded overflow-hidden">
                    <img src="${item.image}" class="w-full h-full object-cover" />
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
                 <div class="w-24 h-16 bg-black/50 rounded flex items-center justify-center">
                    <img src="${item.image}" class="max-w-full max-h-full" />
                </div>
                <button class="text-red-500 hover:text-red-300 font-bold delete-btn px-2">X</button>
            </div>
        `;
    }

    function createUpdateRow(url, index) {
        return `
             <div class="flex gap-4 items-center bg-primary-bg p-4 rounded border border-white/5" data-type="updates" data-index="${index}">
                 <input type="text" value="${url}" placeholder="Image URL / Path" class="flex-1 bg-black/50 border border-white/10 p-2 rounded text-white item-url" />
                 <div class="w-24 h-16 bg-black/50 rounded overflow-hidden">
                    <img src="${url}" class="w-full h-full object-cover" />
                </div>
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

                    // Direct delete from current appData to re-render properly without saving yet? 
                    // Or just remove element? Better to update state & re-render admin.
                    if (type === 'updates') {
                        appData.updates.splice(index, 1);
                    } else {
                        appData[type].splice(index, 1);
                    }
                    renderEditors(appData); // Re-render admin view
                }
            };
        });
    }

    function addItem(type) {
        if (type === 'leadership' || type === 'departmentLeads') {
            appData[type].push({ name: 'New Person', role: 'Role', image: 'https://placehold.co/400' });
        } else if (type === 'sponsors') {
            appData[type].push({ name: 'New Sponsor', image: 'https://placehold.co/200x100', glowColor: 'rgba(255,255,255,0.5)' });
        } else if (type === 'updates') {
            appData.updates.push('https://placehold.co/600x400');
        }
        renderEditors(appData);
    }

    function scrapeAdminData() {
        // Construct new data object from DOM inputs
        const newData = {
            leadership: [],
            departmentLeads: [],
            sponsors: [],
            updates: []
        };

        // Scrape Leadership
        document.querySelectorAll('#admin-leadership-list > div').forEach(row => {
            newData.leadership.push({
                name: row.querySelector('.item-name').value,
                role: row.querySelector('.item-role').value,
                image: row.querySelector('.item-image').value,
            });
        });

        // Scrape Dept Leads
        document.querySelectorAll('#admin-dept-list > div').forEach(row => {
            newData.departmentLeads.push({
                name: row.querySelector('.item-name').value,
                role: row.querySelector('.item-role').value,
                image: row.querySelector('.item-image').value,
            });
        });

        // Scrape Sponsors
        document.querySelectorAll('#admin-sponsor-list > div').forEach(row => {
            newData.sponsors.push({
                name: row.querySelector('.item-name').value,
                glowColor: row.querySelector('.item-glow').value,
                image: row.querySelector('.item-image').value,
            });
        });

        // Scrape Updates
        document.querySelectorAll('#admin-updates-list > div').forEach(row => {
            newData.updates.push(row.querySelector('.item-url').value);
        });

        return newData;
    }

});

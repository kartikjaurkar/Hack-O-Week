// --- Data Management ---
// Initialize storage if empty
if (!localStorage.getItem('registrations')) localStorage.setItem('registrations', JSON.stringify([]));
if (!localStorage.getItem('accounts')) localStorage.setItem('accounts', JSON.stringify([]));

// --- Utility Functions ---
const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `show ${type}`;
    setTimeout(() => { toast.className = ''; }, 3000);
};

const getData = (key) => JSON.parse(localStorage.getItem(key));
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- Registration Logic ---
document.getElementById('registrationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dept = document.getElementById('dept').value;
    const event = document.getElementById('event').value;

    if (!name || !email || !phone || !dept || !event) {
        return showToast("Please fill all registration fields", "error");
    }

    const registrations = getData('registrations');
    registrations.push({ name, email, phone, dept, event, id: Date.now() });
    saveData('registrations', registrations);

    showToast("Registration Successful!");
    e.target.reset();
    updateAdminDashboard();
});

// --- Account Creation Logic ---
document.getElementById('accountForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (pass !== confirm) return showToast("Passwords do not match!", "error");
    if (pass.length < 6) return showToast("Password must be 6+ chars", "error");

    const accounts = getData('accounts');
    if (accounts.find(a => a.user === user)) return showToast("Username already exists", "error");

    accounts.push({ user, pass, id: Date.now() });
    saveData('accounts', accounts);

    showToast("Account created successfully!");
    e.target.reset();
    updateAdminDashboard();
});

// --- Admin Panel Logic ---
function toggleAdmin() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    if (panel.style.display === 'block') updateAdminDashboard();
}

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

function updateAdminDashboard() {
    const regs = getData('registrations');
    const accs = getData('accounts');

    // Update Stats
    document.getElementById('statsRow').innerHTML = `
        <div class="stat-card"><div class="num">${regs.length}</div><div class="lbl">Registrations</div></div>
        <div class="stat-card"><div class="num">${accs.length}</div><div class="lbl">User Accounts</div></div>
    `;

    // Render Registration Table
    const regTable = document.getElementById('regTable');
    if (regs.length === 0) {
        regTable.innerHTML = '<p class="no-data">No registrations found.</p>';
    } else {
        let html = `<table><thead><tr><th>Name</th><th>Event</th><th>Dept</th></tr></thead><tbody>`;
        regs.forEach(r => {
            html += `<tr><td>${r.name}</td><td><span class="badge badge-blue">${r.event}</span></td><td>${r.dept}</td></tr>`;
        });
        html += `</tbody></table>`;
        regTable.innerHTML = html;
    }

    // Render Accounts Table
    const accTable = document.getElementById('accTable');
    if (accs.length === 0) {
        accTable.innerHTML = '<p class="no-data">No accounts found.</p>';
    } else {
        let html = `<table><thead><tr><th>Username</th><th>Account ID</th></tr></thead><tbody>`;
        accs.forEach(a => {
            html += `<tr><td>${a.user}</td><td><span class="badge badge-green">#${a.id.toString().slice(-5)}</span></td></tr>`;
        });
        html += `</tbody></table>`;
        accTable.innerHTML = html;
    }
}

function clearData(type) {
    if (confirm(`Are you sure you want to delete all ${type}?`)) {
        localStorage.setItem(type, JSON.stringify([]));
        updateAdminDashboard();
        showToast(`${type} cleared`, "error");
    }
}

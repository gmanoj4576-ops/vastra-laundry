import '/style.css';
import { api } from '../api.js';

const adminState = {
  user: null,
  view: 'dashboard', // dashboard, users, finance, logistics, past-orders
  authMode: 'login', // login or signup
  orders: [],
  partners: [],
  users: [],
  selectedOrder: null,
  selectedUser: null,
  selectedOrderIds: [], // For bulk selection
  showRegisterModal: false,
  userTab: 'all', // all, customers, logistics, admins
  sidebarOpen: false
};

// --- Custom Theme ---
const themeStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    :root {
      --bg-dark: #0f172a;
      --bg-card: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #3b82f6;
      --accent-glow: rgba(59, 130, 246, 0.4);
      --border: #334155;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --sidebar-width: 260px;
    }
    body {
      background: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      margin: 0;
      overflow-x: hidden;
    }
    .dark-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .dark-input {
      background: #0f172a;
      border: 1px solid var(--border);
      color: var(--text-main);
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    }
    .dark-input:focus { border-color: var(--accent); box-shadow: 0 0 8px var(--accent-glow); }
    .dark-btn {
      background: var(--accent);
      color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%;
    }
    .dark-btn:hover { background: #2563eb; box-shadow: 0 0 15px var(--accent-glow); }
    .dark-btn.success { background: var(--success); }
    .dark-btn.danger { background: var(--danger); box-shadow: 0 0 10px rgba(239,68,68,0.2); }
    
    .sidebar-link { transition: all 0.2s; }
    .sidebar-link:hover { background: rgba(59, 130, 246, 0.1) !important; }
    .sidebar-link.active { background: rgba(59, 130, 246, 0.15) !important; border-left: 3px solid var(--accent) !important; color: white !important; }

    .responsive-table-container { width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th { background: #0f172a; color: var(--text-muted); font-weight: 500; font-size: 12px; padding: 16px; border-bottom: 1px solid var(--border); text-align: left;}
    td { padding: 16px; border-bottom: 1px solid var(--border); color: var(--text-main); font-size: 14px; }
    tr.clickable:hover td { background: rgba(255,255,255,0.05); cursor: pointer; }
    
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .modal-content {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 30px; position: relative;
    }
    .close-btn {
      position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: var(--text-muted); font-size: 24px; cursor: pointer;
    }

    .hamburger { display: none; background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; z-index: 100; }

    @media (max-width: 768px) {
      .hamburger { display: block; }
      .sidebar { 
        transform: translateX(-100%); 
        transition: transform 0.3s ease;
        box-shadow: 10px 0 30px rgba(0,0,0,0.5);
      }
      .sidebar.open { transform: translateX(0); }
      .main-content { margin-left: 0 !important; }
      .stats-grid { grid-template-columns: 1fr !important; }
      .modal-content { padding: 20px; }
      .auth-card { margin: 20px; }
    }

    .toast {
      position: fixed; bottom: 20px; right: 20px; background: var(--bg-card); border: 1px solid var(--accent); color: white; padding: 12px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: translateY(100px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .toast.show { transform: translateY(0); }
    
    /* Autofill and Typing Fix for Dark Mode */
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: white !important;
      -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
      transition: background-color 5000s ease-in-out 0s;
      caret-color: white !important;
    }
    
    input {
      color: white !important;
      background-color: #0f172a !important;
      caret-color: white !important;
    }
    
    input::placeholder { color: rgba(255,255,255,0.4) !important; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    
    @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

    .modal-overlay {
      position: fixed; inset: 0; 
      background: rgba(15, 23, 42, 0.7); 
      backdrop-filter: blur(12px); 
      z-index: 1000; 
      display: flex; align-items: center; justify-content: center; padding: 20px;
      opacity: 0; animation: overlayIn 0.3s forwards;
    }
    .modal-content {
      background: var(--bg-card); 
      border: 1px solid var(--accent); 
      border-radius: 20px; 
      width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 35px; 
      position: relative;
      transform: scale(0.9); box-shadow: 0 0 40px var(--accent-glow);
      animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes overlayIn { to { opacity: 1; } }
    @keyframes modalIn { to { transform: scale(1); } }
    
    .status-pill { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-pending { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
    .status-assigned { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
    .status-completed { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
  </style>
`;

const showCustomAlert = (title, message, type = 'info') => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content animate-fade-in" style="max-width: 400px; text-align: center;">
      <div style="font-size: 50px; margin-bottom: 20px;">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}
      </div>
      <h2 style="margin: 0 0 10px 0; color: white;">${title}</h2>
      <p style="color: var(--text-muted); margin-bottom: 25px; line-height: 1.5;">${message}</p>
      <button class="dark-btn" id="close-alert-btn" style="width: 100%; padding: 12px;">Understood</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('close-alert-btn').onclick = () => overlay.remove();
};

const showToast = (msg) => {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 100);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3000);
};

// --- Authentication Flow ---
const renderAuth = () => {
  return `
    ${themeStyles}
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop') center/cover; position: relative;">
      <div style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px);"></div>
      <div class="auth-card dark-card animate-fade-in" style="width: 100%; max-width: 420px; text-align: center; position: relative; z-index: 1; border: 1px solid var(--accent);">
        <div style="margin-bottom: 30px;">
          <h1 style="color: var(--text-main); margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1.5px;">VASTRA<span style="color: var(--accent)">GOD</span></h1>
          <div style="height: 2px; width: 60px; background: var(--accent); margin: 10px auto;"></div>
          <p style="color: var(--text-muted); font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Overlord Terminal Login</p>
        </div>
        
        <form id="admin-auth-form" style="display: flex; flex-direction: column; gap: 20px;">
          <div style="text-align: left;">
            <label style="color: var(--text-muted); font-size: 11px; font-weight: bold; margin-bottom: 5px; display: block;">MOBILE IDENTIFIER</label>
            <input type="text" id="admin-mobile" placeholder="Enter Mobile Number" required class="dark-input" style="font-size: 16px;">
          </div>
          <div style="text-align: left;">
            <label style="color: var(--text-muted); font-size: 11px; font-weight: bold; margin-bottom: 5px; display: block;">MASTER PASSWORD</label>
            <input type="password" id="admin-password" placeholder="••••••••" required class="dark-input" style="font-size: 16px;">
          </div>
          
          <button type="submit" class="dark-btn" id="auth-submit-btn" style="margin-top: 10px; font-size: 15px; height: 50px;">
            AUTHENTICATE OVERRIDE
          </button>
        </form>
        
        <p id="admin-error" style="color: var(--danger); margin-top: 20px; font-size: 13px; font-family: monospace; display: none; padding: 10px; border: 1px dashed var(--danger); border-radius: 4px;"></p>
        
        <div style="margin-top: 40px; border-top: 1px solid var(--border); padding-top: 20px;">
            <p style="color: #475569; font-size: 11px; font-weight: 500;">
              AUTHORIZED PERSONNEL ONLY. ALL ACTIONS ARE LOGGED.
            </p>
        </div>
      </div>
    </div>
  `;
};

// --- Modals ---
const renderTrackingModal = () => {
  const order = adminState.selectedOrder;
  if (!order) return '';

  const assignedAgent = adminState.partners.find(p => p.mobile === order.assignedPartner || p.mobile === order.deliveryAgent);
  const customer = adminState.users.find(u => u.mobile === order.userMobile || u.email === order.userEmail);

  return `
    <div class="modal-overlay animate-fade-in" id="tracking-modal" style="display: flex;">
      <div class="modal-content" style="max-width: 800px;">
        <button class="close-btn" id="close-tracking-modal">&times;</button>
        <h2 style="margin-top: 0; color: white; display: flex; align-items: center; gap: 10px;">
          <span style="background: var(--accent); padding: 5px 12px; border-radius: 6px; font-size: 14px;">INTEL</span>
          Order Operation Details
        </h2>
        
        <div style="display: flex; gap: 10px; margin-bottom: 25px;">
            <span style="background: rgba(59,130,246,0.1); color: var(--accent); padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; border: 1px solid var(--accent);">
                ID: ${order._id.toUpperCase()}
            </span>
            <span style="background: rgba(16,185,129,0.1); color: var(--success); padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; border: 1px solid var(--success);">
                STATUS: ${order.status.toUpperCase()}
            </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 25px;">
            <div style="background: rgba(15, 23, 42, 0.5); padding: 20px; border-radius: 12px; border: 1px solid var(--border);">
                <h4 style="color: var(--text-muted); margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Customer Intelligence</h4>
                <div style="color: white; font-weight: 700; font-size: 16px;">${customer?.name || 'Unknown User'}</div>
                <div style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">📞 ${order.userMobile || customer?.mobile || 'No Phone'}</div>
                <div style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">📧 ${order.userEmail || customer?.email || 'No Email'}</div>
                <div style="color: white; font-size: 13px; margin-top: 10px; padding-top: 10px; border-top: 1px dotted var(--border);">📍 ${order.address || 'Standard Address'}</div>
            </div>
            
            <div style="background: rgba(15, 23, 42, 0.5); padding: 20px; border-radius: 12px; border: 1px solid var(--border);">
                <h4 style="color: var(--text-muted); margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Fleet Deployment</h4>
                ${assignedAgent ? `
                    <div style="color: white; font-weight: 700; font-size: 16px;">${assignedAgent.name}</div>
                    <div style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">📞 ${assignedAgent.mobile}</div>
                ` : `<div style="color: var(--danger); font-weight: bold; margin-top: 10px; display: flex; align-items: center; gap: 8px;">
                      <span style="display:inline-block; width:8px; height:8px; background:var(--danger); border-radius:50%; animate: pulse 1s infinite;"></span>
                      UNASSIGNED
                    </div>`}
            </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.5); padding: 20px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 25px;">
            <h4 style="color: var(--text-muted); margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Inventory Manifest</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${order.items && order.items.length > 0 ? order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 10px 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                        <div>
                            <div style="color: white; font-weight: 600;">${item.itemName} (${item.quantity}x)</div>
                            <div style="color: var(--text-muted); font-size: 11px;">${item.serviceName}</div>
                        </div>
                        <div style="color: var(--success); font-weight: bold;">₹${item.price * item.quantity}</div>
                    </div>
                `).join('') : `
                    <div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 10px;">No manifest items listed.</div>
                `}
            </div>
            <div style="margin-top: 15px; text-align: right; padding-top: 15px; border-top: 1px solid var(--border);">
                <span style="color: var(--text-muted); margin-right: 15px;">TOTAL GROSS VALUE:</span>
                <span style="color: var(--success); font-size: 20px; font-weight: 900;">₹${order.totalAmount}</span>
            </div>
        </div>

        <h4 style="color: var(--text-muted); font-size: 12px; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px;">Satellite Link - Live Tracking</h4>
        ${order.currentLocation && order.currentLocation.lat ? `
            <div style="border-radius: 12px; overflow: hidden; border: 2px solid var(--accent); box-shadow: 0 0 20px rgba(59,130,246,0.3);">
                <iframe 
                    width="100%" 
                    height="300" 
                    frameborder="0" 
                    style="border:0"
                    src="https://maps.google.com/maps?q=${order.currentLocation.lat},${order.currentLocation.lng}&z=15&output=embed" allowfullscreen>
                </iframe>
            </div>
        ` : `
            <div style="background: #0f172a; border: 2px dashed var(--border); padding: 40px; text-align: center; border-radius: 12px; color: var(--text-muted);">
                <div style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;">📡</div>
                OFFLINE - No active tracking beacon found.
            </div>
        `}
      </div>
    </div>
  `;
};

const renderEditUserModal = () => {
  const user = adminState.selectedUser;
  if (!user) return '';

  return `
      <div class="modal-overlay animate-fade-in" id="edit-user-modal" style="display: flex;">
        <div class="modal-content">
          <button class="close-btn" id="close-edit-modal">&times;</button>
          <h2 style="margin-top: 0; color: white;">Override User Data</h2>
          <p style="color: var(--text-muted); margin-bottom: 20px;">Target: ${user.name} [${user.role.toUpperCase()}]</p>
  
          <form id="edit-user-form" style="display: flex; flex-direction: column; gap: 15px;">
            <div>
              <label style="color: var(--text-muted); font-size: 12px;">Full Name</label>
              <input type="text" id="edit-name" value="${user.name}" class="dark-input">
            </div>
            <div>
              <label style="color: var(--text-muted); font-size: 12px;">Mobile Number</label>
              <input type="text" id="edit-mobile" value="${user.mobile}" class="dark-input">
            </div>
            <div>
              <label style="color: var(--text-muted); font-size: 12px;">Email Address</label>
              <input type="email" id="edit-email" value="${user.email || ''}" class="dark-input">
            </div>
            
            <div style="padding: 15px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; margin-top: 10px;">
               <label style="color: var(--accent); font-size: 12px; font-weight: bold; text-transform: uppercase;">Direct Wallet Override (₹)</label>
               <input type="number" id="edit-wallet" value="${user.walletBalance || 0}" class="dark-input" style="background: #0f172a; margin-top: 5px; font-size: 18px; font-weight: bold; color: var(--success);">
            </div>

            <div>
              <label style="color: var(--text-muted); font-size: 12px;">Assigned Area (Logistics Only)</label>
              <input type="text" id="edit-area" value="${user.area || 'General'}" class="dark-input">
            </div>
  
            <button type="submit" class="dark-btn" style="margin-top: 15px;">Save Master Override</button>
          </form>
        </div>
      </div>
    `;
};

const renderRegisterModal = () => {
  if (!adminState.showRegisterModal) return '';

  return `
      <div class="modal-overlay animate-fade-in" id="register-modal" style="display: flex;">
        <div class="modal-content">
          <button class="close-btn" id="close-register-modal">&times;</button>
          <h2 style="margin-top: 0; color: white;">Deploy New Entity</h2>
          <p style="color: var(--text-muted); margin-bottom: 20px;">Bypass standard registration protocols to inject a new user into the database.</p>
  
          <form id="force-register-form" style="display: flex; flex-direction: column; gap: 15px;">
            <select id="reg-role" class="dark-input" style="font-weight: bold; color: var(--accent);">
                <option value="customer">Customer</option>
                <option value="logistics">Logistics Fleet</option>
            </select>
            <input type="text" id="reg-name" placeholder="Full Name" required class="dark-input">
            <input type="text" id="reg-mobile" placeholder="Mobile Number" required class="dark-input">
            <input type="email" id="reg-email" placeholder="Email Address (Optional)" class="dark-input">
            <input type="password" id="reg-password" placeholder="Password Assignment" required class="dark-input">
            <input type="text" id="reg-area" placeholder="Assigned Area (Logistics Only)" class="dark-input" value="General">
            
            <button type="submit" class="dark-btn success" style="margin-top: 15px;">Execute Deployment</button>
          </form>
        </div>
      </div>
    `;
};

// --- Main Views ---
const renderSidebar = () => {
  return `
      <aside class="sidebar ${adminState.sidebarOpen ? 'open' : ''}" style="width: var(--sidebar-width); background: var(--bg-card); border-right: 1px solid var(--border); height: 100vh; position: fixed; overflow-y: auto; display: flex; flex-direction: column; z-index: 90;">
        <div style="padding: 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h2 style="color: var(--text-main); font-size: 20px; font-weight: 800; margin: 0; text-shadow: 0 0 10px var(--accent-glow);">VASTRA<span style="color: var(--accent)">GOD</span></h2>
            <p style="font-size: 10px; color: var(--danger); margin-top: 4px; display: flex; align-items: center; gap: 4px;"><span style="display:inline-block; width:6px; height:6px; background:var(--danger); border-radius:50%; box-shadow: 0 0 6px var(--danger);"></span> OVERLORD ACCESS</p>
          </div>
          <button class="hamburger" id="close-sidebar" style="display: none;">&times;</button>
        </div>
        <nav style="flex: 1; padding: 15px 0; display: flex; flex-direction: column; gap: 5px;">
            <a href="#" class="sidebar-link ${adminState.view === 'dashboard' ? 'active' : ''}" data-view="dashboard" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: var(--text-muted); text-decoration: none; font-size: 14px;">
              <span style="font-size: 16px;">📊</span> Command Center
            </a>
            <a href="#" class="sidebar-link ${adminState.view === 'users' ? 'active' : ''}" data-view="users" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: var(--text-muted); text-decoration: none; font-size: 14px;">
              <span style="font-size: 16px;">👥</span> User Database
            </a>
            <a href="#" class="sidebar-link ${adminState.view === 'finance' ? 'active' : ''}" data-view="finance" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: var(--text-muted); text-decoration: none; font-size: 14px;">
              <span style="font-size: 16px;">💰</span> Transact Ledger
            </a>
            <a href="#" class="sidebar-link ${adminState.view === 'logistics' ? 'active' : ''}" data-view="logistics" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: var(--text-muted); text-decoration: none; font-size: 14px;">
              <span style="font-size: 16px;">🛵</span> Logistics Core
            </a>
            <a href="#" class="sidebar-link ${adminState.view === 'past-orders' ? 'active' : ''}" data-view="past-orders" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: var(--text-muted); text-decoration: none; font-size: 14px;">
              <span style="font-size: 16px;">📜</span> Past Orders
            </a>
        </nav>
        <div style="padding: 24px; border-top: 1px solid var(--border);">
            <button id="admin-logout-btn" style="width: 100%; padding: 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s;">Secure Logout</button>
        </div>
      </aside>
      ${adminState.sidebarOpen ? `<div id="sidebar-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 80;"></div>` : ''}
    `;
};

const renderTopBar = () => {
  const titles = { 'dashboard': 'Command Center', 'users': 'Master Database', 'finance': 'Financial Ledger', 'logistics': 'Logistics Fleet Intel' };
  return `
          <header style="height: 70px; background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; position: sticky; top: 0; z-index: 10;">
              <div style="display: flex; align-items: center; gap: 15px;">
                  <button class="hamburger" id="sidebar-toggle">☰</button>
                  <h2 style="font-size: 16px; color: var(--text-main); font-weight: 600; margin: 0;">${titles[adminState.view]}</h2>
              </div>
              <div style="display: flex; gap: 10px; align-items: center;">
                  <button id="refresh-data-btn" class="dark-btn" style="padding: 6px 10px; width: auto; font-size: 11px; background: transparent; border: 1px solid var(--accent); color: var(--accent);">⟳ Sync</button>
                  <span id="user-badge" style="font-size: 11px; color: var(--danger); font-weight: bold; border: 1px solid var(--danger); padding: 4px 8px; border-radius: 4px;">${adminState.user.name.split(' ')[0].toUpperCase()}</span>
              </div>
          </header>
      `;
}

const renderDashboardView = () => {
  const activeOrders = adminState.orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
  return `
      <div style="padding: 20px;" class="animate-fade-in">
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px;">
           <div class="dark-card" style="border-left: 4px solid var(--accent); padding: 15px;">
              <div style="color: var(--text-muted); text-transform: uppercase; font-size: 11px; font-weight: bold;">Active Orders</div>
              <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">${activeOrders.length}</div>
           </div>
           <div class="dark-card" style="border-left: 4px solid var(--warning); padding: 15px;">
              <div style="color: var(--text-muted); text-transform: uppercase; font-size: 11px; font-weight: bold;">Pending Actions</div>
              <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">${adminState.orders.filter(o => o.status === 'Pending' || o.status === 'Order Received').length}</div>
           </div>
           <div class="dark-card" style="border-left: 4px solid var(--success); padding: 15px;">
              <div style="color: var(--text-muted); text-transform: uppercase; font-size: 11px; font-weight: bold;">Revenue</div>
              <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">₹${adminState.orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0)}</div>
           </div>
        </div>

        <div class="dark-card" style="padding: 0; overflow: hidden;">
            <div style="padding: 15px 20px; border-bottom: 1px solid var(--border); background: #0f172a; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <h3 style="margin: 0; font-size: 15px;">Active Order Operations</h3>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <select id="bulk-partner-id" class="dark-input" style="padding: 6px; font-size: 11px; width: 160px;">
                        <option value="">-- Bulk Assign Agent --</option>
                        ${adminState.partners.map(p => {
    return `<option value="${p.mobile}">${p.name} (${p.area || 'General'})</option>`;
  }).join('')}
                    </select>
                    <button id="bulk-assign-btn" class="dark-btn" style="padding: 6px 12px; width: auto; font-size: 11px;">Assign Selected</button>
                    <span style="font-size: 11px; color: var(--text-muted);">${adminState.selectedOrderIds.length} Selected</span>
                </div>
            </div>
            <div class="responsive-table-container">
            ${adminState.orders.length === 0 ? '<div style="padding: 40px; text-align: center; color: var(--text-muted);">No orders found in database.</div>' : `
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 40px;"><input type="checkbox" id="select-all-orders" ${adminState.selectedOrderIds.length === activeOrders.length && activeOrders.length > 0 ? 'checked' : ''}></th>
                            <th>Order Target</th>
                            <th>Address / Area</th>
                            <th>Status Vector</th>
                            <th>Logistics Assignment</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activeOrders
        .sort((a, b) => {
          const statusOrder = { 'Pending': 0, 'Order Received': 0, 'Assigned': 1, 'Processing': 1, 'Washing': 1, 'Ironing': 1, 'Out for Delivery': 1, 'Completed': 2, 'Cancelled': 2 };
          return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        })
        .map(order => `
                            <tr class="clickable order-row" data-id="${order._id}">
                                <td onclick="event.stopPropagation();">
                                    <input type="checkbox" class="order-select" data-id="${order._id}" ${adminState.selectedOrderIds.includes(order._id) ? 'checked' : ''}>
                                </td>
                                <td>
                                    <strong style="color: white; display: block;">${order.userEmail || order.userMobile}</strong>
                                    <span style="color: var(--text-muted); font-size: 12px; font-family: monospace;">UUID: ${order._id.substring(order._id.length - 8)}</span>
                                </td>
                                <td style="max-width: 200px; font-size: 12px; color: var(--text-main);">
                                    ${order.address || '<span style="color: var(--danger);">No Address</span>'}
                                </td>
                                <td>
                                    <span style="background: ${order.status === 'Completed' ? 'rgba(16,185,129,0.2)' : order.status === 'Pending' || order.status === 'Order Received' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)'}; color: ${order.status === 'Completed' ? '#34d399' : order.status === 'Pending' || order.status === 'Order Received' ? '#fbbf24' : '#60a5fa'}; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                                        ${order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td onclick="event.stopPropagation();">
                                   ${order.status === 'Pending' || order.status === 'Order Received' ? `
                                      <div style="display: flex; gap: 5px;">
                                          <select id="partner-id-${order._id}" class="dark-input" style="padding: 6px; font-size: 11px; width: 160px;">
                                            <option value="">-- Target Fleet --</option>
                                            ${adminState.partners.map(p => {
          return `<option value="${p.mobile}">${p.name} [${p.mobile}] (${p.area || "General"})</option>`;
        }).join('')}
                                          </select>
                                          <button class="dark-btn assign-btn" data-id="${order._id}" style="padding: 6px 10px; font-size: 12px; width: auto;">Lock</button>
                                      </div>
                                  ` : `
                                      <div style="font-size: 13px;">
                                        <div style="font-weight: bold; color: white;">${adminState.partners.find(p => p.mobile === order.assignedPartner)?.name || order.assignedPartner || 'Unknown'}</div>
                                        <div style="color: var(--text-muted); font-size: 11px;">Agent ID: ${order.assignedPartner}</div>
                                      </div>
                                  `}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            `}
        </div>
      </div>
    `;
};

const renderUsersView = () => {
  const isCust = adminState.userTab === 'customers';
  const displayList = isCust ? adminState.users.filter(u => u.role === 'customer') : adminState.users.filter(u => u.role !== 'customer' && u.role !== 'admin');

  return `
       <div style="padding: 30px;" class="animate-fade-in">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
             <div style="display: flex; background: #0f172a; border-radius: 8px; border: 1px solid var(--border); padding: 5px;">
                 <button class="tab-btn user-tab-switch ${isCust ? 'active' : ''}" data-tab="customers">Customers Core (${adminState.users.filter(u => u.role === 'customer').length})</button>
                 <button class="tab-btn user-tab-switch ${!isCust ? 'active' : ''}" data-tab="logistics">Logistics Fleet (${adminState.users.filter(u => u.role !== 'customer' && u.role !== 'admin').length})</button>
             </div>
             <button class="dark-btn success" id="open-register-btn" style="width: auto;">+ Force Deploy Entity</button>
          </div>

          <div class="dark-card" style="padding: 0; overflow: hidden;">
             <div class="responsive-table-container">
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Entity Classification</th>
                            <th>Contact Vectors</th>
                            <th>Wallet Data</th>
                            <th>Role Flag</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${displayList.length === 0 ? `<tr><td colspan="4" style="text-align:center; padding: 40px; color: var(--text-muted);">No entities located.</td></tr>` : displayList.map(user => `
                            <tr class="clickable user-row" data-id="${user._id}">
                                <td>
                                    <strong style="color: white; display: block; font-size: 14px;">${user.name}</strong>
                                    <span style="color: var(--text-muted); font-size: 10px;">Joined: ${new Date(user.createdAt).toLocaleDateString()}</span>
                                </td>
                                <td>
                                    <div style="color: var(--text-main); font-size: 13px;">${user.mobile}</div>
                                    <div style="color: var(--text-muted); font-size: 11px;">${user.email || 'No email target'}</div>
                                </td>
                                <td>
                                    <strong style="font-size: 15px; color: var(--success);">₹${user.walletBalance || 0}</strong>
                                </td>
                                <td>
                                    <span style="background: rgba(255,255,255,0.1); color: white; padding: 3px 6px; border-radius: 4px; font-size: 10px; text-transform: uppercase;">${user.role}</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
             </div>
          </div>
       </div>
    `;
};

const renderLogisticsView = () => {
  const partners = adminState.partners;

  return `
       <div style="padding: 20px;" class="animate-fade-in">
          <div class="stats-grid" style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 25px;">
             <div class="dark-card" style="border-left: 4px solid var(--accent); padding: 20px; text-align: center;">
                <div style="color: var(--text-muted); text-transform: uppercase; font-size: 12px; font-weight: bold; letter-spacing: 1px;">Logistics Fleet Command</div>
                <div style="font-size: 32px; font-weight: 800; color: white; margin-top: 10px;">${partners.length} Registered Agents</div>
             </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
              ${partners.length === 0 ? '<div class="dark-card" style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No fleet agents found.</div>' : partners.map(p => {
    const agentOrders = adminState.orders.filter(o => (o.assignedPartner === p.mobile || o.deliveryAgent === p.mobile) && o.status !== 'Completed' && o.status !== 'Cancelled');
    return `
                  <div class="dark-card" style="padding: 0; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border);">
                      <div style="padding: 20px; border-bottom: 1px solid var(--border); background: rgba(59,130,246,0.05);">
                          <div style="font-size: 18px; font-weight: 800; color: white; margin-bottom: 4px;">${p.name}</div>
                          <div style="display: flex; flex-direction: column; gap: 4px;">
                              <div style="font-size: 12px; color: var(--text-muted);">Mobile: ${p.mobile}</div>
                              <div style="font-size: 12px; color: var(--accent); font-weight: bold;">Area: ${p.area || 'General Area'}</div>
                          </div>
                      </div>
                      <div style="flex: 1; padding: 15px; overflow-y: auto; max-height: 250px;">
                          <div style="font-size: 11px; font-weight: bold; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase;">Active Assignments (${agentOrders.length})</div>
                          ${agentOrders.length === 0 ? '<div style="font-size: 12px; color: #475569; font-style: italic;">No active assignments.</div>' : `
                              <div style="display: flex; flex-direction: column; gap: 8px;">
                                  ${agentOrders.map(o => `
                                      <div class="order-row clickable" data-id="${o._id}" style="padding: 10px; background: #0f172a; border-radius: 8px; border: 1px solid var(--border); width: 100%; box-sizing: border-box;">
                                          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                              <div style="font-size: 12px; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${o.userMobile}</div>
                                              <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: rgba(59,130,246,0.1); color: var(--accent); border: 1px solid rgba(59,130,246,0.3); white-space: nowrap;">${o.status.toUpperCase()}</span>
                                          </div>
                                          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">PK: ${o._id.substring(o._id.length - 8).toUpperCase()}</div>
                                      </div>
                                  `).join('')}
                              </div>
                          `}
                      </div>
                  </div>
                `;
  }).join('')}
          </div>
       </div>
    `;
};

const renderFinanceView = () => {
  const totalWallet = adminState.users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);
  const totalCoins = adminState.users.reduce((sum, u) => sum + (u.vastraCoins || 0), 0);

  return `
       <div style="padding: 20px;" class="animate-fade-in">
          <h2 style="margin-bottom: 20px; font-size: 20px; color: white;">Vastra Financial Ledger</h2>
          
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
             <div class="dark-card" style="border-left: 4px solid var(--success); padding: 15px;">
                <div style="color: var(--text-muted); text-transform: uppercase; font-size: 11px; font-weight: bold;">System Total Wallet</div>
                <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">₹${totalWallet.toLocaleString()}</div>
             </div>
             <div class="dark-card" style="border-left: 4px solid var(--accent); padding: 15px;">
                <div style="color: var(--text-muted); text-transform: uppercase; font-size: 11px; font-weight: bold;">System Total Coins</div>
                <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">${totalCoins.toLocaleString()}</div>
             </div>
          </div>

          <div class="dark-card" style="padding: 0; overflow: hidden;">
              <div style="padding: 15px 20px; border-bottom: 1px solid var(--border); background: #0f172a; display: flex; justify-content: space-between; align-items: center;">
                  <h3 style="margin: 0; font-size: 15px;">Critical Wallet Exceptions</h3>
                  <span style="font-size: 11px; color: var(--text-muted);">Users with Balance > 0</span>
              </div>
              <div class="responsive-table-container">
                  <table style="width: 100%;">
                      <thead>
                          <tr>
                              <th>Subject</th>
                              <th>Account Balance</th>
                              <th>Coins Balance</th>
                              <th>Auth Role</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${adminState.users.filter(u => (u.walletBalance || 0) > 0 || (u.vastraCoins || 0) > 0).map(u => `
                              <tr>
                                  <td>
                                      <div style="color: white; font-weight: 600;">${u.name}</div>
                                      <div style="color: var(--text-muted); font-size: 11px;">${u.mobile}</div>
                                  </td>
                                  <td><strong style="color: var(--success);">₹${u.walletBalance || 0}</strong></td>
                                  <td><strong style="color: var(--accent);">${u.vastraCoins || 0}</strong></td>
                                  <td><span style="font-size: 10px; border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px;">${u.role.toUpperCase()}</span></td>
                              </tr>
                          `).join('')}
                      </tbody>
                  </table>
              </div>
          </div>
       </div>
    `;
};

const renderPastOrdersView = () => {
  const pastOrders = adminState.orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

  return `
        <div style="padding: 20px;" class="animate-fade-in">
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
                <div class="dark-card" style="border-left: 4px solid var(--success); padding: 15px;">
                    <div style="color: var(--text-muted); text-transform: uppercase; font-size: 11px; font-weight: bold;">Completed Total</div>
                    <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">${pastOrders.filter(o => o.status === 'Completed').length}</div>
                </div>
                <div class="dark-card" style="border-left: 4px solid var(--danger); padding: 15px;">
                    <div style="color: var(--text-muted); text-transform: uppercase; font-size: 11px; font-weight: bold;">Cancelled Total</div>
                    <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">${pastOrders.filter(o => o.status === 'Cancelled').length}</div>
                </div>
            </div>

            <div class="dark-card" style="padding: 0; overflow: hidden;">
                <div style="padding: 15px 20px; border-bottom: 1px solid var(--border); background: #0f172a;">
                    <h3 style="margin: 0; font-size: 15px;">Historical Order Ledger</h3>
                </div>
                <div class="responsive-table-container">
                    ${pastOrders.length === 0 ? '<div style="padding: 40px; text-align: center; color: var(--text-muted);">Archive is currently empty.</div>' : `
                        <table style="width: 100%;">
                            <thead>
                                <tr>
                                    <th>Target Intel</th>
                                    <th>Final Status</th>
                                    <th>Revenue</th>
                                    <th>Agent Involved</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pastOrders.map(o => `
                                    <tr class="clickable order-row" data-id="${o._id}">
                                        <td>
                                            <div style="font-weight: bold; color: white;">${o.userMobile}</div>
                                            <div style="font-size: 11px; color: var(--text-muted);">ID: ${o._id.substring(o._id.length - 8)}</div>
                                        </td>
                                        <td>
                                            <span style="background: ${o.status === 'Completed' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color: ${o.status === 'Completed' ? '#34d399' : '#f87171'}; border: 1px solid ${o.status === 'Completed' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">${o.status.toUpperCase()}</span>
                                        </td>
                                        <td style="color: var(--success); font-weight: bold;">₹${o.totalAmount || 0}</td>
                                        <td>${adminState.partners.find(p => p.mobile === o.assignedPartner || p.mobile === o.deliveryAgent)?.name || o.assignedPartner || 'N/A'}</td>
                                        <td style="font-size: 11px; color: var(--text-muted);">${new Date(o.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
            </div>
        </div>
    `;
};

// --- Main App Renderer ---
const renderApp = () => {
  const root = document.querySelector('#admin-app');

  if (!adminState.user) {
    root.innerHTML = `${themeStyles}${renderAuth()}`;
    attachAuthEvents();
    return;
  }

  root.innerHTML = `
      ${themeStyles}
      <div style="display: flex; background: var(--bg-dark); min-height: 100vh;">
        ${renderSidebar()}
        <div class="main-content" style="flex: 1; margin-left: var(--sidebar-width); width: 100%;">
          ${renderTopBar()}
          <div>
              ${adminState.view === 'dashboard' ? renderDashboardView() :
      adminState.view === 'users' ? renderUsersView() :
        adminState.view === 'finance' ? renderFinanceView() :
          adminState.view === 'past-orders' ? renderPastOrdersView() :
            renderLogisticsView()
    }
          </div>
        </div>
      </div>
      ${renderTrackingModal()}
      ${renderEditUserModal()}
      ${renderRegisterModal()}
    `;

  attachAppEvents();
};

const attachAuthEvents = () => {
  document.getElementById('toggle-auth')?.addEventListener('click', (e) => {
    e.preventDefault();
    adminState.authMode = adminState.authMode === 'login' ? 'signup' : 'login';
    renderApp();
  });

  document.getElementById('admin-auth-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mobile = document.getElementById('admin-mobile').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const errorEl = document.getElementById('admin-error');
    const submitBtn = e.target.querySelector('button');

    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'EXECUTING...';

    try {
      if (adminState.authMode === 'signup') {
        const name = document.getElementById('admin-name').value.trim();
        const email = document.getElementById('admin-email').value.trim();
        await api.signup({ name, mobile, password, email, role: 'admin' });
        alert('Master Key Injected. Proceed to Login.');
        adminState.authMode = 'login';
        renderApp();
        return;
      }

      const res = await api.signin({ mobile, password });
      if (res.user.role !== 'admin') {
        throw new Error("ACCESS DENIED. Subject lacks Overlord clearance.");
      }

      adminState.user = res.user;
      await parallelFetchData();
      renderApp();
    } catch (err) {
      submitBtn.innerText = originalText;
      errorEl.innerText = ">> " + (err.message || "Operation Failed.");
      errorEl.style.display = 'block';
    }
  });
};

const parallelFetchData = async () => {
  try {
    const [o, p, u] = await Promise.all([
      api.getAllOrders().catch(() => []),
      api.getAllPartners().catch(() => []),
      api.getAllUsers().catch(() => [])
    ]);
    adminState.orders = o;
    adminState.partners = p;
    adminState.users = u;
  } catch (e) {
    console.error("Data Sync Fault", e);
  }
}

const attachAppEvents = () => {
  // Sidebar logic
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      adminState.view = e.currentTarget.dataset.view;
      adminState.sidebarOpen = false; // Close on navigation
      renderApp();
    });
  });

  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    adminState.sidebarOpen = true;
    renderApp();
  });

  document.getElementById('close-sidebar')?.addEventListener('click', () => {
    adminState.sidebarOpen = false;
    renderApp();
  });

  document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
    adminState.sidebarOpen = false;
    renderApp();
  });

  document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
    adminState.user = null;
    renderApp();
  });

  document.getElementById('refresh-data-btn')?.addEventListener('click', async (e) => {
    e.target.innerText = 'SYNCING...';
    await parallelFetchData();
    renderApp();
  });

  // Dashboard Assignment
  document.querySelectorAll('.assign-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const orderId = e.target.dataset.id;
      const partnerId = document.getElementById(`partner-id-${orderId}`).value.trim();

      if (!partnerId) {
        showCustomAlert('Assignment Failed', 'CRITICAL: Malformed assignment target.', 'error');
        return;
      }

      e.target.innerText = '...';
      e.target.disabled = true;
      try {
        await api.assignOrder(orderId, partnerId);
        await parallelFetchData();
        renderApp();
        showCustomAlert('Success', 'Order successfully assigned to agent.', 'success');
      } catch (error) {
        showCustomAlert('Execute Failed', error.message, 'error');
        e.target.innerText = 'Lock'; e.target.disabled = false;
      }
    });
  });

  // Bulk Selection Logic
  document.getElementById('select-all-orders')?.addEventListener('change', (e) => {
    const activeOrders = adminState.orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
    if (e.target.checked) {
      adminState.selectedOrderIds = activeOrders.map(o => o._id);
    } else {
      adminState.selectedOrderIds = [];
    }
    renderApp();
  });

  document.querySelectorAll('.order-select').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) {
        if (!adminState.selectedOrderIds.includes(id)) adminState.selectedOrderIds.push(id);
      } else {
        adminState.selectedOrderIds = adminState.selectedOrderIds.filter(oid => oid !== id);
      }
      renderApp();
    });
  });

  // Bulk Assignment Execution
  document.getElementById('bulk-assign-btn')?.addEventListener('click', async (e) => {
    const partnerId = document.getElementById('bulk-partner-id').value;
    if (!partnerId) {
      showCustomAlert('Missing Data', 'Select a logistics agent for bulk assignment.', 'error');
      return;
    }
    if (adminState.selectedOrderIds.length === 0) {
      showCustomAlert('No Selection', 'Select at least one order to assign.', 'error');
      return;
    }

    e.target.innerText = 'ASSIGNING...';
    e.target.disabled = true;

    try {
      await api.bulkAssignOrders(adminState.selectedOrderIds, partnerId);
      adminState.selectedOrderIds = [];
      await parallelFetchData();
      showToast("BULK ASSIGNMENT COMPLETED");
      renderApp();
      showCustomAlert('Bulk Success', 'All selected orders have been assigned to ' + partnerId, 'success');
    } catch (err) {
      showCustomAlert("Bulk Assignment Failed", err.message, 'error');
      e.target.innerText = 'Assign Selected';
      e.target.disabled = false;
    }
  });

  // Tracking Modal Trigger
  document.querySelectorAll('.order-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      adminState.selectedOrder = adminState.orders.find(o => o._id === id);
      renderApp();
    });
  });

  document.getElementById('close-tracking-modal')?.addEventListener('click', () => {
    adminState.selectedOrder = null;
    renderApp();
  });

  // User DB Tab Switch
  document.querySelectorAll('.user-tab-switch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      adminState.userTab = e.currentTarget.dataset.tab;
      renderApp();
    });
  });

  // Edit User Modal Triggers
  document.querySelectorAll('.user-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      adminState.selectedUser = adminState.users.find(u => u._id === id);
      renderApp();
    });
  });

  document.getElementById('close-edit-modal')?.addEventListener('click', () => {
    adminState.selectedUser = null;
    renderApp();
  });

  // Edit User Form Submit
  document.getElementById('edit-user-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const user = adminState.selectedUser;
    const newWalletStr = document.getElementById('edit-wallet').value;
    const newWallet = parseFloat(newWalletStr) || 0;
    const name = document.getElementById('edit-name').value;
    const mobile = document.getElementById('edit-mobile').value;

    btn.innerText = 'OVERRIDING...';
    btn.disabled = true;

    try {
      // Update Details
      const area = document.getElementById('edit-area').value;
      await api.adminUpdateUser(user._id, { name, mobile, area });
      // Update Wallet
      await api.adminUpdateWallet(user._id, newWallet);

      // Local Update for immediate feedback
      const uIndex = adminState.users.findIndex(u => u._id === user._id);
      if (uIndex !== -1) {
        adminState.users[uIndex] = { ...adminState.users[uIndex], name, mobile, area, walletBalance: newWallet };
      }

      showToast("MASTER OVERRIDE SUCCESSFUL");
      adminState.selectedUser = null;
      renderApp();

      // Refresh in background to stay in sync with server
      parallelFetchData().then(() => renderApp());
    } catch (err) {
      showToast("OVERRIDE FAILED: " + err.message);
      btn.innerText = 'Save Master Override';
      btn.disabled = false;
    }
  });

  // Register Modal Triggers
  document.getElementById('open-register-btn')?.addEventListener('click', () => {
    adminState.showRegisterModal = true;
    renderApp();
  });

  document.getElementById('close-register-modal')?.addEventListener('click', () => {
    adminState.showRegisterModal = false;
    renderApp();
  });

  // Register Form Submit
  document.getElementById('force-register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');

    const role = document.getElementById('reg-role').value;
    const name = document.getElementById('reg-name').value;
    const mobile = document.getElementById('reg-mobile').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const area = document.getElementById('reg-area').value;

    btn.innerText = 'DEPLOYING...';
    btn.disabled = true;

    try {
      await api.adminRegisterUser({ name, mobile, email, password, role, area });
      adminState.showRegisterModal = false;
      await parallelFetchData();
      renderApp();
      showCustomAlert('Success', 'Entity sequence deployed successfully.', 'success');
    } catch (err) {
      showCustomAlert('Registration Failed', err.message, 'error');
    } finally {
      btn.innerText = 'Create Overlord Account';
      btn.disabled = false;
    }
  });
};

// Initialize App
renderApp();

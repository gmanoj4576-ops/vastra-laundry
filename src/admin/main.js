import '/style.css';
import { api } from '../api.js';

const adminState = {
  user: null,
  view: 'dashboard', // 'dashboard', 'users', 'finance'
  authMode: 'login', // 'login' or 'signup'
  orders: [],
  partners: [],
  users: [],
  selectedOrder: null,
  selectedUser: null,
  showRegisterModal: false,
  userTab: 'customers' // 'customers' or 'logistics'
};

// --- Custom Theme ---
const themeStyles = `
  <style>
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
    }
    body {
      background: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      margin: 0;
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
    .dark-input:-webkit-autofill,
    .dark-input:-webkit-autofill:hover, 
    .dark-input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 30px #0f172a inset !important;
        -webkit-text-fill-color: var(--text-main) !important;
        transition: background-color 5000s ease-in-out 0s;
    }
    .dark-btn {
      background: var(--accent);
      color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%;
    }
    .dark-btn:hover { background: #2563eb; box-shadow: 0 0 15px var(--accent-glow); }
    .dark-btn.success { background: var(--success); }
    .dark-btn.success:hover { background: #059669; box-shadow: 0 0 15px rgba(16,185,129,0.4); }
    .dark-btn.danger { background: var(--danger); box-shadow: 0 0 10px rgba(239,68,68,0.2); }
    .dark-btn.danger:hover { background: #dc2626; box-shadow: 0 0 15px rgba(239,68,68,0.4); }
    
    .sidebar-link { transition: background 0.2s, border-left 0.2s; }
    .sidebar-link:hover { background: rgba(59, 130, 246, 0.1) !important; }
    
    table { width: 100%; border-collapse: collapse; }
    th { background: #0f172a; color: var(--text-muted); font-weight: 500; font-size: 12px; padding: 16px; border-bottom: 1px solid var(--border); text-align: left;}
    td { padding: 16px; border-bottom: 1px solid var(--border); color: var(--text-main); font-size: 14px; }
    tr.clickable:hover td { background: rgba(255,255,255,0.05); cursor: pointer; }
    
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); z-index: 50; display: flex; align-items: center; justify-content: center;
    }
    .modal-content {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 30px; position: relative;
    }
    .close-btn {
      position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: var(--text-muted); font-size: 24px; cursor: pointer; transition: color 0.2s;
    }
    .close-btn:hover { color: white; }

    .tab-btn { background: transparent; border: none; color: var(--text-muted); padding: 10px 20px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
    .tab-btn:hover { color: white; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  </style>
`;

// --- Authentication Flow ---
const renderAuth = () => {
  const isLogin = adminState.authMode === 'login';
  return `
    ${themeStyles}
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop') center/cover; position: relative;">
      <div style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);"></div>
      <div class="auth-card dark-card animate-fade-in" style="width: 100%; max-width: 400px; text-align: center; position: relative; z-index: 1;">
        <h1 style="color: var(--text-main); margin-bottom: 5px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 0 20px var(--accent-glow);">VASTRA<span style="color: var(--accent)">GOD</span> MODE</h1>
        <p style="color: var(--text-muted); margin-bottom: 30px;">Master Control Terminal</p>
        
        <form id="admin-auth-form" style="display: flex; flex-direction: column; gap: 15px;">
          ${!isLogin ? `<input type="text" id="admin-name" placeholder="Full Name" required class="dark-input">` : ''}
          <input type="text" id="admin-mobile" placeholder="Mobile Number" required class="dark-input">
          ${!isLogin ? `<input type="email" id="admin-email" placeholder="Email Address (Optional)" class="dark-input">` : ''}
          <input type="password" id="admin-password" placeholder="Master Password" required class="dark-input">
          
          <button type="submit" class="dark-btn" style="margin-top: 10px;">
            ${isLogin ? 'Authenticate Override' : 'Initialize Master Account'}
          </button>
        </form>
        
        <p id="admin-error" style="color: var(--danger); margin-top: 15px; font-size: 14px; display: none;"></p>
        
        <div style="margin-top: 25px; border-top: 1px solid var(--border); padding-top: 20px;">
            <p style="color: var(--text-muted); font-size: 14px;">
              ${isLogin ? "No access?" : "Already initialized?"} 
              <a href="#" id="toggle-auth" style="color: var(--accent); text-decoration: none; font-weight: 600;">
                ${isLogin ? 'Register Master Key' : 'Login Here'}
              </a>
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

  const assignedAgent = adminState.partners.find(p => p.mobile === order.assignedPartner);

  return `
    <div class="modal-overlay animate-fade-in" id="tracking-modal" style="display: flex;">
      <div class="modal-content">
        <button class="close-btn" id="close-tracking-modal">&times;</button>
        <h2 style="margin-top: 0; color: white;">Command Center: Order Data</h2>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <span style="background: rgba(59,130,246,0.2); color: #60a5fa; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid rgba(59,130,246,0.3);">
                Order ID: #${order._id.substring(order._id.length - 8).toUpperCase()}
            </span>
            <span style="background: rgba(16,185,129,0.2); color: #34d399; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid rgba(16,185,129,0.3);">
                Tracking: ${order.trackingId || 'PENDING'}
            </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: #0f172a; padding: 15px; border-radius: 12px; border: 1px solid var(--border);">
                <h4 style="color: var(--text-muted); margin-top: 0; font-size: 12px; text-transform: uppercase;">Customer Target</h4>
                <div style="color: white; font-weight: 600;">${order.userEmail}</div>
                <div style="color: var(--text-muted); font-size: 13px; margin-top: 5px;">${order.address || 'Address Unknown'}</div>
                <div style="color: var(--success); font-weight: bold; margin-top: 10px; font-size: 18px;">₹${order.totalAmount}</div>
            </div>
            
            <div style="background: #0f172a; padding: 15px; border-radius: 12px; border: 1px solid var(--border);">
                <h4 style="color: var(--text-muted); margin-top: 0; font-size: 12px; text-transform: uppercase;">Logistics Fleet Agent</h4>
                ${assignedAgent ? `
                    <div style="color: white; font-weight: 600;">${assignedAgent.name}</div>
                    <div style="color: var(--text-muted); font-size: 13px;">${assignedAgent.mobile}</div>
                    <div style="color: var(--warning); font-weight: bold; margin-top: 10px; font-size: 14px;">Payout: ₹${order.partnerPayout || 0}</div>
                ` : `<div style="color: var(--danger); font-weight: bold; margin-top: 10px;">Unassigned</div>`}
            </div>
        </div>

        <h4 style="color: var(--text-muted); font-size: 12px; text-transform: uppercase; margin-bottom: 10px;">Live Tracking Satellite uplink</h4>
        ${order.currentLocation && order.currentLocation.lat ? `
            <div style="border-radius: 12px; overflow: hidden; border: 1px solid var(--accent); box-shadow: 0 0 15px rgba(59,130,246,0.3);">
                <iframe 
                    width="100%" 
                    height="250" 
                    frameborder="0" 
                    style="border:0"
                    src="https://maps.google.com/maps?q=${order.currentLocation.lat},${order.currentLocation.lng}&z=15&output=embed" allowfullscreen>
                </iframe>
            </div>
        ` : `
            <div style="background: #0f172a; border: 1px dashed var(--border); padding: 30px; text-align: center; border-radius: 12px; color: var(--text-muted);">
                <div style="font-size: 30px; margin-bottom: 10px;">📡</div>
                No active tracking signal detected for this order.
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
            
            <button type="submit" class="dark-btn success" style="margin-top: 15px;">Execute Deployment</button>
          </form>
        </div>
      </div>
    `;
};

// --- Main Views ---
const renderSidebar = () => {
  return `
      <aside style="width: 260px; background: var(--bg-card); border-right: 1px solid var(--border); height: 100vh; position: fixed; overflow-y: auto; display: flex; flex-direction: column; z-index: 20;">
        <div style="padding: 24px; border-bottom: 1px solid var(--border);">
          <h2 style="color: var(--text-main); font-size: 20px; font-weight: 800; margin: 0; text-shadow: 0 0 10px var(--accent-glow);">VASTRA<span style="color: var(--accent)">GOD</span></h2>
          <p style="font-size: 12px; color: var(--danger); margin-top: 4px; display: flex; align-items: center; gap: 6px;"><span style="display:inline-block; width:8px; height:8px; background:var(--danger); border-radius:50%; box-shadow: 0 0 8px var(--danger);"></span> Overlord Access</p>
        </div>
        <nav style="flex: 1; padding: 15px 0; display: flex; flex-direction: column; gap: 5px;">
            <a href="#" class="sidebar-link ${adminState.view === 'dashboard' ? 'active' : ''}" data-view="dashboard" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: ${adminState.view === 'dashboard' ? 'white' : 'var(--text-muted)'}; text-decoration: none; font-size: 14px; background: ${adminState.view === 'dashboard' ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}; border-left: 3px solid ${adminState.view === 'dashboard' ? 'var(--accent)' : 'transparent'};">
              <span style="font-size: 16px;">📊</span> Command Center
            </a>
            <a href="#" class="sidebar-link ${adminState.view === 'users' ? 'active' : ''}" data-view="users" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: ${adminState.view === 'users' ? 'white' : 'var(--text-muted)'}; text-decoration: none; font-size: 14px; background: ${adminState.view === 'users' ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}; border-left: 3px solid ${adminState.view === 'users' ? 'var(--accent)' : 'transparent'};">
              <span style="font-size: 16px;">👥</span> User Database
            </a>
            <a href="#" class="sidebar-link ${adminState.view === 'finance' ? 'active' : ''}" data-view="finance" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: ${adminState.view === 'finance' ? 'white' : 'var(--text-muted)'}; text-decoration: none; font-size: 14px; background: ${adminState.view === 'finance' ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}; border-left: 3px solid ${adminState.view === 'finance' ? 'var(--accent)' : 'transparent'};">
              <span style="font-size: 16px;">💰</span> Transact Ledger
            </a>
        </nav>
        <div style="padding: 24px; border-top: 1px solid var(--border);">
            <button id="admin-logout-btn" style="width: 100%; padding: 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s;">Secure Logout</button>
        </div>
      </aside>
    `;
};

const renderTopBar = () => {
  const titles = { 'dashboard': 'Command Center (Orders)', 'users': 'Master Database (Users)', 'finance': 'Financial Ledger' };
  return `
          <header style="height: 70px; background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; position: sticky; top: 0; z-index: 10;">
              <h2 style="font-size: 18px; color: var(--text-main); font-weight: 600;">${titles[adminState.view]}</h2>
              <div style="display: flex; gap: 15px; align-items: center;">
                  <button id="refresh-data-btn" class="dark-btn" style="padding: 8px 15px; width: auto; font-size: 12px; background: transparent; border: 1px solid var(--accent); color: var(--accent);">⟳ Sync Database</button>
                  <span style="font-size: 14px; color: var(--danger); font-weight: bold;">OVERLORD: ${adminState.user.name.toUpperCase()}</span>
              </div>
          </header>
      `;
}

const renderDashboardView = () => {
  return `
      <div style="padding: 30px;" class="animate-fade-in">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 30px;">
           <div class="dark-card" style="border-top: 4px solid var(--accent); padding: 20px;">
              <div style="color: var(--text-muted); text-transform: uppercase; font-size: 12px; font-weight: bold;">Total Orders</div>
              <div style="font-size: 36px; font-weight: 800; color: white; margin-top: 5px;">${adminState.orders.length}</div>
           </div>
           <div class="dark-card" style="border-top: 4px solid var(--warning); padding: 20px;">
              <div style="color: var(--text-muted); text-transform: uppercase; font-size: 12px; font-weight: bold;">Pending Actions</div>
              <div style="font-size: 36px; font-weight: 800; color: white; margin-top: 5px;">${adminState.orders.filter(o => o.status === 'Pending' || o.status === 'Order Received').length}</div>
           </div>
           <div class="dark-card" style="border-top: 4px solid var(--success); padding: 20px;">
              <div style="color: var(--text-muted); text-transform: uppercase; font-size: 12px; font-weight: bold;">Completed Volume</div>
              <div style="font-size: 36px; font-weight: 800; color: white; margin-top: 5px;">₹${adminState.orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0)}</div>
           </div>
        </div>

        <div class="dark-card" style="padding: 0; overflow: hidden;">
            <div style="padding: 20px; border-bottom: 1px solid var(--border); background: #0f172a; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px;">Active Order Operations</h3>
                <span style="font-size: 12px; color: var(--text-muted);">Click any row to open Satellite Radar</span>
            </div>
            ${adminState.orders.length === 0 ? '<div style="padding: 40px; text-align: center; color: var(--text-muted);">No orders found in database.</div>' : `
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Order Target</th>
                            <th>Status Vector</th>
                            <th>Logistics Assignment</th>
                            <th>Gross Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${adminState.orders.map(order => `
                            <tr class="clickable order-row" data-id="${order._id}">
                                <td>
                                    <strong style="color: white; display: block;">${order.userEmail}</strong>
                                    <span style="color: var(--text-muted); font-size: 12px; font-family: monospace;">UUID: ${order._id.substring(order._id.length - 8)}</span>
                                </td>
                                <td>
                                    <span style="background: ${order.status === 'Completed' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)'}; color: ${order.status === 'Completed' ? '#34d399' : '#60a5fa'}; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                                        ${order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td onclick="event.stopPropagation();">
                                   ${order.status === 'Pending' || order.status === 'Order Received' ? `
                                      <div style="display: flex; gap: 5px;">
                                          <select id="partner-id-${order._id}" class="dark-input" style="padding: 6px; font-size: 12px; width: 140px;">
                                            <option value="">-- Target Fleet --</option>
                                            ${adminState.partners.map(p => `<option value="${p.mobile}">${p.name} [${p.mobile}]</option>`).join('')}
                                          </select>
                                          <input type="number" id="payout-${order._id}" placeholder="₹ Pay" class="dark-input" style="padding: 6px; font-size: 12px; width: 70px;">
                                          <button class="dark-btn assign-btn" data-id="${order._id}" style="padding: 6px 10px; font-size: 12px; width: auto;">Lock</button>
                                      </div>
                                  ` : `
                                      <div style="font-size: 13px;">
                                        <div style="font-weight: bold; color: white;">${adminState.partners.find(p => p.mobile === order.assignedPartner)?.name || order.assignedPartner || 'Unknown'}</div>
                                        <div style="color: var(--success);">Pay: ₹${order.partnerPayout || 0}</div>
                                      </div>
                                  `}
                                </td>
                                <td><strong style="font-size: 16px; color: var(--success);">₹${order.totalAmount}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
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
                                 <strong style="color: white; display: block; font-size: 15px;">${user.name}</strong>
                                 <span style="color: var(--text-muted); font-size: 11px;">Join: ${new Date(user.createdAt).toLocaleDateString()}</span>
                             </td>
                             <td>
                                 <div style="color: var(--text-main);">${user.mobile}</div>
                                 <div style="color: var(--text-muted); font-size: 12px;">${user.email || 'No email target'}</div>
                             </td>
                             <td>
                                 <strong style="font-size: 16px; color: var(--success); text-shadow: 0 0 5px rgba(16,185,129,0.3);">₹${user.walletBalance || 0}</strong>
                             </td>
                             <td>
                                 <span style="background: rgba(255,255,255,0.1); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">${user.role}</span>
                             </td>
                         </tr>
                     `).join('')}
                 </tbody>
             </table>
          </div>
       </div>
    `;
};

const renderFinanceView = () => {
  return `
       <div style="padding: 30px;" class="animate-fade-in">
          <h2 style="margin-bottom: 20px;">Financial Ledger Control</h2>
          <div class="dark-card">
              <p style="color: var(--text-muted); text-align: center; padding: 50px;">
                 <span style="font-size: 40px; display: block; margin-bottom: 10px;">🏦</span>
                 Master Ledger Module active. To execute financial overrides, access the specific entity profile via the <b>User Database</b> tab and engage Wallet Override protocols.
              </p>
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
        <div style="flex: 1; margin-left: 260px;">
          ${renderTopBar()}
          <div>
              ${adminState.view === 'dashboard' ? renderDashboardView() :
      adminState.view === 'users' ? renderUsersView() :
        renderFinanceView()
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
      renderApp();
    });
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
      const payout = parseFloat(document.getElementById(`payout-${orderId}`).value);

      if (!partnerId || isNaN(payout) || payout < 0) {
        alert('CRITICAL: Malformed assignment target or payout data.'); return;
      }

      e.target.innerText = '...';
      e.target.disabled = true;
      try {
        await api.assignOrder(orderId, partnerId, payout);
        await parallelFetchData();
        renderApp();
      } catch (error) {
        alert('Execute Failed: ' + error.message);
        e.target.innerText = 'Lock'; e.target.disabled = false;
      }
    });
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
      await api.adminUpdateUser(user._id, { name, mobile });
      // Update Wallet
      await api.adminUpdateWallet(user._id, newWallet);

      adminState.selectedUser = null;
      await parallelFetchData();
      renderApp();
    } catch (err) {
      alert("Override Failed: " + err.message);
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

    btn.innerText = 'DEPLOYING...';
    btn.disabled = true;

    try {
      await api.adminRegisterUser({ name, mobile, email, password, role });
      adminState.showRegisterModal = false;
      await parallelFetchData();
      renderApp();
      alert("Entity sequence deployed successfully.");
    } catch (err) {
      alert("Deployment Failed: " + err.message);
      btn.innerText = 'Execute Deployment';
      btn.disabled = false;
    }
  });
};

// Initialize App
renderApp();

import '/style.css';
import { api } from '../api.js';

const adminState = {
  user: null,
  view: 'dashboard',
  authMode: 'login', // 'login' or 'signup'
  orders: [],
  partners: [],
  users: []
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
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      padding: 24px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .dark-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 15px var(--accent-glow);
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
    .dark-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 8px var(--accent-glow);
    }
    .dark-input:-webkit-autofill,
    .dark-input:-webkit-autofill:hover, 
    .dark-input:-webkit-autofill:focus, 
    .dark-input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #0f172a inset !important;
        -webkit-text-fill-color: var(--text-main) !important;
        transition: background-color 5000s ease-in-out 0s;
    }
    .dark-btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      width: 100%;
    }
    .dark-btn:hover {
      background: #2563eb;
      box-shadow: 0 0 15px var(--accent-glow);
    }
    .dark-btn:active {
      transform: scale(0.98);
    }
    .sidebar-link {
      transition: background 0.2s, border-left 0.2s;
    }
    .sidebar-link:hover {
      background: rgba(59, 130, 246, 0.1) !important;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #0f172a;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      font-size: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      color: var(--text-main);
    }
    tr:hover td {
      background: rgba(255,255,255,0.02);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    @media (max-width: 768px) {
        .layout-wrapper { flex-direction: column !important; }
        .admin-sidebar { position: relative !important; width: 100% !important; height: auto !important; border-right: none !important; border-bottom: 1px solid var(--border); }
        .admin-main-content { margin-left: 0 !important; width: 100% !important; overflow-x: hidden; }
        .admin-nav { display: flex !important; overflow-x: auto !important; padding: 10px !important; }
        .sidebar-link { white-space: nowrap !important; }
        .stats-grid { grid-template-columns: 1fr !important; }
        .auth-card { padding: 20px !important; margin: 15px !important; }
        .dashboard-padding { padding: 15px !important; }
        .top-header { padding: 0 15px !important; }
        .ledger-grid { grid-template-columns: 1fr !important; }
    }
  </style>
`;

// --- Features List (30 Items) ---
const features = [
  { id: 'dashboard', icon: '📊', name: 'Overview & Assignment' },
  { id: 'wallets', icon: '💰', name: 'Wallet & Finance' },
  { id: 'export_csv', icon: '📥', name: 'Export to CSV' },
  { id: 'bulk_assign', icon: '📦', name: 'Bulk Assignment' },
  { id: 'revenue_charts', icon: '📈', name: 'Revenue Analytics' },
  { id: 'heatmaps', icon: '🗺️', name: 'Demand Heatmaps' },
  { id: 'activity_logs', icon: '📝', name: 'Activity & Audit Logs' },
  { id: 'disputes', icon: '⚖️', name: 'Dispute Resolution' },
  { id: 'inventory', icon: '🧴', name: 'Inventory Tracker' },
  { id: 'broadcast', icon: '📢', name: 'Broadcast Notifications' },
  { id: 'promos', icon: '🎟️', name: 'Promo Code Generator' },
  { id: 'delivery_routing', icon: '🚚', name: 'Delivery Routing' },
  { id: 'settings', icon: '⚙️', name: 'System Settings' },
  { id: 'staff_roles', icon: '👥', name: 'Staff Roles & Permissions' },
  { id: 'tax_reports', icon: '🧾', name: 'Tax & Compliance' },
  { id: 'subscriptions', icon: '🔁', name: 'Subscription Plans' },
  { id: 'feedback', icon: '⭐', name: 'Feedback & Reviews' },
  { id: 'reminders', icon: '⏱️', name: 'Automated Reminders' },
  { id: 'pricing', icon: '🏷️', name: 'Service Pricing Editor' },
  { id: 'multi_branch', icon: '🏢', name: 'Multi-Branch Support' },
  { id: 'fleet', icon: '🛵', name: 'Fleet Management' },
  { id: 'qa_checks', icon: '🔍', name: 'QA Checks' },
  { id: 'loyalty', icon: '🎁', name: 'Loyalty Program' },
  { id: 'marketing', icon: '💌', name: 'Marketing Campaigns' },
  { id: 'affiliates', icon: '🤝', name: 'Affiliate Management' },
  { id: 'vendors', icon: '🏭', name: 'Vendor Payments' },
  { id: 'lost_found', icon: '👕', name: 'Lost & Found Register' },
  { id: 'webhooks', icon: '🔌', name: 'API Webhooks' },
  { id: 'mobile_app', icon: '📱', name: 'Mobile App Settings' },
  { id: 'dev_tools', icon: '🛠️', name: 'Developer Tools' }
];

const renderAuth = () => {
  const isLogin = adminState.authMode === 'login';
  return `
    ${themeStyles}
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop') center/cover; position: relative;">
      <div style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);"></div>
      <div class="auth-card dark-card animate-fade-in" style="width: 100%; max-width: 400px; text-align: center; position: relative; z-index: 1;">
        <h1 style="color: var(--text-main); margin-bottom: 5px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 0 20px var(--accent-glow);">VASTRA<span style="color: var(--accent)">ADMIN</span></h1>
        <p style="color: var(--text-muted); margin-bottom: 30px;">Secure Management Portal</p>
        
        <form id="admin-auth-form" style="display: flex; flex-direction: column; gap: 15px;">
          ${!isLogin ? `<input type="text" id="admin-name" placeholder="Full Name" required class="dark-input">` : ''}
          <input type="text" id="admin-mobile" placeholder="Mobile Number" required class="dark-input">
          ${!isLogin ? `<input type="email" id="admin-email" placeholder="Email Address (Optional)" class="dark-input">` : ''}
          <input type="password" id="admin-password" placeholder="Password" required class="dark-input">
          
          <button type="submit" class="dark-btn" style="margin-top: 10px;">
            ${isLogin ? 'Authenticate' : 'Register Admin Account'}
          </button>
        </form>
        
        <p id="admin-error" style="color: #ef4444; margin-top: 15px; font-size: 14px; display: none;"></p>
        
        <div style="margin-top: 25px; border-top: 1px solid var(--border); padding-top: 20px;">
            <p style="color: var(--text-muted); font-size: 14px;">
              ${isLogin ? "Don't have an admin key?" : "Already have access?"} 
              <a href="#" id="toggle-auth" style="color: var(--accent); text-decoration: none; font-weight: 600;">
                ${isLogin ? 'Request Access (Sign Up)' : 'Login Here'}
              </a>
            </p>
        </div>
      </div>
    </div>
  `;
};

const renderSidebar = () => {
  return `
      <aside class="admin-sidebar" style="width: 260px; background: var(--bg-card); border-right: 1px solid var(--border); height: 100vh; position: fixed; overflow-y: auto; display: flex; flex-direction: column; z-index: 20;">
        <div style="padding: 24px; border-bottom: 1px solid var(--border);">
          <h2 style="color: var(--text-main); font-size: 20px; font-weight: 800; margin: 0; text-shadow: 0 0 10px var(--accent-glow);">VASTRA<span style="color: var(--accent)">ADMIN</span></h2>
          <p style="font-size: 12px; color: var(--success); margin-top: 4px; display: flex; align-items: center; gap: 6px;"><span style="display:inline-block; width:8px; height:8px; background:var(--success); border-radius:50%; box-shadow: 0 0 8px var(--success);"></span> Systems Online</p>
        </div>
        <nav class="admin-nav" style="flex: 1; padding: 15px 0;">
          ${features.map(f => `
            <a href="#" class="sidebar-link ${adminState.view === f.id ? 'active' : ''}" data-view="${f.id}" style="
                display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: ${adminState.view === f.id ? 'white' : 'var(--text-muted)'}; 
                text-decoration: none; font-size: 14px; background: ${adminState.view === f.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent'};
                border-left: 3px solid ${adminState.view === f.id ? 'var(--accent)' : 'transparent'};
            ">
              <span style="font-size: 16px;">${f.icon}</span> ${f.name}
            </a>
          `).join('')}
        </nav>
        <div style="padding: 24px; border-top: 1px solid var(--border);">
            <button id="admin-logout-btn" style="width: 100%; padding: 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s;">Terminate Session</button>
        </div>
      </aside>
    `;
};

const renderTopBar = () => {
  return `
        <header class="top-header" style="height: 70px; background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; position: sticky; top: 0; z-index: 10;">
            <h2 style="font-size: 18px; color: var(--text-main); font-weight: 600;">${features.find(f => f.id === adminState.view)?.name || 'Admin'}</h2>
            <div style="display: flex; gap: 15px; align-items: center;">
                <span style="font-size: 14px; color: var(--text-muted);">Commander ${adminState.user.name}</span>
                <div style="width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent), #indigo); border: 2px solid var(--border); box-shadow: 0 0 10px var(--accent-glow); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                    ${adminState.user.name.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    `;
}

const renderDashboard = () => {
  const pendingOrders = adminState.orders.filter(o => o.status === 'Pending' || o.status === 'Order Received');
  const completedOrders = adminState.orders.filter(o => o.status === 'Completed');

  let totalRevenue = adminState.orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  let totalPayouts = completedOrders.reduce((acc, o) => acc + (o.partnerPayout || 0), 0);

  return `
      <div style="padding: 30px;" class="animate-fade-in dashboard-padding">
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;">
          <div class="dark-card" style="border-top: 4px solid var(--accent);">
            <h3 style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Pending Orders</h3>
            <p style="font-size: 32px; font-weight: 800; color: white; margin-top: 10px;">${pendingOrders.length}</p>
          </div>
          <div class="dark-card" style="border-top: 4px solid var(--success);">
            <h3 style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Total Revenue</h3>
            <p style="font-size: 32px; font-weight: 800; color: white; margin-top: 10px;">$${totalRevenue.toFixed(2)}</p>
          </div>
          <div class="dark-card" style="border-top: 4px solid var(--warning);">
            <h3 style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Partner Payouts</h3>
            <p style="font-size: 32px; font-weight: 800; color: white; margin-top: 10px;">$${totalPayouts.toFixed(2)}</p>
          </div>
          <div class="dark-card" style="border-top: 4px solid #8b5cf6;">
            <h3 style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Active Partners</h3>
            <p style="font-size: 32px; font-weight: 800; color: white; margin-top: 10px;">${adminState.partners.length}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px; margin-bottom: 20px;">
            <h2 style="font-weight: 600;">Command Center Override</h2>
            <button id="refresh-data-btn" class="dark-btn" style="width: auto; padding: 10px 20px; font-size: 14px;">Sync Database</button>
        </div>

        <div class="dark-card" style="padding: 0; overflow: hidden; overflow-x: auto;">
            ${adminState.orders.length === 0 ? '<p style="padding: 30px; text-align: center; color: var(--text-muted);">No logs detected.</p>' : `
                <table style="min-width: 900px;">
                    <thead>
                        <tr>
                            <th>Order Details</th>
                            <th>Customer Target</th>
                            <th>Transaction</th>
                            <th>Status Vector</th>
                            <th>Partner Override</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${adminState.orders.map(order => `
                            <tr>
                                <td>
                                    <div style="font-weight: 600; color: white;">#${order._id.substring(order._id.length - 8).toUpperCase()}</div>
                                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${order.date}</div>
                                </td>
                                <td>${order.userEmail}</td>
                                <td style="font-weight: bold; color: var(--success);">$${order.totalAmount}</td>
                                <td>
                                    <span style="background: ${order.status === 'Completed' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)'}; color: ${order.status === 'Completed' ? '#34d399' : '#60a5fa'}; border: 1px solid ${order.status === 'Completed' ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-shadow: 0 0 10px rgba(255,255,255,0.2);">
                                        ${order.status}
                                    </span>
                                </td>
                                <td>
                                  ${order.status === 'Pending' || order.status === 'Order Received' ? `
                                      <div style="display: flex; gap: 8px; flex-direction: column;">
                                          <select id="partner-id-${order._id}" class="dark-input" style="padding: 8px; font-size: 13px;">
                                            <option value="">-- Target Operator --</option>
                                            ${adminState.partners.map(p => `<option value="${p.mobile}">${p.name} [${p.mobile}]</option>`).join('')}
                                          </select>
                                          <div style="display: flex; gap: 8px;">
                                            <input type="number" id="payout-${order._id}" placeholder="Payout ($)" class="dark-input" style="padding: 8px; font-size: 13px;">
                                            <button class="dark-btn assign-btn" data-id="${order._id}" style="padding: 8px; font-size: 13px;">Lock In</button>
                                          </div>
                                      </div>
                                  ` : `
                                      <div style="font-size: 13px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
                                        <div style="color: var(--text-muted);">Operator:</div>
                                        <div style="font-weight: 600; color: white;">${adminState.partners.find(p => p.mobile === order.assignedPartner)?.name || order.assignedPartner || 'Unknown'}</div>
                                        <div style="color: var(--success); font-weight: bold; margin-top: 4px;">Comm: $${order.partnerPayout || 0}</div>
                                      </div>
                                  `}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `}
        </div>
      </div>
    `;
}

const renderWallets = () => {
  const customers = adminState.users.filter(u => u.role === 'customer');
  const partners = adminState.users.filter(u => u.role === 'partner');

  const calculatePendingPayout = (partnerMobile) => {
    return adminState.orders
      .filter(o => o.assignedPartner === partnerMobile && o.status === 'Completed' && !o.payoutExecuted)
      .reduce((sum, o) => sum + (o.partnerPayout || 0), 0);
  };

  return `
      <div style="padding: 30px;" class="animate-fade-in dashboard-padding">
        <h2 style="margin-bottom: 20px; font-weight: 600;">Global Ledger</h2>
        <p style="color: var(--text-muted); margin-bottom: 30px;">Track encrypted decentralized balances and payouts.</p>
        
        <div class="ledger-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div class="dark-card" style="padding: 0;">
                <div style="padding: 20px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2);">
                    <h3 style="margin:0; font-size: 16px;">Customer Holdings</h3>
                </div>
                <div style="padding: 10px 20px;">
                    ${customers.length === 0 ? '<p style="color:var(--text-muted);">No entries.</p>' : customers.map(c => `
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 16px 0;">
                            <div>
                                <strong style="display: block; color: white;">${c.name}</strong>
                                <small style="color: var(--text-muted);">${c.mobile} | ${c.email || 'Encrypted'}</small>
                            </div>
                            <div style="text-align: right;">
                                <strong style="display: block; color: var(--accent); font-size: 18px; text-shadow: 0 0 10px var(--accent-glow);">$${c.walletBalance}</strong>
                                <small style="color: var(--text-muted);">VC: ${c.vastraCoins}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="dark-card" style="padding: 0;">
                <div style="padding: 20px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2);">
                    <h3 style="margin:0; font-size: 16px;">Operator Yields</h3>
                </div>
                <div style="padding: 10px 20px;">
                    ${partners.length === 0 ? '<p style="color:var(--text-muted);">No operating units.</p>' : partners.map(p => {
    const pendingInfo = calculatePendingPayout(p.mobile);
    return `
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 16px 0;">
                            <div>
                                <strong style="display: block; color: white;">${p.name}</strong>
                                <small style="color: var(--text-muted);">${p.mobile} | ${p.partnerStatus ? p.partnerStatus.toUpperCase() : 'ACTIVE'}</small>
                            </div>
                            <div style="text-align: right;">
                                <strong style="display: block; color: var(--success); font-size: 18px; text-shadow: 0 0 10px rgba(16,185,129,0.4);">$${pendingInfo.toFixed(2)}</strong>
                                ${pendingInfo > 0 ? `<button class="execute-payout-btn" data-mobile="${p.mobile}" style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 4px 10px; border-radius: 4px; font-size: 12px; margin-top: 8px; cursor: pointer; transition: all 0.2s;">Execute Transfer</button>` : `<span style="font-size: 12px; color: var(--text-muted); display: block; margin-top: 8px;">Settled ✓</span>`}
                            </div>
                        </div>
                        `;
  }).join('')}
                </div>
            </div>
        </div>
      </div>
    `;
};

const renderPlaceholder = (feature) => {
  return `
      <div class="animate-fade-in" style="padding: 30px; height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <div style="font-size: 72px; margin-bottom: 20px; text-shadow: 0 0 30px var(--accent-glow);">${feature.icon}</div>
        <h2 style="margin-bottom: 15px; color: white; font-weight: 800; font-size: 28px;">${feature.name}</h2>
        <p style="color: var(--text-muted); max-width: 500px; text-align: center; line-height: 1.6; font-size: 16px;">
            This module is encrypted and currently under construction in the mainframe. 
            Awaiting Phase 2.5 decryption sequence.
        </p>
        <button class="dark-btn" style="margin-top: 30px; width: auto; padding: 12px 30px; box-shadow: 0 0 20px var(--accent-glow);">Access Override Code</button>
      </div>
    `;
};

// --- Main Render Engine ---
const renderApp = () => {
  const root = document.querySelector('#admin-app');

  if (!adminState.user) {
    root.innerHTML = `${themeStyles}${renderAuth()}`;
    attachAuthEvents();
    return;
  }

  root.innerHTML = `
    ${themeStyles}
    <div class="layout-wrapper" style="display: flex; background: var(--bg-dark); min-height: 100vh;">
      ${renderSidebar()}
      <div class="admin-main-content" style="flex: 1; margin-left: 260px;">
        ${renderTopBar()}
        <div id="admin-content">
            ${adminState.view === 'dashboard' ? renderDashboard() :
      adminState.view === 'wallets' ? renderWallets() :
        renderPlaceholder(features.find(f => f.id === adminState.view))
    }
        </div>
      </div>
    </div>
  `;
  attachAppEvents();
};

const attachAuthEvents = () => {
  // Toggle Login/Signup
  document.getElementById('toggle-auth').addEventListener('click', (e) => {
    e.preventDefault();
    adminState.authMode = adminState.authMode === 'login' ? 'signup' : 'login';
    renderApp();
  });

  document.getElementById('admin-auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mobile = document.getElementById('admin-mobile').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const errorEl = document.getElementById('admin-error');
    const submitBtn = e.target.querySelector('button');

    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Processing...';

    try {
      if (adminState.authMode === 'signup') {
        const name = document.getElementById('admin-name').value.trim();
        const email = document.getElementById('admin-email').value.trim();

        await api.signup({ name, mobile, password, email, role: 'admin' });
        alert('Admin account created! You can now log in.');
        adminState.authMode = 'login';
        renderApp();
        return;
      }

      // Login Flow
      const res = await api.signin({ mobile, password });
      if (res.user.role !== 'admin') {
        throw new Error("Clearance Denied. You are not a registered Admin.");
      }

      errorEl.style.display = 'none';
      adminState.user = res.user;

      adminState.orders = await api.getAllOrders();
      adminState.partners = await api.getAllPartners();
      adminState.users = await api.getAllUsers();
      renderApp();
    } catch (err) {
      submitBtn.innerText = originalText;
      errorEl.innerText = ">> " + (err.message || "Failed.");
      errorEl.style.display = 'block';
    }
  });
};

const attachAppEvents = () => {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      adminState.view = e.currentTarget.dataset.view;
      renderApp();
    });
  });

  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    adminState.user = null;
    renderApp();
  });

  const refreshBtn = document.getElementById('refresh-data-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.innerText = 'Syncing...';
      refreshBtn.style.opacity = '0.7';
      adminState.orders = await api.getAllOrders();
      adminState.partners = await api.getAllPartners();
      adminState.users = await api.getAllUsers();
      renderApp();
    });
  }

  document.querySelectorAll('.assign-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const orderId = e.target.dataset.id;
      const partnerIdInput = document.getElementById(`partner-id-${orderId}`);
      const payoutInput = document.getElementById(`payout-${orderId}`);

      const partnerId = partnerIdInput.value.trim();
      const payout = parseFloat(payoutInput.value);

      if (!partnerId) {
        alert('CRITICAL: Select a Target Operator.');
        return;
      }
      if (isNaN(payout) || payout < 0) {
        alert('CRITICAL: Invalid payout trajectory.');
        return;
      }

      e.target.innerText = 'Executing...';
      e.target.style.background = 'var(--warning)';
      e.target.disabled = true;

      try {
        await api.assignOrder(orderId, partnerId, payout);
        adminState.orders = await api.getAllOrders();
        renderApp();
      } catch (error) {
        alert('Execute Failed: ' + error.message);
        e.target.innerText = 'Lock In';
        e.target.style.background = 'var(--accent)';
        e.target.disabled = false;
      }
    });
  });

  document.querySelectorAll('.execute-payout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mobile = e.target.dataset.mobile;
      e.target.innerText = 'Processing...';
      e.target.style.opacity = '0.5';

      // Simulate API call to mark payouts as executed
      setTimeout(() => {
        adminState.orders.forEach(o => {
          if (o.assignedPartner === mobile && o.status === 'Completed' && !o.payoutExecuted) {
            o.payoutExecuted = true;
          }
        });
        renderApp();
      }, 800);
    });
  });
}

renderApp();

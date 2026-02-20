import '/style.css';
import { api } from '../api.js';

const partnerState = {
  user: null,
  authMode: 'login', // 'login' or 'signup'
  orders: [],
  activeOrderModal: null // ID of the currently viewed order
};

// --- Custom Theme ---
const themeStyles = `
  <style>
    :root {
      --bg-dark: #0f172a;
      --bg-card: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #10b981; /* Emerald green accent for partners */
      --accent-glow: rgba(16, 185, 129, 0.4);
      --border: #334155;
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
      background: #059669;
      box-shadow: 0 0 15px var(--accent-glow);
    }
    .dark-btn:active {
      transform: scale(0.98);
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
        .stats-grid { grid-template-columns: 1fr !important; }
        .auth-card { padding: 20px !important; margin: 15px !important; }
        header { flex-direction: column !important; align-items: flex-start !important; gap: 15px !important; padding-bottom: 15px !important; }
        .dashboard-container { padding: 15px !important; }
        .table-wrapper { padding: 0 !important; }
    }
  </style>
`;

// Login/Signup UI
const renderAuth = () => {
  const isLogin = partnerState.authMode === 'login';
  return `
      ${themeStyles}
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: url('https://images.unsplash.com/photo-1587820792019-33bde14457ae?q=80&w=2070&auto=format&fit=crop') center/cover; position: relative;">
        <div style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);"></div>
        
        <div class="auth-card dark-card animate-fade-in" style="width: 100%; max-width: 400px; text-align: center; position: relative; z-index: 1;">
          <h1 style="color: var(--text-main); margin-bottom: 5px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 0 20px var(--accent-glow);">VASTRA<span style="color: var(--accent)">PARTNER</span></h1>
          <p style="color: var(--text-muted); margin-bottom: 30px;">Field Operations Portal</p>
          
          <form id="partner-auth-form" style="display: flex; flex-direction: column; gap: 15px;">
            ${!isLogin ? `<input type="text" id="partner-name" placeholder="Full Legal Name" required class="dark-input">` : ''}
            <input type="text" id="partner-mobile" placeholder="Mobile Number" required class="dark-input">
            ${!isLogin ? `<input type="email" id="partner-email" placeholder="Email Address (Optional)" class="dark-input">` : ''}
            <input type="password" id="partner-password" placeholder="Passcode" required class="dark-input">
            
            <button type="submit" class="dark-btn" style="margin-top: 10px;">
              ${isLogin ? 'Initialize Session' : 'Apply as Operator'}
            </button>
          </form>
          
          <p id="partner-error" style="color: var(--danger); margin-top: 15px; font-size: 14px; display: none;"></p>
          
          <div style="margin-top: 25px; border-top: 1px solid var(--border); padding-top: 20px;">
              <p style="color: var(--text-muted); font-size: 14px;">
                ${isLogin ? "Not registered in the fleet?" : "Already an operator?"} 
                <a href="#" id="toggle-auth" style="color: var(--accent); text-decoration: none; font-weight: 600;">
                  ${isLogin ? 'Join the Fleet (Sign Up)' : 'Login Here'}
                </a>
              </p>
          </div>
        </div>
      </div>
    `;
};

// Dashboard UI
const renderDashboard = () => {
  const newOrders = partnerState.orders.filter(o => o.status === 'Assigned' || o.status === 'Pending');
  const earnings = partnerState.orders
    .filter(o => o.status === 'Completed')
    .reduce((acc, order) => acc + (order.partnerPayout || 0), 0);
  const activeJobs = partnerState.orders.filter(o => ['Processing', 'Washing', 'Ironing', 'Out for Delivery'].includes(o.status));

  return `
        ${themeStyles}
        <div class="dashboard-container animate-fade-in" style="padding: 20px; max-width: 1000px; margin: 0 auto;">
            <header style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 30px;">
              <div style="h2">
                <h2 style="color: var(--text-main); font-weight: 800; margin: 0; text-shadow: 0 0 10px var(--accent-glow);">VASTRA<span style="color: var(--accent)">PARTNER</span></h2>
                <div style="display: flex; align-items: center; gap: 6px; margin-top: 5px; font-size: 13px; color: var(--accent);">
                    <span style="display:inline-block; width:8px; height:8px; background:var(--accent); border-radius:50%; box-shadow: 0 0 8px var(--accent);"></span>
                    Ready for duty
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                  <span style="font-weight: 500; color: var(--text-muted);">Operator: <span style="color: white">${partnerState.user.name.split(' ')[0]}</span></span>
                  <button id="partner-logout-btn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--danger); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: background 0.2s;">Secure Logout</button>
              </div>
            </header>
            
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div class="dark-card" style="border-top: 4px solid var(--accent);">
                  <h3 style="font-size: 14px; color: var(--text-muted); text-transform: uppercase;">New Assignments</h3>
                  <p style="font-size: 32px; font-weight: 800; color: white; margin-top: 10px; text-shadow: 0 0 15px var(--accent-glow);">${newOrders.length}</p>
                </div>
                <div class="dark-card" style="border-top: 4px solid var(--warning);">
                  <h3 style="font-size: 14px; color: var(--text-muted); text-transform: uppercase;">Active Jobs</h3>
                  <p style="font-size: 32px; font-weight: 800; color: white; margin-top: 10px;">${activeJobs.length}</p>
                </div>
                <div class="dark-card" style="border-top: 4px solid #3b82f6;">
                  <h3 style="font-size: 14px; color: var(--text-muted); text-transform: uppercase;">Cleared Payouts</h3>
                  <p style="font-size: 32px; font-weight: 800; color: #60a5fa; margin-top: 10px;">$${earnings.toFixed(2)}</p>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px; margin-bottom: 20px;">
                 <h2 style="font-weight: 600;">Active Directives</h2>
                 <button id="partner-refresh-btn" class="dark-btn" style="width: auto; padding: 10px 20px; font-size: 14px;">Sync Terminal</button>
              </div>

              <div class="table-wrapper dark-card" style="padding: 0; overflow-x: auto;">
              ${partnerState.orders.length === 0 ? '<p style="padding: 30px; text-align: center; color: var(--text-muted);">No assignments matching operative code.</p>' : `
                      <table style="min-width: 700px;">
                          <thead>
                              <tr>
                                  <th>Directive Code</th>
                                  <th>Target Client</th>
                                  <th>Commission</th>
                                  <th>Operational Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${partnerState.orders.map(order => `
                                  <tr>
                                      <td>
                                        <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 4px;">${order.date}</div>
                                        <div style="font-weight: 600; color: white; letter-spacing: 1px;">#${order._id.substring(order._id.length - 8).toUpperCase()}</div>
                                      </td>
                                      <td>${order.userEmail}</td>
                                      <td style="font-weight: bold; color: var(--accent);">$${order.partnerPayout || 0}</td>
                                      <td>
                                        <div style="display: flex; gap: 10px; align-items: center;">
                                            <span style="background: rgba(16,185,129,0.1); color: var(--accent); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${order.status}</span>
                                            <button class="dark-btn open-order-btn" data-id="${order._id}" style="width: auto; padding: 6px 12px; font-size: 12px; margin-left: auto;">Manage Data</button>
                                        </div>
                                      </td>
                                  </tr>
                              `).join('')}
                          </tbody>
                      </table>
                  `}
              </div>
            </main>
            ${renderOrderModal()}
        </div>
    `;
};

const renderOrderModal = () => {
  if (!partnerState.activeOrderModal) return '';
  const order = partnerState.orders.find(o => o._id === partnerState.activeOrderModal);
  if (!order) return '';

  const steps = ['Order Received', 'Washing', 'Ironing', 'Ready for Pickup', 'Completed'];
  const currentIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

  return `
      <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100;" class="animate-fade-in" id="order-modal-backdrop">
          <div class="dark-card" style="width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;">
              <button id="close-modal-btn" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer;">&times;</button>
              
              <h2 style="margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid var(--border);">Directive #${order._id.substring(order._id.length - 8).toUpperCase()}</h2>
              
              <div style="margin: 20px 0; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                  <h4 style="margin: 0 0 10px 0; color: var(--text-muted);">Task Details</h4>
                  ${order.items.map(item => `
                      <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
                          <span>${item.itemName} (${item.serviceName}) x${item.quantity || item.qty}</span>
                      </div>
                  `).join('')}
                  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border); display: flex; justify-content: space-between; font-weight: bold;">
                      <span>Expected Comm:</span>
                      <span style="color: var(--accent);">$${order.partnerPayout || 0}</span>
                  </div>
              </div>

              <h4 style="margin-bottom: 15px;">Progress Synchronization</h4>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                  ${steps.map((step, idx) => {
    const isCompleted = idx <= currentIndex;
    const isNext = idx === currentIndex + 1;
    const btnStyle = isCompleted ? 'background: rgba(16,185,129,0.1); border-color: var(--accent); color: var(--accent);' :
      (isNext ? 'background: var(--accent); color: white; border-color: var(--accent);' : 'background: rgba(255,255,255,0.05); color: var(--text-muted); border-color: var(--border);');
    return `
                          <button class="dark-btn status-update-btn" data-status="${step}" data-id="${order._id}" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border: 1px solid transparent; ${btnStyle}" ${!isNext && !isCompleted ? 'disabled' : ''}>
                              <span style="font-weight: 600;">${step}</span>
                              <span>${isCompleted ? '✓' : (isNext ? 'Execute' : 'Locked')}</span>
                          </button>
                      `;
  }).join('')}
              </div>
          </div>
      </div>
    `;
};

// App Controller
const renderPartnerApp = () => {
  const root = document.querySelector('#partner-app');

  if (!partnerState.user) {
    root.innerHTML = renderAuth();
    attachAuthEvents();
    return;
  }

  root.innerHTML = renderDashboard();
  attachAppEvents();
};

const attachAuthEvents = () => {
  document.getElementById('toggle-auth').addEventListener('click', (e) => {
    e.preventDefault();
    partnerState.authMode = partnerState.authMode === 'login' ? 'signup' : 'login';
    renderPartnerApp();
  });

  document.getElementById('partner-auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mobile = document.getElementById('partner-mobile').value.trim();
    const password = document.getElementById('partner-password').value.trim();
    const errorEl = document.getElementById('partner-error');
    const submitBtn = e.target.querySelector('button');

    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Connecting...';

    try {
      if (partnerState.authMode === 'signup') {
        const name = document.getElementById('partner-name').value.trim();
        const email = document.getElementById('partner-email').value.trim();

        await api.signup({ name, mobile, password, email, role: 'partner' });
        alert('Operator account established. You may now login.');
        partnerState.authMode = 'login';
        renderPartnerApp();
        return;
      }

      const res = await api.signin({ mobile, password });
      if (res.user.role !== 'partner') {
        throw new Error("Access Denied. You are not registered as an operator.");
      }

      errorEl.style.display = 'none';
      partnerState.user = res.user;
      partnerState.orders = await api.getPartnerOrders(partnerState.user.mobile);

      renderPartnerApp();
    } catch (err) {
      submitBtn.innerText = originalText;
      errorEl.innerText = ">> " + (err.message || "Login failed.");
      errorEl.style.display = 'block';
    }
  });
};

const attachAppEvents = () => {
  document.getElementById('partner-logout-btn').addEventListener('click', () => {
    partnerState.user = null;
    renderPartnerApp();
  });

  const refreshBtn = document.getElementById('partner-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.innerText = 'Syncing...';
      refreshBtn.style.opacity = '0.5';
      try {
        partnerState.orders = await api.getPartnerOrders(partnerState.user.mobile);
        renderPartnerApp();
      } catch (err) {
        alert('Terminal Sync Failed.');
        refreshBtn.innerText = 'Sync Terminal';
        refreshBtn.style.opacity = '1';
      }
    });
  }

  document.querySelectorAll('.open-order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      partnerState.activeOrderModal = e.target.dataset.id;
      renderPartnerApp();
    });
  });

  const closeBtn = document.getElementById('close-modal-btn');
  const backdrop = document.getElementById('order-modal-backdrop');
  if (closeBtn) closeBtn.addEventListener('click', () => { partnerState.activeOrderModal = null; renderPartnerApp(); });
  if (backdrop) backdrop.addEventListener('click', (e) => { if (e.target === backdrop) { partnerState.activeOrderModal = null; renderPartnerApp(); } });

  document.querySelectorAll('.status-update-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const btnEl = e.currentTarget;
      const orderId = btnEl.dataset.id;
      const newStatus = btnEl.dataset.status;

      // Prevent re-updating current or past statuses
      const order = partnerState.orders.find(o => o._id === orderId);
      const steps = ['Order Received', 'Washing', 'Ironing', 'Ready for Pickup', 'Completed'];
      if (steps.indexOf(newStatus) <= steps.indexOf(order.status)) return;

      const originalHtml = btnEl.innerHTML;
      btnEl.innerHTML = '<span style="margin: 0 auto;">Syncing...</span>';

      try {
        await api.updateOrderStatus(orderId, newStatus);
        partnerState.orders = await api.getPartnerOrders(partnerState.user.mobile);
        renderPartnerApp();
      } catch (err) {
        alert('Update Broadcast Failed: ' + err.message);
        btnEl.innerHTML = originalHtml;
      }
    });
  });
};

renderPartnerApp();

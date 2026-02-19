import { getUserData } from '../data/mock-data.js';

export function renderProfile(user, orders, onLogout) {
  const ext = getUserData(user.email);

  const content = `
    <div class="page-content">
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="width: 80px; height: 80px; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; border: 4px solid white; box-shadow: var(--shadow-md);">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <h2>${user.name}</h2>
        <p style="color: #64748b;">${user.email}</p>
        <div class="glass-card" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; margin-top: 1rem; border-radius: 20px; background: rgba(255, 255, 255, 0.5);">
             <span style="font-size: 1.2rem;">🪙</span> 
             <span style="font-weight: 700; color: #d97706;">${ext.vastraCoins} Coins</span>
        </div>
      </div>

      <!-- Digital Wallet -->
      <div class="glass-card" style="padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem; background: linear-gradient(135deg, #1e293b, #334155); color: white;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <p style="opacity: 0.8; font-size: 0.9rem;">Vastra Wallet Balance</p>
                <h2 style="font-size: 2rem; font-weight: 700;">$${ext.walletBalance.toFixed(2)}</h2>
            </div>
            <button id="add-money-btn" class="auth-btn" style="width: auto; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); margin-top: 0;">+ Add Money</button>
        </div>
      </div>

      <!-- Saved Addresses -->
      <div class="profile-section glass-card" style="margin-bottom: 1.5rem; padding: 1.5rem; border-radius: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3>Saved Addresses</h3>
            <button id="add-address-btn" style="color: #3b82f6; background: none; font-weight: 600; cursor: pointer; border: none;">+ Add New</button>
        </div>
        ${ext.savedAddresses.map(addr => `
            <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <div style="font-size: 1.5rem;">${addr.type === 'Home' ? '🏠' : '🏢'}</div>
                <div>
                    <h4 style="margin:0;">${addr.type}</h4>
                    <p style="margin:0; font-size: 0.85rem; color: #64748b;">${addr.text}</p>
                </div>
            </div>
        `).join('')}
      </div>

        <!-- Referral & Earn -->
      <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.5rem; border-radius: 16px; background: linear-gradient(135deg, #ecfdf5, #d1fae5);">
        <h3 style="color: #047857; margin-bottom: 0.5rem;">💌 Refer & Earn</h3>
        <p style="color: #065f46; font-size: 0.9rem; margin-bottom: 1rem;">Invite a friend and you both get <strong>$10 in Vastra Wallet</strong>.</p>
        <div style="display: flex; gap: 0.5rem;">
            <input type="text" value="VASTRA-MAHA-2026" readonly style="background: white; border: 1px dashed #059669; color: #059669; font-weight: 700; text-align: center; border-radius: 8px;">
            <button id="copy-referral-btn" class="auth-btn" style="width: auto; background: #059669; margin-top: 0;">Copy</button>
        </div>
      </div>

      <div class="profile-section" style="background: white; border-radius: 16px; padding: 1.5rem; box-shadow: var(--shadow-sm);">
        <h3 style="margin-bottom: 1.5rem;">Order History</h3>
        ${orders.length === 0 ? `
          <p style="text-align: center; color: #94a3b8; padding: 2rem 0;">No orders yet.</p>
        ` : `
          <div class="history-list">
            ${orders.map(order => `
              <div class="history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #f1f5f9;">
                <div>
                  <h4 style="margin:0">#${order.id}</h4>
                  <p style="margin:0; font-size: 0.8rem; color: #64748b;">${order.date} • ${order.items.length} items</p>
                </div>
                <div style="text-align: right;">
                  <span style="display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; background: #dcfce7; color: #166534; margin-bottom: 0.5rem;">${order.status}</span>
                  <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                     <button class="invoice-btn" onclick="alert('Downloading invoice...')" style="font-size: 0.7rem; color: #3b82f6; border: 1px solid #3b82f6; padding: 0.2rem 0.8rem; border-radius: 9999px; background: transparent;">Invoice</button>
                     <button class="reorder-btn" data-id="${order.id}" style="font-size: 0.7rem; color: #6366f1; border: 1px solid #6366f1; padding: 0.2rem 0.8rem; border-radius: 9999px; background: transparent;">Buy Again</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <div style="margin-top: 2rem;">
        <button id="logout-btn-real" class="auth-btn" style="background: #fee2e2; color: #ef4444; border: 1px solid #fecaca;">Logout</button>
      </div>
       <!-- Floating Help Chat -->
      <button class="fab-chat" onclick="alert('Chat with Support Connected! 🎧')" style="position: fixed; bottom: 2rem; right: 2rem; width: 60px; height: 60px; border-radius: 50%; background: #3b82f6; color: white; border: none; font-size: 1.5rem; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
        💬
      </button>
    </div>
  `;

  return content;
}

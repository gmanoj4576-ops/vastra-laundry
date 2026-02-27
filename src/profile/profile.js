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
            <button id="add-money-btn" class="auth-btn" style="width: auto; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); margin-top: 0; backdrop-filter: blur(10px);">+ Add Money</button>
        </div>
      </div>

      <!-- Saved Addresses -->
      <div class="profile-section glass-card" style="margin-bottom: 1.5rem; padding: 1.5rem; border-radius: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3>Saved Addresses</h3>
            <button id="add-address-btn" class="text-btn" style="margin: 0; padding: 0.25rem 0.75rem;">+ Add New</button>
        </div>
        ${ext.savedAddresses.map(addr => `
            <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <div style="font-size: 1.5rem;">${addr.type === 'Home' ? '🏠' : '🏢'}</div>
                <div style="flex: 1;">
                    <h4 style="margin:0;">${addr.type}</h4>
                    <p style="margin:0; font-size: 0.85rem; color: #64748b;">${addr.text}</p>
                </div>
                <button class="edit-address-btn text-btn" data-id="${addr.id}" style="font-size: 0.75rem; color: #3b82f6;">Edit</button>
            </div>
        `).join('')}
      </div>

        <!-- Referral & Earn -->
      <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.5rem; border-radius: 16px; background: linear-gradient(135deg, #ecfdf5, #d1fae5);">
        <h3 style="color: #047857; margin-bottom: 0.5rem;">💌 Refer & Earn</h3>
        <p style="color: #065f46; font-size: 0.9rem; margin-bottom: 1rem;">Invite a friend and you both get <strong>$10 in Vastra Wallet</strong>.</p>
        <div style="display: flex; gap: 0.5rem;">
            <input type="text" value="VASTRA-MAHA-2026" readonly style="background: white; border: 1px dashed #059669; color: #059669; font-weight: 700; text-align: center; border-radius: 8px;">
            <button id="copy-referral-btn" class="auth-btn" style="width: auto; background: linear-gradient(135deg, #059669, #10b981); margin-top: 0; padding: 0.5rem 1.5rem;">Copy</button>
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
                  <h4 style="margin:0">#${(order._id || order.id || 'N/A').toString().slice(-6).toUpperCase()}</h4>
                  <p style="margin:0; font-size: 0.8rem; color: #64748b;">${order.date} • ${order.items.length} items</p>
                </div>
                <div style="text-align: right;">
                  <span style="display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; background: #dcfce7; color: #166534; margin-bottom: 0.5rem;">${order.status}</span>
                  <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                     <button class="invoice-btn text-btn" onclick="alert('Downloading invoice...')" style="font-size: 0.75rem; border: 1px solid currentColor; margin: 0; padding: 0.3rem 1rem;">Invoice</button>
                     <button class="reorder-btn text-btn" data-id="${order._id || order.id}" style="font-size: 0.75rem; color: #6366f1; border: 1px solid currentColor; margin: 0; padding: 0.3rem 1rem;">Buy Again</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <div style="margin-top: 2rem;">
        <button id="logout-btn-real" class="auth-btn" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; font-weight: 700;">Logout</button>
      </div>
       <!-- Floating Help Chat -->
      <button class="fab-chat" onclick="alert('Chat with Support Connected! 🎧')" style="position: fixed; bottom: 2rem; right: 2rem; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; font-size: 1.5rem; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1000;" onmouseover="this.style.transform='scale(1.1) translateY(-5px)'" onmouseout="this.style.transform='scale(1) translateY(0)'">
        💬
      </button>

      <!-- Address Edit Modal -->
      <div id="addr-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 3000; display: none; opacity: 0; transition: opacity 0.3s; align-items: center; justify-content: center;">
        <div id="addr-modal" class="glass-card" style="width: 90%; max-width: 450px; background: white; border-radius: 20px; padding: 2rem; transform: translateY(20px); transition: all 0.3s;">
            <h3 id="addr-modal-title" style="margin-top: 0; margin-bottom: 1.5rem;">Edit Address</h3>
            <input type="hidden" id="edit-addr-id">
            
            <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem;">Category (e.g. Home, Office)</label>
                <input type="text" id="edit-addr-type" style="width: 100%; padding: 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 0.9rem;">
            </div>

            <div style="margin-bottom: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem;">Door Number</label>
                    <input type="text" id="edit-addr-door" placeholder="Ext: 4B" style="width: 100%; padding: 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 0.9rem;">
                </div>
                <div>
                     <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem;">Street Name</label>
                     <input type="text" id="edit-addr-street" placeholder="Street Name" style="width: 100%; padding: 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 0.9rem;">
                </div>
            </div>

            <div style="margin-bottom: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem;">Village/Area</label>
                    <input type="text" id="edit-addr-village" placeholder="Village" style="width: 100%; padding: 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 0.9rem;">
                </div>
                <div>
                     <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem;">City</label>
                     <input type="text" id="edit-addr-city" placeholder="City" style="width: 100%; padding: 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 0.9rem;">
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="close-addr-modal" class="auth-btn" style="background: #f1f5f9; color: #64748b; margin-top: 0; box-shadow: none;">Cancel</button>
                <button id="save-addr-btn" class="auth-btn" style="background: var(--primary-gradient); margin-top: 0;">Save Address</button>
            </div>
        </div>
      </div>
    </div>
  `;

  return content;
}

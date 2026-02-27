import { getUserData } from '../data/mock-data.js';

export function renderHeader(user, onNavigate, cartCount) {
  const ext = getUserData(user.email);
  const merged = { ...ext, ...user }; // Prioritize actual user object
  const unreadCount = (merged.notifications || []).filter(n => !n.read).length;

  return `
    <header class="main-header" style="background: white; border-bottom: 1px solid #f1f5f9;">
      <div class="header-left">
        <button class="icon-btn" id="menu-btn" style="border:none; background:none; font-size: 1.4rem;">☰</button>
      </div>
      <div class="header-center" style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="/logo.jpg" alt="Logo" style="width: 36px; height: 36px; border-radius: 10px; object-fit: contain;"> 
          <span style="font-family: 'Syne', sans-serif; font-weight: 800; color: var(--text-main); font-size: 1.1rem; letter-spacing: -0.5px;">Vastra</span>
      </div>
      <div class="header-right" style="display: flex; gap: 0.75rem; align-items: center;">
        <button id="wallet-btn" style="background: #f0fdf4; color: #16a34a; padding: 0.35rem 0.65rem; border-radius: 12px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 4px; border: 1px solid #bbf7d0; cursor: pointer;">
          👛 ₹${merged.walletBalance || 0}
        </button>
        <button id="coin-btn" style="background: #fffbeb; color: #b45309; padding: 0.35rem 0.65rem; border-radius: 12px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 4px; border: 1px solid #fef3c7; cursor: pointer;">
          🪙 ${merged.vastraCoins || 0}
        </button>
      </div>
    </header>

    <!-- Coin Info Modal -->
    <div id="coin-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 3000; opacity: 0; pointer-events: none; transition: opacity 0.3s;"></div>
    <div id="coin-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); width: 90%; max-width: 400px; background: white; z-index: 3001; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.2); opacity: 0; pointer-events: none; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite;">🪙</div>
            <h2 style="font-size: 1.5rem; color: #1e293b; margin-bottom: 0.5rem;">Vastra Coins</h2>
            <p style="color: #64748b; font-size: 0.9rem;">Your current balance: <strong style="color: #b45309;">${ext.vastraCoins} Coins</strong></p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; color: #3b82f6; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span>💡</span> How to earn</h4>
            <ul style="margin: 0; padding-left: 1.5rem; color: #475569; font-size: 0.85rem; line-height: 1.6;">
                <li>Earn 10 coins for every ₹100 spent.</li>
                <li>Get 50 bonus coins on your first order.</li>
                <li>Refer a friend and earn 100 coins!</li>
            </ul>
        </div>
        
        <div style="background: #fffbeb; border: 1px dashed #fcd34d; border-radius: 12px; padding: 1rem; text-align: center; margin-bottom: 1.5rem;">
            <p style="margin: 0; color: #b45309; font-weight: 700; font-size: 1rem;">Exchange Rate</p>
            <p style="margin: 0; color: #92400e; font-size: 1.2rem; font-weight: 800; margin-top: 0.25rem;">100 Coins = ₹1</p>
            <button id="exchange-coins-btn" class="auth-btn" style="margin-top: 1rem; background: #b45309; color: white;">Exchange Now</button>
            <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #b45309;">Values are automatically applied at checkout.</p>
        </div>
        
        <button id="close-coin-modal" class="auth-btn" style="margin-top: 0; background: #f1f5f9; color: #475569; box-shadow: none;">Got it, thanks!</button>
    </div>

    <!-- Side Menu Overlay & Drawer -->
    <div id="menu-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; opacity: 0; pointer-events: none; transition: opacity 0.3s;"></div>
    
    <div id="side-menu" style="position: fixed; top: 0; left: -300px; width: 280px; height: 100%; background: white; z-index: 2001; transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 5px 0 25px rgba(0,0,0,0.1); display: flex; flex-direction: column;">
        <div style="padding: 2rem; background: var(--primary-gradient); display: flex; align-items: center; justify-content: space-between; color: white;">
             <div>
                <h2 style="font-size: 1.25rem; font-weight: 800;">Hello, ${user.name.split(' ')[0]}</h2>
                <p style="font-size: 0.85rem; opacity: 0.8;">Premium Member</p>
             </div>
             <button id="close-menu-btn" style="background:none; border:none; font-size: 1.5rem; cursor: pointer; color: white;">✕</button>
        </div>
        <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; overflow-y: auto;">
            <a href="#" class="menu-link" data-view="home" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.2rem;">🏠</span> Home</a>
            <a href="#" class="menu-link" data-view="profile" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.2rem;">👤</span> My Profile</a>
            <a href="#" class="menu-link" data-view="track" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.2rem;">📦</span> Order History & Tracking</a>
            
            <div style="height: 1px; background: #f1f5f9; margin: 0.5rem 0;"></div>
            
            <a href="#" id="menu-payment-btn" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.2rem;">💳</span> Payment History</a>
            <a href="#" id="menu-wallet-btn" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.2rem;">👛</span> Vastra Wallet</a>
            <a href="#" id="menu-address-btn" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.2rem;">📍</span> Saved Addresses</a>
            
            <div style="height: 1px; background: #f1f5f9; margin: 0.5rem 0;"></div>
            
            <a href="https://wa.me/918008514610" target="_blank" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.2rem;">💬</span> Help & Support</a>
            <a href="#" id="menu-logout-btn" style="padding: 1rem; border-radius: 12px; color: #ef4444; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.2rem;">🚪</span> Logout</a>
        </div>
        <div style="margin-top: auto; padding: 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9;">
            <p style="text-align: center; color: #94a3b8; font-size: 0.75rem; font-weight: 600;">Vastra Signature v1.3</p>
        </div>
    </div>

    <style>
        #menu-overlay.open { opacity: 1 !important; pointer-events: all !important; }
        #side-menu.open { left: 0 !important; }
        .menu-link:hover, .menu-link-static:hover { background: #f8fafc; color: var(--primary); }
        .menu-link-static { padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem; cursor: pointer; }
    </style>
  `;
}

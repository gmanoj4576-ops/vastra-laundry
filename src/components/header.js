import { getUserData } from '../data/mock-data.js';

export function renderHeader(user, onNavigate, cartCount) {
  const ext = getUserData(user.email);
  const unreadCount = ext.notifications.filter(n => !n.read).length;

  return `
    <header class="main-header glass-card" style="border-radius: 0 0 20px 20px; border-top: none;">
      <div class="header-left">
        <button class="icon-btn" id="menu-btn" style="width: 44px; height: 44px; font-size: 1.5rem; background: white; box-shadow: var(--shadow-sm);">☰</button>
      </div>
      <div class="header-center">
        <h1 id="logo" style="cursor:pointer; display: flex; align-items: center; gap: 0.5rem;">
          <img src="/logo.svg" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=Vastra+Laundry&background=random&color=fff&size=64'" alt="Logo" style="width: 40px; height: 40px; border-radius: 20%; object-fit: cover;"> 
          <span style="font-family: 'Syne', sans-serif; font-weight: 800; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.5rem;">Vastra Laundry</span>
        </h1>
      </div>
      <div class="header-right" style="display: flex; gap: 0.5rem; align-items: center;">
        
        <!-- Loyalty Coins -->
        <div class="coins-badge" style="background: linear-gradient(135deg, #fbbf24, #d97706); color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);">
          <span>🪙</span> ${ext.vastraCoins}
        </div>

        <!-- Notifications -->
        <div class="notif-container" style="position: relative;">
            <button class="icon-btn" id="notif-btn" style="position: relative;">
              🔔
              ${unreadCount > 0 ? `<span class="cart-badge" style="background: #ef4444; top: -2px; right: -2px;">${unreadCount}</span>` : ''}
            </button>
            <div class="notif-dropdown glass-card" id="notif-dropdown">
                <div style="padding: 1rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin:0; font-size: 1rem;">Notifications</h3>
                    <button style="font-size: 0.7rem; color: #3b82f6; background: none; border: none; cursor: pointer;">Mark all read</button>
                </div>
                <!-- Mock Notifications -->
                ${unreadCount === 0 ? '<div style="padding: 2rem; text-align: center; color: #94a3b8;">No new notifications</div>' : ''}
                ${ext.notifications.slice(0, 3).map(n => `
                    <div class="notif-item">
                        <div style="width: 30px; height: 30px; background: #e0f2fe; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">📢</div>
                        <div class="notif-content">
                            <h4>${n.text || n.title || 'Notification'}</h4>
                            <p style="font-size: 0.7rem;">${n.date || 'Just now'}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <button class="icon-btn" id="cart-btn">
          🛒
          ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
        </button>
        <button class="icon-btn" id="profile-btn">
          <div style="width: 32px; height: 32px; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent-blue); border: 2px solid white;">
            ${user.name[0].toUpperCase()}
          </div>
        </button>
      </div>
    </header>

    <!-- Side Menu Overlay & Drawer -->
    <div id="menu-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.3s;"></div>
    
    <div id="side-menu" style="position: fixed; top: 0; left: -300px; width: 280px; height: 100%; background: white; z-index: 1001; transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 5px 0 25px rgba(0,0,0,0.1); display: flex; flex-direction: column;">
        <div style="padding: 2rem; background: var(--primary-gradient); display: flex; align-items: center; justify-content: space-between;">
             <h2 style="font-size: 1.5rem; color: var(--accent-blue);">Menu</h2>
             <button id="close-menu-btn" style="background:none; border:none; font-size: 1.5rem; cursor: pointer;">✕</button>
        </div>
        <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <a href="#" class="menu-link" data-view="home" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.5rem;">🏠</span> Home</a>
            <a href="#" class="menu-link" data-view="profile" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.5rem;">👤</span> Profile</a>
            <a href="#" class="menu-link" data-view="track" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.5rem;">📦</span> My Orders</a>
            <a href="#" class="menu-link" data-view="cart" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.5rem;">🛒</span> Cart</a>
             <div style="height: 1px; background: #f1f5f9; margin: 0.5rem 0;"></div>
            <a href="#" onclick="alert('Help Center Coming Soon')" style="padding: 1rem; border-radius: 12px; color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 1rem;"><span style="font-size: 1.5rem;">❓</span> Help & Support</a>
        </div>
        <div style="margin-top: auto; padding: 2rem;">
            <p style="text-align: center; color: #94a3b8; font-size: 0.8rem;">Vastra Signature v1.2</p>
        </div>
    </div>

    <style>
        #menu-overlay.open { opacity: 1; pointer-events: all; }
        #side-menu.open { left: 0; }
        .menu-link:hover { background: #f1f5f9; color: var(--accent-blue); }
    </style>
  `;
}

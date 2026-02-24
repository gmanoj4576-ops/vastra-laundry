export function renderBottomNav(activeView, cartCount, unreadNotifCount = 0) {
    const items = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'track', label: 'Orders', icon: '📦' },
        { id: 'notifications', label: 'Notifs', icon: '🔔' },
        { id: 'cart', label: 'Cart', icon: '🛒' }
    ];

    return `
    <nav class="bottom-nav">
      ${items.map(item => `
        <button class="nav-item ${activeView === item.id ? 'active' : ''}" data-view="${item.id}">
          <div class="nav-icon-wrapper">
            <span class="nav-icon">${item.icon}</span>
            ${item.id === 'cart' && cartCount > 0 ? `<span class="nav-badge">${cartCount}</span>` : ''}
            ${item.id === 'notifications' && unreadNotifCount > 0 ? `<span class="nav-badge">${unreadNotifCount}</span>` : ''}
          </div>
          <span class="nav-label">${item.label}</span>
        </button>
      `).join('')}
    </nav>

    <style>
      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 70px;
        background: white;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-top: 1px solid #f1f5f9;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
        z-index: 1000;
        padding-bottom: env(safe-area-inset-bottom);
      }

      .nav-item {
        background: none;
        border: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: #94a3b8;
        padding: 8px;
        flex: 1;
        cursor: pointer;
        transition: all 0.2s;
      }

      .nav-item.active {
        color: var(--primary);
      }

      .nav-icon-wrapper {
        position: relative;
        font-size: 1.5rem;
      }

      .nav-label {
        font-size: 0.75rem;
        font-weight: 600;
      }

      .nav-badge {
        position: absolute;
        top: -4px;
        right: -8px;
        background: #ef4444;
        color: white;
        font-size: 0.7rem;
        min-width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        padding: 2px;
        border: 2px solid white;
      }

      .nav-item:active {
        transform: scale(0.9);
      }
    </style>
  `;
}

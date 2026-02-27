export const services = [
  { id: 'washing', name: 'Standard Wash', icon: '🧺', desc: 'Expert clean for your clothes', price: '₹2/item' },
  { id: 'ironing', name: 'Iron', icon: '💨', desc: 'Perfect steam iron finish', price: '₹1.5/item' },
  { id: 'dryclean', name: 'Dry Cleaning', icon: '🧥', desc: 'Special care for delicate wear', price: '₹5/item' },
  { id: 'women', name: 'Women Special', icon: '👗', desc: 'Hand care for sarees & heavy suits', price: '₹6/item' },
  { id: 'kids', name: 'Kids Wear', icon: '🧸', desc: 'Gentle, hypoallergenic wash', price: '₹1/item' },
  { id: 'premium', name: 'Premium Care', icon: '💎', desc: 'Luxury wash with hand care', price: '₹10/kit' },
  { id: 'industry', name: 'Industry', icon: '🏭', desc: 'Bulk orders & corporate uniforms', price: 'Get Quote' },
  { id: 'other', name: 'Other', icon: '✨', desc: 'Custom requests & items', price: 'Get Quote' }
];

import { MOCK_DATA } from '../data/mock-data.js';

export function renderHome(user, onServiceSelect) {
  const container = document.getElementById('app');
  const tips = MOCK_DATA.fabricCareTips;

  const content = `
    <div class="page-content">
      <section class="hero-section" style="padding: 2rem 0; margin-bottom: 2rem;">
        <div class="hero-branding" style="padding: 2rem; background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-premium); display: flex; align-items: center; gap: 2.5rem; overflow: hidden; position: relative;">
          <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: var(--primary-light); border-radius: 50%; transform: translate(30%, -30%); opacity: 0.5; z-index: 0;"></div>
          
          <div class="logo-wrapper" style="width: 140px; height: 140px; z-index: 1;">
              <img src="/logo.jpg" alt="Vastra Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 24px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">
          </div>
          
          <div style="z-index: 1;">
            <h2 class="brand-title" style="font-family: 'Syne', sans-serif; font-size: 2.4rem; margin-bottom: 0.5rem; color: var(--text-main); font-weight: 800; letter-spacing: -1px;">Vastra Laundry</h2>
            <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 400px; line-height: 1.4;">Premium fabric care powered by modern technology.</p>
          </div>
        </div>
      </section>

      <section class="welcome-section" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem;">
        <div>
          <h3>Hi, ${user.name}!</h3>
          <p>Choose a service to get started.</p>
        </div>
        <button class="auth-btn pro-badge-btn" style="width: auto; padding: 0.5rem 1rem; font-size: 0.8rem; background: ${user.subscription === 'Pro' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#6366f1'}; border: none; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
          ${user.subscription === 'Pro' ? '⭐ Vastra Pro Member' : 'Upgrade to Pro 💎'}
        </button>
      </section>

      <!-- Daily Check-In & Rewards -->
      <section style="margin-bottom: 2.5rem;">
        <div class="glass-card" style="padding: 1.5rem; border-radius: 20px; background: white; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 50px; height: 50px; background: #fffbeb; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🎁</div>
                <div>
                    <h4 style="margin: 0; color: #1e293b;">Daily Check-In</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #64748b;">Get 50 Vastra Coins every day!</p>
                </div>
            </div>
            <button id="daily-checkin-btn" class="auth-btn" style="width: auto; margin: 0; padding: 0.6rem 1.2rem; font-size: 0.85rem; background: #f59e0b;">Check-In Now</button>
        </div>
      </section>

      <!-- Tracking Search Card -->
      <section style="margin-bottom: 2.5rem;">
        <div class="glass-card" style="padding: 1.5rem; border-radius: 20px; background: linear-gradient(135deg, #4f46e5, #6366f1); color: white; border: none; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);">
          <h4 style="margin: 0 0 10px 0; font-size: 1.1rem;">Track Your Order</h4>
          <p style="margin: 0 0 15px 0; font-size: 0.85rem; opacity: 0.9;">Enter your Vastra Tracking ID to see live updates.</p>
          <div style="display: flex; gap: 10px; background: rgba(255,255,255,0.15); padding: 6px; border-radius: 12px; backdrop-filter: blur(5px);">
            <input type="text" id="tracking-input" placeholder="VST-..." style="flex: 1; background: transparent; border: none; color: white; padding: 8px 12px; outline: none; font-family: monospace; letter-spacing: 1px;">
            <button id="track-btn-home" style="background: white; color: #4f46e5; border: none; padding: 8px 18px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.9rem;">Track</button>
          </div>
          <div id="tracking-error-home" style="display:none; color: #fecaca; font-size: 0.75rem; margin-top: 8px; font-weight: 600;"></div>
        </div>
      </section>

      <section class="services-section">
        <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1.25rem;">
          ${services.map(s => `
            <div class="service-card ${s.id}" data-id="${s.id}">
              <div class="service-icon">${s.icon}</div>
              <h3>${s.name}</h3>
              <p>${s.desc}</p>
              <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: auto;">
                 <span style="font-size: 1rem; font-weight: 800; color: inherit;">${s.price}</span>
                 <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">→</div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Fabric Care Guide -->
      <section style="margin-top: 3rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <h3 style="margin: 0;">Fabric Care Guide 🧵</h3>
          <span style="font-size: 0.8rem; color: #3b82f6; font-weight: 700; cursor: pointer;">View All Tips →</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
          ${tips.map((tip, idx) => `
            <div class="glass-card" style="padding: 1.5rem; border-radius: 20px; transition: transform 0.3s ease; border: 1px solid rgba(59, 130, 246, 0.1);" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
              <div style="width: 40px; height: 40px; background: ${['#eff6ff', '#fef2f2', '#f0fdf4', '#fdf7ff', '#fffbeb'][idx % 5]}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 1rem;">
                ${['🧼', '👖', '🐑', '👗', '✨'][idx % 5]}
              </div>
              <h4 style="color: #1e293b; margin-bottom: 0.5rem; font-weight: 700;">${tip.title}</h4>
              <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">${tip.text}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <div class="promo-banner glass-card" style="margin-top: 3rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05)); border: 1px solid rgba(255,255,255,0.5);">
        <div class="promo-text">
          <h3>Exclusive Perks</h3>
          <p>Join Vastra Plus for free delivery on every order.</p>
        </div>
        <button class="auth-btn" style="width: auto; padding: 0.5rem 1.5rem; margin-top: 0;">Join Now</button>
      </div>
    </div>
  `;

  return content;
}

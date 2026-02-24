export const services = [
  { id: 'washing', name: 'Standard Wash', icon: '🧺', desc: 'Expert clean for your clothes', price: '$2/item' },
  { id: 'ironing', name: 'Iron', icon: '💨', desc: 'Perfect steam iron finish', price: '$1.5/item' },
  { id: 'dryclean', name: 'Dry Cleaning', icon: '🧥', desc: 'Special care for delicate wear', price: '$5/item' },
  { id: 'women', name: 'Women Special', icon: '👗', desc: 'Hand care for sarees & heavy suits', price: '$6/item' },
  { id: 'kids', name: 'Kids Wear', icon: '🧸', desc: 'Gentle, hypoallergenic wash', price: '$1/item' },
  { id: 'premium', name: 'Premium Care', icon: '💎', desc: 'Luxury wash with hand care', price: '$10/kit' },
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

      <section class="welcome-section" style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <h3>Hi, ${user.name}!</h3>
          <p>Choose a service to get started.</p>
        </div>
        <button class="auth-btn" style="width: auto; padding: 0.5rem 1rem; font-size: 0.8rem; background: #6366f1;">Vastra Pro 💎</button>
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
        <h3 style="margin-bottom: 1rem;">Fabric Care Guide 🧵</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          ${tips.map(tip => `
            <div class="glass-card" style="padding: 1rem; border-radius: 16px;">
              <h4 style="color: #3b82f6; margin-bottom: 0.5rem;">${tip.title}</h4>
              <p style="font-size: 0.85rem; color: #64748b;">${tip.text}</p>
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

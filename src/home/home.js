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
      <section class="hero-section glass-card" style="text-align: center; padding: 3rem 1rem; margin-bottom: 2rem; border-radius: 20px; position: relative;">
        <div class="hero-branding" style="position: relative;">
          <div class="logo-large skew-animate" style="width: 120px; height: 120px; margin: 0 auto 1rem;">
              <img src="/logo.svg" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=Vastra+Service&background=2563eb&color=fff&size=128&bold=true'" alt="Vastra Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20%;">
          </div>
          <h2 class="brand-title" style="font-family: 'Syne', sans-serif; font-size: 2.5rem; margin-bottom: 0.5rem; color: #1e293b; font-weight: 800;">Vastra Laundry Service</h2>
          <p style="color: #64748b; font-size: 1.1rem; max-width: 500px; margin: 0 auto;">Where technology meets pristine cleaning.</p>
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
        <div class="services-grid">
          ${services.map(s => `
            <div class="service-card glass-card" data-id="${s.id}">
              <div class="service-icon" style="background: white; border: 1px solid #f1f5f9;">${s.icon}</div>
              <h3>${s.name}</h3>
              <p>${s.desc}</p>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.8rem;">
                 <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px;">Top Rated</span>
                 ${s.id === 'premium' ? `<span class="badge" style="background: #fef3c7; color: #92400e; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px;">Premium</span>` : ''}
              </div>
              <span style="font-size: 0.85rem; font-weight: 700; color: #3b82f6; margin-top: 0.5rem;">Starting at ${s.price}</span>
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

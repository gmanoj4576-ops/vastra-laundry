const serviceData = {
  'washing': {
    'Shirt': 2, 'Trousers': 2.5, 'T-Shirt': 1.5, 'Shorts': 1.5, 'Towel': 1
  },
  'ironing': {
    'Shirt': 1.5, 'Trousers': 2, 'Saree': 3, 'Suit': 4, 'Bedsheet': 2
  },
  'dryclean': {
    'Suit (2pc)': 6, 'Saree (Heavy)': 8, 'Lehenga': 12, 'Blazer': 5, 'Jacket': 6
  },
  'women': {
    'Saree (Silk)': 6, 'Kurta Set': 4, 'Dupatta': 2, 'Gown': 8, 'Blouse': 3
  },
  'kids': {
    'Frock': 2, 'School Uniform': 3, 'Small Shirt': 1, 'Shorts': 1, 'Jumpsuit': 2.5
  },
  'premium': {
    'Luxury Shirt': 5, 'Designer Saree': 15, 'Tuxedo': 12, 'Leather Jacket': 10
  }
};

export function renderServiceDetail(serviceId, currentCart, onAddToCart, onBack) {
  const serviceName = serviceId.charAt(0).toUpperCase() + serviceId.slice(1);
  const isCustom = serviceId === 'other' || serviceId === 'industry';

  let itemsHtml = '';

  if (isCustom) {
    itemsHtml = `
        <div class="glass-card" style="padding: 1.5rem; border-radius: 16px; margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">Describe Your Request</h3>
            <p style="margin-bottom: 1rem; color: #64748b; font-size: 0.9rem;">
                ${serviceId === 'industry' ? 'For bulk or industrial orders, please describe the quantity and type of fabric.' : 'Please list the items and any specific instructions.'}
            </p>
            <textarea id="custom-request-text" rows="5" placeholder="E.g., 5 Lab Coats, 2 heavy curtains..." style="width: 100%; border: 2px solid #e2e8f0; padding: 1rem; border-radius: 12px; font-family: inherit; font-size: 1rem;"></textarea>
            <div style="margin-top: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Estimated Budget (Optional)</label>
                <input type="number" id="custom-budget" placeholder="$" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 2px solid #e2e8f0;">
            </div>
            <button id="submit-custom-req" class="auth-btn" style="margin-top: 1.5rem;">Request Quote</button>
        </div>
      `;
  } else {
    const items = serviceData[serviceId] || {};
    itemsHtml = `
        <div class="modifiers-section" style="margin-top: 2rem; display: flex; gap: 1rem;">
            <div class="modifier-card glass-card" style="flex: 1; padding: 1rem; border-radius: 12px; cursor: pointer; text-align: center;">
              <input type="checkbox" id="express-mode" style="display:none">
              <label for="express-mode" style="cursor:pointer">
                <div style="font-size: 1.5rem;">⚡</div>
                <div style="font-weight: 700; margin: 0.2rem 0;">Express</div>
                <div style="font-size: 0.75rem; color: #64748b;">+$5.00</div>
              </label>
            </div>
            <div class="modifier-card glass-card" style="flex: 1; padding: 1rem; border-radius: 12px; cursor: pointer; text-align: center;">
              <input type="checkbox" id="eco-mode" style="display:none">
              <label for="eco-mode" style="cursor:pointer">
                <div style="font-size: 1.5rem;">🌿</div>
                <div style="font-weight: 700; margin: 0.2rem 0;">Eco-friendly</div>
                <div style="font-size: 0.75rem; color: #64748b;">Free</div>
              </label>
            </div>
        </div>
        <style>
            .modifier-card input:checked + label { color: #3b82f6; }
            .modifier-card input:checked + label div:first-child { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); }
        </style>
        <div class="items-list" style="margin-top: 2rem;">
            ${Object.entries(items).map(([item, price]) => `
              <div class="item-row glass-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-radius: 12px; margin-bottom: 0.75rem; background: rgba(255,255,255,0.6);">
                <div>
                  <h4 style="margin:0">${item}</h4>
                  <p style="margin:0; font-size: 0.85rem; color: #64748b;">$${price.toFixed(2)} / item</p>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <button class="qty-btn minus" data-item="${item}" style="width: 32px; height: 32px; border-radius: 50%; background: white; border: 1px solid #e2e8f0; color: #64748b;">-</button>
                  <span class="item-qty" id="qty-${item.replace(/\W/g, '-')}" style="font-weight: 700; min-width: 20px; text-align: center;">0</span>
                  <button class="qty-btn plus" data-item="${item}" style="width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; color: white; border: none;">+</button>
                </div>
              </div>
            `).join('')}
        </div>
        <div class="service-footer" style="margin-top: 2rem; position: sticky; bottom: 2rem;">
            <button id="add-to-cart-multi" class="auth-btn" style="box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
              Update Cart
            </button>
        </div>
      `;
  }

  const content = `
    <div class="page-content">
      <button id="back-to-home" class="icon-btn" style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; width: auto; padding-right: 1rem; border-radius: 12px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Services
      </button>
      
      <div class="service-detail-header">
        <h2 style="font-size: 2rem; color: #1e293b;">${serviceName}</h2>
        <p style="color: #64748b;">${isCustom ? 'Tailored to your needs.' : 'Expert care for your favorite garments.'}</p>
      </div>

      ${itemsHtml}
    </div>
  `;

  return content;
}

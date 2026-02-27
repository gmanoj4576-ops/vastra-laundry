import { api } from '../api.js';

export function renderCheckout(cart, total) {
  if (!cart) cart = [];
  const user = JSON.parse(localStorage.getItem('vastra_user'));
  const ext = user ? (JSON.parse(localStorage.getItem(`vastra_ext_${user.email}`)) || { savedAddresses: [] }) : { savedAddresses: [] };

  return `
    <div class="checkout-container fade-in">
      <div class="checkout-header">
        <button id="back-to-home" class="icon-btn"><i class="fas fa-arrow-left"></i></button>
        <h1>Checkout</h1>
      </div>

      <div class="checkout-content">
        <!-- Order Summary -->
        <div class="order-summary glass-card">
          <h3>Order Summary</h3>
          <div class="cart-items-list">
            ${cart.map(item => `
              <div class="summary-item">
                <div class="item-info">
                  <span class="item-name">${item.itemName || item.name}</span>
                  <span class="item-service">${item.serviceName || item.service}</span>
                </div>
                <div class="item-qty">x${item.quantity || item.qty}</div>
                <div class="item-price">₹${(item.price * (item.quantity || item.qty)).toFixed(2)}</div>
              </div>
            `).join('')}
          </div>
          <div class="summary-total">
            <span>Total Amount</span>
            <span>₹${total}</span>
          </div>
        </div>

        <!-- Address Section -->
         <div class="address-section glass-card">
          <h3><i class="fas fa-map-marker-alt"></i> Pickup Address</h3>
          <div class="address-selector" style="margin-bottom: 1rem;" id="address-radio-group">
            ${ext.savedAddresses.map((addr, i) => `
              <label style="display:flex; align-items:center; gap: 10px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 8px; background: #f8fafc; font-size: 0.9rem; cursor: pointer; transition: border-color 0.2s;">
                <input type="radio" name="addressSelect" value="${addr.text}" ${i === 0 ? 'checked' : ''} style="accent-color: var(--primary); transform: scale(1.2);">
                <span style="color: var(--text-main); font-weight: 500;">${addr.type}: ${addr.text}</span>
              </label>
            `).join('')}
              <label style="display:flex; align-items:center; gap: 10px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 8px; background: #f8fafc; font-size: 0.9rem; cursor: pointer; transition: border-color 0.2s;">
                <input type="radio" name="addressSelect" value="custom" ${ext.savedAddresses.length === 0 ? 'checked' : ''} style="accent-color: var(--primary); transform: scale(1.2);">
                <span style="color: var(--text-main); font-weight: 500;">Enter Custom Address...</span>
              </label>
            <div id="custom-address-container" style="display: ${ext.savedAddresses.length === 0 ? 'block' : 'none'}; margin-top: 10px;">
              <textarea id="address-input" placeholder="Enter your full address here..." style="width: 100%; padding: 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 0.9rem; min-height: 80px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='#e2e8f0'"></textarea>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="locate-me-btn" class="text-btn" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #eff6ff; color: #3b82f6; border: 1px solid #dbeafe;">
              <i class="fas fa-location-arrow"></i> Use Live Location
            </button>
            <button id="change-address-btn" class="text-btn" style="flex: 1;">Change Address</button>
          </div>
          <p id="location-status" style="display:none; font-size: 0.8rem; margin-top: 5px; color: #64748b;"></p>
        </div>

        <!-- Payment Section -->
        <div class="payment-section glass-card">
          <h3><i class="fas fa-wallet"></i> Payment Method</h3>
          <div class="payment-options">
             <label class="payment-option selected">
               <input type="radio" name="payment" value="wallet" checked>
               <span class="radio-custom"></span>
               <div class="pay-label">
                 <i class="fas fa-wallet"></i>
                  <span>Pay from Wallet (₹${ext.walletBalance || 0})</span>
               </div>
             </label>
             <label class="payment-option">
               <input type="radio" name="payment" value="cod">
               <span class="radio-custom"></span>
               <div class="pay-label">
                 <i class="fas fa-money-bill-wave"></i>
                 <span>Cash on Delivery</span>
               </div>
             </label>
          </div>
        </div>
      </div> <!-- End checkout-content -->

      <div style="background: rgba(255, 255, 255, 0.95); padding: 1.5rem; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); margin-top: 1rem; border: 1px solid #f1f5f9;">
         <div class="total-display">
           <small style="color: #64748b; font-weight: 600;">Final Amount</small>
           <strong style="color: #1e293b; font-size: 1.5rem;">₹${total}</strong>
         </div>
         <button id="place-order-btn" class="auth-btn" style="margin-top: 0; width: auto; padding: 1rem 2.5rem; background: #4f46e5; color: white; border-radius: 14px; font-weight: 700; font-size: 1rem; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
           Place Order <i class="fas fa-chevron-right" style="margin-left: 8px;"></i>
         </button>
      </div>
    </div>
  `;
}

export function renderSuccess() {
  return `
    <div class="order-success fade-in" style="text-align: center; padding: 4rem 2rem;">
        <div class="success-icon" style="font-size: 4rem; color: #16a34a; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="margin-bottom: 0.5rem; color: #1e293b;">Order Placed Successfully!</h2>
        <p style="color: #64748b; margin-bottom: 2rem;">Your clothes are in good hands.</p>
        <button id="success-home-btn" class="auth-btn" style="width: auto; padding: 0.8rem 2rem;">Back to Home</button>
    </div>
  `;
}

export function setupCheckoutEvents(cart, total, onSuccess) {
  const backBtn = document.getElementById('back-to-home');
  if (backBtn) {
    backBtn.onclick = () => window.location.reload();
  }

  const successHomeBtn = document.getElementById('success-home-btn');
  if (successHomeBtn) {
    successHomeBtn.onclick = () => window.location.reload();
  }

  const addressRadios = document.querySelectorAll('input[name="addressSelect"]');
  const customAddrContainer = document.getElementById('custom-address-container');
  if (addressRadios.length > 0) {
    addressRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        customAddrContainer.style.display = e.target.value === 'custom' ? 'block' : 'none';
      });
    });
  }

  const locateBtn = document.getElementById('locate-me-btn');
  if (locateBtn) {
    locateBtn.onclick = () => {
      const status = document.getElementById('location-status');
      status.style.display = 'block';
      status.innerText = '📍 Fetching location...';
      status.style.color = '#3b82f6';

      if (!navigator.geolocation) {
        status.innerText = '❌ Geolocation not supported';
        status.style.color = '#ef4444';
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          const addr = `Live Location (${lat}, ${lng})`;

          // Add to select and select it
          const select = document.getElementById('address-select');
          const option = document.createElement('option');
          option.value = addr;
          option.text = `📍 ${addr}`;
          option.selected = true;
          select.add(option, select.options[0]);

          status.innerText = '✅ Location detected and applied!';
          status.style.color = '#10b981';
        },
        (err) => {
          status.innerText = `❌ Error: ${err.message}`;
          status.style.color = '#ef4444';
        },
        { enableHighAccuracy: true }
      );
    };
  }

  // Note: place-order-btn click is handled in main.js to avoid scoping issues with this.state
}

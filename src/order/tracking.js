export function renderTracking(order) {
  const steps = [
    { label: 'Pending', icon: '⏳' },
    { label: 'Order Received', icon: '📝' },
    { label: 'Washing', icon: '🧺' },
    { label: 'Ironing', icon: '💨' },
    { label: 'Ready for Pickup', icon: '🚚' },
    { label: 'Completed', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(s => s.label === order.status);

  const content = `
    <div class="page-content animate-fade-in">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
        <button id="back-home-track" class="icon-btn" style="border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #f1f5f9; cursor: pointer;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
            <h2 style="margin:0;">Order Tracking</h2>
            <p style="margin:0; font-size: 0.8rem; color: #64748b;">ID: #${(order._id || order.id || 'N/A').toString().slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div style="margin-bottom: 2rem; padding: 1rem; background: #eef2ff; border-radius: 12px; border: 1px solid #e0e7ff;">
         <span style="font-size: 12px; color: #4338ca; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Vastra Tracking ID</span>
         <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
            <code style="font-size: 1.1rem; color: #1e1b4b; font-weight: 800; letter-spacing: 1px;">${order.trackingId || 'PENDING...'}</code>
            <button onclick="navigator.clipboard.writeText('${order.trackingId}')" class="icon-btn" style="padding: 5px; color: #4338ca;">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
         </div>
      </div>

      <div class="tracking-timeline" style="padding: 1.5rem; background: white; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); margin-bottom: 2rem;">
        ${steps.map((step, index) => `
          <div class="timeline-item" style="display: flex; gap: 1.5rem; margin-bottom: 2rem; position: relative;">
            ${index !== steps.length - 1 ? `<div style="position: absolute; left: 1.1rem; top: 2.2rem; bottom: -2rem; width: 2px; background: ${index < currentStepIndex ? '#4f46e5' : '#f1f5f9'};"></div>` : ''}
            <div class="step-icon" style="width: 2.2rem; height: 2.2rem; border-radius: 50%; background: ${index <= currentStepIndex ? '#4f46e5' : '#f8fafc'}; color: ${index <= currentStepIndex ? 'white' : '#94a3b8'}; display: flex; align-items: center; justify-content: center; z-index: 1; border: 2px solid ${index <= currentStepIndex ? '#4f46e5' : '#f1f5f9'};">
              ${index < currentStepIndex ? '✓' : step.icon}
            </div>
            <div class="step-content">
              <h4 style="margin:0; color: ${index <= currentStepIndex ? '#1e293b' : '#94a3b8'}; font-weight: ${index === currentStepIndex ? '700' : '500'};">${step.label}</h4>
              <p style="margin:0; font-size: 0.8rem; color: #64748b;">${index === currentStepIndex ? 'Current Status' : (index < currentStepIndex ? 'Completed' : 'Awaiting...')}</p>
            </div>
          </div>
        `).join('')}

        <!-- LIVE LOCATION SECTION (ALWAYS VISIBLE) -->
        <div class="live-location" style="margin-top: 1rem; padding: 1.5rem; background: ${order.currentLocation ? '#f0fdf4' : '#f8fafc'}; border: 1.5px solid ${order.currentLocation ? '#dcfce7' : '#e2e8f0'}; border-radius: 16px; border-left: 5px solid ${order.currentLocation ? '#16a34a' : '#6366f1'}; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
             <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 10px; color: ${order.currentLocation ? '#16a34a' : '#4f46e5'};">
                   <div style="position: relative;">
                     <span style="display:inline-block; width:12px; height:12px; background: currentColor; border-radius:50%;"></span>
                     <span style="position:absolute; inset: -4px; background: currentColor; opacity:0.3; border-radius:50%; animation: pulse 1.5s infinite;"></span>
                   </div>
                   <strong style="font-size: 0.95rem;">${order.currentLocation ? 'Live Agent Tracking Active' : 'Waiting for Agent Pickup'}</strong>
                </div>
                ${order.currentLocation ? '<span style="font-size: 0.7rem; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 10px; font-weight: 700;">LIVE</span>' : ''}
             </div>
             
             <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                <div style="width: 45px; height: 45px; background: ${order.currentLocation ? '#dcfce7' : '#f1f5f9'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                  ${order.currentLocation ? '🛵' : '🚚'}
                </div>
                <div>
                   <div style="font-weight: 700; color: #1e293b;">${order.currentLocation ? 'Your Vastra Agent' : 'Logistics Partner'}</div>
                   <div style="font-size: 0.75rem; color: #64748b;">${order.currentLocation ? 'On the way to your location' : 'Assigning nearest agent...'}</div>
                </div>
             </div>

             ${order.currentLocation ? `
               <a href="https://www.google.com/maps/search/?api=1&query=${order.currentLocation.lat},${order.currentLocation.lng}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px; background: #16a34a; color: white; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 0.9rem; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);">
                  <i class="fas fa-map-marked-alt"></i> Track Live on Google Maps
               </a>
             ` : `
               <button disabled style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px; background: #e2e8f0; color: #94a3b8; border-radius: 12px; border: none; font-weight: 700; font-size: 0.9rem; cursor: not-allowed;">
                  <i class="fas fa-map-marker-alt"></i> Map Loading...
               </button>
             `}
          </div>
      </div>

      <div class="order-details-card" style="padding: 1.5rem; background: #f8fafc; border-radius: 20px; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 1rem 0; color: #1e293b;">Order Summary</h4>
        <div style="display: flex; flex-direction: column; gap: 8px;">
        ${order.items.map(item => `
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #475569;">
            <span>${item.itemName} (${item.serviceName}) x${item.quantity}</span>
            <span style="font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-weight: 800; color: #1e293b; font-size: 1rem;">
            <span>Total Paid</span>
            <span>₹${order.totalAmount.toFixed(2)}</span>
        </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    </style>
  `;

  return content;
}

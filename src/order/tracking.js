export function renderTracking(order) {
  const steps = [
    { label: 'Order Received', icon: '📝' },
    { label: 'Washing', icon: '🧺' },
    { label: 'Ironing', icon: '💨' },
    { label: 'Ready for Pickup', icon: '🚚' },
    { label: 'Completed', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(s => s.label === order.status);

  const content = `
    <div class="page-content">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
        <button id="back-home-track" class="icon-btn" style="border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='rotate(10deg) scale(1.1)'" onmouseout="this.style.transform='rotate(0deg) scale(1)'">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h2>Track Order #${order.id}</h2>
      </div>

      <div class="tracking-timeline" style="padding: 1rem; background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        ${steps.map((step, index) => `
          <div class="timeline-item" style="display: flex; gap: 1.5rem; margin-bottom: 2rem; position: relative;">
            ${index !== steps.length - 1 ? `<div style="position: absolute; left: 1.1rem; top: 2.2rem; bottom: -2rem; width: 2px; background: ${index < currentStepIndex ? '#3b82f6' : '#e2e8f0'};"></div>` : ''}
            <div class="step-icon" style="width: 2.2rem; height: 2.2rem; border-radius: 50%; background: ${index <= currentStepIndex ? '#3b82f6' : '#f1f5f9'}; color: ${index <= currentStepIndex ? 'white' : '#94a3b8'}; display: flex; align-items: center; justify-content: center; z-index: 1;">
              ${index < currentStepIndex ? '✓' : step.icon}
            </div>
            <div class="step-content">
              <h4 style="margin:0; color: ${index <= currentStepIndex ? '#1e293b' : '#94a3b8'};">${step.label}</h4>
              <p style="margin:0; font-size: 0.8rem; color: #64748b;">${index <= currentStepIndex ? 'Current Status' : 'Waiting...'}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="order-details-card" style="margin-top: 2rem; padding: 1.5rem; background: #e0f2fe; border-radius: 16px; color: #1e3a8a;">
        <h4 style="margin-bottom: 1rem;">Order Summary</h4>
        ${order.items.map(item => `
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.25rem;">
            <span>${item.itemName} (${item.serviceName}) x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return content;
}

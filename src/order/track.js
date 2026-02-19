export function renderTrack(orderId) {
    const steps = [
        { status: 'Placed', icon: '📝', completed: true },
        { status: 'Pickup', icon: '🚚', completed: true },
        { status: 'Processing', icon: 'washing-machine-sm', completed: false, active: true },
        { status: 'Delivery', icon: '🚲', completed: false }
    ];

    return `
    <div class="page-content">
        <button onclick="window.location.reload()" class="icon-btn" style="margin-bottom: 1rem;">← Back</button>
        
        <div class="glass-card" style="padding: 2rem; border-radius: 20px; text-align: center; margin-bottom: 2rem;">
            <h2 style="font-family: 'Syne', sans-serif;">Order #${orderId}</h2>
            <p style="color: #64748b;">Estimated Delivery: <strong>Tomorrow, 6 PM</strong></p>
            
            <div class="track-visual" style="margin-top: 3rem; position: relative; display: flex; justify-content: space-between; align-items: center;">
                <div class="track-line" style="position: absolute; top: 20px; left: 0; width: 100%; height: 4px; background: #e2e8f0; z-index: 0;"></div>
                <div class="track-progress" style="position: absolute; top: 20px; left: 0; width: 66%; height: 4px; background: #3b82f6; z-index: 0; transition: width 1s ease;"></div>
                
                ${steps.map((step, index) => `
                    <div class="step-item ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}" style="z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <div class="step-circle" style="width: 44px; height: 44px; background: ${step.completed || step.active ? '#3b82f6' : 'white'}; border: 4px solid ${step.completed ? '#3b82f6' : '#e2e8f0'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${step.completed || step.active ? 'white' : '#94a3b8'}; font-size: 1.2rem; transition: all 0.3s; box-shadow: ${step.active ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none'};">
                            ${step.icon === 'washing-machine-sm' ? '🧺' : step.icon}
                        </div>
                        <span style="font-size: 0.8rem; font-weight: ${step.active ? '700' : '500'}; color: ${step.active ? '#1e293b' : '#94a3b8'};">${step.status}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 3rem;">
               <div class="glass-card" style="padding: 1rem; background: rgba(59, 130, 246, 0.05); border: 1px dashed #3b82f6; display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 1.5rem;">🧺</div>
                    <div style="text-align: left;">
                        <h4 style="margin:0;">Currently Washing</h4>
                        <p style="margin:0; font-size: 0.8rem; color: #64748b;">Your clothes are in the main wash cycle.</p>
                    </div>
               </div>
            </div>
        </div>
    </div>
    <style>
        .step-item.active .step-circle {
            animation: pulse-blue 2s infinite;
        }
        @keyframes pulse-blue {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
    </style>
    `;
}

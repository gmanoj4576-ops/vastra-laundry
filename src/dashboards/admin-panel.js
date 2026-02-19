export function renderAdminPanel(user, orders) {
  const totalRevenue = orders.reduce((acc, o) => acc + o.items.reduce((sum, i) => sum + (i.price * i.quantity), 0), 0);
  const pendingOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  const content = `
    <div class="admin-layout" style="display: flex; height: 100vh; background: #f1f5f9;">
      <!-- 1. Sidebar Navigation -->
      <aside style="width: 250px; background: white; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column;">
        <div style="padding: 1.5rem; text-align: center; border-bottom: 1px solid #f1f5f9;">
            <img src="/logo.svg" style="width: 40px; height: 40px; margin-bottom: 0.5rem;">
            <h3 style="margin: 0; color: #1e293b; font-family: 'Syne', sans-serif;">Vastra Admin</h3>
        </div>
        <nav style="flex: 1; padding: 1rem;">
            <a href="#" class="admin-link active" style="display: block; padding: 0.75rem 1rem; border-radius: 8px; background: #eff6ff; color: #2563eb; font-weight: 600; margin-bottom: 0.5rem;">📊 Dashboard</a>
            <a href="#" class="admin-link" style="display: block; padding: 0.75rem 1rem; border-radius: 8px; color: #64748b; font-weight: 500; margin-bottom: 0.5rem; transition: 0.2s;">📦 Orders</a>
            <a href="#" class="admin-link" style="display: block; padding: 0.75rem 1rem; border-radius: 8px; color: #64748b; font-weight: 500; margin-bottom: 0.5rem; transition: 0.2s;">👥 Customers</a>
            <a href="#" class="admin-link" style="display: block; padding: 0.75rem 1rem; border-radius: 8px; color: #64748b; font-weight: 500; margin-bottom: 0.5rem; transition: 0.2s;">📈 Analytics</a>
            <a href="#" class="admin-link" style="display: block; padding: 0.75rem 1rem; border-radius: 8px; color: #64748b; font-weight: 500; margin-bottom: 0.5rem; transition: 0.2s;">⚙️ Settings</a>
        </nav>
        <div style="padding: 1rem; border-top: 1px solid #f1f5f9;">
            <button id="admin-logout" style="width: 100%; padding: 0.75rem; background: #fee2e2; color: #ef4444; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Logout</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main style="flex: 1; overflow-y: auto; padding: 2rem;">
        <!-- 2. Header with Search -->
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h2 style="margin: 0; color: #0f172a;">Dashboard Overview</h2>
                <p style="margin: 0; color: #64748b; font-size: 0.9rem;">Welcome back, Admin!</p>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <input type="text" placeholder="Search orders..." style="padding: 0.6rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; width: 250px;">
                <div style="width: 40px; height: 40px; background: white; border-radius: 50%; box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; cursor: pointer;">🔔</div>
                <div style="width: 40px; height: 40px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">A</div>
            </div>
        </header>

        <!-- 3. Stats Cards with Gradients & Icons -->
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
                <div style="position: relative; z-index: 1;">
                    <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 0.5rem;">Total Revenue</h4>
                    <p style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0;">$${totalRevenue.toFixed(2)}</p>
                    <span style="font-size: 0.8rem; color: #16a34a;">+12.5% from last week</span>
                </div>
                <div style="position: absolute; right: -10px; bottom: -10px; font-size: 5rem; opacity: 0.1; color: #2563eb;">💰</div>
            </div>
            
            <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
                <div style="position: relative; z-index: 1;">
                    <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 0.5rem;">Active Orders</h4>
                    <p style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0;">${pendingOrders}</p>
                    <span style="font-size: 0.8rem; color: #ea580c;">${pendingOrders} pending processing</span>
                </div>
                <div style="position: absolute; right: -10px; bottom: -10px; font-size: 5rem; opacity: 0.1; color: #ea580c;">📦</div>
            </div>

            <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
                <div style="position: relative; z-index: 1;">
                    <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 0.5rem;">Total Customers</h4>
                    <p style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0;">1,248</p>
                    <span style="font-size: 0.8rem; color: #2563eb;">+5 new today</span>
                </div>
                <div style="position: absolute; right: -10px; bottom: -10px; font-size: 5rem; opacity: 0.1; color: #2563eb;">👥</div>
            </div>

            <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
                <div style="position: relative; z-index: 1;">
                    <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 0.5rem;">Completion Rate</h4>
                    <p style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0;">94%</p>
                    <span style="font-size: 0.8rem; color: #16a34a;">Top efficiency</span>
                </div>
                <div style="position: absolute; right: -10px; bottom: -10px; font-size: 5rem; opacity: 0.1; color: #16a34a;">⚡</div>
            </div>
        </div>

        <!-- 4. Charts & Analytics Section -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
            <div style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-sm);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0; font-size: 1.1rem;">Weekly Revenue</h3>
                    <select style="border: 1px solid #e2e8f0; padding: 0.3rem; border-radius: 6px; width: auto;"><option>Last 7 Days</option></select>
                </div>
                <div style="height: 150px; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;">
                    ${[40, 60, 35, 80, 50, 90, 70].map(h => `
                        <div style="flex: 1; background: #eff6ff; border-radius: 8px; position: relative; height: 100%;">
                            <div style="position: absolute; bottom: 0; width: 100%; height: ${h}%; background: #3b82f6; border-radius: 8px; transition: height 0.5s;"></div>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; color: #94a3b8; font-size: 0.8rem;">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>

            <div style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-sm);">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">Order Status</h3>
                <div style="display: flex; align-items: center; justify-content: center; height: 140px; position: relative;">
                    <div style="width: 120px; height: 120px; border-radius: 50%; border: 15px solid #f1f5f9; border-top-color: #3b82f6; border-right-color: #f59e0b; position: relative;"></div>
                    <div style="position: absolute; text-align: center;">
                        <span style="font-size: 1.5rem; font-weight: 700;">${orders.length}</span><br><span style="font-size: 0.8rem; color: #64748b;">Total</span>
                    </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; font-size: 0.8rem;">
                    <div style="display: flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></span> Active</div>
                    <div style="display: flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></span> Pending</div>
                </div>
            </div>
        </div>

        <!-- 5. Recent Orders Table with Glassmorphism & Status Pills -->
        <div style="background: white; border-radius: 16px; padding: 1.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; font-size: 1.1rem;">Recent Orders</h3>
                <!-- 6. Filter Tabs -->
                <div style="display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.25rem; border-radius: 8px;">
                    <button style="border: none; background: white; padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; shadow: var(--shadow-sm);">All</button>
                    <button style="border: none; background: transparent; padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; color: #64748b;">Pending</button>
                    <button style="border: none; background: transparent; padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; color: #64748b;">Completed</button>
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                <tr style="text-align: left; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 0.85rem;">
                    <th style="padding: 1rem;">Order ID</th>
                    <th style="padding: 1rem;">Customer</th>
                    <th style="padding: 1rem;">Services</th>
                    <th style="padding: 1rem;">Date</th>
                    <th style="padding: 1rem;">Status</th>
                    <th style="padding: 1rem;">Total</th>
                    <th style="padding: 1rem;">Action</th>
                </tr>
                </thead>
                <tbody>
                ${orders.length > 0 ? orders.map(o => `
                    <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 1rem; font-weight: 600; color: #3b82f6;">#${o.id}</td>
                    <td style="padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 24px; height: 24px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;">👤</div>
                            User ${user.name.split(' ')[0]}
                        </div>
                    </td>
                    <td style="padding: 1rem; font-size: 0.85rem; color: #64748b;">${o.items.length} items (${o.items[0]?.itemName || 'Mixed'})</td>
                    <td style="padding: 1rem; font-size: 0.85rem;">${o.date}</td>
                    <td style="padding: 1rem;">
                        <span style="
                            padding: 0.2rem 0.6rem; 
                            border-radius: 20px; 
                            font-size: 0.75rem; 
                            font-weight: 700; 
                            background: ${o.status === 'Completed' ? '#dcfce7' : o.status === 'Order Received' ? '#dbeafe' : '#fef9c3'}; 
                            color: ${o.status === 'Completed' ? '#166534' : o.status === 'Order Received' ? '#1e40af' : '#854d0e'};
                        ">
                        ${o.status.toUpperCase()}
                        </span>
                    </td>
                    <td style="padding: 1rem; font-weight: 700;">$${o.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</td>
                    <td style="padding: 1rem;">
                        <button style="border: none; background: transparent; cursor: pointer; color: #94a3b8;">⋮</button>
                    </td>
                    </tr>
                `).join('') : '<tr><td colspan="7" style="padding: 2rem; text-align: center; color: #94a3b8;">No recent orders</td></tr>'}
                </tbody>
            </table>
            
            <!-- 7. Quick Actions -->
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem;">
                <button style="padding: 0.6rem 1.2rem; border: 1px solid #e2e8f0; background: white; border-radius: 8px; font-weight: 600; color: #64748b; cursor: pointer;">Export CSV</button>
            </div>
        </div>
      </main>
    </div>
    
    <style>
        .admin-link:hover { background: #f8fafc; color: #1e293b; }
        .admin-link.active { background: #eff6ff; color: #2563eb; }
    </style>
  `;

  return content;
}

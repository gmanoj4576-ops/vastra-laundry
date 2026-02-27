export function overrideNativePopups() {
    window.customAlert = function (message, title = 'Notification') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;opacity:0;transition:opacity 0.3s ease;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

            const modal = document.createElement('div');
            modal.style.cssText = 'background:white;padding:24px;border-radius:24px;width:85%;max-width:340px;transform:translateY(20px) scale(0.95);transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);box-shadow:0 20px 40px rgba(0,0,0,0.2);text-align:center;';

            const icon = document.createElement('div');
            icon.innerHTML = '<i class="fas fa-bell"></i>';
            icon.style.cssText = 'width:48px;height:48px;background:#e0e7ff;color:#4f46e5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 16px;';

            const titleEl = document.createElement('h3');
            titleEl.innerText = title;
            titleEl.style.cssText = 'margin:0 0 8px 0;font-family:Syne,sans-serif;font-weight:700;color:#1e293b;font-size:1.2rem;';

            const msgEl = document.createElement('p');
            msgEl.innerText = message;
            msgEl.style.cssText = 'margin:0 0 24px 0;color:#475569;font-size:0.95rem;line-height:1.5;font-weight:500;';

            const btn = document.createElement('button');
            btn.innerText = 'Okay';
            btn.style.cssText = 'background:linear-gradient(135deg, #4f46e5, #3b82f6);color:white;border:none;padding:12px 32px;border-radius:14px;font-weight:700;font-size:1rem;width:100%;cursor:pointer;box-shadow:0 4px 12px rgba(79,70,229,0.3);';

            btn.onclick = () => {
                overlay.style.opacity = '0';
                modal.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, 300);
            };

            modal.appendChild(icon);
            modal.appendChild(titleEl);
            modal.appendChild(msgEl);
            modal.appendChild(btn);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // reflow
            void overlay.offsetWidth;
            overlay.style.opacity = '1';
            modal.style.transform = 'translateY(0) scale(1)';
        });
    };

    // Override native alert silently
    window.alert = (msg) => window.customAlert(msg);

    window.customPrompt = function (message, defaultValue = '', title = 'Input Required') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;opacity:0;transition:opacity 0.3s ease;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

            const modal = document.createElement('div');
            modal.style.cssText = 'background:white;padding:24px;border-radius:24px;width:85%;max-width:340px;transform:translateY(20px) scale(0.95);transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);box-shadow:0 20px 40px rgba(0,0,0,0.2);text-align:center;';

            const titleEl = document.createElement('h3');
            titleEl.innerText = title;
            titleEl.style.cssText = 'margin:0 0 8px 0;font-family:Syne,sans-serif;font-weight:700;color:#1e293b;font-size:1.2rem;';

            const msgEl = document.createElement('p');
            msgEl.innerText = message;
            msgEl.style.cssText = 'margin:0 0 16px 0;color:#475569;font-size:0.95rem;font-weight:500;';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = defaultValue;
            input.style.cssText = 'width:100%;padding:14px;border:2px solid #e2e8f0;border-radius:14px;margin-bottom:24px;font-size:1rem;color:#1e293b;outline:none;transition:border-color 0.2s;box-sizing:border-box;font-family:inherit;font-weight:600;';
            input.onfocus = () => input.style.borderColor = '#4f46e5';
            input.onblur = () => input.style.borderColor = '#e2e8f0';

            const btnGroup = document.createElement('div');
            btnGroup.style.cssText = 'display:flex;gap:12px;';

            const cancelBtn = document.createElement('button');
            cancelBtn.innerText = 'Cancel';
            cancelBtn.style.cssText = 'flex:1;background:#f1f5f9;color:#64748b;border:none;padding:12px;border-radius:14px;font-weight:700;font-size:1rem;cursor:pointer;';

            const okBtn = document.createElement('button');
            okBtn.innerText = 'Confirm';
            okBtn.style.cssText = 'flex:1;background:linear-gradient(135deg, #4f46e5, #3b82f6);color:white;border:none;padding:12px;border-radius:14px;font-weight:700;font-size:1rem;cursor:pointer;box-shadow:0 4px 12px rgba(79,70,229,0.3);';

            const close = (val) => {
                overlay.style.opacity = '0';
                modal.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve(val);
                }, 300);
            };

            cancelBtn.onclick = () => close(null);
            okBtn.onclick = () => close(input.value);

            btnGroup.appendChild(cancelBtn);
            btnGroup.appendChild(okBtn);

            modal.appendChild(titleEl);
            modal.appendChild(msgEl);
            modal.appendChild(input);
            modal.appendChild(btnGroup);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            void overlay.offsetWidth;
            overlay.style.opacity = '1';
            modal.style.transform = 'translateY(0) scale(1)';
            setTimeout(() => input.focus(), 300);
        });
    };
}

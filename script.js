// Chat Bot Logic
function toggleChat() {
    const chat = document.getElementById("chatbox");
    const isHidden = chat.getAttribute('aria-hidden') === 'true' || !chat.hasAttribute('aria-hidden');
    chat.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
    // if opening, focus the input
    if (isHidden) {
        setTimeout(() => {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }, 300);
    }
}

// Chat Bot Core
(function initChat() {
    const sendBtn = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const msgs = document.getElementById('chat-messages');

    if (!sendBtn || !input || !msgs) return;

    function addMessage(text, sender) {
        const row = document.createElement('div');
        row.className = `message ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = text; // allow bold/links

        row.appendChild(bubble);
        msgs.appendChild(row);
        msgs.scrollTop = msgs.scrollHeight;
    }

    function getBotResponse(rawText) {
        const text = rawText.toLowerCase().trim();

        if (text.includes('event') || text.includes('when')) {
            return "Our upcoming events include the <b>Welcome Mixer</b> and <b>Dashain Celebration</b>. Check the <a href='events.html'>Events Page</a> for dates!";
        }
        if (text.includes('board') || text.includes('president') || text.includes('who')) {
            return "Our President leads the NSA! You can meet the entire team on our <a href='about.html'>About Page</a>.";
        }
        if (text.includes('join') || text.includes('member') || text.includes('sign up')) {
            return "We'd love to have you! You can become a member by attending our next meeting or filling out the <a href='contact.html'>Contact Form</a>.";
        }
        if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
            return "Namaste! 🙏 How can I help you today?";
        }
        if (text.includes('thank')) {
            return "You're welcome! Dhanyabad! 🇳🇵";
        }

        return "I'm not sure about that. Try asking about <b>events</b>, <b>board members</b>, or <b>how to join</b>.";
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        // User Message
        addMessage(text, 'user');
        input.value = '';

        // Bot Response (Simulate delay)
        setTimeout(() => {
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 600);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
})();

// DOM-ready helpers
document.addEventListener('DOMContentLoaded', () => {

    // 1. SAFE UTILS & GLOBALS
    let galleryImages = [];
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
    let lbIndex = 0;

    function tryLoad(url) {
        return new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(url);
            i.onerror = () => reject(url);
            i.src = url;
        });
    }

    // 2. ADMIN UI (High Priority - Always run first)
    try {
        (function initAdminUI() {
            const LS_ADMIN = 'nsa_is_admin';
            let isAdmin = localStorage.getItem(LS_ADMIN) === 'true';

            // Create Lock Button (Fixed Bottom-Left)
            if (!document.getElementById('admin-lock')) {
                const lockBtn = document.createElement('button');
                lockBtn.id = 'admin-lock';
                lockBtn.textContent = '🔒';
                lockBtn.title = 'Admin Login';
                Object.assign(lockBtn.style, {
                    position: 'fixed', bottom: '20px', left: '20px', zIndex: '10000',
                    background: 'rgba(33,33,33,0.8)', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer',
                    display: 'grid', placeItems: 'center', fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                });
                lockBtn.onclick = handleLoginToggle;
                document.body.appendChild(lockBtn);
            }

            // Toolbar
            if (isAdmin) showToolbar();

            // Login Logic
            function handleLoginToggle() {
                if (isAdmin) return;
                const frame = document.createElement('div');
                frame.className = 'admin-modal-overlay';
                frame.innerHTML = `
                    <div class="admin-modal">
                        <h3>Admin Access</h3>
                        <input type="password" id="admin-pass" placeholder="Enter Password" autofocus>
                        <div style="display:flex; gap:10px; justify-content:center">
                            <button id="try-login" class="glow-btn small">Unlock</button>
                            <button id="cancel-login" class="small-btn">Cancel</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(frame);

                const passIn = document.getElementById('admin-pass');
                const submit = () => {
                    if (passIn.value === 'HAGEC2025') {
                        localStorage.setItem(LS_ADMIN, 'true');
                        isAdmin = true;
                        showToolbar();
                        frame.remove();
                        location.reload(); // Refresh to unlock features
                    } else {
                        alert('Incorrect Password');
                    }
                };
                document.getElementById('try-login').onclick = submit;
                document.getElementById('cancel-login').onclick = () => frame.remove();
                passIn.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
            }

            function showToolbar() {
                if (document.getElementById('admin-toolbar')) return;
                const bar = document.createElement('div');
                bar.id = 'admin-toolbar';
                bar.className = 'admin-toolbar';
                bar.innerHTML = `
                    <span>Admin Mode</span>
                    <button id="admin-edit-toggle" class="small-btn">✎ Edit Text</button>
                    <button id="admin-logout" class="small-btn danger">Logout</button>
                `;
                document.body.appendChild(bar);
                document.getElementById('admin-logout').onclick = () => {
                    localStorage.setItem(LS_ADMIN, 'false');
                    location.reload();
                };
                document.getElementById('admin-edit-toggle').onclick = toggleEditMode;
                unlockFeatures();
            }

            function unlockFeatures() {
                const adminPanel = document.getElementById('gal-admin-panel');
                if (adminPanel) adminPanel.hidden = false; // Show added panel if exists

                const galMgr = document.getElementById('gallery-manager');
                if (galMgr) galMgr.style.display = 'block';

                // Re-render gallery if possible to show delete buttons
                if (typeof window.renderGalleryExternal === 'function') window.renderGalleryExternal();
            }

            // Content Editor
            // Content Editor
            let editMode = false;
            // Hidden file input for inline image editing
            const imgEditInput = document.createElement('input');
            imgEditInput.type = 'file';
            imgEditInput.accept = 'image/*';
            imgEditInput.style.display = 'none';
            document.body.appendChild(imgEditInput);
            let currentImgTarget = null;

            imgEditInput.onchange = (e) => {
                if (!currentImgTarget || !imgEditInput.files[0]) return;
                const file = imgEditInput.files[0];
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const newSrc = evt.target.result;
                    currentImgTarget.src = newSrc;

                    // Save Image Edit
                    const uid = currentImgTarget.dataset.editableId;
                    const LS_IMGS = 'nsa_image_edits_v1';
                    let imgs = JSON.parse(localStorage.getItem(LS_IMGS) || '{}');
                    imgs[uid] = newSrc;
                    localStorage.setItem(LS_IMGS, JSON.stringify(imgs));
                };
                reader.readAsDataURL(file);
            };

            function toggleEditMode() {
                editMode = !editMode;
                const btn = document.getElementById('admin-edit-toggle');
                if (btn) {
                    btn.textContent = editMode ? '✓ Done' : '✎ Edit Text/Images';
                    btn.style.background = editMode ? '#00e676' : '';
                    btn.style.color = editMode ? '#000' : '';
                }

                // Expanded selectors for Board Members and generic text
                const selectors = 'main h1, main h2, main h3, main p, main li, figcaption, .member-role, .member-email, .member-img';
                const targets = document.querySelectorAll(selectors);

                targets.forEach((el, idx) => {
                    // Stable ID generation (assumes static DOM structure)
                    const uid = location.pathname + '|' + el.tagName + '|' + idx;
                    el.dataset.editableId = uid;

                    if (el.tagName.toLowerCase() === 'img') {
                        // Image editing
                        if (editMode) {
                            el.style.cursor = 'pointer';
                            el.style.outline = '4px solid #00e676';
                            el.style.transition = 'outline 0.3s';
                            el.title = 'Click to replace image';
                            el.onclick = (e) => {
                                e.preventDefault();
                                currentImgTarget = el;
                                imgEditInput.click();
                            };
                        } else {
                            el.style.cursor = '';
                            el.style.outline = '';
                            el.title = '';
                            el.onclick = null;
                        }
                    } else {
                        // Text editing
                        el.contentEditable = editMode ? 'true' : 'false';
                        if (editMode) {
                            el.style.outline = '1px dashed rgba(255,255,255,0.3)';
                            el.addEventListener('blur', saveEdit);
                            // Disable link navigation while editing
                            if (el.tagName.toLowerCase() === 'a') {
                                el.onclick = (e) => e.preventDefault();
                            }
                        } else {
                            el.style.outline = '';
                            el.removeEventListener('blur', saveEdit);
                            if (el.tagName.toLowerCase() === 'a') el.onclick = null;
                        }
                    }
                });
            }

            function saveEdit(e) {
                const el = e.target;
                const uid = el.dataset.editableId;
                const LS_EDITS = 'nsa_text_edits_v1';
                let edits = JSON.parse(localStorage.getItem(LS_EDITS) || '{}');
                edits[uid] = el.innerText;
                localStorage.setItem(LS_EDITS, JSON.stringify(edits));

                // Special handling for Emails: update href
                if (el.classList.contains('member-email')) {
                    el.href = 'mailto:' + el.innerText.trim();
                }
            }

            // Apply Edits (Text & Images)
            (function applyEdits() {
                // Text
                const TEXT_KEY = 'nsa_text_edits_v1';
                const IMG_KEY = 'nsa_image_edits_v1';
                const texts = JSON.parse(localStorage.getItem(TEXT_KEY) || '{}');
                const imgs = JSON.parse(localStorage.getItem(IMG_KEY) || '{}');

                const selectors = 'main h1, main h2, main h3, main p, main li, figcaption, .member-role, .member-email, .member-img';
                const targets = document.querySelectorAll(selectors);

                targets.forEach((el, idx) => {
                    const uid = location.pathname + '|' + el.tagName + '|' + idx;

                    // Apply Text
                    if (texts[uid] && el.tagName.toLowerCase() !== 'img') {
                        el.innerText = texts[uid];
                        if (el.classList.contains('member-email')) {
                            el.href = 'mailto:' + texts[uid].trim();
                        }
                    }

                    // Apply Image
                    if (imgs[uid] && el.tagName.toLowerCase() === 'img') {
                        el.src = imgs[uid];
                    }
                });
            })();
        })();
    } catch (e) { console.error('Admin UI Error:', e); }

    // 3. LOGO REPLACEMENT
    try {
        (function tryReplaceLogo() {
            const logoCandidates = ['assets/logo.png', 'assets/logo.webp', 'assets/logo.jpg'];
            const logoEls = Array.from(document.querySelectorAll('.nav-logo, .logo'));
            if (!logoEls.length) return;
            (async () => {
                for (const url of logoCandidates) {
                    try { await tryLoad(url); logoEls.forEach(el => el.src = url); return; } catch (e) { }
                }
            })();
        })();
    } catch (e) { }

    // 4. NAV & UI EVENTS
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
            const chat = document.getElementById('chatbox');
            if (chat && chat.getAttribute('aria-hidden') === 'false') chat.setAttribute('aria-hidden', 'true');
        }
        if (lightbox && lightbox.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }
    });

    // 5. GALLERY MANAGER (Robust)
    try {
        (function galleryManager() {
            const LS_GALLERY = 'nsa_gallery_v4';
            const galGrid = document.getElementById('gallery-list');
            if (!galGrid) return;

            const adminToggle = document.getElementById('gal-admin-toggle');
            const adminPanel = document.getElementById('gal-admin-panel');
            const addForm = document.getElementById('add-img-form');
            const urlInput = document.getElementById('img-url');
            const capInput = document.getElementById('img-caption');

            function loadGallery() { return JSON.parse(localStorage.getItem(LS_GALLERY)) || []; }
            function saveGallery(list) { localStorage.setItem(LS_GALLERY, JSON.stringify(list)); }

            let gallery = loadGallery();
            if (!gallery.length) {
                gallery = [
                    { src: 'assets/gallery1.jpg', caption: 'Himalayan peaks', alt: 'Nepal mountains', size: '' },
                    { src: 'assets/gallery2.jpg', caption: 'Temple', alt: 'Kathmandu Temple', size: 'large' },
                    { src: 'assets/gallery3.jpg', caption: 'Culture', alt: 'Nepal culture', size: '' },
                    { type: 'video', src: 'https://www.youtube.com/embed/W8f79_5tOIg', caption: 'Nepal Video', size: 'large' }
                ];
                saveGallery(gallery);
            }

            const isAdmin = localStorage.getItem('nsa_is_admin') === 'true';

            function renderGallery() {
                galGrid.innerHTML = '';
                gallery.forEach((item, index) => {
                    const figure = document.createElement('figure');
                    figure.className = `gallery-item ${item.size || ''}`;

                    if (item.type === 'video') {
                        const iframe = document.createElement('iframe');
                        iframe.className = 'gallery-video';
                        iframe.src = item.src;
                        iframe.title = item.caption;
                        iframe.frameBorder = '0';
                        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                        iframe.allowFullscreen = true;
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.minHeight = '300px';
                        iframe.style.borderRadius = '8px';
                        figure.appendChild(iframe);
                    } else {
                        const img = document.createElement('img');
                        img.className = 'gallery-img';
                        img.src = item.src;
                        img.alt = item.alt || item.caption;
                        img.loading = 'lazy';
                        img.dataset.caption = item.caption;
                        figure.appendChild(img);
                    }

                    const cap = document.createElement('figcaption');
                    cap.textContent = item.caption;

                    const delBtn = document.createElement('button');
                    // ... rest of button logic ...
                    delBtn.className = 'del-img-btn';
                    delBtn.textContent = '✕';
                    // Explicitly use display property for robustness
                    delBtn.style.display = isAdmin ? 'block' : 'none';
                    delBtn.onclick = (e) => {
                        e.stopPropagation();
                        // Double check admin status before allowing delete
                        if (localStorage.getItem('nsa_is_admin') === 'true') {
                            if (confirm('Delete?')) {
                                gallery.splice(index, 1);
                                saveGallery(gallery);
                                renderGallery();
                            }
                        }
                    };

                    figure.appendChild(cap);
                    figure.appendChild(delBtn);
                    galGrid.appendChild(figure);
                });
                setTimeout(attachGalleryListeners, 100);
            }

            window.renderGalleryExternal = renderGallery;

            if (adminToggle) {
                adminToggle.onclick = () => {
                    const hidden = adminPanel.hidden;
                    adminPanel.hidden = !hidden;
                    adminToggle.textContent = hidden ? '❌ Close Admin' : '⚙️ Gallery Admin';
                };
            }

            if (addForm) {
                addForm.onsubmit = (e) => {
                    e.preventDefault();
                    const fileInput = document.getElementById('img-file');
                    if (!fileInput || !fileInput.files[0]) return alert('Please select a file');

                    const file = fileInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function (evt) {
                        gallery.push({ src: evt.target.result, caption: capInput.value || '', alt: '', size: '' });
                        saveGallery(gallery);
                        renderGallery();
                        fileInput.value = '';
                        capInput.value = '';
                        alert('Image uploaded!');
                    };
                    reader.readAsDataURL(file);
                };
            }

            renderGallery();
        })();
    } catch (e) { console.error('Gallery Error:', e); }

    // 6. EVENTS MANAGER
    try {
        (function eventsManager() {
            const LS_EVENTS = 'nsa_events_v1';
            const LS_REGS = 'nsa_event_regs_v1';
            const eventsListEl = document.getElementById('events-list');

            if (!eventsListEl) return;

            const selectedTitle = document.getElementById('selected-title');
            const selectedDate = document.getElementById('selected-date');
            const selectedDesc = document.getElementById('selected-desc');
            const regForm = document.getElementById('register-form');
            const regEventId = document.getElementById('reg-event-id');
            const regName = document.getElementById('reg-name');
            const regEmail = document.getElementById('reg-email');
            const regMsg = document.getElementById('reg-msg');
            const adminToggle = document.getElementById('admin-toggle');
            const adminPanel = document.getElementById('admin-panel');
            const addEventForm = document.getElementById('add-event-form');
            const evTitle = document.getElementById('ev-title');
            const evDate = document.getElementById('ev-date');
            const evDesc = document.getElementById('ev-desc');
            const clearEventsBtn = document.getElementById('clear-events');

            function loadEvents() { return JSON.parse(localStorage.getItem(LS_EVENTS) || '[]'); }
            function saveEvents(list) { localStorage.setItem(LS_EVENTS, JSON.stringify(list)); }
            function loadRegs() { return JSON.parse(localStorage.getItem(LS_REGS) || '[]'); }
            function saveRegs(list) { localStorage.setItem(LS_REGS, JSON.stringify(list)); }

            function ensureInitialEvents() {
                // Return empty list if no events are stored
                let list = loadEvents();
                if (!list) {
                    list = [];
                    saveEvents(list);
                }
                return list;
            }

            function formatDate(iso) {
                if (!iso) return '—';
                try { return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); } catch (e) { return iso; }
            }

            let events = ensureInitialEvents();
            let regs = loadRegs();
            // Check global admin status
            let adminMode = localStorage.getItem('nsa_is_admin') === 'true';

            function renderEventsList() {
                eventsListEl.innerHTML = '';
                if (!events.length) {
                    const p = document.createElement('div');
                    p.className = 'event-row';
                    // Simplify message for non-admins
                    p.textContent = adminMode ? 'No events. Use Admin Panel to add.' : 'No upcoming events at this time.';
                    eventsListEl.appendChild(p);
                    selectEvent(null);
                    return;
                }

                events.slice().sort((a, b) => (a.date > b.date) ? 1 : -1).forEach(ev => {
                    const row = document.createElement('div');
                    row.className = 'event-row';
                    row.tabIndex = 0;
                    row.dataset.id = ev.id;

                    const t = document.createElement('div'); t.className = 'ev-title'; t.textContent = ev.title;
                    if ((ev.title || '').trim().toLowerCase() === 'welcome mixer') row.classList.add('no-slide');
                    const d = document.createElement('div'); d.className = 'ev-date'; d.textContent = formatDate(ev.date);

                    const right = document.createElement('div');
                    right.style.display = 'flex'; right.style.gap = '8px'; right.style.alignItems = 'center';

                    const viewBtn = document.createElement('button');
                    viewBtn.className = 'small-btn'; viewBtn.textContent = 'View';
                    viewBtn.onclick = (e) => { e.stopPropagation(); selectEvent(ev.id); };

                    const delBtn = document.createElement('button');
                    delBtn.className = 'small-btn danger'; delBtn.textContent = 'Delete';
                    delBtn.style.display = adminMode ? 'inline-flex' : 'none';
                    delBtn.onclick = (e) => { e.stopPropagation(); if (adminMode) deleteEvent(ev.id); };

                    right.appendChild(viewBtn); right.appendChild(delBtn);
                    row.appendChild(t); row.appendChild(d); row.appendChild(right);
                    row.onclick = () => selectEvent(ev.id);
                    row.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') selectEvent(ev.id); };
                    eventsListEl.appendChild(row);
                });
            }

            function selectEvent(id) {
                const ev = events.find(x => x.id === id);
                if (!ev) {
                    selectedTitle.textContent = 'No event selected';
                    selectedDate.textContent = '—';
                    selectedDesc.textContent = adminMode ? 'Select an event to edit/delete.' : 'Select an event to see details.';
                    regEventId.value = '';
                    return;
                }
                selectedTitle.textContent = ev.title;
                selectedDate.textContent = formatDate(ev.date);
                selectedDesc.textContent = ev.desc || '';
                regEventId.value = ev.id;
                if (regName) regName.focus();
            }

            function addEvent(ev) {
                events.push(ev);
                saveEvents(events);
                renderEventsList();
                selectEvent(ev.id);
            }

            function deleteEvent(id) {
                if (!confirm('Delete this event?')) return;
                events = events.filter(e => e.id !== id);
                saveEvents(events);
                renderEventsList();
                selectEvent(null);
            }

            function clearAllEvents() {
                if (!confirm('Clear all events?')) return;
                events = [];
                saveEvents(events);
                renderEventsList();
                selectEvent(null);
            }

            // Secure Admin Toggle: Only show/enable if truly admin
            if (adminToggle) {
                if (adminMode) {
                    adminToggle.style.display = 'inline-block';
                    adminToggle.onclick = () => {
                        const isHidden = adminPanel.hidden;
                        adminPanel.hidden = !isHidden;
                        adminToggle.setAttribute('aria-pressed', !isHidden);
                    };
                    // Open panel by default if admin
                    if (adminPanel) adminPanel.hidden = false;
                } else {
                    adminToggle.style.display = 'none';
                    if (adminPanel) adminPanel.hidden = true;
                }
            }

            if (addEventForm) {
                addEventForm.onsubmit = (e) => {
                    e.preventDefault();
                    const title = evTitle.value.trim();
                    const date = evDate.value;
                    const desc = evDesc.value.trim();
                    if (!title || !date) return alert('Title/Date required');
                    addEvent({ id: 'ev-' + Date.now(), title, date, desc });
                    addEventForm.reset();
                };
            }

            if (clearEventsBtn) clearEventsBtn.onclick = clearAllEvents;

            if (regForm) {
                regForm.onsubmit = (e) => {
                    e.preventDefault();
                    const eid = regEventId.value;
                    if (!eid) { regMsg.textContent = 'Select event first.'; return; }

                    const selectedEv = events.find(x => x.id === eid);
                    const evTitleStr = selectedEv ? selectedEv.title : 'Unknown Event';

                    // 1. Save Locally
                    regs.push({ id: 'r-' + Date.now(), eventId: eid, name: regName.value, email: regEmail.value, ts: new Date().toISOString() });
                    saveRegs(regs);

                    // 2. Send Email Notification (AJAX)
                    regMsg.textContent = 'Sending registration...';

                    fetch("https://formsubmit.co/ajax/nsamorgan2024@gmail.com", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            subject: `New Event Registration: ${evTitleStr}`,
                            name: regName.value,
                            email: regEmail.value,
                            event: evTitleStr,
                            message: `New registration for "${evTitleStr}" from ${regName.value} (${regEmail.value}).`
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Success:', data);
                            regMsg.textContent = 'Registered & Email Sent!';
                            regForm.reset();
                            setTimeout(() => { regMsg.textContent = ''; }, 4000);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            regMsg.textContent = 'Registered locally (Email failed).';
                            regForm.reset();
                            setTimeout(() => { regMsg.textContent = ''; }, 4000);
                        });
                };
            }

            renderEventsList();
            if (events.length) selectEvent(events[0].id);
        })();
    } catch (e) { }

    // 7. LIGHTBOX FUNCTIONS
    function openLightboxByIndex(index) {
        if (!lightbox) return;
        if (!galleryImages.length) galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
        if (!galleryImages.length) return;
        lbIndex = (index + galleryImages.length) % galleryImages.length;
        const img = galleryImages[lbIndex];
        if (!img) return;
        if (lightboxImg) lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = img.dataset.caption || '';
        lightbox.setAttribute('aria-hidden', 'false');
    }
    function closeLightbox() { if (lightbox) lightbox.setAttribute('aria-hidden', 'true'); }
    function showNext() { openLightboxByIndex(lbIndex + 1); }
    function showPrev() { openLightboxByIndex(lbIndex - 1); }
    function attachGalleryListeners() {
        galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
        galleryImages.forEach((img, idx) => {
            if (img.dataset.glistener) return;
            img.addEventListener('click', (e) => { e.preventDefault(); openLightboxByIndex(idx); });
            img.dataset.glistener = '1';
        });
    }
    if (lightboxClose) lightboxClose.onclick = closeLightbox;
    if (lightboxNext) lightboxNext.onclick = showNext;
    if (lightboxPrev) lightboxPrev.onclick = showPrev;
    if (lightbox) lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };

    // 8. FLAG OVERLAY
    (function toggleFlag() {
        const hero = document.querySelector('.hero');
        const overlay = document.querySelector('.flag-overlay');
        if (!overlay) return;
        if (!hero) { overlay.style.display = 'none'; return; }
        document.body.classList.add('has-hero');
    })();

});

/* Background slideshow: preload images and crossfade between two slides. */
(async function () {
    // Default stylized SVG backgrounds (fallback)
    const defaultQueries = [
        'assets/bg1.svg',
        'assets/bg2.svg',
        'assets/bg3.svg',
        'assets/bg4.svg',
        'assets/bg5.svg'
    ];

    function tryLoad(url) {
        return new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(url);
            i.onerror = () => reject(url);
            i.src = url;
        });
    }
    // Look for user-provided slideshow images named slide1..slide5 in either assets/ or assets/photos/
    const customSlides = [];
    const exts = ['jpg', 'png', 'webp'];
    for (let i = 1; i <= 5; i++) {
        let found = false;
        for (const base of ['assets', 'assets/photos']) {
            if (found) break;
            for (const ext of exts) {
                const candidate = `${base}/slide${i}.${ext}`;
                try {
                    // await to test sequentially to keep order
                    // eslint-disable-next-line no-await-in-loop
                    await tryLoad(candidate);
                    customSlides.push(candidate);
                    found = true;
                    break;
                } catch (e) {
                    // try next
                }
            }
        }
    }

    const queries = customSlides.length ? customSlides : defaultQueries;

    // If user prefers reduced motion, don't animate; set a single background.
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const container = document.querySelector('.bg-slideshow');
    if (!container) return;

    const slides = Array.from(container.querySelectorAll('.slide'));
    if (slides.length < 2) return;

    // Preload images (populate the browser cache)
    const images = queries.map(q => {
        const img = new Image();
        img.src = q;
        return img;
    });

    let current = 0;
    // reference to the events-scoped slides so we can keep them synchronized
    let eventsSlides = null;

    // Initialize first slide(s)
    slides[0].style.backgroundImage = `url('${images[0].src}')`;
    slides[0].classList.add('visible');
    if (prefersReduced) {
        // stop here — don't cycle
        return;
    }

    // set next slide background right away to avoid white flash
    slides[1].style.backgroundImage = `url('${images[1 % images.length].src}')`;

    const INTERVAL_MS = 7000; // visible time per slide
    const TRANSITION_MS = 1000; // should match CSS transition

    const __interval = setInterval(() => {
        const nextIndex = (current + 1) % images.length;
        const active = slides[0].classList.contains('visible') ? slides[0] : slides[1];
        const hidden = active === slides[0] ? slides[1] : slides[0];

        // update hidden slide's background to next image
        hidden.style.backgroundImage = `url('${images[nextIndex].src}')`;

        // trigger crossfade
        hidden.classList.add('visible');
        active.classList.remove('visible');

        current = nextIndex;

        // keep events slideshow perfectly in sync with the global slideshow
        if (eventsSlides) {
            try {
                const eActive = eventsSlides[0].classList.contains('visible') ? eventsSlides[0] : eventsSlides[1];
                const eHidden = eActive === eventsSlides[0] ? eventsSlides[1] : eventsSlides[0];
                eHidden.style.backgroundImage = `url('${images[nextIndex].src}')`;
                eHidden.classList.add('visible');
                eActive.classList.remove('visible');
            } catch (e) { /* ignore sync errors */ }
        }
    }, INTERVAL_MS + TRANSITION_MS);
    // expose interval and container so other code (page logic) can stop/hide the slideshow
    try { window.__nsa_slideshowInterval = __interval; window.__nsa_slideshowContainer = container; window.__nsa_slideshowSlides = slides; } catch (e) { }

    // --- EVENTS SECTION SLIDESHOW (scoped to #events .container) ---
    (function initEventsSlideshow() {
        const eventsContainer = document.querySelector('#events .container');
        if (!eventsContainer) return;

        // make sure events container is positioned for absolute children
        const bgWrap = document.createElement('div');
        bgWrap.className = 'events-bg-slideshow';
        const sA = document.createElement('div'); sA.className = 'slide';
        const sB = document.createElement('div'); sB.className = 'slide';
        bgWrap.appendChild(sA); bgWrap.appendChild(sB);

        const overlay = document.createElement('div');
        overlay.className = 'events-overlay';

        // insert slideshow and overlay as first children so they sit behind content
        eventsContainer.insertBefore(bgWrap, eventsContainer.firstChild);
        eventsContainer.insertBefore(overlay, eventsContainer.firstChild);

        // Use the same preloaded images array from the global slideshow
        const eSlides = [sA, sB];
        // initialize events slides to current global index so they match
        eSlides[0].style.backgroundImage = `url('${images[current].src}')`;
        eSlides[0].classList.add('visible');
        if (prefersReduced) return; // don't animate if user prefers reduced motion
        eSlides[1].style.backgroundImage = `url('${images[(current + 1) % images.length].src}')`;

        eventsSlides = eSlides; // sync reference
    })();
})();

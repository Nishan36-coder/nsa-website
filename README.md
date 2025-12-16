# Nepalese Student Association — Morgan State University

A modern, dynamic website for the Nepalese Student Association (NSA) at Morgan State University. This project showcases Nepalese culture, events, and gallery through a premium glassmorphism design.

## 🚀 Live Features

### 1. **Dynamic Media**
- **Video Background**: Homepage features a looped YouTube video background (`W8f79_5tOIg`) that starts at 1:00, autoplays, and blends seamlessly.
- **Glassmorphism Design**: All pages (Home, About, Gallery, Events, Contact) use a unified frosted glass UI.
- **Background Slideshow**: Non-homepage sections feature a cross-fading background slideshow.

### 2. **Global Admin System 🔒**
A client-side admin system allows you to manage the entire website directly from the browser.
- **Login**: Click the **Lock Icon (🔒)** in the bottom-left corner.
- **Password**: `HAGEC2025`
- **Session**: Persists via LocalStorage (stays logged in until you click Logout).

### 3. **Admin Capabilities**
Once logged in, you gain access to:
- **✏️ Edit Content**: Click "Edit Text/Images" in the toolbar to modifying ANY text on the page, change images (click to upload), or update email links.
- **🖼️ Gallery Manager**:
  - **Upload**: Add new images or videos directly to the gallery using the Admin Panel.
  - **Delete**: "Delete" (X) buttons appear on gallery items only in Admin mode.
  - **Video Support**: The gallery supports both images and YouTube videos.
- **📅 Event Manager**:
  - **Add Events**: Create new events with Title, Date, and Description.
  - **Delete Events**: Remove old events from the list.
  - **Clear All**: Reset the event calendar.

### 4. **Forms & Email 📧**
- **Contact Form**: Submits messages directly to `nsamorgan2024@gmail.com` via FormSubmit.co.
- **Event Registration**: Users can register for events. Success emails (with name/event details) are sent automatically to `nsamorgan2024@gmail.com`.
- **Note**: You must **activate** FormSubmit once by sending a test submission from the live site to confirm your email address.

### 5. **Gallery**
- **Lightbox**: Click images to view them in full screen.
- **Video Playback**: Videos play directly within the gallery grid.
- **Data Persistence**: All gallery changes are saved to the browser's LocalStorage (`nsa_gallery_v4`).

---

## 🛠️ Technical Details

### File Structure
- `index.html`: Homepage with Video Background.
- `about.html`: Board members & Mission.
- `gallery.html`: Dynamic gallery grid.
- `events.html`: Event calendar & registration.
- `contact.html`: Contact form.
- `style.css`: All premium styling, animations, and responsive layouts.
- `script.js`:
  - **Modular Logic**: Separate IIFEs for Admin, Gallery, Events, and UI.
  - **LocalStorage**: Handles all data persistence (no backend database required).
  - **Robustness**: Error handling ensures one module doesn't break others.

### Key Customizations
- **Styling**: To change the blue/red theme, edit the `:root` variables in `style.css`.
- **Text Glow**: The homepage text uses a multi-layered `drop-shadow` filter for maximum contrast against the video.
- **Logo Fit**: The `.logo-wrap` in CSS uses `inset: 3px` to perfectly align the decorative ring with the logo's gold border.

## 📝 Usage Guide

1. **Deployment**: Upload all files to any static host (GitHub Pages, Netlify, Vercel).
2. **Initial Setup**:
   - Log in as Admin (`HAGEC2025`).
   - Use the **Edit Text** mode to update Board Member names and roles on the About page.
   - Go to **Events** and populate the initial calendar.
   - Go to **Contact** and submit one test form to activate email forwarding.

---
*Built with ❤️ for the NSA at Morgan State University.*

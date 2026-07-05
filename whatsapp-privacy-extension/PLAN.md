# WhatsApp Web Privacy Extension — Plan (not started)

A separate Chrome extension project (own folder, own repo/codebase later if needed —
nothing here touches DevQuiz's web app, mobile app, or the Notes-clipper extension).
This file is just the plan; no code has been written yet. Start whenever ready.

## Goal

Add a privacy toggle to **WhatsApp Web** (web.whatsapp.com) that lets the user instantly
blur/hide sensitive info on screen — useful when someone glances at your screen or you're
screen-sharing:

- Contact and group **names** (sidebar list + open chat header)
- **Message text** (bubbles) — blurred, not deleted, un-blurs on hover/click
- **Group member names/avatars**
- Optionally: chat **thumbnails/avatars** too

This mirrors the "blur mode" already built for DevQuiz Notes (`Notes.jsx` — see
`client/src/pages/Notes.jsx` for the CSS blur + hover-to-reveal pattern) — same UX idea,
applied to WhatsApp Web's DOM instead of our own React components.

## Why this is harder than the Notes clipper extension

The Notes-clipper extension (`chrome-extension/` in this repo) only talks to _our own_
backend API — it doesn't touch the DOM of any third-party site. This new extension must
inject a **content script into web.whatsapp.com** and manipulate WhatsApp's own DOM
directly, which means:

- No public API — we're styling/hiding elements WhatsApp Web renders, by inspecting its
  actual DOM structure (class names, `data-*` attributes) via browser DevTools.
- WhatsApp Web's DOM structure **changes without notice** across their releases — a
  selector that works today can silently break after they ship an update. The extension
  needs to fail gracefully (do nothing) rather than break the page if selectors stop
  matching.
- Must be careful not to violate WhatsApp's Terms of Service — this extension only
  _visually_ hides/blurs content already rendered to the user's own screen (a client-side
  CSS effect), it does not scrape, export, or transmit any message data anywhere. No
  network calls to any server at all — this should be a 100% local, offline extension.

## Rough approach

1. **Manifest V3**, `content_scripts` matching `https://web.whatsapp.com/*`.
2. Content script injects a CSS class (`filter: blur(6px)`) onto:
   - The chat list sidebar's name/preview-text elements
   - The open chat's header name
   - Message bubble text spans
   - Group participant names in the group-info panel
3. **Hover-to-reveal**: `:hover` removes the blur on that specific element only (same
   pattern as Notes' blur mode), OR a "click to reveal for 5 seconds" toggle if hover is
   too easy to trigger accidentally.
4. **Toggle**: an extension popup with an on/off switch, and maybe granular checkboxes
   (blur names / blur messages / blur groups independently) — persisted in
   `chrome.storage.local`, restored on every page load of web.whatsapp.com.
5. **Keyboard shortcut** (`chrome.commands`) to instantly toggle blur on/off — useful for
   quickly hiding everything the moment someone walks by.
6. Watch for WhatsApp Web's SPA navigation (it doesn't do full page reloads between
   chats) using a `MutationObserver` on the main app container, since a one-time DOM scan
   on load won't catch chats opened afterward.

## Selector research needed before writing any code

WhatsApp Web obfuscates/hashes its CSS class names (they look like `_ak8q`, `_amig`, etc.)
and these names are **not stable across releases** — this is the main technical risk.
Options to make the extension resilient:

- Prefer stable `data-testid`/`aria-label`/semantic attributes over class names wherever
  WhatsApp Web provides them (more likely to survive updates than obfuscated classes).
- Structural/positional selectors (e.g. "the header's direct child span") as a fallback
  where no stable attribute exists.
- Ship a quick way to update selectors remotely-ish (e.g. a small JSON config bundled
  with the extension) so a broken selector after a WhatsApp update doesn't require a full
  new extension version for a one-line fix — still needs a new extension version to
  actually update the bundled file, but keeps the _code_ untouched.

## First real step when we start

Open web.whatsapp.com, inspect the DOM with DevTools for: the sidebar chat list item
structure, the open-chat header, and one message bubble — document the actual selectors
(or `data-testid` attributes if any exist) before writing the content script. That
research should happen first and will likely reshape parts of this plan.

-------new update features----

# WhatsApp Web Privacy Extension — Requirements

## Overview

Build a standalone Chrome Extension (Manifest V3) that enhances privacy on WhatsApp Web (https://web.whatsapp.com) by visually hiding or blurring sensitive information. The extension must work completely locally within the user's browser and should never collect, store, or transmit any WhatsApp data to external servers.

This project must be developed as a completely separate codebase and should not modify or depend on any existing projects.

---

## Primary Objectives

- Protect user privacy while using WhatsApp Web.
- Prevent people nearby from reading chats during screen sharing or in public places.
- Allow users to instantly hide or reveal sensitive information.
- Provide a clean, modern, and easy-to-use interface.

---

## Core Features

### Privacy Toggle

- Enable/Disable Privacy Mode with one click.
- Remember the user's last selected state.
- Automatically restore the selected state whenever WhatsApp Web opens.

---

### Blur Contact Information

Blur the following:

- Contact names
- Group names
- Chat header names
- Chat list names
- Last message preview
- Group participant names
- Profile pictures
- Group icons

Support:

- Blur on hover reveal
  OR
- Click to reveal temporarily (preferred)

---

### Blur Messages

Blur:

- Incoming messages
- Outgoing messages
- Replies
- Quoted messages
- Emoji messages
- Links
- Code blocks
- Voice message captions

Messages should remain selectable and should not be removed from the page.

---

### Blur Media

Blur:

- Images
- Videos
- GIFs
- Stickers
- Documents preview
- Shared media thumbnails

Reveal only when clicked or hovered (configurable).

---

### Sidebar Privacy

Allow hiding/blurring:

- Chat names
- Last message preview
- Unread badge
- Contact avatars
- Online status
- Typing indicator

---

### Header Privacy

Blur:

- Contact name
- Profile picture
- Last seen
- Online status
- Typing status

---

### Meeting Mode

Single-click mode optimized for screen sharing.

Should automatically:

- Blur all messages
- Blur names
- Blur profile pictures
- Blur media
- Hide unread badges
- Hide message previews

---

### Panic Mode

Keyboard shortcut that instantly hides everything.

Example:

Ctrl + Shift + X

Should immediately:

- Blur entire chat
- Blur sidebar
- Blur names
- Blur media
- Hide sensitive information

Press shortcut again to restore.

---

### Auto Lock

Optional PIN lock.

Features:

- Lock WhatsApp after user inactivity.
- Lock after browser restart (optional).
- Require PIN before revealing content.
- Store PIN securely using browser storage.

---

### Settings Popup

Modern popup interface with individual toggles.

Example options:

☑ Enable Privacy Mode

☑ Blur Messages

☑ Blur Contact Names

☑ Blur Profile Pictures

☑ Blur Media

☑ Blur Chat Sidebar

☑ Blur Header

☑ Blur Group Members

☑ Hide Unread Count

☑ Hide Typing Indicator

☑ Hide Online Status

☑ Enable Meeting Mode

☑ Enable Panic Shortcut

☑ Enable Auto Lock

---

### Keyboard Shortcuts

Support configurable shortcuts.

Examples:

Ctrl + Shift + X → Toggle Privacy

Ctrl + Shift + M → Meeting Mode

Ctrl + Shift + L → Lock WhatsApp

---

### Storage

Persist settings using chrome.storage.local.

Store:

- Privacy mode state
- Individual feature toggles
- PIN (hashed if implemented)
- User preferences

---

## Technical Requirements

- Chrome Extension Manifest V3
- Content Script injected only into:
  https://web.whatsapp.com/*
- No backend required
- No API calls
- No analytics
- No tracking
- No cloud storage
- Fully offline functionality

---

## DOM Handling

Since WhatsApp Web is a React Single Page Application:

- Use MutationObserver to detect DOM changes.
- Reapply privacy rules whenever chats change.
- Avoid relying solely on hashed CSS class names.
- Prefer stable selectors such as:
  - data-testid
  - aria-label
  - role attributes
- Gracefully fail if WhatsApp changes its DOM.

---

## Performance Requirements

- Lightweight.
- Minimal CPU usage.
- Minimal memory usage.
- No noticeable delay while opening chats.
- Efficient DOM updates.
- Avoid unnecessary rescanning.

---

## UI Requirements

- Modern design
- Clean interface
- Light/Dark mode support
- Smooth blur animations
- Responsive popup
- Easy-to-understand settings

---

## Privacy Requirements

The extension must NEVER:

- Read chats for external processing.
- Upload messages.
- Store conversations.
- Send analytics.
- Send user information.
- Connect to external servers.
- Require login.
- Require user accounts.

Everything must remain completely local within the user's browser.

---

## Future Features (Optional)

- Blur only specific chats.
- Blur selected contacts.
- Scheduled privacy mode.
- Workspace profiles.
- Custom blur intensity.
- Custom reveal duration.
- Export/Import settings.
- Multiple privacy presets.
- Password-protected settings.
- Auto-enable during screen sharing (if detectable).

---

## Success Criteria

- One-click privacy protection.
- Fast and responsive.
- Works across WhatsApp Web updates as reliably as possible.
- Simple enough for non-technical users.
- Secure, lightweight, and fully offline.
- Easy to maintain and extend in future versions.

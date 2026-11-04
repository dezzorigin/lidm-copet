# LEXiCO - Design System & UI Guidelines

## 1. Aesthetic Theme: Sleek Tech / Cyber-Investigator
We are avoiding playful, childish, or Neo-Brutalism styles. The UI must feel modern, analytical, and slightly intense to fit the theme of cybersecurity and OSINT (Open Source Intelligence).
- **Vibe:** Clean, focused, digital forensics dashboard.
- **Backgrounds:** Dark/Neutral mode default (e.g., Tailwind `slate-900` or `zinc-900`).
- **Surfaces:** Subtle glassmorphism (translucency with blur) for cards and modals to give depth.

## 2. Color Palette
- **Primary/Accent:** Neon Blue or Cyan (for interactive elements and focus states).
- **Safe/Correct:** Emerald Green (`emerald-500`) for legit messages or correct answers.
- **Danger/Scam:** Crimson Red (`red-500` or `rose-600`) for scam indicators or wrong answers.
- **Text:** High contrast white/off-white for headings, soft gray for body text.

## 3. Typography
- **Headings & UI Elements:** Clean Sans-serif (e.g., `Inter` or standard system sans).
- **Data & Code Snippets:** Monospace (e.g., `Roboto Mono` or `Fira Code`) to emphasize the "technical" forensic feel.

## 4. Realistic OSINT Mockups (Critical Requirement)
When rendering the "Spot the Scam" or "Simulation" scenarios, the messages must NOT be displayed in generic text boxes. They must be contained within realistic UI mockups:
- **Email Mockup:** Must mimic a desktop or mobile email client (showing Sender Name, Email Address, Subject, Timestamp, and Body).
- **WhatsApp/Chat Mockup:** Must mimic a chat interface (green header, chat bubbles with correct alignment).

## 5. Animation (Framer Motion)
Animations should be purposeful, not purely decorative.
- **Page Transitions:** Subtle fade-in (`opacity: 0` to `1`).
- **Feedback Drawer:** When a user answers a quiz, the feedback panel must slide up smoothly from the bottom of the screen.
- **Hover States:** Micro-interactions on buttons (slight scale up or border glow).
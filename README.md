# ⌨️ Typewriter Typing Tutor

> **Master every keystroke. One letter at a time.**

Typewriter Typing Tutor is a planned interactive typing-practice experience that blends the nostalgic feel of a mechanical typewriter with a polished, modern glassmorphism interface. The experience is designed around a typewriter with animated mechanics, paper-based typing feedback, a synchronized virtual keyboard, realistic typing audio, and timed typing challenges.

> **Project status:** Update this section to reflect the current implementation. The features below describe the intended project scope; mark features as complete only after they have been implemented and tested.

---

## ✨ Features

### Typing practice modes

- **Alphabet practice** — lowercase, uppercase, mixed-case, and letter drills.
- **Alphanumeric practice** — letters, digits, and number-row exercises.
- **Special characters** — punctuation, symbols, brackets, and Shift combinations.
- **Mixed challenge** — combined letters, numbers, and symbols.
- **Words and sentences** — natural-language practice at different difficulty levels.
- **Custom practice** — use your own text, sentences, or code snippets.

### Timed sessions

- 30-second challenge
- 60-second challenge
- 120-second challenge
- Unlimited practice

The timer should start according to the selected start behavior, stop when the session finishes, and reset cleanly when a new test begins.

### Mechanical typewriter experience

- Animated key presses and key releases
- Typewriter-style paper and monospaced text
- Carriage advancement as characters are entered
- Carriage-return animation for new lines
- Spacebar behavior that advances the carriage without printing a visible character
- A modern correction workflow for Backspace
- Responsive animation that does not block typing input

### Live typing statistics

- Gross words per minute (WPM)
- Net WPM, using a documented error-adjustment method
- Accuracy percentage
- Correct and incorrect character counts
- Final results when a test ends
- Personal-best tracking, where implemented

### Audio

- Mechanical keypress sounds
- Distinct Space and Enter sounds
- Volume and mute controls
- Optional synthesized audio fallback
- Saved sound preferences, where implemented

### Modern interface

- Dark glassmorphism panels
- Cyan and violet accent lighting
- Vintage typewriter-inspired visuals
- Responsive layout for desktop, tablet, and mobile
- Reduced-motion support
- Keyboard focus indicators and accessible control labels

---

## 🎨 Design direction

The visual language combines vintage craftsmanship with a cinematic, modern interface.

| Element | Direction |
| --- | --- |
| Background | Midnight blue-black |
| Primary accent | Electric cyan |
| Secondary accent | Soft violet |
| Typewriter | Matte black, gunmetal, and subtle chrome |
| Paper | Warm ivory |
| Interface | Translucent glass panels, fine borders, soft shadows |
| Typography | Clean UI typography with a monospaced typing surface |

The typewriter and its paper should remain the central focus. Glass effects and ambient lighting should support the experience rather than reduce readability.

---

## 🧰 Technology stack

The planned stack includes:

- **HTML5** — semantic page structure
- **CSS3** — layout, glassmorphism, responsive styling, and transitions
- **JavaScript ES modules** — typing logic and application behavior
- **Tailwind CSS 3** — utility-first styling
- **GSAP 3** — coordinated mechanical and interface animations
- **Three.js** — optional 3D typewriter rendering
- **Web Audio API** — low-latency synthesized sound effects
- **Lucide** — interface icons
- **LocalStorage** — local preferences and best-score persistence
- **Vite** — local development server and build tooling, if used by the implementation

The exact dependencies should match the project's `package.json`. Three.js and GSAP are optional until the implementation requires them.

---

## 🚀 Getting started

### Prerequisites

- Node.js (a current LTS release is recommended)
- npm, or another package manager supported by the project
- Git

### 1. Clone the repository

Replace the placeholder with your GitHub repository URL:

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
```

### 2. Install dependencies

If the project includes a `package.json`, run:

```bash
npm install
```

### 3. Start the development server

For a Vite project with the standard `dev` script:

```bash
npm run dev
```

Open the local URL printed in the terminal, commonly `http://localhost:5173`.

> If the project is currently plain HTML, CSS, and JavaScript without a package setup, use a local development server rather than opening the page with `file://`—especially if loading modules, audio assets, or 3D models.

### 4. Create a production build

If a build script is configured:

```bash
npm run build
```

Preview the build if the project provides a preview script:

```bash
npm run preview
```

---

## 🕹️ How to use

1. Open **Typewriter Typing Tutor** in your browser.
2. Select a typing mode: Alphabet, Alphanumeric, Special Characters, Mixed Challenge, Words and Sentences, or Custom Practice.
3. Choose a duration: 30, 60, or 120 seconds, or Unlimited.
4. Adjust sound and keyboard visibility to your preference.
5. Start the session or begin typing if first-keystroke start is enabled.
6. Follow the highlighted target character and the virtual keyboard.
7. Review your speed, accuracy, and errors when the session ends.
8. Start another session or practice the characters you find difficult.

Controls and available modes depend on the current implementation.

---

## 📊 Typing metrics

### Gross WPM

A common gross WPM calculation treats five typed characters as one word:

```text
Gross WPM = (characters typed / 5) / elapsed time in minutes
```

### Accuracy

One possible character-based accuracy formula is:

```text
Accuracy = (correct characters / attempted characters) × 100
```

Define the counting policy clearly in the implementation. For example, decide whether corrected mistakes remain in the error total and whether accuracy is based on the final text or all keystroke attempts.

### Net WPM

Net WPM depends on the selected error-adjustment policy. Document the formula used by the application and apply it consistently. Avoid comparing scores from different formulas as if they were equivalent.

---

## 📁 Suggested project structure

Adapt this example to match the actual files in the repository.

```text
typewriter-typing-tutor/
├── public/
│   ├── audio/                 # Local typing sound assets
│   ├── fonts/                 # Optional local fonts
│   └── models/                # Optional typewriter GLB assets
├── src/
│   ├── components/
│   │   ├── Typewriter.js      # Typewriter visuals and mechanics
│   │   ├── VirtualKeyboard.js # Keyboard layout and key states
│   │   ├── TypingEngine.js    # Input, prompts, and character matching
│   │   ├── TypingTimer.js     # Test lifecycle and timing
│   │   ├── Statistics.js      # WPM, accuracy, and score calculations
│   │   ├── AudioEngine.js     # Sound effects and volume
│   │   ├── ResultsPanel.js    # End-of-test results
│   │   └── Settings.js        # User preferences
│   ├── main.js                # Application entry point
│   └── styles.css             # Global and component styles
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

This is a suggested architecture, not a guarantee of the current repository contents.

---

## 🔊 Audio and asset notes

- Prefer local audio files for reliable playback and predictable loading.
- Start Web Audio playback only after a user gesture where required by the browser.
- Keep sound effects short and avoid excessive overlapping audio.
- Use optimized GLB models and compressed textures if using Three.js.
- Confirm the license permits redistribution before committing third-party models, fonts, or audio.
- Do not commit large generated files or assets that are not needed to run the project.

---

## ♿ Accessibility and performance

The application should aim to:

- Support keyboard-only navigation.
- Provide visible focus states and accessible names for icon buttons.
- Maintain sufficient contrast between text, glass surfaces, and the background.
- Respect `prefers-reduced-motion`.
- Keep the typing engine responsive while animations play.
- Avoid intercepting browser shortcuts unnecessarily.
- Provide a usable fallback when WebGL is unavailable.
- Clean up animation loops, audio nodes, and event listeners when appropriate.
- Remain usable on smaller screens and lower-powered devices.

---

## 🧪 Testing checklist

Before describing the application as production-ready, verify:

- [ ] Every typing mode generates the correct type of prompt.
- [ ] All timer durations start, pause, resume, and finish correctly.
- [ ] Restarting does not create duplicate timers or event listeners.
- [ ] WPM and accuracy follow the documented formulas.
- [ ] Incorrect characters are counted consistently.
- [ ] Space, Enter, Backspace, Shift, and punctuation behave correctly.
- [ ] The virtual keyboard reflects physical keyboard input.
- [ ] Typing sounds can be muted and the volume control works.
- [ ] User preferences persist as intended.
- [ ] The application remains usable without WebGL.
- [ ] Responsive layouts work on desktop, tablet, and mobile.
- [ ] No broken assets or unexpected console errors remain.
- [ ] A production build completes successfully.

---

## 🛣️ Roadmap

Potential development milestones:

- [ ] Complete the glassmorphism interface
- [ ] Build the animated typewriter and paper
- [ ] Implement all typing modes
- [ ] Implement accurate timer and test lifecycle
- [ ] Add synchronized virtual keyboard
- [ ] Add mechanical typing audio
- [ ] Implement results and local personal records
- [ ] Add custom-text and mistake-practice modes
- [ ] Polish responsive behavior and accessibility
- [ ] Optimize assets and validate the production build

Update this roadmap as milestones are completed.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make and test your changes.
4. Commit with a descriptive message:

   ```bash
   git add .
   git commit -m "feat: add typing practice feature"
   ```

5. Push your branch and open a pull request.

For larger changes, describe the intended behavior and testing performed in the pull request.

---

## 📦 Git workflow

To add this README to an existing local repository:

```bash
git add README.md
git commit -m "docs: add Typewriter Typing Tutor README"
git push
```

If the branch has no upstream configured, Git may ask you to set one. Check your current branch and remote before pushing:

```bash
git status
git branch --show-current
git remote -v
```

Do not commit secrets, credentials, environment files, or private tokens.

---

## 📄 License

No license has been specified here. Before publishing the project for reuse, choose a license that matches your intentions and add the corresponding `LICENSE` file. Without an explicit license, others generally do not receive permission to reuse the project's code beyond rights granted by applicable law.

---

## 💡 Project philosophy

**A modern typing tutor with the soul of a classic machine.**

Typewriter Typing Tutor aims to make practice feel tactile and rewarding: each keystroke should have a visual response, every line should feel like it is being typed onto paper, and every session should help the user build speed, rhythm, and accuracy.

**Typewriter Typing Tutor — Master every keystroke. One letter at a time.**

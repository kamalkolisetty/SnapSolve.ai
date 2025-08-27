# SnapSolve.ai: Solve, Save, Shine! 🚀

 *Unleash your creativity—draw math equations, physics diagrams, chemical reactions, poetry, or abstract sketches in any language, and watch SnapSolve.ai transform them into brilliant AI-powered solutions!*

Welcome to **SnapSolve.ai**, a revolutionary web application that brings your drawings to life with the power of Google Gemini 1.5 Flash. Inspired by an Apple advertisement showcasing canvas-based evaluation, I named the entry point `windowsToo` in `index.html` and adorned it with a Windows icon favicon (`/windows-icon.png`) to make this magic accessible to Windows users and beyond. Whether you’re sketching simple arithmetic (`2 + 2`), solving advanced calculus (`∫(x^2 dx)`), diagramming physics problems (e.g., circuits), balancing chemical equations (`H2 + O2 → H2O`), writing poetry in any language, or expressing abstract ideas (e.g., a heart for “love”), SnapSolve.ai delivers precise, stunning results in LaTeX or text. With a vibrant canvas, colorful swatches, a playful smiley cursor, and an animated About page, it’s crafted for students, educators, and creatives worldwide. Dive into the live frontend demos at [Netlify](https://snapsolve-ai.netlify.app/) or [Choreo](https://ab778f97-bbe9-4c37-b86f-4cca944bc744.e1-us-east-azure.choreoapps.dev) to explore the sleek UI, or clone the repository at [github.com/kamalkolisetty/SnapSolve.ai](https://github.com/kamalkolisetty/SnapSolve.ai) for the full AI-powered experience. Let’s *Solve, Save, Shine!* ❤️✨

---

## 🌟 Features: A Canvas of Possibilities

SnapSolve.ai is your creative playground, transforming *any* drawing in *any language* into meaningful results. Below is a detailed look at its capabilities:

| Feature | Description |
|---------|-------------|
| **Dynamic Canvas** | Draw anything—simple math (`2 + 2`), advanced calculus (`∫(x^2 dx)`), physics diagrams (e.g., pulleys), chemical equations (`H2 + O2 → H2O`), poetry in any language, or abstract sketches (e.g., a heart for “love”). Supports mouse and touch input for seamless drawing on desktop or mobile. Features a black canvas (>768px) for bold contrast or white canvas (≤768px) for mobile clarity. Save drawings as `snapsolve_ai.png`. Named `windowsToo` with a Windows icon favicon to honor its universal vision. <br> // Code here |
| **Vibrant Swatches** | Choose from 14 vibrant colors on desktop (e.g., red, blue, cyan, pink) or 5 on mobile for simplicity, with a hover zoom effect for a playful touch. A custom smiley cursor (`/one.png`) brings joy to every stroke, fixed for flawless performance across devices. <br> // Code here |
| **Smart Eraser** | Erase mistakes effortlessly by matching the canvas background (black on desktop, white on mobile), ensuring precise corrections without disrupting your work. <br> // Code here |
| **LaTeX & Text Outputs** | View results in draggable boxes below the navbar, rendered in crisp LaTeX for math (e.g., `x^2 + 2x + 1 = 0` → `x = -1`) or clear text for non-math inputs (e.g., a heart sketch → “love”). Supports variable assignments (e.g., `x = 4`) and multilingual inputs, with responsive styling for all screens. <br> // Code here |
| **Professional Print Page** | Generate a polished print page with a glowing *SnapSolve.ai* header, *Solve, Save, Shine!* tagline, and a “Back to Home” button for seamless navigation, perfect for homework, presentations, or creative outputs. <br> // Code here |
| **Responsive Design** | Adapts to every device: wide canvas with 14 swatches (>768px), stacked navbar with 5 swatches (≤768px), and scaled fonts/buttons (≤480px) for readability and ease of use. <br> // Code here |
| **Vibrant About Page** | Explore a stunning gradient background with floating symbols (π, √, ∞, ❤️, ✨, ☕) and interactive feature cards, showcasing the app’s capabilities with flair. <br> // Code here |
| **AI-Powered Analysis** | Powered by Google Gemini 1.5 Flash, processes *any* drawing in *any language*—from math and science to poetry and abstract concepts—with robust parsing for accurate results. <br> // Code here |
| **Friendly Error Handling** | Displays playful alerts for empty canvas or processing issues, ensuring a delightful user experience even when things go wrong. <br> // Code here |

---

## 🚀 Installation Steps

To unlock the full AI-powered functionality of SnapSolve.ai, clone the repository and set it up locally. Follow these steps to get started:

### Prerequisites
- **Node.js** (v16+): Required for the frontend.
- **Python** (3.8+): Required for the backend.
- **Git**: To clone the repository.

### Setup Instructions

# Clone the Repository
git clone https://github.com/kamalkolisetty/SnapSolve.ai.git
cd SnapSolve.ai

# Frontend Setup
cd frontend
npm install
npm run build  # For deployment to Netlify/Choreo
npm run dev    # For local development

# Backend Setup
cd backend
pip install -r requirements.txt
# Create .env with:
# GEMINI_API_KEY=your-key
# GEMINI_API_KEY2=your-key2
# GEMINI_API_KEY3=your-key3
# SERVER_URL=0.0.0.0
# PORT=8000
# ENV=dev
python main.py

### Environment Variables
- **Frontend**: Create a `frontend/.env` file with:
VITE_API_URL=http://localhost:8000

Ensure `/one.png` (smiley cursor) and `/windows-icon.png` (Windows icon favicon) are in `frontend/public`.
- **Backend**: Create a `backend/.env` file with:

  GEMINI_API_KEY=your-key
  GEMINI_API_KEY2=your-key2
  GEMINI_API_KEY3=your-key3
  SERVER_URL=0.0.0.0
  PORT=8000
  ENV=dev

### Running the Application
- **Frontend**: After setup, run `npm run dev` and open `http://localhost:5173` to see SnapSolve.ai with the `windowsToo` branding and Windows icon favicon.
- **Backend**: Run `python main.py` to start the FastAPI server.

### Usage
- Draw on the canvas: equations, multilingual poetry, diagrams, or sketches.
- Click *Run* to process drawings with Gemini AI, viewing results in draggable LaTeX/text boxes.
- Use *Save Canvas* to download as `snapsolve_ai.png`.
- Click *Print* for a professional output page with the Windows icon favicon.
- Explore the About page for animated symbols and feature highlights.



## 🛠️ Code Snippets

Below are the key code snippets that power SnapSolve.ai’s core features, provided for reference and inspiration.

### 1. Canvas Setup with Windows Icon
```tsx
const canvasRef = useRef<HTMLCanvasElement>(null);
const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
const isSmallScreen = window.innerWidth <= 768;

useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctxRef.current = ctx;
    ctx.strokeStyle = isSmallScreen ? 'black' : 'white';
    ctx.lineWidth = 3;
    // Set Windows icon favicon
    document.querySelector('link[rel="icon"]')?.setAttribute('href', '/windows-icon.png');
}, []);

<canvas
    ref={canvasRef}
    className="canvas"
    style={{ cursor: `url('/one.png') 8 8, crosshair`, background: isSmallScreen ? 'white' : 'black' }}
/>


## 🌈 Why SnapSolve.ai?

SnapSolve.ai stands out by:
- **Universal Processing**: Handles simple math, advanced calculus, physics, chemistry, multilingual poetry, and abstract sketches in any language supported by Gemini, making it a global tool for learning and creativity.
- **Engaging Experience**: A smiley cursor, animated symbols, responsive design, and `windowsToo` branding with a Windows icon favicon create a fun, intuitive interface.
- **Open-Source Innovation**: Built on cutting-edge technologies and inspired by projects like `Authman2/Canvas`, SnapSolve.ai invites collaboration and inspires future creators.

---

## 🎥 Demo Video

([https://your-demo-link](https://drive.google.com/file/d/1CFd3Oou9HO4tmP79kJpBWyM7HsB82khc/view?usp=sharing))  
*Witness SnapSolve.ai transform equations, multilingual poetry, and sketches into stunning results under the `windowsToo` banner!*

---

## 📸 Screenshots

*(Placeholders—update with your screenshots)*  
| Screenshot | Description |
|------------|-------------|
| ![Canvas Drawing](https://via.placeholder.com/600x400.png?text=Drawing+a+Physics+Diagram) | Sketching a pulley system with the smiley cursor and Windows icon favicon. |
| ![LaTeX Output](https://via.placeholder.com/600x400.png?text=LaTeX+Output) | Draggable box displaying `∫(x^2 dx) = (x^3)/3 + C`. |
| ![About Page](https://via.placeholder.com/600x400.png?text=About+Page) | Floating π, √, and ❤️ with vibrant feature cards and Windows icon favicon. |

---

## 🌍 Inspiration: From Vision to Reality

Inspired by an Apple advertisement showcasing canvas-based evaluation, I created SnapSolve.ai to bring this magic to Windows users and beyond. The `windowsToo` name in `index.html` and the Windows icon favicon (`/windows-icon.png`) embody this mission, making advanced drawing analysis accessible to all. SnapSolve.ai goes further, processing *any* drawing—math, physics, chemistry, poetry, or abstract concepts—in any language supported by Google Gemini 1.5 Flash, empowering students, educators, and creatives globally to unleash their creativity.

---

## 🧑‍💻 Tech Stack: Powering the Magic

SnapSolve.ai leverages a robust stack of open-source technologies, enhanced with custom innovations for a seamless experience:

| Component | Technologies |
|-----------|--------------|
| **Frontend** | **React (18.x)**: Dynamic UI with components for canvas, navbar, and outputs. <br> **TypeScript**: Type-safe development for reliability. <br> **Vite**: Lightning-fast build tool for development and deployment (`npm run build`). <br> **react-draggable**: Draggable LaTeX/text output boxes. <br> **axios**: API calls to `/calculate` endpoint. <br> **MathJax (2.7.9)**: Crisp LaTeX rendering for equations. <br> **Tailwind CSS**: Utility-first styling for responsive design (e.g., `flex`, `rounded-lg`). <br> **Custom Assets**: Smiley cursor (`/one.png`), Windows icon favicon (`/windows-icon.png`), Poppins font for a modern look. |
| **Backend** | **FastAPI**: High-performance API for processing canvas images. <br> **Google Gemini 1.5 Flash**: AI-powered analysis for multilingual drawings. <br> **PIL (Python Imaging Library)**: Decodes base64 images for processing. <br> **uvicorn**: ASGI server for development mode. <br> **python-dotenv**: Manages environment variables (e.g., `GEMINI_API_KEY`). <br> **logging, re, ast**: Robust debugging and response parsing. |
| **Inspiration** | Open-source projects like `Authman2/Canvas` and `shuding/apple-pencil-safari-api-test`, alongside official documentation for React, FastAPI, Gemini API, and Stack Overflow community insights. |

---

## 🌟 Try It Out

Experience the vibrant UI at the live frontend demos:
- [Netlify](https://snapsolve-ai.netlify.app/)
- [Choreo](https://ab778f97-bbe9-4c37-b86f-4cca944bc744.e1-us-east-azure.choreoapps.dev)

Draw, erase, save PNGs, and explore the animated About page with its Windows icon favicon. For the full AI-powered experience, clone the repository at [github.com/kamalkolisetty/SnapSolve.ai](https://github.com/kamalkolisetty/SnapSolve.ai) and follow the installation steps below.

---

## 🤝 Contributing

Contributions are welcome to enhance SnapSolve.ai! To contribute:
1. Fork the repository.
2. Create a branch (`git checkout -b feature/awesome-feature`).
3. Commit changes (`git commit -m 'Add awesome feature'`).
4. Push to the branch (`git push origin feature/awesome-feature`).
5. Open a Pull Request.

 

---

## 🙌 Acknowledgments

- **Open-Source Community**: Gratitude to React, TypeScript, Vite, FastAPI, Google Gemini API, PIL, `Authman2/Canvas`, `shuding/apple-pencil-safari-api-test`, and Stack Overflow for their invaluable resources.
- **Inspiration**: An Apple advertisement for canvas evaluation, reimagined as `windowsToo` for universal accessibility.

Connect via [LinkedIn](https://www.linkedin.com/in/kamal-kumar-kolisetty-19b944221/).

---

## 📬 Contact

Have questions or ideas? Reach out via [GitHub Issues](https://github.com/kamalkolisetty/SnapSolve.ai/issues) or [LinkedIn](https://www.linkedin.com/in/kamal-kumar-kolisetty-19b944221/).

Let’s *Solve, Save, Shine!* 🚀

©KWorks | Crafted with ✨

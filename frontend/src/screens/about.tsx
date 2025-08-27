import { Link } from 'react-router-dom';

export default function About() {
 return (
 <>
 <style>
 {`
 @keyframes fadeInUp {
 from { transform: translateY(30px); opacity: 0; }
 to { transform: translateY(0); opacity: 1; }
 }
 @keyframes float {
 0% { transform: translate(0, 0) rotate(0deg); }
 25% { transform: translate(10px, -10px) rotate(5deg); }
 50% { transform: translate(0, -15px) rotate(0deg); }
 75% { transform: translate(-10px, -10px) rotate(-5deg); }
 100% { transform: translate(0, 0) rotate(0deg); }
 }
 body {
 font-family: 'Poppins', sans-serif;
 background: linear-gradient(135deg, #a8e6cf 0%, #d5f5f6 100%);
 margin: 0;
 padding: 40px 20px;
 display: flex;
 justify-content: center;
 align-items: center;
 min-height: 100vh;
 overflow-x: hidden;
 position: relative;
 }
 .math-symbol {
 position: absolute;
 font-size: clamp(2rem, 4vw, 2.5rem);
 color: rgba(0, 201, 255, 0.3);
 pointer-events: none;
 animation: float 6s ease-in-out infinite;
 user-select: none;
 }
 .math-symbol.pi { top: 10%; left: 5%; animation-delay: 0s; }
 .math-symbol.sqrt { top: 20%; right: 10%; animation-delay: 1s; }
 .math-symbol.infinity { bottom: 15%; left: 15%; animation-delay: 2s; }
 .math-symbol.plus { top: 30%; right: 5%; animation-delay: 3s; }
 .math-symbol.equals { bottom: 10%; right: 20%; animation-delay: 4s; }
 .math-symbol.times { top: 15%; left: 25%; animation-delay: 0.5s; }
 .math-symbol.divide { bottom: 20%; left: 10%; animation-delay: 1.5s; }
 .math-symbol.heart { top: 25%; right: 15%; animation-delay: 2.5s; }
 .math-symbol.sparkle { bottom: 30%; left: 20%; animation-delay: 3.5s; }
 .math-symbol.coffee { top: 35%; left: 30%; animation-delay: 4.5s; }
 .container {
 background: #000000;
 border-radius: 30px;
 box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
 padding: 50px 60px;
 max-width: 1000px;
 width: 100%;
 text-align: center;
 animation: fadeInUp 0.8s ease-out;
 color: #f0f0f0;
 overflow: hidden;
 position: relative;
 z-index: 10;
 }
 .header h1 {
 font-size: clamp(2.8rem, 6vw, 5rem);
 font-weight: 900;
 margin: 0 0 12px;
 color: #ffffff;
 animation: pulse 2.5s infinite;
 text-shadow: 0 2px 5px rgba(255, 255, 255, 0.4);
 }
 .header p {
 font-size: clamp(1.3rem, 3vw, 1.9rem);
 font-weight: 600;
 margin: 0 0 40px;
 color: #dddddd;
 letter-spacing: 0.05em;
 }
 .features {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
 gap: 28px 40px;
 margin-bottom: 50px;
 }
 .feature-card {
 background: #111111;
 border-radius: 18px;
 padding: 25px 30px;
 box-shadow: 0 10px 25px rgba(255, 255, 255, 0.05);
 display: flex;
 align-items: flex-start;
 gap: 20px;
 animation: fadeInUp 0.6s ease-out forwards;
 animation-delay: calc(0.18s * var(--index));
 cursor: pointer;
 transition: transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
 color: #f0f0f0;
 }
 .feature-card:hover {
 transform: scale(1.1);
 box-shadow: 0 15px 25px rgba(0, 201, 255, 0.45);
 background: #222222;
 }
 .feature-icon {
 font-size: 2.6rem;
 color: #00c9ff;
 flex-shrink: 0;
 user-select: none;
 }
 .feature-card h3 {
 font-size: clamp(1.3rem, 2.8vw, 1.6rem);
 font-weight: 700;
 margin: 0 0 8px;
 color: #00c9ff;
 user-select: none;
 }
 .feature-card p {
 font-size: clamp(1rem, 2.2vw, 1.12rem);
 color: #cccccc;
 margin: 0;
 line-height: 1.5;
 user-select: none;
 }
 .home-button {
 display: inline-block;
 padding: 14px 36px;
 font-size: clamp(1.1rem, 2.8vw, 1.3rem);
 font-weight: 700;
 color: #000;
 background: #00c9ff;
 border: none;
 border-radius: 14px;
 cursor: pointer;
 text-decoration: none;
 box-shadow: 0 6px 15px rgba(0, 201, 255, 0.7);
 transition: background 0.35s ease, transform 0.3s ease, box-shadow 0.3s ease;
 margin-bottom: 20px;
 }
 .home-button:hover {
 background: #0099cc;
 transform: scale(1.07);
 box-shadow: 0 8px 22px rgba(0, 153, 204, 0.9);
 }
 .creator-info {
 font-size: 1.1rem;
 font-weight: 600;
 color: #dddddd;
 margin-bottom: 40px;
 user-select: none;
 }
 .creator-info a {
 color: #00c9ff;
 text-decoration: none;
 font-weight: 700;
 transition: color 0.3s ease, transform 0.3s ease;
 }
 .creator-info a:hover {
 color: #0099cc;
 transform: scale(1.05);
 }
 footer {
 text-align: center;
 color: #dddddd;
 font-weight: 600;
 padding: 12px 0;
 }
 @media (max-width: 768px) {
 body {
 padding: 20px;
 }
 .container {
 padding: 40px 30px;
 }
 .math-symbol {
 font-size: clamp(1.5rem, 3vw, 1.8rem);
 }
 .features {
 grid-template-columns: 1fr;
 gap: 24px;
 }
 .header h1 {
 font-size: clamp(2.4rem, 6vw, 3rem);
 }
 .header p {
 font-size: clamp(1.1rem, 2.8vw, 1.3rem);
 }
 .feature-card h3 {
 font-size: clamp(1.15rem, 2.5vw, 1.3rem);
 }
 .feature-card p {
 font-size: clamp(0.9rem, 1.9vw, 1rem);
 }
 .home-button {
 padding: 12px 30px;
 font-size: clamp(1rem, 2.5vw, 1.1rem);
 margin-bottom: 30px;
 color: #000;
 }
 .creator-info {
 font-size: 1rem;
 margin-bottom: 30px;
 }
 }
 @media (max-width: 480px) {
 body {
 padding: 15px;
 }
 .container {
 padding: 30px 20px;
 }
 .math-symbol {
 font-size: clamp(1.2rem, 2.5vw, 1.5rem);
 }
 .header h1 {
 font-size: clamp(1.8rem, 4.5vw, 2.2rem);
 }
 .header p {
 font-size: clamp(0.95rem, 2.2vw, 1.1rem);
 }
 .feature-card {
 padding: 20px 24px;
 }
 .feature-card h3 {
 font-size: clamp(1rem, 1.8vw, 1.1rem);
 }
 .feature-card p {
 font-size: clamp(0.75rem, 1.4vw, 0.9rem);
 }
 .home-button {
 padding: 10px 26px;
 font-size: clamp(0.9rem, 2.3vw, 1rem);
 margin-bottom: 24px;
 color: #000;
 }
 .creator-info {
 font-size: 0.95rem;
 margin-bottom: 24px;
 }
 }
 `}
 </style>

 <div className="container" role="main" aria-label="About SnapSolve.ai">
 <span className="math-symbol pi" aria-hidden="true">π</span>
 <span className="math-symbol sqrt" aria-hidden="true">√</span>
 <span className="math-symbol infinity" aria-hidden="true">∞</span>
 <span className="math-symbol plus" aria-hidden="true">+</span>
 <span className="math-symbol equals" aria-hidden="true">=</span>
 <span className="math-symbol times" aria-hidden="true">×</span>
 <span className="math-symbol divide" aria-hidden="true">÷</span>
 <span className="math-symbol heart" aria-hidden="true">❤️</span>
 <span className="math-symbol sparkle" aria-hidden="true">✨</span>
 <span className="math-symbol coffee" aria-hidden="true">☕</span>

 <section className="header">
 <h1 tabIndex={0}>About SnapSolve.ai</h1>
 <p>Solve, Save, Shine!</p>
 </section>

 <section className="features" aria-label="Key Features of SnapSolve.ai">
 <article className="feature-card" style={{ '--index': 0 } as React.CSSProperties} tabIndex={0} role="group" aria-labelledby="feature1-title">
 <span className="feature-icon" aria-hidden="true">✏️</span>
 <div>
 <h3 id="feature1-title">Draw & Solve</h3>
 <p>Sketch equations on a dynamic canvas and get instant AI-powered solutions.</p>
 </div>
 </article>

 <article className="feature-card" style={{ '--index': 1 } as React.CSSProperties} tabIndex={0} role="group" aria-labelledby="feature2-title">
 <span className="feature-icon" aria-hidden="true">📜</span>
 <div>
 <h3 id="feature2-title">Stunning LaTeX</h3>
 <p>Render results in beautiful, draggable LaTeX outputs for clarity.</p>
 </div>
 </article>

 <article className="feature-card" style={{ '--index': 2 } as React.CSSProperties} tabIndex={0} role="group" aria-labelledby="feature3-title">
 <span className="feature-icon" aria-hidden="true">🎨</span>
 <div>
 <h3 id="feature3-title">Vibrant Colors</h3>
 <p>Use multiple colors and a powerful eraser to craft your equations with ease.</p>
 </div>
 </article>

 <article className="feature-card" style={{ '--index': 3 } as React.CSSProperties} tabIndex={0} role="group" aria-labelledby="feature4-title">
 <span className="feature-icon" aria-hidden="true">💾</span>
 <div>
 <h3 id="feature4-title">Save & Print</h3>
 <p>Download your work as PNG or print professional-quality results with ease.</p>
 </div>
 </article>

 <article className="feature-card" style={{ '--index': 4 } as React.CSSProperties} tabIndex={0} role="group" aria-labelledby="feature5-title">
 <span className="feature-icon" aria-hidden="true">📱</span>
 <div>
 <h3 id="feature5-title">Responsive Design</h3>
 <p>Enjoy seamless interaction on mobile and desktop with touch-friendly controls.</p>
 </div>
 </article>
 </section>

 <Link to="/" className="home-button" aria-label="Go back to home page">Back to Home</Link>

 <p className="creator-info">
 <a href="https://www.linkedin.com/in/kamal-kumar-kolisetty-19b944221/" target="_blank" rel="noopener noreferrer">
 Kamal Kumar Kolisetty
 </a> – Creator &amp; Dreamer <br></br> Built SnapSolve.ai with ❤️ to make math magical!
 </p>

 <footer>
 ©KWorks | Crafted with ✨ &amp; ☕
 </footer>
 </div>
 </>
 );
}
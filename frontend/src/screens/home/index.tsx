import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Draggable from 'react-draggable';
import { Link } from 'react-router-dom';

// Define SWATCHES arrays
const LARGE_SCREEN_SWATCHES = [
  "rgb(255, 0, 0)", "#FFA500", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)",
  "rgb(0, 255, 255)", "rgb(255, 0, 255)", "#be4bdb", "#893200", "#FF78AC",
  "#A8D5E3", "#F2F0EA", "#31EC56", "#970747",
];
const SMALL_SCREEN_SWATCHES = [
  "rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(0, 0, 0)", "rgb(255, 192, 203)"
];

interface GeneratedResult {
  expression: string;
  answer: string;
}

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('rgb(0, 0, 0)'); // Default to black for visibility
  const [reset, setReset] = useState(false);
  const [dictOfVars, setDictOfVars] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<GeneratedResult>();
  const [latexAnswer, setLatexAnswer] = useState<Array<string>>([]);
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
  const [latexPairs, setLatexPairs] = useState<Array<{ answer: string; expression: string; rawAnswer: string; rawExpression: string }>>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(50); // Default navbar height

  useEffect(() => {
    if (latexPairs.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 100);
    }
  }, [latexPairs]);

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexAnswer([]);
      setLatexExpression([]);
      setLatexPairs([]);
      setResult(undefined);
      setDictOfVars({});
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      updateNavbarHeight();
    };
    window.addEventListener('resize', handleResize);

    const updateNavbarHeight = () => {
      const header = document.querySelector('.bg-gradient');
      const height = header instanceof HTMLElement ? header.offsetHeight : 50;
      setNavbarHeight(height);
    };

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = window.innerWidth;
          const header = document.querySelector('.bg-gradient');
          const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 60;
          canvas.height = window.innerHeight - headerHeight;
          canvas.style.top = `${headerHeight}px`;
          ctx.lineCap = 'round';
          ctx.lineWidth = Math.max(2, window.innerWidth / 500);
          ctx.fillStyle = isSmallScreen ? 'white' : 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          canvas.style.cursor = isSmallScreen ? "url('/one.png') 8 8, crosshair" : "url('/one.png') 16 16, crosshair";
          console.log('resizeCanvas: width=', canvas.width, 'height=', canvas.height, 'fillStyle=', ctx.fillStyle, 'isSmallScreen=', isSmallScreen); // Debug canvas
        } else {
          console.error('resizeCanvas: Failed to get 2D context');
        }
      } else {
        console.error('resizeCanvas: Canvas ref is null');
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      resizeCanvas();
      updateNavbarHeight();
      window.addEventListener('resize', resizeCanvas);
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
        CommonHTML: { scale: isSmallScreen ? 90 : Math.max(80, Math.min(100, window.innerWidth / 12)) },
        displayAlign: 'left',
        displayIndent: '1em',
      });
      if (latexPairs.length > 0) {
        setTimeout(() => {
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }, 100);
      }
    };

    return () => {
      document.head.removeChild(script);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSmallScreen, latexPairs]);

  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latexAnswerString = `\\(\\large{\\textbf{${answer}}}\\)`;
    const latexExpressionString = `\\(\\normalsize{${expression.replace(/ /g, '\\,')}}\\)`;
    setLatexAnswer([...latexAnswer, latexAnswerString]);
    setLatexExpression([...latexExpression, latexExpressionString]);
    setLatexPairs([...latexPairs, { answer: latexAnswerString, expression: latexExpressionString, rawAnswer: answer, rawExpression: expression }]);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = isSmallScreen ? 'white' : 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log('resetCanvas: fillStyle=', ctx.fillStyle, 'isSmallScreen=', isSmallScreen); // Debug canvas
      } else {
        console.error('resetCanvas: Failed to get 2D context');
      }
    } else {
      console.error('resetCanvas: Canvas ref is null');
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      let x: number, y: number;
      if ('touches' in e) {
        e.preventDefault();
        x = (e.touches[0].clientX - rect.left) * scaleX;
        y = (e.touches[0].clientY - rect.top) * scaleY;
      } else {
        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = color;
        setIsDrawing(true);
        console.log('startDrawing: x=', x, 'y=', y, 'strokeStyle=', color); // Debug drawing
      } else {
        console.error('startDrawing: Failed to get 2D context');
      }
    } else {
      console.error('startDrawing: Canvas ref is null');
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      let x: number, y: number;
      if ('touches' in e) {
        e.preventDefault();
        x = (e.touches[0].clientX - rect.left) * scaleX;
        y = (e.touches[0].clientY - rect.top) * scaleY;
      } else {
        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineTo(x, y);
        ctx.stroke();
        console.log('draw: x=', x, 'y=', y, 'strokeStyle=', color); // Debug drawing
      } else {
        console.error('draw: Failed to get 2D context');
      }
    } else {
      console.error('draw: Canvas ref is null');
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    console.log('stopDrawing: isDrawing=', false); // Debug drawing
  };

  const erase = () => {
    setColor(isSmallScreen ? 'white' : 'black');
  };

  const runRoute = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasNonBlackPixels = Array.from(imageData.data).some((pixel, index) => {
          if (index % 4 === 3) return false;
          return pixel !== 0;
        });
        if (!hasNonBlackPixels) {
          alert('Canvas is empty! Draw something before running.');
          return;
        }
      }
      setIsLoading(true);
      const imageData = canvas.toDataURL('image/png');
      try {
        const response = await axios({
          method: 'post',
          url: `${import.meta.env.VITE_API_URL}/calculate`,
          data: {
            image: imageData,
            dict_of_vars: dictOfVars,
          },
        });

        const resp = response.data;
        resp.data.forEach((data: Response) => {
          if (data.assign === true) {
            setDictOfVars((prev) => ({
              ...prev,
              [data.expr]: data.result,
            }));
          }
        });
        resp.data.forEach((data: Response) => {
          let resolvedAnswer = data.result;
          if (data.result.includes('cannot be solved') && dictOfVars[data.expr]) {
            resolvedAnswer = dictOfVars[data.expr];
          } else if (data.result.includes('initials or abbreviation') || data.result.includes('incomplete equation')) {
            console.warn(`Invalid API response for expression "${data.expr}": ${data.result}`);
            resolvedAnswer = 'Invalid input, please clarify';
          }
          setResult({
            expression: data.expr,
            answer: resolvedAnswer,
          });
        });
        resetCanvas();
      } catch (error) {
        console.error('API call failed:', error);
        alert("Uh-oh! 😢 We're down right now, please try again later! 🚀");
      } finally {
        setIsLoading(false);
        // Ensure canvas color is correct after API call
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = isSmallScreen ? 'white' : 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            console.log('runRoute: fillStyle=', ctx.fillStyle, 'isSmallScreen=', isSmallScreen); // Debug canvas
          } else {
            console.error('runRoute: Failed to get 2D context');
          }
        } else {
          console.error('runRoute: Canvas ref is null');
        }
      }
    } else {
      console.error('runRoute: Canvas ref is null');
    }
  };

  const saveCanvasImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasNonBlackPixels = Array.from(imageData.data).some((pixel, index) => {
          if (index % 4 === 3) return false;
          return pixel !== 0;
        });
        if (!hasNonBlackPixels) {
          alert('Canvas is empty! Draw something before saving.');
          return;
        }
      }
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'snapsolve_ai.png';
      link.click();
    }
  };

  const formatExpression = (expr: string) => {
    return expr
      .replace(/\^(\d+)/g, '<sup>$1</sup>')
      .replace(/\_(\d+)/g, '<sub>$1</sub>')
      .replace(/\,/g, ' ')
      .replace(/\\pm/g, '±')
      .replace(/\\times/g, '×');
  };

  const printQueries = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SnapSolve.ai</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
          <style>
            @keyframes scaleUp {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes glow {
              0% { text-shadow: 0 0 3px rgba(0, 201, 255, 0.4); }
              50% { text-shadow: 0 0 15px rgba(0, 201, 255, 0.7); }
              100% { text-shadow: 0 0 3px rgba(0, 201, 255, 0.4); }
            }
            body {
              font-family: 'Poppins', sans-serif;
              background: linear-gradient(135deg, #a8e6cf 0%, #d5f5f6 100%);
              margin: 0;
              padding: 50px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .container {
              background: linear-gradient(145deg, #f0f4f8, #e0e7ff);
              border-radius: 35px;
              box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
              padding: 60px;
              max-width: 1200px;
              width: 100%;
              animation: scaleUp 0.7s ease-out;
            }
            .header {
              text-align: center;
              margin-bottom: 60px;
            }
            .header h1 {
              color: #1a3c5e;
              font-size: 4rem;
              margin: 0;
              animation: glow 2.5s infinite;
            }
            .header p {
              color: #2c3e50;
              font-size: 1.5rem;
              margin-top: 15px;
              font-weight: 600;
            }
            .print-button {
              display: block;
              margin: 0 auto 30px;
              padding: 12px 24px;
              font-size: 1.2rem;
              font-weight: 600;
              color: #ffffff;
              background: #00c9ff;
              border: none;
              border-radius: 10px;
              cursor: pointer;
              transition: background 0.3s ease, transform 0.3s ease;
            }
            .print-button:hover {
              background: #0099cc;
              transform: scale(1.05);
            }
            .home-button {
              display: block;
              margin: 0 auto 30px;
              padding: 12px 24px;
              font-size: 1.2rem;
              font-weight: 600;
              color: #000;
              background: #00c9ff;
              border: none;
              border-radius: 10px;
              cursor: pointer;
              text-decoration: none;
              box-shadow: 0 6px 15px rgba(0, 201, 255, 0.7);
              transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
            }
            .home-button:hover {
              background: #0099cc;
              transform: scale(1.05);
              box-shadow: 0 8px 22px rgba(0, 153, 204, 0.9);
            }
            .query-card {
              background: #ffffff;
              border-radius: 25px;
              padding: 35px;
              margin-bottom: 35px;
              border-left: 12px solid #00c9ff;
              box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
              animation: scaleUp 0.6s ease-out forwards;
              animation-delay: calc(0.25s * var(--index));
              transition: transform 0.4s ease, box-shadow 0.4s ease;
            }
            .query-card:hover {
              transform: translateY(-12px);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .expression, .answer {
              font-size: 1.8rem;
              color: #1a3c5e;
              margin-bottom: 20px;
              padding: 20px;
              background: rgba(255, 255, 255, 0.9);
              border-radius: 15px;
              border: 1px solid rgba(0, 201, 255, 0.3);
              font-family: 'Courier New', monospace;
            }
            .answer {
              font-size: 2.5rem;
              font-weight: bold;
              color: rgba(231, 76, 60, 0.9);
              background: rgba(231, 76, 60, 0.15);
            }
            .footer {
              text-align: center;
              margin-top: 60px;
              color: #2c3e50;
              font-size: 1.2rem;
              font-weight: 600;
            }
            sup, sub {
              font-size: 0.65em;
              vertical-align: baseline;
              position: relative;
              top: -0.5em;
            }
            sub {
              top: 0.5em;
            }
            @media print {
              body {
                background: white;
              }
              .container {
                box-shadow: none;
                padding: 20px;
              }
              .query-card {
                border: 1px solid #ccc;
                box-shadow: none;
              }
              .query-card:hover {
                transform: none;
              }
              .header h1 {
                animation: none;
              }
              .print-button, .home-button {
                display: none;
              }
            }
            @media (max-width: 600px) {
              .container {
                padding: 30px;
              }
              .header h1 {
                font-size: 2.8rem;
              }
              .header p {
                font-size: 1.2rem;
              }
              .print-button, .home-button {
                padding: 10px 20px;
                font-size: 1rem;
              }
              .expression, .answer {
                font-size: 1.4rem;
              }
              .answer {
                font-size: 2rem;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SnapSolve.ai</h1>
              <p>Solve, Save, Shine!</p>
            </div>
            <button class="print-button" onclick="window.print()">Print Now</button>
           <button class="home-button" onclick="if (window.opener) { window.opener.focus(); window.close(); } else { alert('Cannot return to the original page. Please close this window manually.'); }">Back to Home</button>


            ${latexPairs
              .map(
                (pair, index) => `
              <div class="query-card" style="--index: ${index}">
                <div class="expression">Expression: ${formatExpression(pair.rawExpression)}</div>
                <div class="answer">Answer: ${formatExpression(pair.rawAnswer)}</div>
              </div>
            `
              )
              .join('')}
            <div class="footer">
              Powered by SnapSolve.ai • ${new Date().toLocaleDateString()}
            </div>
          </div>
          <script>
            if (!window.print) {
              alert('Print functionality is not supported in this browser. Please use the browser\\'s print option (Ctrl+P or Cmd+P).');
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert('Failed to open print window. Please allow pop-ups and try again.');
    }
  };

  return (
    <>
      <style>
        {`
          .latex-content {
            background: rgba(0, 0, 0, 0.9);
            color: #ffffff;
            padding: 1.5vw 2vw;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 1px solid #00c9ff;
            cursor: move;
            animation: fadeIn 0.4s ease-in;
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: fit-content;
            max-width: 80vw;
            box-sizing: border-box;
            overflow: visible;
            z-index: 15;
            position: relative;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            left: 10px;
            pointer-events: auto;
          }
          .latex-content:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
          }
          .latex-content .answer {
            font-size: clamp(1.4rem, 3.5vw, 1.6rem);
            font-weight: bold;
            padding-bottom: 6px;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            width: fit-content;
          }
          .latex-content .expression {
            font-size: clamp(1.2rem, 3vw, 1.4rem);
            color: #e0e0e0;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            width: fit-content;
          }
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 40;
            color: #ffffff;
            font-size: clamp(1.2rem, 3vw, 1.5rem);
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            pointer-events: ${isLoading ? 'auto' : 'none'};
            opacity: ${isLoading ? 1 : 0};
            transition: opacity 0.3s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          canvas.absolute.top-0.left-0.w-full.h-full {
            cursor: url('/one.png') 16 16, crosshair !important;
            z-index: 10;
            background: transparent;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            touch-action: none;
          }
          .bg-gradient {
            flex-direction: row;
            padding: 0.8vw;
            gap: 1vw;
            z-index: 20;
            background: linear-gradient(to right, #a8e6cf 0%, #d5f5f6 100%);
            width: 100%;
            box-sizing: border-box;
            position: fixed;
            top: 0;
            left: 0;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .flex.rounded-lg.items-center.gap-2.overflow-auto {
            max-width: 50vw;
            padding: 0.5vw;
            overflow-x: auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            display: flex;
            align-items: center;
          }
          .rounded-full {
            width: clamp(25px, 4vw, 30px);
            height: clamp(25px, 4vw, 30px);
          }
          .btn {
            padding: clamp(5px, 1vw, 6px) clamp(10px, 2vw, 12px);
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            transition: transform 0.2s ease, background 0.3s ease;
          }
          .btn:hover {
            transform: scale(1.05);
          }
          .btn-eraser {
            background: #ffffff;
            color: #000000;
          }
          .btn-eraser:hover {
            background: #e0e0e0;
          }
          .btn-about {
            background: #800080;
            color: #ffffff !important;
          }
          .btn-about a {
            color: #ffffff !important;
            text-decoration: none;
          }
          .btn-about:hover {
            background: #660066;
          }
          .btn-about:hover a {
            color: #ffffff !important;
          }
          .button-group {
            display: flex;
            gap: 0.8vw;
            align-items: center;
          }
          .print-button-container {
            display: flex;
            justify-content: center;
            width: 100%;
          }
          .latex-container {
            position: absolute;
            top: ${navbarHeight + 50}px;
            z-index: 15;
            width: fit-content;
            max-width: 80vw;
            overflow: visible;
            pointer-events: none;
          }
          .latex-container > div {
            pointer-events: auto;
          }
          @media (max-width: 768px) {
            .bg-gradient {
              flex-direction: column;
              padding: 1.5vw;
              min-height: 100px;
              align-items: center;
              gap: 0.8vw;
            }
            .flex.rounded-lg.items-center.gap-2.overflow-auto {
              max-width: 90vw;
              gap: 0.8vw;
              justify-content: center;
            }
            .button-group {
              flex-direction: row;
              justify-content: center;
              width: 100%;
            }
            .print-button-container {
              display: flex;
              justify-content: center;
              width: 100%;
            }
            .latex-content {
              width: fit-content;
              max-width: 90vw;
              padding: 1.5vw 2vw;
              left: 5px;
              z-index: 15;
              overflow: visible;
              white-space: pre-wrap;
              overflow-wrap: break-word;
            }
            .latex-content .answer {
              font-size: clamp(1.3rem, 4vw, 1.5rem);
            }
            .latex-content .expression {
              font-size: clamp(1.1rem, 3.5vw, 1.3rem);
            }
            .latex-container {
              top: ${navbarHeight + 50}px;
              width: fit-content;
              max-width: 90vw;
              z-index: 15;
              overflow: visible;
            }
            canvas.absolute.top-0.left-0.w-full.h-full {
              cursor: url('/one.png') 8 8, crosshair !important;
            }
            .rounded-full {
              width: clamp(20px, 5vw, 25px);
              height: clamp(20px, 5vw, 25px);
            }
            .loading-overlay {
              font-size: clamp(1rem, 3.5vw, 1.2rem);
            }
          }
          @media (max-width: 480px) {
            .bg-gradient {
              min-height: 120px;
            }
            .latex-content {
              width: fit-content;
              max-width: 95vw;
              padding: 1.5vw 2vw;
              left: 5px;
              z-index: 15;
              overflow: visible;
              white-space: pre-wrap;
              overflow-wrap: break-word;
            }
            .latex-content .answer {
              font-size: clamp(1.2rem, 4.5vw, 1.4rem);
            }
            .latex-content .expression {
              font-size: clamp(1rem, 4vw, 1.2rem);
            }
            .latex-container {
              top: ${navbarHeight + 50}px;
              width: fit-content;
              max-width: 95vw;
              z-index: 15;
              overflow: visible;
            }
            .btn {
              padding: clamp(4px, 1.5vw, 5px) clamp(8px, 3vw, 10px);
              font-size: clamp(0.7rem, 2.5vw, 0.8rem);
            }
            .loading-overlay {
              font-size: clamp(0.9rem, 3vw, 1.1rem);
            }
          }
        `}
      </style>

      <div
        className="absolute top-0 left-0 flex items-center justify-between p-2 w-full bg-gradient z-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #a8e6cf 0%, #d5f5f6 100%)',
        }}
      >
        {isSmallScreen ? (
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="flex rounded-lg items-center gap-2 overflow-auto p-1" style={{ border: '1px solid black' }}>
              {SMALL_SCREEN_SWATCHES.map((swatch) => (
                <div
                  key={swatch}
                  className="rounded-full"
                  style={{
                    backgroundColor: swatch,
                    width: 'clamp(32px, 7vw, 25px)',
                    height: 'clamp(32px, 7vw, 25px)',
                    border: color === swatch ? '3px solid gold' : '1px solid white',
                    cursor: 'pointer',
                    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onClick={() => setColor(swatch)}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
            <div className="button-group">
              <Button
                onClick={() => setReset(true)}
                className="btn btn-danger px-3 py-1 rounded shadow"
              >
                Reset
              </Button>
              <Button
                onClick={runRoute}
                className="btn px-3 py-1 rounded shadow"
              >
                Run
              </Button>
              <Button
                onClick={saveCanvasImage}
                className="btn px-3 py-1 rounded shadow"
              >
                Save Canvas
              </Button>
              <Button
                onClick={erase}
                className="btn btn-eraser px-3 py-1 rounded shadow"
              >
                Eraser
              </Button>
            </div>
            <div className="button-group">
              {latexPairs.length > 0 && (
                <Button
                  onClick={printQueries}
                  className="btn px-3 py-1 rounded shadow"
                >
                  Print
                </Button>
              )}
              <Button
                className="btn btn-about px-3 py-1 rounded shadow"
              >
                <Link to="/about">About</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <Button
                onClick={() => setReset(true)}
                className="btn btn-danger px-3 py-1 rounded shadow"
              >
                Reset
              </Button>
            </div>
            <div
              className="flex rounded-lg items-center gap-2 overflow-auto p-1"
              style={{ border: '1px solid black' }}
            >
              {LARGE_SCREEN_SWATCHES.map((swatch) => (
                <div
                  key={swatch}
                  className="rounded-full"
                  style={{
                    backgroundColor: swatch,
                    width: 'clamp(39px, 7vw, 30px)',
                    height: 'clamp(39px, 7vw, 30px)',
                    border: color === swatch ? '4px solid gold' : '1px solid white',
                    cursor: 'pointer',
                    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onClick={() => setColor(swatch)}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
            <div>
              <Button
                onClick={runRoute}
                className="btn px-3 py-1 rounded shadow"
              >
                Run
              </Button>
            </div>
            <div>
              <Button
                onClick={saveCanvasImage}
                className="btn px-3 py-1 rounded shadow"
              >
                Save Canvas
              </Button>
            </div>
            <div>
              <Button
                onClick={erase}
                className="btn btn-eraser px-3 py-1 rounded shadow"
              >
                Eraser
              </Button>
            </div>
            <div className="button-group">
              {latexPairs.length > 0 && (
                <Button
                  onClick={printQueries}
                  className="btn px-3 py-1 rounded shadow"
                >
                  Print
                </Button>
              )}
              <Button
                className="btn btn-about px-3 py-1 rounded shadow"
              >
                <Link to="/about">About</Link>
              </Button>
            </div>
          </>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute left-0 w-full h-full"
        style={{ display: 'block', touchAction: 'none', zIndex: 10 }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {isLoading && (
        <div className="loading-overlay">
          Processing...
        </div>
      )}

      <div className="latex-container">
        {latexPairs.map((pair, index) => (
          <Draggable key={`latex-pair-${index}`}>
            <div className="text-white" style={{ margin: '8px' }}>
              <div className="latex-content">
                <div className="answer">{pair.answer}</div>
                <div className="expression">{pair.expression}</div>
              </div>
            </div>
          </Draggable>
        ))}
      </div>
    </>
  );
}
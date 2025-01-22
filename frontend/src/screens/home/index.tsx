import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Draggable from 'react-draggable';

// Define your SWATCHES array with valid colors
const SWATCHES = [
  "rgb(255, 0, 0)", // Red
  "#FFA500",
  "rgb(0, 255, 0)", // Green
  "rgb(0, 0, 255)", // Blue
  "rgb(255, 255, 0)", // Yellow
  "rgb(0, 255, 255)", // Cyan
  "rgb(255, 0, 255)", // Magenta
  "#be4bdb",  // purple
  "#893200",  // brown
  "#FF78AC",
  "#A8D5E3",
  "#F2F0EA",
  "#31EC56",
  "#970747",
  "rgb(255, 255, 255)", // White
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
  const [color, setColor] = useState('rgb(255, 255, 255)');
  const [reset, setReset] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [result, setResult] = useState<GeneratedResult>();
  const [latexAnswer, setLatexAnswer] = useState<Array<string>>([]);
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);

  useEffect(() => {
    if ((latexAnswer.length > 0 || latexExpression.length > 0) && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexAnswer, latexExpression]);

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
      setResult(undefined);
      setDictOfVars({});
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
      }
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latexAnswerString = `\\(\\Huge{\\textbf{${answer}}}\\)`;
    const latexExpressionString = `\\(\\normalsize{${expression.replace(/ /g, '\\,')}}\\)`; // Preserve spaces using LaTeX "\\," for small spacing
    setLatexAnswer([...latexAnswer, latexAnswerString]);
    setLatexExpression([...latexExpression, latexExpressionString]);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.background = 'black';
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const runRoute = async () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_API_URL}/calculate`,
        data: {
          image: canvas.toDataURL('image/png'),
          dict_of_vars: dictOfVars,
        },
      });

      const resp = await response.data;
      resp.data.forEach((data: Response) => {
        if (data.assign === true) {
          setDictOfVars({
            ...dictOfVars,
            [data.expr]: data.result,
          });
        }
      });

      resp.data.forEach((data: Response) => {
        setTimeout(() => {
          setResult({
            expression: data.expr,
            answer: data.result,
          });
        }, 100);
      });
    }
  };

  return (
    <>
      {/* UI Section */}
      <div
        className="absolute top-0 left-0 flex flex-wrap items-center justify-between p-3 w-full bg-gradient z-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)',
        }}
      >
        {/* Reset Button */}
        <div className="mb-2 md:mb-0">
          <Button
            onClick={() => setReset(true)}
            className="btn btn-danger px-4 py-2 rounded shadow"
          >
            Reset
          </Button>
        </div>

        {/* Color Swatches Section */}
        <div
        
          className="flex rounded-lg  items-center gap-2 overflow-auto p-2 md:max-w-full max-w-screen-sm flex-nowrap"
          style={{
            border: '1px solid black',
            


        }}
        >
          {SWATCHES.map((swatch) => (
            <div
              key={swatch}
              className="rounded-full"
              style={{
                backgroundColor: swatch,
                width: '40px',
                height: '40px',
                border: color === swatch ? '3px solid gold' : '2px solid white',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onClick={() => setColor(swatch)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.1)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            />
          ))}
        </div>

        {/* Run Button */}
        <div className="mb-2 md:mb-0">
          <Button
            onClick={runRoute}
            className="btn px-4 py-2 rounded shadow"
          >
            Run
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />

      {/* Render Answers */}
      {latexAnswer.map((latex, index) => (
        <Draggable key={`answer-${index}`}>
          <div className="absolute p-2 text-white" style={{ marginBottom: '20px' }}>
            <div className="latex-content">{latex}</div>
          </div>
        </Draggable>
      ))}

      {/* Render Expressions */}
      {latexExpression.map((latex, index) => (
        <Draggable key={`expression-${index}`}>
          <div className="absolute p-2 text-white" style={{ marginTop: '40px' }}>
            <div className="latex-content">{latex}</div>
          </div>
        </Draggable>
      ))}
    </>
  );
}

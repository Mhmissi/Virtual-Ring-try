import React, { useRef, useEffect, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { getRingFingerBase } from "../utils/ringMath";
import type { RingType, DiamondType, DiamondSize, FingerType } from "../types/ring";

interface HandCanvasProps {
  imageUrl: string;
  selectedRing: RingType;
  selectedDiamond: DiamondType;
  selectedDiamondSize: DiamondSize;
  selectedFinger: FingerType;
}

const HandCanvas: React.FC<HandCanvasProps> = ({
  imageUrl,
  selectedRing,
  selectedDiamond,
  selectedDiamondSize,
  selectedFinger
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const ringImageRef = useRef<HTMLImageElement>(null);
  const diamondImageRef = useRef<HTMLImageElement>(null);
  const handsRef = useRef<Hands | null>(null);

  const [landmarks, setLandmarks] = useState<any[]>([]);
  const [ringImageLoaded, setRingImageLoaded] = useState(false);
  const [diamondImageLoaded, setDiamondImageLoaded] = useState(false);

  // Initialize MediaPipe Hands
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const newLandmarks = results.multiHandLandmarks[0];
        setLandmarks(newLandmarks);
      }
    });

    handsRef.current = hands;

    return () => {
      hands.close();
    };
  }, []);

  // Process image when it loads
  useEffect(() => {
    const image = imageRef.current;
    const hands = handsRef.current;
    
    if (image && hands) {
      image.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          // Set canvas to original image size for high quality
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          
          // Enable high-quality rendering
          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
          }
          
          // Process hand landmarks
          hands.send({ image });
        }
      };
    }
  }, [imageUrl]);

  // Load ring image when selected ring changes
  useEffect(() => {
    if (ringImageRef.current) {
      setRingImageLoaded(false);
      ringImageRef.current.src = `/Rings/${selectedRing}.png`;
    }
  }, [selectedRing]);

  // Load diamond image when selected diamond changes
  useEffect(() => {
    if (diamondImageRef.current) {
      setDiamondImageLoaded(false);
      diamondImageRef.current.src = `/Diamonds/${selectedDiamond}.png`;
    }
  }, [selectedDiamond]);

  // Redraw when landmarks, finger, ring, or diamond changes
  useEffect(() => {
    if (landmarks.length > 0 && ringImageLoaded) {
      drawHandAndRing(landmarks);
    }
  }, [landmarks, selectedFinger, selectedRing, selectedDiamond, selectedDiamondSize, ringImageLoaded, diamondImageLoaded]);

  const drawHandAndRing = (landmarks: any[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas and redraw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    }

    // Draw hand landmarks with better quality (HIDDEN FROM USER)
    // drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
    //   color: "#00FF00",
    //   lineWidth: 3,
    // });
    // drawLandmarks(ctx, landmarks, {
    //   color: "#FF0000",
    //   lineWidth: 2,
    //   radius: 4,
    // });

    // Calculate ring position based on selected finger
    const ringPos = getRingFingerBase(landmarks, canvas.width, canvas.height, selectedFinger);
    
    // Draw ring and diamond
    drawRingAndDiamondOnCanvas(ctx, ringPos, landmarks, selectedFinger);


  };

  const drawRingAndDiamondOnCanvas = (
    ctx: CanvasRenderingContext2D,
    ringPos: { x: number; y: number },
    landmarks: any[],
    selectedFinger: FingerType
  ) => {
    if (!ringImageRef.current || !ringImageLoaded) return;

    // Enable high-quality rendering for ring and diamond
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Get landmarks for the selected finger
    let lm13: any, lm14: any;
    
    switch (selectedFinger) {
      case "Index":
        lm13 = landmarks[5];
        lm14 = landmarks[6];
        break;
      case "Middle":
        lm13 = landmarks[9];
        lm14 = landmarks[10];
        break;
      case "Ring":
        lm13 = landmarks[13];
        lm14 = landmarks[14];
        break;
      case "Pinky":
        lm13 = landmarks[17];
        lm14 = landmarks[18];
        break;
      default:
        lm13 = landmarks[13];
        lm14 = landmarks[14];
    }

    if (!lm13 || !lm14) return;

    // Calculate finger width and angle
    const fingerWidth = Math.sqrt(
      Math.pow((lm14.x - lm13.x) * ctx.canvas.width, 2) +
      Math.pow((lm14.y - lm13.y) * ctx.canvas.height, 2)
    );

    const fingerAngle = Math.atan2(
      (lm14.y - lm13.y) * ctx.canvas.height,
      (lm14.x - lm13.x) * ctx.canvas.width
    );

    // Calculate ring size based on finger type
    let ringSize: number;
    switch (selectedFinger) {
      case "Index":
        ringSize = Math.max(fingerWidth * 1.05, 24); // Even bigger for index
        break;
      case "Middle":
        ringSize = Math.max(fingerWidth * 1.0, 22); // Bigger for middle
        break;
      case "Ring":
        ringSize = Math.max(fingerWidth * 1.0, 22); // Bigger for ring finger
        break;
      case "Pinky":
        ringSize = Math.max(fingerWidth * 1.15, 27); // Much bigger for pinky finger
        break;
      default:
        ringSize = Math.max(fingerWidth * 0.9, 18);
    }

    // Save context state
    ctx.save();

    // Move to ring position and rotate
    ctx.translate(ringPos.x, ringPos.y);
    ctx.rotate(fingerAngle + Math.PI / 2); // Add 90 degrees for horizontal orientation

    // Draw ring with high quality
    ctx.drawImage(
      ringImageRef.current,
      -ringSize / 2,
      -ringSize / 2,
      ringSize,
      ringSize
    );

    // Draw diamond if selected with high quality
    if (selectedDiamond !== "None" && diamondImageRef.current && diamondImageLoaded) {
      const diamondSizeMultiplier = getDiamondSizeMultiplier(selectedDiamondSize);
      const diamondSize = ringSize * 0.4 * diamondSizeMultiplier;

      ctx.drawImage(
        diamondImageRef.current,
        -diamondSize / 2,
        -diamondSize / 2,
        diamondSize,
        diamondSize
      );
    }

    // Restore context state
    ctx.restore();
  };

  const getDiamondSizeMultiplier = (size: DiamondSize): number => {
    const caratValue = parseFloat(size);
    // Make diamond size changes more noticeable
    return 0.3 + (caratValue * 0.2); // Base 0.3 + 0.2 per carat
  };

  return (
    <div className="luxury-canvas-container">
      <canvas
        ref={canvasRef}
        className="luxury-canvas"
        style={{ 
          maxWidth: "100%", 
          height: "auto",
          imageRendering: "-webkit-optimize-contrast"
        }}
      />
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Hand"
        style={{ display: "none" }}
        crossOrigin="anonymous"
      />
      <img
        ref={ringImageRef}
        src={`/Rings/${selectedRing}.png`}
        alt="Ring"
        style={{ display: "none" }}
        onLoad={() => setRingImageLoaded(true)}
        onError={() => setRingImageLoaded(false)}
        crossOrigin="anonymous"
      />
      <img
        ref={diamondImageRef}
        src={`/Diamonds/${selectedDiamond}.png`}
        alt="Diamond"
        style={{ display: "none" }}
        onLoad={() => setDiamondImageLoaded(true)}
        onError={() => setDiamondImageLoaded(false)}
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default HandCanvas;
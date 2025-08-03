import React from "react";
import type { FingerType } from "../types/ring";

interface Landmark {
  x: number;
  y: number;
}

interface RingPosition {
  x: number;
  y: number;
}

export const getRingFingerBase = (
  landmarks: Landmark[],
  imgWidth: number,
  imgHeight: number,
  selectedFinger: FingerType
): RingPosition => {
  // Input validation
  if (!landmarks || landmarks.length < 21) {
    return { x: 0, y: 0 };
  }

  let lm13: Landmark, lm14: Landmark, lm15: Landmark;

  // Select landmarks based on finger type
  switch (selectedFinger) {
    case "Index":
      // Index finger: landmarks 5, 6, 7
      lm13 = landmarks[5];
      lm14 = landmarks[6];
      lm15 = landmarks[7];
      break;
    case "Middle":
      // Middle finger: landmarks 9, 10, 11
      lm13 = landmarks[9];
      lm14 = landmarks[10];
      lm15 = landmarks[11];
      break;
    case "Ring":
      // Ring finger: landmarks 13, 14, 15 (default)
      lm13 = landmarks[13];
      lm14 = landmarks[14];
      lm15 = landmarks[15];
      break;
    case "Pinky":
      // Pinky finger: landmarks 17, 18, 19
      lm13 = landmarks[17];
      lm14 = landmarks[18];
      lm15 = landmarks[19];
      break;
    default:
      // Default to ring finger
      lm13 = landmarks[13];
      lm14 = landmarks[14];
      lm15 = landmarks[15];
  }

  // Validate landmarks exist
  if (!lm13 || !lm14 || !lm15) {
    return { x: 0, y: 0 };
  }

  // Calculate finger direction vector
  const fingerDirection = {
    x: lm14.x - lm13.x,
    y: lm14.y - lm13.y
  };

  // Calculate perpendicular offset (same logic as before)
  const perpendicularOffset = 0.02; // 2% of image size
  let offsetX = -fingerDirection.y * perpendicularOffset;
  let offsetY = fingerDirection.x * perpendicularOffset;

  // Adjust offset for index finger to move ring to the left
  if (selectedFinger === "Index") {
    offsetX -= 0.01; // Move ring to the left by 1% of image width
  }

  // Adjust offset for middle finger to move ring to the left
  if (selectedFinger === "Middle") {
    offsetX -= 0.005; // Move ring to the left by 0.5% of image width
  }

  // Use different weights based on finger type
  let baseWeight: number, jointWeight: number, tipWeight: number;
  
  if (selectedFinger === "Pinky") {
    // For pinky finger, position closer to base (landmark 17)
    baseWeight = 0.45;
    jointWeight = 0.45;
    tipWeight = 0.10;
  } else {
    // For other fingers, use the original weights (65% towards 14)
    baseWeight = 0.35;
    jointWeight = 0.65;
    tipWeight = 0.0;
  }

  const weightedX = (lm13.x * baseWeight + lm14.x * jointWeight + lm15.x * tipWeight) + offsetX;
  const weightedY = (lm13.y * baseWeight + lm14.y * jointWeight + lm15.y * tipWeight) + offsetY;

  return {
    x: weightedX * imgWidth,
    y: weightedY * imgHeight
  };
};

interface RingIndicatorProps {
  ringPos: { x: number; y: number } | null;
}

export const RingIndicator: React.FC<RingIndicatorProps> = ({ ringPos }) => {
  if (!ringPos) return null;
  return (
    <svg
      style={{
        position: "absolute",
        left: ringPos.x - 16, // 16 = half of icon width (32)
        top: ringPos.y - 16,  // 16 = half of icon height (32)
        pointerEvents: "none",
      }}
      width={32}
      height={32}
      viewBox="0 0 32 32"
    >
      <polygon
        points="16,4 28,28 4,28"
        fill="#b9f2ff"
        stroke="#333"
        strokeWidth={2}
      />
    </svg>
  );
};
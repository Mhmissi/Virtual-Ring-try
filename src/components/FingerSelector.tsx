import React from "react";
import type { FingerType } from "../types/ring";

interface FingerSelectorProps {
  selectedFinger: FingerType;
  onFingerSelect: (finger: FingerType) => void;
}

const FingerSelector: React.FC<FingerSelectorProps> = ({ selectedFinger, onFingerSelect }) => {
  const fingerOptions = [
    { type: "Index" as FingerType, label: "Index", icon: "👆" },
    { type: "Middle" as FingerType, label: "Middle", icon: "🖕" },
    { type: "Ring" as FingerType, label: "Ring", icon: "💍" },
    { type: "Pinky" as FingerType, label: "Pinky", icon: "🤏" }
  ];

  return (
    <div className="luxury-button-grid">
      {fingerOptions.map((finger) => (
        <button
          key={finger.type}
          className={`luxury-button ${selectedFinger === finger.type ? "active" : ""}`}
          onClick={() => onFingerSelect(finger.type)}
        >
          <div className="luxury-button-content">
            <div className="luxury-button-icon">
              {finger.icon}
            </div>
            <div className="luxury-button-text">
              {finger.label}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default FingerSelector; 
import React from "react";
import type { DiamondSize } from "../types/ring";

interface DiamondSizeSelectorProps {
  selectedSize: DiamondSize;
  onSizeSelect: (size: DiamondSize) => void;
}

const DiamondSizeSelector: React.FC<DiamondSizeSelectorProps> = ({ selectedSize, onSizeSelect }) => {
  const sizeOptions: { size: DiamondSize; label: string }[] = [
    { size: "0.5", label: "0.5 ct" },
    { size: "1", label: "1 ct" },
    { size: "1.5", label: "1.5 ct" },
    { size: "2", label: "2 ct" },
  ];

  return (
    <div className="diamond-size-grid">
      {sizeOptions.map((option) => (
        <button
          key={option.size}
          onClick={() => onSizeSelect(option.size)}
          className={`diamond-size-button ${selectedSize === option.size ? 'active' : ''}`}
        >
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 mb-1 flex items-center justify-center">
              <div 
                className="bg-blue-200 rounded-full"
                style={{
                  width: `${parseFloat(option.size) * 6}px`,
                  height: `${parseFloat(option.size) * 6}px`,
                  minWidth: '6px',
                  minHeight: '6px'
                }}
              />
            </div>
            <span className="text-xs font-medium">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DiamondSizeSelector; 
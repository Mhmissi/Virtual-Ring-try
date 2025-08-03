import React from "react";
import type { RingType } from "../types/ring";

interface RingSelectorProps {
  selectedRing: RingType;
  onRingSelect: (ringType: RingType) => void;
}

const RingSelector: React.FC<RingSelectorProps> = ({ selectedRing, onRingSelect }) => {
  const ringOptions: { type: RingType; name: string; color: string; icon: string }[] = [
    { type: "YellowGold", name: "Gold", color: "#FFD700", icon: "💍" },
    { type: "RoseGold", name: "Rose Gold", color: "#B76E79", icon: "💎" },
    { type: "Platinum", name: "Platinum", color: "#E5E4E2", icon: "✨" },
    { type: "WhiteGold", name: "White Gold", color: "#F5F5DC", icon: "🌟" },
  ];

  return (
    <div className="luxury-button-grid">
      {ringOptions.map((ring) => (
        <button
          key={ring.type}
          onClick={() => onRingSelect(ring.type)}
          className={`luxury-button ${selectedRing === ring.type ? 'active' : ''}`}
        >
          <div className="luxury-button-content">
            <div 
              className="luxury-button-icon metal-color-icon"
              style={{ 
                backgroundColor: ring.color
              }}
            >
              {ring.icon}
            </div>
            <span className="luxury-button-text">{ring.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RingSelector; 
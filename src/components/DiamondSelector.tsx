import React from "react";
import type { DiamondType } from "../types/ring";

interface DiamondSelectorProps {
  selectedDiamond: DiamondType;
  onDiamondSelect: (diamondType: DiamondType) => void;
}

const DiamondSelector: React.FC<DiamondSelectorProps> = ({ selectedDiamond, onDiamondSelect }) => {
  const diamondOptions: { type: DiamondType; name: string; image: string; icon: string }[] = [
    { type: "None", name: "No Diamond", image: "", icon: "○" },
    { type: "Round", name: "Round", image: "/Diamonds/Round.png", icon: "💎" },
    { type: "Princess", name: "Princess", image: "/Diamonds/Princess.png", icon: "💎" },
    { type: "Oval", name: "Oval", image: "/Diamonds/Oval.png", icon: "💎" },
    { type: "Heart", name: "Heart", image: "/Diamonds/Heart.png", icon: "💎" },
    { type: "Marquisse", name: "Marquisse", image: "/Diamonds/Marquisse.png", icon: "💎" },
    { type: "Pear", name: "Pear", image: "/Diamonds/Pear.png", icon: "💎" },
  ];

  return (
    <div className="luxury-button-grid">
      {diamondOptions.map((diamond) => (
        <button
          key={diamond.type}
          onClick={() => onDiamondSelect(diamond.type)}
          className={`luxury-button ${selectedDiamond === diamond.type ? 'active' : ''}`}
        >
          <div className="luxury-button-content">
            {diamond.image ? (
              <img
                src={diamond.image}
                alt={diamond.name}
                className="luxury-button-icon"
                style={{ objectFit: 'contain', padding: '4px' }}
              />
            ) : (
              <div className="luxury-button-icon" style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
                {diamond.icon}
              </div>
            )}
            <span className="luxury-button-text">{diamond.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DiamondSelector; 
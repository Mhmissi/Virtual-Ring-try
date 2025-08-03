import React, { useState } from "react";
import HandCanvas from "./components/HandCanvas";
import HandUpload from "./components/HandUpload";
import PopupSelector from "./components/PopupSelector";
import type { RingType, DiamondType, DiamondSize, FingerType } from "./types/ring";
import './App.css';

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("/defaultHand.webp");
  const [selectedRing, setSelectedRing] = useState<RingType>("YellowGold");
  const [selectedDiamond, setSelectedDiamond] = useState<DiamondType>("Round");
  const [selectedDiamondSize, setSelectedDiamondSize] = useState<DiamondSize>("1");
  const [selectedFinger, setSelectedFinger] = useState<FingerType>("Ring");

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleRingSelect = (ringType: RingType) => {
    setSelectedRing(ringType);
  };

  const handleDiamondSelect = (diamondType: DiamondType) => {
    setSelectedDiamond(diamondType);
  };

  const handleDiamondSizeSelect = (size: DiamondSize) => {
    setSelectedDiamondSize(size);
  };

  const handleFingerSelect = (finger: FingerType) => {
    setSelectedFinger(finger);
  };

  const fingerOptions = [
    { value: "Index" as FingerType, label: "Index", image: "/icons/indexFinegr.png" },
    { value: "Middle" as FingerType, label: "Middle", image: "/icons/MidleFinder.png" },
    { value: "Ring" as FingerType, label: "Ring", image: "/icons/RingFinger.png" },
    { value: "Pinky" as FingerType, label: "Pinky", image: "/icons/PinkyFinger.png" }
  ];

  const ringOptions = [
    { value: "YellowGold" as RingType, label: "Gold", color: "#FFD700" },
    { value: "RoseGold" as RingType, label: "Rose Gold", color: "#B76E79" },
    { value: "Platinum" as RingType, label: "Platinum", color: "#E5E4E2" },
    { value: "WhiteGold" as RingType, label: "White Gold", color: "#F5F5DC" }
  ];

  const diamondOptions = [
    { value: "Round" as DiamondType, label: "Round", image: "/Diamonds/Round.png" },
    { value: "Princess" as DiamondType, label: "Princess", image: "/Diamonds/Princess.png" },
    { value: "Oval" as DiamondType, label: "Oval", image: "/Diamonds/Oval.png" },
    { value: "Marquisse" as DiamondType, label: "Marquisse", image: "/Diamonds/Marquisse.png" },
    { value: "Heart" as DiamondType, label: "Heart", image: "/Diamonds/Heart.png" },
    { value: "Pear" as DiamondType, label: "Pear", image: "/Diamonds/Pear.png" }
  ];

  const sizeOptions = [
    { value: "0.5" as DiamondSize, label: "0.5 ct" },
    { value: "1" as DiamondSize, label: "1 ct" },
    { value: "1.5" as DiamondSize, label: "1.5 ct" },
    { value: "2" as DiamondSize, label: "2 ct" }
  ];

  return (
    <div className="luxury-container">
      {/* Main Content Area */}
      <div className="main-content">
        {/* Preview Section */}
        {imageUrl && (
          <div className="preview-section">
            <h2 className="preview-title">Customize Your Dream Ring</h2>
            <div className="luxury-canvas-container">
              <HandCanvas 
                imageUrl={imageUrl} 
                selectedRing={selectedRing}
                selectedDiamond={selectedDiamond}
                selectedDiamondSize={selectedDiamondSize}
                selectedFinger={selectedFinger}
              />
            </div>
          </div>
        )}
        
        {/* Customization Section */}
        {imageUrl && (
          <div className="customization-section">
            <h2 className="customization-title">Customize Your Ring</h2>
            <div className="popup-customization-grid">
              <PopupSelector
                title="Finger"
                selectedValue={selectedFinger}
                options={fingerOptions}
                onSelect={handleFingerSelect}
                renderOption={(option) => (
                  <div className="popup-option-content">
                    <img 
                      src={(option as any).image} 
                      alt={option.label} 
                      className="popup-option-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="popup-option-label">{option.label}</span>
                  </div>
                )}
              />
              
              <PopupSelector
                title="Ring Metal"
                selectedValue={selectedRing}
                options={ringOptions}
                onSelect={handleRingSelect}
                renderOption={(option) => (
                  <div className="popup-option-content">
                    <span className="popup-option-label">{option.label}</span>
                  </div>
                )}
              />
              
              <PopupSelector
                title="Diamond Shape"
                selectedValue={selectedDiamond}
                options={diamondOptions}
                onSelect={handleDiamondSelect}
                renderOption={(option) => (
                  <div className="popup-option-content">
                    <img 
                      src={option.image} 
                      alt={option.label} 
                      className="popup-option-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="popup-option-label">{option.label}</span>
                  </div>
                )}
              />
              
              <PopupSelector
                title="Diamond Size"
                selectedValue={selectedDiamondSize}
                options={sizeOptions}
                onSelect={handleDiamondSizeSelect}
                renderOption={(option) => (
                  <div className="popup-option-content">
                    <span className="popup-option-icon">💎</span>
                    <span className="popup-option-label">{option.label}</span>
                  </div>
                )}
              />
            </div>
          </div>
        )}
        
        {/* Upload Section */}
        <div className="upload-section">
          <h2 className="upload-title">Upload Your Hand</h2>
          <HandUpload onImageUpload={handleImageUpload} />
        </div>
      </div>
    </div>
  );
};

export default App;

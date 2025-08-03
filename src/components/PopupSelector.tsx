import React, { useState } from "react";

interface PopupSelectorProps<T> {
  title: string;
  selectedValue: T;
  options: { value: T; label: string; icon?: string; image?: string }[];
  onSelect: (value: T) => void;
  renderOption?: (option: { value: T; label: string; icon?: string; image?: string }) => React.ReactNode;
}

const PopupSelector = <T extends string>({
  title,
  selectedValue,
  options,
  onSelect,
  renderOption
}: PopupSelectorProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: T) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="popup-selector">
      <button
        className="popup-trigger"
        onClick={() => setIsOpen(true)}
      >
        <div className="popup-trigger-content">
          <span className="popup-trigger-label">{title}</span>
          <span className="popup-trigger-value">{selectedOption?.label}</span>
        </div>
      </button>

      {isOpen && (
        <div className="popup-overlay" onClick={() => setIsOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3 className="popup-title">{title}</h3>
              <button 
                className="popup-close"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="popup-options">
              {options.map((option) => {
                const metalClass = (option as any).color ? `metal-${option.value.toLowerCase()}` : '';
                return (
                  <button
                    key={option.value}
                    className={`popup-option ${selectedValue === option.value ? 'active' : ''} ${metalClass}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {renderOption ? renderOption(option) : option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupSelector; 
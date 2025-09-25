import type { Product } from '@/shared/types';

interface ColorSelectorProps {
  colors: Product['colors'];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="color-selector">
      {selectedColor && (
        <div className="selected-color-name">
          {colors.find(c => c.value === selectedColor)?.name}
        </div>
      )}
      <div className="color-options">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorSelect(color.value)}
            aria-label={`Select ${color.name} color`}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
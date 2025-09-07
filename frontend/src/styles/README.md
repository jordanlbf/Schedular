# CSS Architecture

## Structure

```
src/styles/
├── base/                    # Foundation styles
│   ├── variables.css       # CSS custom properties
│   └── layout.css         # Basic layout components
├── components/             # Reusable UI components
│   ├── buttons.css        # Button variants
│   ├── forms.css          # Form inputs and layouts
│   ├── panels.css         # Panel and card components
│   ├── progress.css       # Progress indicators
│   ├── tables.css         # Table components
│   ├── toast.css          # Toast notifications
│   └── utilities.css      # Small utility components
├── features/              # Feature-specific styles
│   └── sale/
│       ├── cart.css       # Cart-specific components
│       ├── products.css   # Product display components
│       └── wizard.css     # Wizard/form flow components
├── utilities/             # Utility classes
│   └── responsive.css     # Media queries
└── index.css              # Main import file
```

## Migration Notes

- Original `sale.css` backed up as `sale.css.backup`
- New `sale.css` imports the modular structure
- No breaking changes to existing class names
- CSS custom properties centralized in `variables.css`

## Usage

Import the main CSS file:
```css
@import url('../../styles/index.css');
```

Or import specific components as needed:
```css
@import url('../../styles/components/buttons.css');
@import url('../../styles/components/forms.css');
```

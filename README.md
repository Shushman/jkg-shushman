# Interactive Article Template

A modern template for creating interactive academic articles in the style of [Distill](https://distill.pub/) publications. Built with React, TypeScript, MDX, and shadcn/ui components.

## Features

- 🎨 **Distill-inspired Design** - Clean, academic styling optimized for readability
- 📝 **MDX Support** - Write content in Markdown with embedded React components
- 🧮 **Mathematical Notation** - KaTeX integration for beautiful equations
- 📊 **Interactive Visualizations** - D3.js for data visualization and interactive graphics
- 🎛️ **UI Components** - shadcn/ui components for consistent, accessible interactions
- ⚡ **Fast Development** - Bun + Vite for lightning-fast development and builds
- 🎯 **TypeScript** - Full type safety throughout the project

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production  
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
├── article.mdx              # Main article content (MDX format)
├── components/              # Reusable React components
│   ├── ui/                 # shadcn/ui components
│   ├── InteractiveSlider.tsx
│   └── MathVisualization.tsx
├── styles.css              # Global styles with Tailwind
├── index.tsx               # Application entry point
├── index.html              # HTML template
└── vite.config.ts          # Vite configuration
```

## Writing Your Article

### Basic Structure

Edit `article.mdx` to write your article content. You can use standard Markdown syntax along with React components:

```mdx
import { MyComponent } from './components/MyComponent';

# Article Title

Your introduction text here...

## Interactive Section

<MyComponent prop="value" />

More content...

## Mathematical Notation

Inline math: $E = mc^2$

Display equations:
$$
\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u
$$
```

### Adding Interactive Components

Create new React components in the `components/` directory and import them in your MDX file:

```tsx
// components/MyVisualization.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function MyVisualization() {
  const [value, setValue] = useState([50]);
  
  return (
    <Card>
      <CardContent>
        <Slider value={value} onValueChange={setValue} />
        <p>Value: {value[0]}</p>
      </CardContent>
    </Card>
  );
}
```

Then use it in your article:

```mdx
import MyVisualization from './components/MyVisualization';

<MyVisualization />
```

## Available Components

### shadcn/ui Components

The project includes shadcn/ui components. Add more as needed:

```bash
bunx shadcn@latest add button input textarea
```

### Built-in Examples

- `InteractiveSlider` - Parameter control with real-time calculations
- `MathVisualization` - D3.js sine wave visualization with controls

## Mathematical Notation

Use KaTeX syntax for mathematical expressions:

- Inline: `$x = y + z$` 
- Display: `$$\\sum_{i=1}^n x_i$$`
- Complex: `$$\\mathcal{L} = \\frac{1}{2} \\sum_{i=1}^{n} (y_i - f(x_i))^2$$`

## Data Visualization

The project includes D3.js for creating custom visualizations:

```tsx
import * as d3 from 'd3';

// Create SVG visualizations
const svg = d3.select(svgRef.current);
// ... D3.js code
```

## Styling

### Tailwind CSS

Use Tailwind utility classes for styling:

```tsx
<div className="max-w-4xl mx-auto p-6">
  <h1 className="text-3xl font-bold mb-4">Title</h1>
</div>
```

### Custom Styles

Add custom styles in `styles.css` using Tailwind's `@layer` directive:

```css
@layer components {
  .article-header {
    @apply text-center mb-12 pb-8 border-b-2 border-gray-200;
  }
}
```

## Deployment

Build the project for production:

```bash
bun run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## Development

### Available Scripts

- `bun run dev` - Start development server on port 3000
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally

### Adding Dependencies

```bash
# Add new packages
bun add package-name

# Add development dependencies  
bun add -D package-name
```

## License

MIT License - feel free to use this template for your own interactive articles!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

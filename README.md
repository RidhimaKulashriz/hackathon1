# RAAH - Personalized Adaptive Learning Platform

RAAH is a modern, accessible, and interactive learning platform designed for students from Class 1 to 12, offering personalized learning experiences across multiple streams (Science, Commerce, and Arts).

## Features

- 🎨 Beautiful, responsive UI with light/dark theme support
- 📚 Comprehensive curriculum coverage for Classes 1-12
- 🎓 Multiple streams (Science, Commerce, Arts) for higher classes
- 🌓 Built-in theme switcher with system preference detection
- ♿ Accessible design following WCAG guidelines
- 🚀 Optimized for performance
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: HTML5, CSS3, TypeScript
- **3D Graphics**: Three.js
- **Build Tool**: esbuild
- **Package Manager**: npm/yarn

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/raah-learning-platform.git
   cd raah-learning-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

To start the development server with hot-reload:

```bash
npm run dev
# or
yarn dev
```

This will start a development server at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
raah-frontend/
├── index.html          # Main HTML file
├── assets/             # Static assets (images, fonts, etc.)
├── styles/             # Global styles and themes
├── src/
│   ├── main.ts         # Application entry point
│   ├── ui/             # UI components
│   ├── data/           # Data models and seed data
│   ├── tests/          # Test files
│   └── three/          # 3D graphics code
├── dist/               # Compiled output
├── package.json        # Project configuration
└── tsconfig.json      # TypeScript configuration
```

## Theming

The application supports both light and dark themes. The theme can be toggled using the theme button in the header. The theme preference is saved in the browser's local storage.

### Theme Variables

- **Light Theme**: Beige-green color scheme
- **Dark Theme**: Emerald-charcoal color scheme

## Adding Content

### Adding a New Class

1. Open `src/data/curriculum.ts`
2. Add a new entry to the `seed` array following the existing pattern
3. The application will automatically pick up the new class

### Adding a New Subject

1. Open `src/data/curriculum.ts`
2. Add the subject to the appropriate stream in the `seed` array
3. Add topics for the subject

## Accessibility

This project follows web accessibility best practices:

- Semantic HTML5 elements
- ARIA attributes where necessary
- Keyboard navigation support
- Proper color contrast
- Reduced motion support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) for 3D graphics
- [esbuild](https://esbuild.github.io/) for fast builds
- [TypeScript](https://www.typescriptlang.org/) for type safety

# 🎯 Projectile Motion Simulator

A professional, interactive physics simulation application built with Next.js, React, and TypeScript. This simulator provides a comprehensive tool for visualizing and analyzing projectile motion with realistic physics calculations.

## ✨ Features

### 🚀 Professional Canvas
- **Responsive Design**: Canvas automatically adapts to different screen sizes
- **Dynamic Sizing**: Adjustable canvas dimensions with real-time preview
- **Proper Separation**: Canvas is cleanly separated from sidebars with professional layout
- **Size Indicator**: Live display of current canvas dimensions
- **Aspect Ratio Control**: Tools to maintain or adjust canvas proportions

### ⚙️ Enhanced Parameter Controls
- **Professional Sliders**: Beautiful, responsive parameter controls with visual feedback
- **Real-time Updates**: Live preview of parameter values with colored indicators
- **Comprehensive Parameters**:
  - Initial Velocity (10-100 m/s)
  - Launch Angle (5-85°)
  - Projectile Mass (1-100 kg)
  - Gravity (1-20 m/s²)
  - Air Resistance Toggle

### 🎮 Quick Presets
- **Cannon Ball**: Heavy projectile with air resistance
- **Bullet**: High-speed, lightweight projectile
- **Basketball**: Sports projectile with moderate air resistance
- **Feather**: Very light object heavily affected by air
- **Perfect Vacuum**: Ideal physics without air resistance

### 📐 Canvas Size Controls
- **Preset Sizes**: Small, Medium, Large, Wide, Square, Tall
- **Custom Dimensions**: Fine-tune width and height with sliders
- **Quick Actions**: Rotate canvas or fix aspect ratio with one click
- **Live Preview**: Real-time aspect ratio and dimension display

### 📊 Comprehensive Data Panel
- **Live Metrics**: Real-time position, velocity, speed, and time
- **Physics Analysis**: Detailed breakdown of current parameters
- **Calculated Results**: Maximum height, range, and time of flight
- **Progress Tracking**: Visual progress bar during simulation
- **Canvas Information**: Current dimensions, aspect ratio, and scale

### 🎨 Professional UI/UX
- **Clean Architecture**: Modular component structure
- **Tabbed Interface**: Organized controls with Parameters, Presets, and Canvas tabs
- **Theme Support**: Light and dark mode with smooth transitions
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Professional Styling**: Modern design with consistent spacing and typography

## 🏗️ Architecture

### Clean Code Structure
```
src/
├── components/
│   ├── controls/
│   │   ├── ControlPanel.tsx      # Main control interface
│   │   ├── ParameterSlider.tsx   # Professional parameter controls
│   │   ├── PresetSelector.tsx    # Quick preset selection
│   │   ├── ControlButtons.tsx    # Simulation control buttons
│   │   └── CanvasSizeControls.tsx # Canvas sizing interface
│   ├── simulation/
│   │   └── SimulationCanvas.tsx  # Responsive canvas component
│   ├── data/
│   │   └── DataPanel.tsx         # Live data and analytics
│   ├── layout/
│   │   └── Header.tsx            # Application header
│   └── ProjectileSimulator.tsx   # Main orchestrator component
├── hooks/
│   └── useSimulation.ts          # Custom hook for simulation logic
├── types/
│   └── simulation.ts             # TypeScript type definitions
└── app/
    ├── page.tsx                  # Main page
    ├── layout.tsx                # App layout
    └── globals.css               # Global styles
```

### Key Improvements

#### 1. **Proper Canvas Layout**
- Canvas is no longer merged with sidebars
- Responsive design that adapts to different screen sizes
- Professional container with proper spacing and borders
- Dynamic sizing with aspect ratio preservation

#### 2. **Enhanced Parameter UI**
- Professional slider components with visual feedback
- Color-coded parameters for easy identification
- Real-time value display with proper units
- Descriptive tooltips and help text

#### 3. **Modular Architecture**
- Separated concerns into focused components
- Custom hooks for simulation logic
- TypeScript interfaces for type safety
- Clean import/export structure

#### 4. **Professional Features**
- Tabbed interface for organized controls
- Quick preset system for common scenarios
- Canvas size presets and custom controls
- Comprehensive data visualization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd projectile-sim

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production
```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🔧 Usage

### Basic Simulation
1. **Set Parameters**: Use the Parameters tab to adjust velocity, angle, mass, and gravity
2. **Choose Preset**: Or select a quick preset from the Presets tab
3. **Adjust Canvas**: Customize canvas size in the Canvas tab
4. **Run Simulation**: Click the Start button to begin the simulation
5. **Analyze Data**: View live metrics in the data panel

### Advanced Features
- **Pause/Resume**: Control simulation playback
- **Air Resistance**: Toggle realistic air resistance effects
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Design**: Works on all device sizes

## 🎯 Physics Model

### Without Air Resistance
Perfect parabolic trajectory following kinematic equations:
- x = v₀cos(θ)t
- y = v₀sin(θ)t - ½gt²

### With Air Resistance
Realistic trajectory affected by:
- Drag force proportional to velocity²
- Mass-dependent air resistance coefficient
- Dynamic velocity calculations at each frame

## 🎨 Design Philosophy

### Professional Appearance
- Modern, clean interface design
- Consistent color scheme and typography
- Smooth animations and transitions
- Responsive layout for all devices

### User Experience
- Intuitive controls and navigation
- Clear visual feedback
- Comprehensive data display
- Accessible design patterns

### Code Quality
- TypeScript for type safety
- Modular component architecture
- Custom hooks for logic separation
- Clean, maintainable code structure

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop**: Full-featured interface with all panels visible
- **Tablet**: Optimized layout with collapsible panels
- **Mobile**: Streamlined interface with touch-friendly controls

## 🌟 Future Enhancements

Potential improvements for future versions:
- Multiple projectile simulation
- Wind effects and environmental factors
- Data export and analysis tools
- 3D visualization options
- Educational mode with guided tutorials

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS

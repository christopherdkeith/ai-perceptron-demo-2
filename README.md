# Perceptron Demo - 3D Plane Classification

An interactive visualisation of how a perceptron (the simplest neural network) learns to classify points in 3D space using a planar decision boundary.

🔗 **[Live Demo](https://christopherdkeith.github.io/ai-perceptron-demo-2/)** 🔗

## Overview

This educational demo extends the classic 2D perceptron to 3D, showing how a single-neuron perceptron learns to separate points into two classes using a plane as the decision boundary. Watch in real-time as the algorithm adjusts its weights and bias to find the perfect plane that classifies all points correctly.

**Key Insight:** The perceptron IS a plane, defined by just four numbers (Weight_x, Weight_y, Weight_z, and Bias). Learning means adjusting these four numbers to position and orient the plane correctly in 3D space.

## Features

- **3D visualisation**: Fully interactive 3D scatter plot with rotatable camera
- **Real-time Plane Rendering**: Semi-transparent polygon surfaces show both target and learned planes
- **Drag to Rotate**: Click and drag the chart to view from any angle
- **Interactive Controls**: 
  - Adjust learning rate to see how it affects convergence speed
  - Change the target plane coefficients (A, B, C in z = Ax + By + C)
  - Generate new random data points in 3D space
  - Reset camera view and retrain from scratch
- **Live Metrics**: Track training rounds, accuracy, correct/incorrect classifications, and all weight values
- **Educational Explanations**: Built-in explanations of how 3D perceptrons work and the learning process

## Demo

The interface displays:
- **Blue points**: Labeled as -1 (below the target plane)
- **Green points**: Labeled as +1 (above the target plane)
- **Red surface**: The target plane that defines the correct classification
- **Orange surface**: The perceptron's current decision boundary (starts at origin, converges to target)

## How It Works

The perceptron learns through these steps:

1. **Make Predictions**: For each point, calculate `(Weight_x × x) + (Weight_y × y) + (Weight_z × z) + Bias`
   - If result ≥ 0, predict +1 (above plane)
   - If result < 0, predict -1 (below plane)

2. **Find Mistakes**: Compare predictions with correct labels

3. **Adjust Weights**: When wrong, update using the perceptron learning rule:
   ```
   New Weight_x = Old Weight_x + (Learning Rate × Error × x)
   New Weight_y = Old Weight_y + (Learning Rate × Error × y)
   New Weight_z = Old Weight_z + (Learning Rate × Error × z)
   New Bias = Old Bias + (Learning Rate × Error)
   ```

4. **Repeat**: Continue until all points are classified correctly

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No installation required!

### View Online

**Just visit:** [https://christopherdkeith.github.io/ai-perceptron-demo-2/](https://christopherdkeith.github.io/ai-perceptron-demo-2/)

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/christopherdkeith/ai-perceptron-demo-2.git
   cd ai-perceptron-demo-2
   ```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with" your browser, or
   - Use a local server: `python -m http.server 8000`

### Usage

1. **Click "Start Training"** to begin the learning process
2. **Watch the accuracy increase** as the orange plane rotates and aligns with the red target plane
3. **Drag the chart** to rotate the 3D view and see the planes from different angles
4. **Experiment with parameters**:
   - Try different learning rates (0.01 for slow/steady, 0.5 for fast/jumpy)
   - Change the target plane coefficients (A, B, C)
   - Generate new data points to see adaptation in 3D space
5. **Reset camera** to return to the default viewing angle
6. **Reset and repeat** to see different learning trajectories

## Project Structure

```
ai-perceptron-demo-2/
├── index.html               # Main HTML interface
├── perceptron.js            # Core 3D perceptron algorithm
├── ui.js                    # UI interactions and 3D chart rendering
├── styles.css               # Styling
├── IMPLEMENTATION_PLAN.md   # Development roadmap
└── README.md                # This file
```

## Educational Value

This demo illustrates:
- **3D Linear Classification**: Understanding planar decision boundaries in 3D space
- **Core AI Learning Principle**: Start with random values, measure mistakes, adjust parameters to reduce errors
- **Gradient Descent**: How small adjustments based on errors lead to optimal solutions
- **Hyperparameter Tuning**: How learning rate affects convergence
- **Supervised Learning**: Training with labeled data (points marked as +1 or -1)
- **3D Geometry**: visualising planes as decision boundaries in 3D coordinate systems

## Key Concepts

### Perceptron in 3D
The simplest form of a neural network extended to three dimensions:
- **Weights** (Weight_x, Weight_y, Weight_z): Control the plane's orientation in 3D space
- **Bias**: Shifts the plane's position
- **Activation Function**: Step function that outputs +1 or -1
- **Decision Boundary**: A plane defined by `wx·x + wy·y + wz·z + b = 0`

### Learning Algorithm
The perceptron uses supervised learning to adjust its parameters:
- Each training round processes all data points in 3D space
- Weights update only when predictions are incorrect
- Learning continues until perfect classification or manual stop
- The plane rotates and translates to separate the two classes

### Plane Equation Forms
- **Implicit form**: `wx·x + wy·y + wz·z + b = 0` (what the perceptron uses)
- **Explicit form**: `z = Ax + By + C` (what the UI displays for the target plane)
- Conversion: `A = -wx/wz`, `B = -wy/wz`, `C = -b/wz`

## Technical Details

- **Built with**: Vanilla JavaScript (ES5 for broad compatibility)
- **visualisation**: Highcharts 7.x with 3D extensions
- **Custom Series**: `polygon3d` series type for rendering plane surfaces
- **No Dependencies**: No build tools, bundlers, or frameworks required
- **Pure Client-Side**: Runs entirely in the browser

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note**: Requires browser support for Highcharts 3D rendering (WebGL/Canvas).

## Related Projects

- **[2D Perceptron Demo](https://github.com/christopherdkeith/ai-perceptron-demo)**: The original 2D line classification version

## Contributing

Contributions are welcome! Ideas for enhancements:
- Add more activation functions (sigmoid, ReLU)
- Implement multi-class classification with multiple planes
- Add noise to data points
- Show weight history graph
- Export training data and results
- Add support for 4D+ visualisation using color/size

## License

This project is open source and available under the MIT License.

## Author

Christopher Keith

## Acknowledgments

This demo was created as an educational tool to help people understand the foundational concepts of neural networks and machine learning through interactive 3D visualisation. Special thanks to the Highcharts team for their excellent 3D charting library.

---

**Learning Note**: While modern neural networks are far more complex, they build on these same principles: adjusting parameters (weights) based on errors to minimize mistakes. The perceptron demonstrates this fundamental learning process in its simplest form, now extended to three dimensions to show how the concept scales beyond 2D.

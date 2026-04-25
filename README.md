# Fourier Web Engine
*A JavaScript engine for drawing complex shapes using Fourier series*

## Overview
This project visualizes how **Fourier series** can reconstruct complex shapes using rotating vectors (epicycles).  
A shape (such as heart, clover, Tux), or any closed curve, is sampled, converted into complex numbers, decomposed into Fourier coefficients, and then animated as a chain of rotating vectors.

The result is a smooth, intuitive demonstration of how Fourier series "draw" curves.

---

## ✨ Features

- Real‑time epicycle animation in JavaScript
- Clean JSON format for shape data
- Normalization for consistent scaling
- Modular design - easy to plug in new shapes
- Pause/resume animation
- Supports any closed curve

---

## 📐 How Fourier Series Reconstruct Shapes

Any closed 2D curve can be represented as a sequence of complex samples:

```text
z[k] = x[k] + i·y[k]
```
where z[k] is one sample point one the shape

If the curve is sampled uniformly, the Discrete Fourier Transform (DFT) gives coefficients:
```text
Cₙ = (1/N) Σ z[k] · e^(−i·2π·n·k/N)
```
We multiply each sample 𝑧[𝑘] by this rotating phasor and sum them all.

Intuition:

If the shape has a strong component that "vibrates" at frequency 𝑛, then when you multiply by the phasor 
and sum, the contributions line up and reinforce. 
If the shape doesn't match that frequency, the contributions cancel out.
This is essentially like centrifuging the unwanted frequencies.

Each coefficient (Cₙ) corresponds to:
- A frequency (how fast the vector rotates)
- A magnitude (length of the vector)
- A phase (initial angle)

The reconstruction is:
```text
z(t) = Σ Cₙ · e^(i 2π n t)
```
This is literally the head to tail rule - sum of all rotating vectos
Before, we had:

- 𝑧[𝑘]: discrete samples of the shape
- 𝐶𝑛: how much of each frequency is present

Now we want to draw the shape back using only the 𝐶𝑛.

## Project Architecture

### Project Folder Structure
```text
fourier-web/
├── Dockerfile
├── README.md
├── css
│   └── style.css
├── data
│   ├── clover-3.json
│   ├── clover-4.json
│   └── heart.json
├── docker-compose.yaml
├── index.html
└── js
    ├── constants.js
    ├── drawingContext.js
    ├── drawingService.js
    ├── main.js
    ├── strategy.js
    └── vector.js
```

### Data JSON Format
The json file contains a list of coefficients as shown
```text
[
  { "n": 0,  "re": 10.0, "im": 0.0 },
  { "n": 1,  "re": 5.0,  "im": -3.0 },
  { "n": -1, "re": 5.0,  "im": 3.0 },
  { "n": 2,  "re": 2.0,  "im": -1.0 }
]
```
Each coefficient has:
- n: (angular) frequency  
- re: real part of a complex number
- im: imaginary part of a complex number

### JavaScript Components

```markdown
*drawingContext.js*

#### Handles all canvas coordinate transforms:
- Centers the drawing origin
- Applies zoom and (future) pan
- Clears and resets the canvas each frame
- Converts model‑space to screen‑space

It ensures the Fourier engine draws consistently regardless of canvas size.
```

```markdown
*drawingService.js*

#### The core rendering engine:
- Stores the vector chain
- Updates vector angles each frame
- Accumulates the trace of the endpoint
- Draws grid, axes, vectors, and trace
- Resets state when needed

This is the **runtime** of the Fourier animation.
```

```markdown
*vector.js*

#### Represents a single rotating vector:
- Has magnitude, phase, angular velocity
- Computes its head position based on parent vector
- Draws itself on the canvas
- Updates its angle each frame

Vectors form a linked chain (epicycles).
````

```markdown
*main.js*
#### The application controller:

- Initializes canvas + DrawingContext
- Loads shapes from JSON
- Builds vector chains from Fourier coefficients
- Handles Start / Pause / Reset / Zoom
- Integrates random strategies
- Runs the animation loop

This file ties the UI and engine together.
```

```markdown
*strategy.js*

#### Provides random Fourier coefficient generators:
Random Strategies
Selecting Random in the Shape dropdown chooses one of the built‑in strategies:

- OrganicStrategy — chaotic, natural shapes
- SmoothStrategy — decays with frequency, smoother curves
- SparseStrategy — mostly empty, occasional spikes

Each strategy generates Fourier coefficients procedurally, producing unique shapes every run.
Used when the user selects Random.
```

```markdown
*constants.js`

#### Holds all configurable constants:

- Colors
- Line widths
- Grid spacing
- Default zoom
- Random count of vectors (when selecting Random)

Centralized so the engine is easy to tune.
```

### How to build the container and run the container
Since this uses docker-compose
```text
docker compose up --build
```

### How to run the visualizer
```text
http://localhost:8081
```
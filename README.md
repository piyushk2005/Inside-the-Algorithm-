# Inside the Algorithm

A zero-setup, browser-based visual playground for understanding machine learning — built for **Smackathon PS 02** (SDG 4 · Quality Education).

## Problem

Core ML concepts — gradient descent, decision boundaries, overfitting, neural network basics — are usually taught abstractly through equations and slides. Students can follow the math without ever building real intuition, and setting up a coding environment discourages beginners before they even start.

## Solution

An interactive, no-install browser tool where students watch ML algorithms train in real time. Adjusting parameters like learning rate or model complexity instantly changes decision boundaries, loss curves, and network weights — no coding required.

## Modules

1. **Landing page** — module cards with a Guided Walkthrough / Free Explore toggle
2. **Gradient Descent Visualizer** — loss curve with a rolling-ball animation, learning rate & momentum sliders, convergence/divergence states
3. **Decision Boundary Playground** — click-to-add data points, live-redrawing decision boundary, complexity slider (underfit → overfit)
4. **Overfitting Demonstrator** — train/test split with diverging loss curves
5. **Neural Network Trainer** — node/edge network diagram with weight-based edge styling and forward-pass animation
6. **Shared control panel** — Play / Pause / Step / Reset / speed control, consistent across all modules
7. **Guided walkthrough mode** — scripted step-by-step scenarios per module
8. **Architecture diagram page** — visual breakdown of the simulation pipeline

## Tech stack

- React + Vite
- Client-side only — no backend, all computation runs in the browser

## Getting started

```bash
git clone https://github.com/piyushk2005/Inside-the-Algorithm-.git
cd Inside-the-Algorithm-
npm install
npm run dev
```

## Status

Prototype built for Smackathon show round (Aug 6).
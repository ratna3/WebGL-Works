# Interactive Kaleidoscope Visualization

A beautiful WebGL-based kaleidoscope visualization that responds to mouse movements and user input.

## Files Organization

The project consists of the following files:

- `index.html` - Main HTML file containing the user interface and shader code
- `kaleidoscope.js` - JavaScript that handles WebGL setup and rendering
- `webgl-utils.js` - Utility functions for WebGL (shader compilation, context setup)
- `MV.js` - Matrix and vector operations for WebGL

## How to Run

1. Ensure you have a modern web browser installed (Chrome, Firefox, Edge, etc.)
2. Install the "Live Server" extension for Visual Studio Code
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Click Install on the extension by Ritwick Dey

3. Running the project:
   - Open the project folder in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - The kaleidoscope will open in your default browser

## Features

- Beautiful symmetrical patterns that respond to mouse movements
- Real-time interaction with patterns by moving your mouse
- Multiple color schemes to choose from
- Adjustable symmetry segments
- Animation speed control
- Optimized for performance using WebGL

## Controls

- **Mouse Movement**: Changes the pattern formation
- **Symmetry Segments**: Adjusts the number of segments in the kaleidoscope pattern
- **Animation Speed**: Controls how fast the patterns animate
- **Color Theme**: Changes between Rainbow, Ocean Blues, Warm Sunset, and Electric Neon
- **Reset Button**: Returns all settings to their defaults

## Technical Details

This kaleidoscope visualization uses WebGL fragment shaders to create the kaleidoscope effect. The visualization works by:

1. Creating a full-screen quad as a canvas for the fragment shader
2. Applying mathematical transformations to create symmetry
3. Using mouse position to influence pattern formation
4. Generating colors based on position, time, and user settings

## Credits

Created by Ratna Kirti

## License

This project is open-source and available for personal and educational use.

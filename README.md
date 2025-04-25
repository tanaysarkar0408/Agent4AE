# Agent4AE Plugin

Agent4AE is a plugin designed to simplify scripting for Adobe After Effects by leveraging AI to generate ExtendScript code based on user prompts. It provides a seamless interface for users to create and execute scripts directly in After Effects.

## Features

- **AI-Powered Script Generation**: Uses Google Generative AI (Gemini) to generate ExtendScript code for After Effects.
- **Real-Time Execution**: Execute generated scripts directly in After Effects.
- **User-Friendly Interface**: A React-based UI for entering prompts and viewing results.
- **Predefined Examples**: Handles common After Effects tasks like creating layers, pre-composing, and animations.
- **Dynamic Textarea**: Automatically adjusts the height of the input field based on the content.
- **Preset Application**: Supports applying user presets to layers. Presets must be placed in the "User Presets" subfolder or the default presets folder.

## Project Structure

- **Frontend**: Built with React and TailwindCSS.
- **Backend**: Node.js server using Express to interact with Google Generative AI.
- **Adobe CEP Integration**: Includes a CEP panel for After Effects.

## Setup Instructions

### Prerequisites

- Node.js and npm installed.
- Adobe After Effects installed.
- A valid Google Generative AI API key.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Agent4AE
   ```

2. Install dependencies for both the frontend and backend:
   ```bash
   npm install
   cd Backend
   npm install
   ```

3. Set up the `.env` file in the `Backend` folder:
   ```properties
   GEMINI_API_KEY=your-google-generative-ai-api-key
   ```

4. Start the backend server:
   ```bash
   cd Backend
   npm start
   ```

5. Start the frontend development server:
   ```bash
   cd ..
   npm run dev
   ```

6. Load the plugin in After Effects:
   - Copy the `src/Plugins` folder to the appropriate CEP extensions directory for After Effects.
   - Restart After Effects and enable the plugin from the `Window > Extensions` menu.

## Usage

1. Open the Agent4AE panel in After Effects.
2. Enter a prompt describing the desired action (e.g., "Create a red solid layer named Background").
3. Click "Generate & Run" to execute the script in After Effects.
4. View the result or error feedback in the panel.

### Preset Requirements

- Presets must be placed in the "User Presets" subfolder or the default presets folder for After Effects.
- Example paths:
  - User Presets: `Documents/Adobe/After Effects/User Presets/<subfolder>/<preset>.ffx`
  - Default Presets: `C:/Program Files/Adobe/Adobe After Effects/Support Files/Presets/<subfolder>/<preset>.ffx`

## Examples

### Create a Red Solid Layer
Prompt:
```
Create a red solid layer named Background
```

### Pre-compose All Layers
Prompt:
```
Pre-compose all layers and name it PrecomposeByAgent
```

### Create a Text Layer
Prompt:
```
Create a text layer with text 'Hello'
```

## Development Notes

- **Frontend**: Built with Vite, React, and TailwindCSS. The main entry point is `src/main.jsx`.
- **Backend**: The server is implemented in `Backend/server.js` and communicates with Google Generative AI.
- **CEP Integration**: The plugin's manifest and resources are located in `src/Plugins`.

## Troubleshooting

- Ensure the backend server is running on port 3000.
- Verify the `.env` file contains a valid API key.
- Check After Effects' preferences to allow unsigned extensions if the plugin doesn't appear.

## License

This project is licensed under MIT .

# Agent4AE Plugin for After Effects

## Overview
Agent4AE is a CEP extension for Adobe After Effects that allows users to record audio, transcribe it, and generate After Effects scripts based on voice commands.

## Installation

### Step 1: Locate the CEP Extensions Directory
- **Windows**: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions`
- **macOS**: `/Library/Application Support/Adobe/CEP/extensions`

If the `extensions` folder doesn’t exist, create it.

### Step 2: Install the Plugin
1. Download the `src/Plugins` folder.
2. Copy the entire `src/Plugins` folder into the CEP extensions directory:
   - Windows: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\Agent4AE`
   - macOS: `/Library/Application Support/Adobe/CEP/extensions/Agent4AE`

### Step 3: Enable Scripting in After Effects
1. Open After Effects.
2. Go to `Edit > Preferences > Scripting & Expressions`.
3. Check `Allow Scripts to Write Files and Access Network`.
4. Restart After Effects.

### Step 4: Install ffmpeg
The plugin uses `ffmpeg` for audio processing. Follow the instructions in `install_ffmpeg.md` to install `ffmpeg` and add it to your system PATH.

### Step 5: Grant Microphone Access
Ensure After Effects has microphone access:
- **Windows**: Settings > Privacy > Microphone > Allow apps to access your microphone.
- **macOS**: System Preferences > Security & Privacy > Microphone > Enable for After Effects.

## Usage
1. Open After Effects.
2. Go to `Window > Extensions > Agent4AE` to open the panel.
3. Click "Start Recording" or press Ctrl+L to record audio.
4. Speak your command (e.g., "Hey Jarvis create a layer of black colour").
5. The plugin will transcribe the audio and execute the command in After Effects.
6. Check the After Effects Script Editor (`File > Scripts > Open Script Editor`) for debug logs.

## Troubleshooting
- **CSInterface is undefined**: Ensure `CSInterface.js` is in the `client/` folder. Check the browser console (F12) for 404 errors.
- **Python script failed**: Verify `ffmpeg` is installed and in PATH. Check the After Effects console for error messages.
- **Audio file not found**: Confirm the WAV file exists in `Documents/Agent4AERecordings`.

## Support
For issues, contact [your contact information].
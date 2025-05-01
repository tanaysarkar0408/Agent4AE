# Agent4AE Extension Setup Guide

Welcome to **Agent4AE**, a CEP extension for Adobe After Effects that enables script execution via text prompts or voice commands. This extension includes a pre-bundled Python virtual environment (venv) for audio recording and transcription. This guide explains how to set up the extension and install `ffmpeg`, the only external dependency.

## Prerequisites
- **Adobe After Effects**: Version 2019 or later.
- **Windows**: Tested on Windows 10/11.
- **Administrator Access**: Required to install the extension and modify system PATH (optional for `ffmpeg`).

## Step 1: Install the Extension
1. **Download the Extension**:
   - Obtain the `com.PLUGINS.aeplugin` folder from the distribution package.

2. **Place the Extension**:
   - Copy the `com.PLUGINS.aeplugin` folder to:
     ```
     C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\
     ```
   - If the `extensions` folder doesn’t exist, create it.

3. **Verify Extension Structure**:
   Ensure the folder contains:
   ```
   com.PLUGINS.aeplugin/
   ├── CSXS/
   │   └── manifest.xml
   |── host/
   |   └── main.jsx
   ├── src/
   │   ├── ui.html
   │   ├── main.js
   │   └── CSInterface.js
   ├── server/
   │   ├── venv/
   │   │   ├── Scripts/
   │   │   │   └── python.exe
   │   │   └── Lib/
   │   │       └── site-packages/
   │   └── audio_recorder/
   │       ├── audio_recorder.py
   │       └── audio_transcribe.py
   ├── ffmpeg/
   │   └── ffmpeg.exe
   ```

## Step 2: Install ffmpeg
The extension uses `ffmpeg` for audio processing, included in the `ffmpeg/` folder. You may need to add it to your system PATH or rely on the bundled version.

1. **Option 1: Use Bundled ffmpeg** (Recommended):
   - The extension is configured to use `ffmpeg.exe` in:
     ```
     C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.PLUGINS.aeplugin\ffmpeg\
     ```
   - No additional setup is needed unless you encounter issues.

2. **Option 2: Install ffmpeg System-Wide**:
   - Download ffmpeg from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) (`ffmpeg-release-essentials.zip`).
   - Extract to `C:\ffmpeg`.
   - Add to system PATH:
     - Right-click **This PC** > **Properties** > **Advanced system settings** > **Environment Variables**.
     - Under **System Variables**, edit `Path`, add:
       ```
       C:\ffmpeg\bin
       ```
     - Click **OK**.
   - Verify:
     ```cmd
     ffmpeg -version
     ```

## Step 3: Enable After Effects Permissions
1. **Allow Scripting**:
   - In After Effects, go to **Edit > Preferences > Scripting & Expressions**.
   - Check **Allow Scripts to Write Files and Access Network**.

2. **Grant Microphone Access**:
   - Ensure Windows allows microphone access:
     - Go to **Settings > Privacy > Microphone**.
     - Enable **Allow apps to access your microphone**.

## Step 4: Test the Extension
1. **Open After Effects**:
   - Launch After Effects and go to **Window > Extensions > Agent4AE**.

2. **Test Text Prompts**:
   - Type a prompt (e.g., "Create a black solid layer") in the textarea.
   - Press **Ctrl+Enter** or click **Execute**.
   - Verify the script runs and feedback appears in the panel.

3. **Test Voice Commands**:
   - Click **Start Recording** or press **Ctrl+L**.
   - Speak a command (e.g., "Hey Jarvis create a black solid layer").
   - After 5 seconds, check:
     - The textarea shows the transcript.
     - The audio file is saved in `Documents\Agent4AERecordings`.
     - The audio is imported into the "Audio Recordings" folder in After Effects.
     - If the command starts with "Hey Jarvis," the script executes.

## Troubleshooting
- **Python Errors**:
  - If you see errors like `No such file or directory`:
    - Verify the venv exists at `com.PLUGINS.aeplugin\server\venv\`.
    - Check the After Effects console (`File > Scripts > Open Script Editor`) for logged paths:
      ```
      Python path: C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.PLUGINS.aeplugin\server\venv\Scripts\python.exe
      Transcription script path: C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.PLUGINS.aeplugin\server\audio_recorder\audio_transcribe.py
      ```
    - Test manually:
      ```cmd
      "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.PLUGINS.aeplugin\server\venv\Scripts\python.exe" "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.PLUGINS.aeplugin\server\audio_recorder\audio_transcribe.py" test.wav
      ```

- **ffmpeg Warning**:
  - If you see `Couldn't find ffmpeg or avconv`:
    - Ensure `ffmpeg.exe` is in `com.PLUGINS.aeplugin\ffmpeg\`.
    - Alternatively, install ffmpeg system-wide (Step 2, Option 2).
    - Verify the `audio_transcribe.py` path to ffmpeg is correct.

- **Transcription Issues**:
  - If transcription fails, check the console for errors.
  - Ensure your microphone is working and After Effects has access.

## Support
For issues, contact [your contact info or support channel]. Provide:
- After Effects version.
- Console output from the Script Editor.
- Error messages.

Thank you for using Agent4AE!
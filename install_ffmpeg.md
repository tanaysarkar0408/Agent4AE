# Installing ffmpeg for Agent4AE

The Agent4AE plugin requires `ffmpeg` for audio processing. Follow these steps to install `ffmpeg` and add it to your system PATH.

## Windows

1. **Download ffmpeg**:

   - Go to https://ffmpeg.org/download.html.
   - Download the Windows build (e.g., from gyan.dev: https://www.gyan.dev/ffmpeg/builds/).
   - Choose the "ffmpeg-release-essentials.zip" or similar package.

2. **Extract the Files**:

   - Extract the ZIP file to a folder, e.g., `C:\ffmpeg`.

3. **Add ffmpeg to PATH**:

   - Right-click the Start button and select `System`.
   - Click `Advanced system settings` &gt; `Environment Variables`.
   - Under "System variables," find `Path` and click `Edit`.
   - Click `New` and add `C:\ffmpeg\bin`.
   - Click `OK` to close all dialogs.

4. **Verify Installation**:

   - Open a Command Prompt (`cmd`).

   - Run:

     ```
     ffmpeg -version
     ```

   - You should see the `ffmpeg` version information.

## macOS

1. **Install Homebrew** (if not already installed):

   - Open Terminal and run:

     ```
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```

2. **Install ffmpeg**:

   - Run:

     ```
     brew install ffmpeg
     ```

3. **Verify Installation**:

   - Run:

     ```
     ffmpeg -version
     ```

   - You should see the `ffmpeg` version information.

## Linux

1. **Install ffmpeg**:

   - Open a terminal.

   - For Ubuntu/Debian:

     ```
     sudo apt-get update
     sudo apt-get install ffmpeg
     ```

   - For Fedora:

     ```
     sudo dnf install ffmpeg
     ```

   - For CentOS:

     ```
     sudo yum install ffmpeg
     ```

2. **Verify Installation**:

   - Run:

     ```
     ffmpeg -version
     ```

   - You should see the `ffmpeg` version information.

## Troubleshooting

- If `ffmpeg -version` fails, ensure the path is correctly added to your system PATH.
- Restart your terminal or computer after adding `ffmpeg` to PATH.
- If issues persist, download a different `ffmpeg` build or consult the `ffmpeg` documentation: https://ffmpeg.org/documentation.html.
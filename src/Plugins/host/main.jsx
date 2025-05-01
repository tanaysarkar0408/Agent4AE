function startRecording() {
    try {
        // Define recordings directory
        var recordingsDir = Folder.myDocuments.fsName + "/Agent4AERecordings";
        var recordingsFolder = new Folder(recordingsDir);
        if (!recordingsFolder.exists) {
            recordingsFolder.create();
        }
        var audioFilePath = recordingsDir + "/recording_" + new Date().getTime() + ".wav";

       // Path to Python script in extension directory
       var pythonScriptPath = "C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\<YOUR_FOLDER_NAME>\\server\\audio_recorder\\audio_recorder.py";

        // Construct command to run Python script
        var command = 'python "' + pythonScriptPath + '" "' + audioFilePath + '"';

        // Execute Python script
        var result = system.callSystem(command);
        
        // Check if audio file was created
        var audioFile = new File(audioFilePath);
        if (audioFile.exists) {
            // Import audio into After Effects and store in folder
            try {
                app.beginUndoGroup("Import Audio");
                // Find or create "Audio Recordings" folder
                var audioFolder = null;
                for (var i = 1; i <= app.project.items.length; i++) {
                    if (app.project.items[i].name === "Audio Recordings" && app.project.items[i] instanceof FolderItem) {
                        audioFolder = app.project.items[i];
                        break;
                    }
                }
                if (!audioFolder) {
                    audioFolder = app.project.items.addFolder("Audio Recordings");
                }
                // Import audio
                var importOptions = new ImportOptions(audioFile);
                var audioItem = app.project.importFile(importOptions);
                // Move audio to folder
                audioItem.parentFolder = audioFolder;
                $.writeln("Audio imported successfully");
            } catch (e) {
                $.writeln("Error importing audio: " + e.toString());
            } finally {
                app.endUndoGroup();
            }

            return JSON.stringify({
                status: "success",
                audioFilePath: audioFilePath
            });
        } else {
            return JSON.stringify({
                status: "error",
                message: "Failed to create audio file: " + result
            });
        }
    } catch (e) {
        return JSON.stringify({
            status: "error",
            message: "Failed to start recording: " + e.toString()
        });
    }
}

function stopRecording(audioFilePath) {
    try {
        // Check if file exists
        var audioFile = new File(audioFilePath);
        if (!audioFile.exists) {
            return JSON.stringify({
                status: "error",
                message: "Audio file not found"
            });
        }
        
        return JSON.stringify({
            status: "success",
            audioFilePath: audioFilePath
        });
    } catch (e) {
        return JSON.stringify({
            status: "error",
            message: "Failed to verify recording: " + e.toString()
        });
    }
}

function transcribeAudio(audioFilePath) {
    try {
        // Path to Python transcription script
        var pythonScriptPath = "C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\<YOUR_FOLDER_NAME>\\server\\audio_recorder\\audio_transcribe.py";

        // Construct command to run Python script
        var command = 'python "' + pythonScriptPath + '" "' + audioFilePath + '"';

        // Execute Python script and capture output
        var result = system.callSystem(command);
        alert("RESULT from jsx - " + result);
        // // Check if result is valid
        // if (!result || result === "") {
        //     var errorMsg = "Error: Transcription failed; no output from script";
        //     $.writeln(errorMsg);
        //     return errorMsg;
        // }

        // // Split output to handle WAV Info and transcript
        // var lines = result.split("\n");
        // var transcript = lines[lines.length - 1].trim(); // Last line is the transcript

        // if (transcript.indexOf("Error") === 0) {
        //     $.writeln("Transcription error: " + transcript);
        //     return transcript;
        // }

        // $.writeln("Transcription result: " + transcript);
        return result;
    } catch (e) {
        var errorMsg = "Error: Transcription failed; " + e.toString();
        $.writeln(errorMsg);
        return errorMsg;
    }
}

function readAudioFile(filePath) {
    try {
        var file = new File(filePath);
        if (!file.exists) {
            return "Error: File not found";
        }
        file.encoding = "BINARY";
        file.open("r");
        var content = file.read();
        file.close();
        // Convert to base64
        return encodeBase64(content);
    } catch (e) {
        return "Error: " + e.toString();
    }
}

function encodeBase64(binary) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var result = "";
    var i = 0;
    while (i < binary.length) {
        var a = binary.charCodeAt(i++);
        var b = i < binary.length ? binary.charCodeAt(i++) : NaN;
        var c = i < binary.length ? binary.charCodeAt(i++) : NaN;
        var n = (a << 16) | (b << 8) | c;
        result += chars[(n >> 18) & 63] + chars[(n >> 12) & 63] +
                  (isNaN(b) ? "=" : chars[(n >> 6) & 63]) +
                  (isNaN(c) ? "=" : chars[n & 63]);
    }
    return result;
}

function runScriptInAE(script) {
    try {
        eval(script);
        return "Script executed successfully";
    } catch (e) {
        return "Error: " + e.toString();
    }
}
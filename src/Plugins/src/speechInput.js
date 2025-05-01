/**
 * speechInput.js
 * Adds speech-to-text functionality to Agent4AE After Effects CEP panel.
 * Press Ctrl + L to toggle microphone and transcribe into the prompt textarea.
 * Requirements:
 * - CEP panel with ui.html containing a textarea (id="prompt")
 * - After Effects CC 2019 or later
 * Instructions:
 * 1. Place this file in the CEP extension’s js folder (e.g., client/js/).
 * 2. Include in ui.html via <script src="speechInput.js"></script>.
 * 3. Ensure ui.html has <button id="micButton"> and <span id="micStatus">.
 */

(function() {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        document.getElementById('feedback').innerText = 'Speech Recognition API not supported in this version of After Effects.';
        document.getElementById('feedback').classList.add('error');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let isListening = false;
    const textarea = document.getElementById('prompt');
    const micStatus = document.getElementById('micStatus');
    const feedback = document.getElementById('feedback');

    // Update mic status UI
    function updateMicStatus() {
        if (micStatus) {
            micStatus.textContent = isListening ? '🎙️ Listening...' : '🎙️ Mic Off';
            micStatus.style.color = isListening ? 'green' : 'red';
        }
    }

    // Handle transcription results
    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        if (textarea) {
            textarea.value = finalTranscript + interimTranscript;
            textarea.scrollTop = textarea.scrollHeight; // Auto-scroll to bottom
            // Trigger textarea height adjustment
            textarea.dispatchEvent(new Event('input'));
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        updateMicStatus();
        if (feedback) {
            feedback.innerText = `Speech recognition error: ${event.error}`;
            feedback.classList.add('error');
        }
    };

    recognition.onend = function() {
        isListening = false;
        updateMicStatus();
    };

    // Toggle speech recognition
    function toggleSpeechRecognition() {
        if (!textarea) {
            if (feedback) {
                feedback.innerText = 'Textarea with id="prompt" not found.';
                feedback.classList.add('error');
            }
            return;
        }

        if (isListening) {
            recognition.stop();
            if (feedback) {
                feedback.innerText = 'Microphone stopped.';
                feedback.classList.remove('error');
            }
        } else {
            try {
                recognition.start();
                if (feedback) {
                    feedback.innerText = 'Microphone active. Speak now.';
                    feedback.classList.remove('error');
                }
            } catch (e) {
                feedback.innerText = `Error starting microphone: ${e.message}`;
                feedback.classList.add('error');
            }
        }
        isListening = !isListening;
        updateMicStatus();
    }

    // Keybinding for Ctrl + L
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key.toLowerCase() === 'l') {
            event.preventDefault(); // Prevent default After Effects shortcuts
            toggleSpeechRecognition();
        }
    });

    // Mic button click handler
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.addEventListener('click', toggleSpeechRecognition);
    }

    // Initialize mic status
    updateMicStatus();
})();
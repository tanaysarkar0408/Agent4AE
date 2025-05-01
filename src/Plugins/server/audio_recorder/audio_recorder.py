# import sys
# import sounddevice as sd
# import scipy.io.wavfile as wavfile
# import numpy as np

# def record_audio(output_path, duration=3, samplerate=44100):
#     print("Recording...")
#     recording = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1)
#     sd.wait()  # Wait until recording is finished
#     print("Recording finished")
#     wavfile.write(output_path, samplerate, recording)

# if __name__ == "__main__":
#     output_path = sys.argv[1]
#     record_audio(output_path)

import sys
import sounddevice as sd
import scipy.io.wavfile as wavfile
import numpy as np

def record_audio(output_path, duration=3, samplerate=44100):
    """
    Record audio and save as a PCM WAV file.
    
    Args:
        output_path (str): Path to save the WAV file.
        duration (float): Recording duration in seconds.
        samplerate (int): Sample rate in Hz.
    """
    print("Recording...")
    # Record mono audio (1 channel)
    recording = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='int16')
    sd.wait()  # Wait until recording is finished
    print("Recording finished")
    # Ensure 16-bit PCM format
    wavfile.write(output_path, samplerate, recording)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No output file specified")
        sys.exit(1)
    
    output_path = sys.argv[1]
    record_audio(output_path)
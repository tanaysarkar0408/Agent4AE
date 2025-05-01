# import sys
# import speech_recognition as sr
# import os
# import wave
# import tempfile
# from pydub import AudioSegment

# def inspect_wav_file(input_path):
#     """
#     Inspect WAV file properties (sample rate, channels, sample width).
    
#     Args:
#         input_path (str): Path to the WAV file.
    
#     Returns:
#         dict: WAV file properties or error message.
#     """
#     try:
#         with wave.open(input_path, 'rb') as wav_file:
#             return {
#                 "channels": wav_file.getnchannels(),
#                 "sample_rate": wav_file.getframerate(),
#                 "sample_width": wav_file.getsampwidth() * 8,  # Convert bytes to bits
#                 "frames": wav_file.getnframes(),
#                 "duration_seconds": wav_file.getnframes() / wav_file.getframerate()
#             }
#     except wave.Error as e:
#         return f"Error: Invalid WAV file; {str(e)}"
#     except Exception as e:
#         return f"Error: Could not inspect WAV file; {str(e)}"

# def convert_to_compatible_wav(input_path, output_path):
#     """
#     Convert WAV file to a compatible PCM WAV format using pydub.
    
#     Args:
#         input_path (str): Path to the input WAV file.
#         output_path (str): Path to save the converted WAV file.
    
#     Returns:
#         bool: True if conversion succeeded, False otherwise.
#     """
#     try:
#         audio = AudioSegment.from_file(input_path, format="wav")
#         audio = audio.set_channels(1).set_frame_rate(16000).set_sample_width(2)  # Mono, 16kHz, 16-bit
#         audio.export(output_path, format="wav")
#         return True
#     except Exception as e:
#         print(f"Error: Conversion failed; {str(e)}")
#         return False

# def transcribe_audio(input_path):
#     """
#     Transcribe a WAV audio file to text using Google's Speech Recognition API.
    
#     Args:
#         input_path (str): Path to the input WAV file.
    
#     Returns:
#         str: Transcribed text or error message.
#     """
#     # Check if the input file exists
#     if not os.path.exists(input_path):
#         return "Error: Audio file not found"

#     # Inspect WAV file properties
#     wav_info = inspect_wav_file(input_path)
#     if isinstance(wav_info, str):
#         return wav_info
#     print(f"WAV Info: Channels={wav_info['channels']}, Sample Rate={wav_info['sample_rate']} Hz, "
#           f"Sample Width={wav_info['sample_width']} bits, Duration={wav_info['duration_seconds']:.2f} seconds")

#     # Initialize recognizer
#     recognizer = sr.Recognizer()

#     # Try transcribing the original file
#     try:
#         with sr.AudioFile(input_path) as source:
#             recognizer.adjust_for_ambient_noise(source)
#             audio = recognizer.record(source)
#         transcript = recognizer.recognize_google(audio, language="en-US")
#         return transcript.strip()
#     except sr.UnknownValueError:
#         error_msg = "Error: Could not understand audio"
#     except sr.RequestError as e:
#         error_msg = f"Error: Could not request results; {str(e)}"
#     except Exception as e:
#         error_msg = f"Error: Transcription failed; {str(e)}"

#     # If transcription fails, try converting to a compatible format
#     print(f"Transcription attempt failed: {error_msg}. Attempting format conversion...")
#     with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
#         temp_path = temp_file.name
#     if convert_to_compatible_wav(input_path, temp_path):
#         try:
#             with sr.AudioFile(temp_path) as source:
#                 recognizer.adjust_for_ambient_noise(source)
#                 audio = recognizer.record(source)
#             transcript = recognizer.recognize_google(audio, language="en-US")
#             os.unlink(temp_path)  # Clean up temporary file
#             return transcript.strip()
#         except sr.UnknownValueError:
#             error_msg = "Error: Could not understand audio after conversion"
#         except sr.RequestError as e:
#             error_msg = f"Error: Could not request results after conversion; {str(e)}"
#         except Exception as e:
#             error_msg = f"Error: Transcription failed after conversion; {str(e)}"
#         finally:
#             if os.path.exists(temp_path):
#                 os.unlink(temp_path)  # Ensure cleanup
#     else:
#         error_msg = "Error: Could not convert audio to compatible format"

#     return error_msg

# if __name__ == "__main__":
#     # Check for input file argument
#     if len(sys.argv) < 2:
#         print("Error: No input file specified")
#         sys.exit(1)

#     input_path = sys.argv[1]
#     result = transcribe_audio(input_path)
#     print(result)

import sys
import speech_recognition as sr
import os
import wave
import tempfile
from pydub import AudioSegment

def inspect_wav_file(input_path):
    try:
        with wave.open(input_path, 'rb') as wav_file:
            return {
                "channels": wav_file.getnchannels(),
                "sample_rate": wav_file.getframerate(),
                "sample_width": wav_file.getsampwidth() * 8,  # Convert bytes to bits
                "frames": wav_file.getnframes(),
                "duration_seconds": wav_file.getnframes() / wav_file.getframerate()
            }
    except wave.Error as e:
        return f"Error: Invalid WAV file; {str(e)}"
    except Exception as e:
        return f"Error: Could not inspect WAV file; {str(e)}"

def convert_to_compatible_wav(input_path, output_path):
    try:
        audio = AudioSegment.from_file(input_path)
        audio = audio.set_frame_rate(44100)
        audio = audio.set_channels(1)
        audio = audio.set_sample_width(2)  # 16-bit
        audio.export(output_path, format="wav")
        return output_path
    except Exception as e:
        return f"Error: Could not convert audio: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Audio file path not provided.")
        sys.exit(1)

    audio_file_path = sys.argv[1]

    # Inspect the WAV file (you can keep this for debugging if needed, but don't print in final version)
    # wav_info = inspect_wav_file(audio_file_path)
    # if isinstance(wav_info, str) and wav_info.startswith("Error"):
    #     print(wav_info)
    #     sys.exit(1)
    # else:
    #     print(f"WAV Info: Channels={wav_info['channels']}, Sample Rate={wav_info['sample_rate']} Hz, Sample Width={wav_info['sample_width']} bits, Duration={wav_info['duration_seconds']:.2f} seconds")

    r = sr.Recognizer()
    try:
        # Ensure the audio is in a compatible format (16kHz mono)
        with sr.AudioFile(audio_file_path) as source:
            audio_data = r.record(source)
            try:
                text = r.recognize_google(audio_data)
                print(text)  # Print ONLY the transcribed text
            except sr.UnknownValueError:
                print("Error: Could not understand audio")
            except sr.RequestError as e:
                print(f"Error: Could not request results from Google Speech Recognition service; {e}")
    except FileNotFoundError:
        print(f"Error: Audio file not found at {audio_file_path}")
    except Exception as e:
        print(f"Error during transcription: {e}")
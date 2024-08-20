import re
from openai import OpenAI
client = OpenAI(api_key="sk-Wegv8aa0K2lVdchDCaWSvPSr8hx7xrOJ6-Fr3O93GoT3BlbkFJr8QcaCm044OJT6XO39UM4PW-z6BjlXyuhcNlbN06MA")

def is_draw_request(text):
    """
    This function checks if the given text is asking to draw something.
    
    Args:
    text (str): The input text to check.

    Returns:
    bool: True if the text is asking to draw something, False otherwise.
    """
    # Keywords and phrases that typically indicate a drawing request
    draw_keywords = [
        "draw", "illustrate", "sketch", "depict", 
        "create an image of", "generate an illustration of",
        "make a drawing of", "visualize", "paint"
    ]

    # Convert the text to lowercase for case-insensitive comparison
    text_lower = text.lower()

    # Check if any of the draw keywords are present in the text
    for keyword in draw_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
            return True
    
    # Additional context checks
    context_phrases = [
        "could you", "please", "i would like you to", "can you"
    ]
    
    for phrase in context_phrases:
        if phrase in text_lower:
            for keyword in draw_keywords:
                if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
                    return True
    
    return False

def is_tts_request(text):
    """
    This function checks if the given text is asking for text-to-speech (TTS) audio.
    
    Args:
    text (str): The input text to check.

    Returns:
    bool: True if the text is asking for TTS audio, False otherwise.
    """
    # Keywords and phrases that typically indicate a TTS request
    tts_keywords = [
        "text-to-speech", "tts", "convert to audio", 
        "read aloud", "speak", "narrate", "speak this", 
        "audio version", "voice this", "read this text"
    ]

    # Convert the text to lowercase for case-insensitive comparison
    text_lower = text.lower()

    # Check if any of the TTS keywords are present in the text
    for keyword in tts_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
            return True

    # Additional context checks
    context_phrases = [
        "could you", "please", "i would like you to", "can you"
    ]
    
    for phrase in context_phrases:
        if phrase in text_lower:
            for keyword in tts_keywords:
                if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
                    return True
                
    return False

def ImgaeGeneration(prompt):
  """
    This function generates an image based on a prompt.
    
    Args:
    prompt (str): Prompt to generate image from.

    Returns:
    str: Image URL. Can be downloaded as well for storing. 
    """
  response = client.images.generate(
      model="dall-e-3",
      prompt=prompt,
      size="1024x1024",
      quality="standard",
      n=1,
    )

  image_url = response.data[0].url
  return image_url

def VoiceGeneration(prompt):
    """
    This function generates audio reading the prompt out loud.
    
    Args:
    prompt (str): Prompt to read from.

    Returns:
    str: path to audio file 
    Audio file is downloaded into current dir.
    The name of the file is result.mp3 
    """
    audioFile = "result.mp3"
    with client.audio.speech.with_streaming_response.create(
        model="tts-1",
        voice="alloy",
        input=prompt,
    ) as response:
        response.stream_to_file(audioFile)

    return audioFile


messages = []
messages.append({"role": "system", "content": "you are a helpful assistant"})

print("Your new assistant is ready!")
while input != "quit()":
    message = input()
    messages.append({"role": "user", "content": message})
    if(is_draw_request(message)): 
        reply = ImgaeGeneration(message)
    elif (is_tts_request(message)): 
        reply = VoiceGeneration(message)
    else:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages)
        reply = response.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    print("\n" + reply + "\n")


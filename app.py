from flask import Flask, request, jsonify
from chatbot import is_draw_request, is_tts_request, ImgaeGeneration, VoiceGeneration
from openai import OpenAI

app = Flask(__name__)
client = OpenAI()

messages = []
messages.append({"role": "system", "content": "you are a helpful assistant"})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data['message']

    messages.append({"role": "user", "content": user_message})

    if is_draw_request(user_message):
        reply = ImgaeGeneration(user_message)
    elif is_tts_request(user_message):
        reply = VoiceGeneration(user_message)
    else:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages)
        reply = response.choices[0].message.content
    
    messages.append({"role": "assistant", "content": reply})
    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True)

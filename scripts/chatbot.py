import sys
import json
import urllib.request
import urllib.error

def generate_response(prompt):
    url = "http://localhost:11434/api/generate"
    
    system_prompt = "You are a helpful AI business assistant. You help small business owners understand how AI and automation can save them time and money. Be concise, friendly, and practical. Do not use overly complex jargon."
    
    full_prompt = f"{system_prompt}\n\nUser: {prompt}\nAI:"

    data = {
        "model": "llama3:latest",
        "prompt": full_prompt,
        "stream": False
    }

    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get("response", "Sorry, I couldn't generate a response.")
    except urllib.error.URLError as e:
        return f"Error communicating with local AI model: {e}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_message = sys.argv[1]
    else:
        user_message = "Hello!"
        
    ai_response = generate_response(user_message)
    print(json.dumps({"response": ai_response}))

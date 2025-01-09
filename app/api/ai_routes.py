from flask import Blueprint, request, jsonify
import json
import os
from dotenv import load_dotenv 
from openai import OpenAI

load_dotenv()
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')

client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")

ai_routes = Blueprint('ai', __name__)


@ai_routes.route('/recommendations', methods=['POST'])
def get_stock_recommendations():
    data = request.json
    user_query = data.get('query', '')

    user_query = "I would like to inquire about information in the stock consulting field. Please provide a concise and clear answer of around 100 words. Here is my question:" + user_query

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",  
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_query}
            ],
            stream=False
        )

        return jsonify(response.choices[0].message.content), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
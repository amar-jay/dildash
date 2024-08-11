"""
@author: amar-jay
"""

from flask import Flask, request, jsonify
from flask.wrappers import json
from flask_cors import CORS
from ollama import generate_conversation_and_questions, parse_questions
from db import DB_NAME, add_conversation, get_all_conversations, get_conversation
import sqlite3


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/generate', methods=['GET'])
def generate():
    """
    generate a conversation and questions
    params: num_speaker (int), level (int)
    """

    num_speakers = request.args.get('num_speakers', default=2, type=int) # ?num_speaker=2
    level_idx = request.args.get('level', default=1, type=int) # ?level=1
    length = request.args.get('length', default=10, type=int)
    num_questions = request.args.get('num_questions', default=5, type=int)

    if num_speakers< 0 or num_speakers> 3:
        return jsonify({"error": "Invalid number of speakers. Choose 1, 2, or 3."}), 400

    if level_idx < 0 or level_idx > 3:
        return jsonify({"error": "Invalid level. Choose a level between 1 and 4."}), 400

    topic, conversation, questions = generate_conversation_and_questions(num_speakers, num_questions, level_idx, length)

    parsed_questions = parse_questions(questions)
    conn = sqlite3.connect(DB_NAME)
    # Save the generated data to the database
    add_conversation(conn, num_speakers, level_idx, topic, conversation, parsed_questions)
    conn.close()

    return jsonify({
        "conversation": conversation,
        "questions": questions
    })


@app.route('/conversations/add_random', methods=['GET'])
def add_random_conversation():
    num_speakers = 2
    level = 1
    topic = "Science"
    with open('sample.txt', 'r') as f:
        text = f.read()
        no_head_text = text.split("CONVERSATIONS:\n")[1] # removed heading
        conversation, questions = no_head_text.split("QUESTIONS:\n")
        parsed_questions = json.loads(questions.strip())
    conversation = conversation.strip()

    conn = sqlite3.connect(DB_NAME)

    # Save the generated data to the database
    add_conversation(conn, num_speakers, level, topic, conversation, parsed_questions)
    conn.close()
    return jsonify({
        "conversation": conversation,
        "questions": questions
    })


# get conversations from the database
@app.route('/conversations/<int:conversation_id>', methods=['GET'])
def get_conversation_(conversation_id):
    conn = sqlite3.connect('dildash.db')
    conversation = get_conversation(conn, conversation_id)
    conn.close()
    return jsonify(conversation)


@app.route('/conversations', methods=['GET'])
def get_conversations():
    conn = sqlite3.connect('dildash.db')
    conversations = get_all_conversations(conn)
    conn.close()

    return jsonify(conversations)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


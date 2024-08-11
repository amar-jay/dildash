"""
@author: amar-jay
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from ollama import generate_conversation_and_questions
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def save_to_database(num_speaker, level, topic, conversation, questions):
    conn = sqlite3.connect('dildash.db')
    cursor = conn.cursor()

    cursor.execute('''
    INSERT INTO conversations (num_speaker, level, topic, conversation, questions)
    VALUES (?, ?, ?, ?, ?)
    ''', (num_speaker, level, topic, conversation, questions))

    conn.commit()
    conn.close()

@app.route('/generate', methods=['GET'])
def generate():
    """
    generate a conversation and questions
    params: num_speaker (int), level (int)
    """

    num_speaker = request.args.get('num_speaker', default=2, type=int) # ?num_speaker=2
    level = request.args.get('level', default=1, type=int) # ?level=1

    if num_speaker< 0 or num_speaker> 3:
        return jsonify({"error": "Invalid number of speakers. Choose 1, 2, or 3."}), 400

    if level < 0 or level > 3:
        return jsonify({"error": "Invalid level. Choose a level between 1 and 4."}), 400

    topic, conversation, questions = generate_conversation_and_questions(num_speaker, level)

    # Save the generated data to the database
    save_to_database(num_speaker, level, topic, conversation, questions)

    return jsonify({
        "conversation": conversation,
        "questions": questions
    })


@app.route('/conversations/add_random', methods=['GET'])
def add_random_conversation():
    num_speaker = 2
    level = 1
    topic = "Science"
    conversation = "Jamie: No, what happened?\nAlex: Scientists at CERN discovered a new type of subatomic particle that could change our understanding of the fundamental forces of the universe.\nJamie: That's incredible! What exactly did they find?\nAlex: They found evidence of a particle called a tetraquark. Unlike regular particles made of three quarks, this one is made of four."
    questions = "Jamie: What did scientists at CERN discover?\nJamie: What could the new subatomic particle change?\nJamie: What is the new subatomic particle called?\nJamie: How many quarks does the new particle have?\nJamie: How many quarks do regular particles have?"

    save_to_database(num_speaker, level, topic, conversation, questions)
    return jsonify({
        "conversation": conversation,
        "questions": questions
    })


# get conversations from the database
@app.route('/conversations/<int:conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    conn = sqlite3.connect('dildash.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, num_speaker, level, topic, conversation, questions FROM conversations WHERE id = ?', (conversation_id,))
    row = cursor.fetchone()
    if row is None:
        return jsonify({"error": "Conversation not found"}), 404

    conversation = {
        "id": row[0],
        "num_speaker": row[1],
        "level": row[2],
        "topic": row[3],
        "conversation": row[4],
        "questions": row[5]
    }
    conn.close()
    return jsonify(conversation)


@app.route('/conversations', methods=['GET'])
def get_all_conversations():
    conn = sqlite3.connect('dildash.db')
    cursor = conn.cursor()

    cursor.execute('SELECT id, num_speaker, level, topic, conversation, questions FROM conversations')
    rows = cursor.fetchall()

    # Convert rows to a list of dictionaries
    conversations = [
        {
            "id": row[0],
            "num_speaker": row[1],
            "level": row[2],
            "topic": row[3],
            "conversation": row[4],
            "questions": row[5]
        }
        for row in rows
    ]

    conn.close()

    return jsonify(conversations)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


"""
@author: amar-jay
"""
import sqlite3
from sqlite3 import Connection


DB_NAME='dildash.db'

def save_to_database(conn:Connection, num_speaker, level, topic, conversation, questions, correct_answer):
    """
    @deprecated Use add_conversation instead.
    """

    cursor = conn.cursor()

    cursor.execute('''
    INSERT INTO conversations (num_speaker, level, topic, conversation, questions, correct_answer)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (num_speaker, level, topic, conversation, questions, correct_answer))

    conn.commit()


def add_conversation(conn:Connection, num_speakers, level, topic, conversation_text, questions):
    """
    Add a conversation and its related questions, options, and correct answers to the database.

    :param conn: SQLite database connection object.
    :param num_speakers: Number of speakers in the conversation.
    :param level: Difficulty level of the conversation.
    :param topic: Topic of the conversation.
    :param conversation_text: The actual conversation text.
    :param questions: A list of dictionaries representing questions. Each dictionary should have keys:
                      'question' (str), 'options' (list of str), and 'correct_answer' (str).
    """


    try:

        cursor = conn.cursor()

        # Insert the conversation
        cursor.execute('''
            INSERT INTO Conversations (num_speakers, level, topic, conversation)
            VALUES (?, ?, ?, ?)
        ''', (num_speakers, level, topic, conversation_text))
        
        # Get the conversation ID
        conversation_id = cursor.lastrowid

        # Insert questions and their related data
        for question_data in questions:
            question_text = question_data['question']
            options = question_data['options']
            correct_answer = question_data['correct_answer']

            # Insert the correct answer
            cursor.execute('''
                INSERT INTO CorrectAnswer (_index, value)
                VALUES (?, ?)
            ''', (correct_answer['index'], correct_answer['value']))
            
            # Get the correct answer ID
            correct_answer_id = cursor.lastrowid

            # Insert the question
            cursor.execute('''
                INSERT INTO Question (question, correct_answer_id)
                VALUES (?, ?)
            ''', (question_text, correct_answer_id))
            
            # Get the question ID
            question_id = cursor.lastrowid

            # Link the question with the conversation
            cursor.execute('''
                INSERT INTO ConversationQuestions (conversation_id, question_id)
                VALUES (?, ?)
            ''', (conversation_id, question_id))

            # Insert options and link them with the question
            for idx, option_value in enumerate(options):
                cursor.execute('''
                    INSERT INTO Option (_index, value)
                    VALUES (?, ?)
                ''', (idx, option_value))
                
                # Get the option ID
                option_id = cursor.lastrowid

                # Link the option with the question
                cursor.execute('''
                    INSERT INTO QuestionOptions (question_id, option_id)
                    VALUES (?, ?)
                ''', (question_id, option_id))

        # Commit the transaction
        conn.commit()
        print("Conversation and questions added successfully.")

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        conn.rollback()


def get_all_conversations(conn:Connection):
    """
    Retrieve all conversations and their related questions, options, and correct answers from the database.

    :param conn: SQLite database connection object.
    :return: A list of dictionaries, each containing a conversation and its questions.
    """
    try:

        cursor = conn.cursor()

        # Retrieve all conversations
        cursor.execute('''
            SELECT id, num_speakers, level, topic, conversation
            FROM Conversations
        ''')
        
        conversations = cursor.fetchall()

        all_conversations = []

        for conv in conversations:
            conversation_id = conv[0]
            conversation_data = {
                'num_speakers': conv[1],
                'level': conv[2],
                'topic': conv[3],
                'conversation': conv[4],
                'questions': []
            }

            # Retrieve the questions associated with the conversation
            cursor.execute('''
                SELECT q.id, q.question, ca._index, ca.value
                FROM Question q
                JOIN ConversationQuestions cq ON cq.question_id = q.id
                JOIN CorrectAnswer ca ON ca.id = q.correct_answer_id
                WHERE cq.conversation_id = ?
            ''', (conversation_id,))
            
            questions = cursor.fetchall()

            for question in questions:
                question_id = question[0]
                question_text = question[1]
                correct_index = question[2]
                correct_value = question[3]

                # Retrieve the options for each question
                cursor.execute('''
                    SELECT o._index, o.value
                    FROM Option o
                    JOIN QuestionOptions qo ON qo.option_id = o.id
                    WHERE qo.question_id = ?
                    ORDER BY o._index
                ''', (question_id,))
                
                options = cursor.fetchall()

                # Structure the question data
                question_data = {
                    'question': question_text,
                    'options': [{'index': opt[0], 'value': opt[1]} for opt in options],
                    'correct_answer': {'index': correct_index, 'value': correct_value}
                }

                # Add the question to the conversation
                conversation_data['questions'].append(question_data)

            # Add the conversation to the list of all conversations
            all_conversations.append(conversation_data)

        return all_conversations

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        return []


def get_conversation(conn, conversation_id):
    """
    Retrieve a conversation and its related questions, options, and correct answers from the database.

    :param conn: SQLite database connection object.
    :param conversation_id: The ID of the conversation to retrieve.
    :return: A dictionary containing the conversation details and its questions.
    """
    try:
        cursor = conn.cursor()

        # Retrieve the conversation details
        cursor.execute('''
            SELECT num_speakers, level, topic, conversation
            FROM Conversations
            WHERE id = ?
        ''', (conversation_id,))
        
        conversation = cursor.fetchone()

        if conversation is None:
            print(f"No conversation found with ID {conversation_id}.")
            return None

        # Structure the conversation data
        conversation_data = {
            'num_speakers': conversation[0],
            'level': conversation[1],
            'topic': conversation[2],
            'conversation': conversation[3],
            'questions': []
        }

        # Retrieve the questions associated with the conversation
        cursor.execute('''
            SELECT q.id, q.question, ca._index, ca.value
            FROM Question q
            JOIN ConversationQuestions cq ON cq.question_id = q.id
            JOIN CorrectAnswer ca ON ca.id = q.correct_answer_id
            WHERE cq.conversation_id = ?
        ''', (conversation_id,))
        
        questions = cursor.fetchall()

        for question in questions:
            question_id = question[0]
            question_text = question[1]
            correct_index = question[2]
            correct_value = question[3]

            # Retrieve the options for each question
            cursor.execute('''
                SELECT o._index, o.value
                FROM Option o
                JOIN QuestionOptions qo ON qo.option_id = o.id
                WHERE qo.question_id = ?
                ORDER BY o._index
            ''', (question_id,))
            
            options = cursor.fetchall()

            # Structure the question data
            question_data = {
                'question': question_text,
                'options': [{'_index': opt[0], 'value': opt[1]} for opt in options],
                'correct_answer': {'_index': correct_index, 'value': correct_value}
            }

            # Add the question to the conversation
            conversation_data['questions'].append(question_data)

        return conversation_data

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        return None


# Usage example
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Add/Get conversation to/from database')
    parser.add_argument('--add', type=bool, help=f'add random conversation')
    parser.add_argument('--get_all_conversations', type=bool, help=f'get all conversations from database')
    parser.add_argument('--get_conversation', type=int, help=f'get a specific conversation')

    args = parser.parse_args()
    conn = sqlite3.connect(DB_NAME)

    if args.add:
                # Example data
        num_speakers = 2
        level = 1
        topic = "Technology"
        conversation_text = "A conversation about technology."
        questions = [
            {
                'question': "What is the main topic?",
                'options': ["Science", "Technology", "Art", "History"],
                'correct': {
                    "index": 1,
                    "value":"Technology",
                },
            },
            {
                'question': "How many speakers are there?",
                'options': ["One", "Two", "Three", "Four"],
                'correct': {
                    "index": 1,
                    "value":"Two",
                },
            }
        ]

        # Add the conversation and its questions
        add_conversation(conn, num_speakers, level, topic, conversation_text, questions)
        print("Added conversation")
    elif args.get_conversation:
        conversation = get_conversation(conn, args.get_conversation)
        if conversation == None:
            raise Exception("conversation not found")
        print(f"Conversation {args.get_conversation} Details:")
        print(f"Num Speakers: {conversation['num_speakers']}")
        print(f"Level: {conversation['level']}")
        print(f"Topic: {conversation['topic']}")
        print(f"Conversation: {conversation['conversation']}")
        print("Questions:")
        for q in conversation['questions']:
            print(f"  Question: {q['question']}")
            print(f"  Options: {', '.join([o['value'] for o in q['options']])}")
            print(f"  Correct Answer: {q['correct_answer']['value']}")
            print()
        print()

    elif args.get_all_conversations:
        # Retrieve all conversations and their questions
        all_conversations = get_all_conversations(conn)


            # Print the retrieved conversations
        for i, conversation in enumerate(all_conversations, start=1):
            print(f"Conversation {i} Details:")
            print(f"Num Speakers: {conversation['num_speakers']}")
            print(f"Level: {conversation['level']}")
            print(f"Topic: {conversation['topic']}")
            print(f"Conversation: {conversation['conversation']}")
            print("Questions:")
            for q in conversation['questions']:
                print(f"  Question: {q['question']}")
                print(f"  Options: {', '.join([o['value'] for o in q['options']])}")
                print(f"  Correct Answer: {q['correct_answer']['value']}")
                print()
            print()

    else:
        print("Nothing done!!")
    # close all connections
    conn.close()


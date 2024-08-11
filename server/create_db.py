"""
@author: amar-jay
"""
import sqlite3

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('dildash.db')

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create tables with names matching the schema
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Option (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        _index INTEGER NOT NULL,
        value TEXT NOT NULL
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS CorrectAnswer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        _index INTEGER NOT NULL,
        value TEXT NOT NULL
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS Question (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        correct_answer_id INTEGER NOT NULL,
        FOREIGN KEY (correct_answer_id) REFERENCES CorrectAnswer (id)
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS Conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        num_speakers INTEGER NOT NULL,
        level INTEGER NOT NULL,
        topic TEXT NOT NULL,
        conversation TEXT NOT NULL
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS QuestionOptions (
        question_id INTEGER NOT NULL,
        option_id INTEGER NOT NULL,
        FOREIGN KEY (question_id) REFERENCES Question (id),
        FOREIGN KEY (option_id) REFERENCES Option (id),
        PRIMARY KEY (question_id, option_id)
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS ConversationQuestions (
        conversation_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES Conversations (id),
        FOREIGN KEY (question_id) REFERENCES Question (id),
        PRIMARY KEY (conversation_id, question_id)
    )
''')

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Database setup completed.")


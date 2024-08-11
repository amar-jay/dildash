"""
@author: amar-jay
"""
import sqlite3

print("Creating database...")
# Connect to the SQLite database (it will create a new file if it doesn't exist)
conn = sqlite3.connect('dildash.db')
cursor = conn.cursor()

# Create a table to store conversations and questions
cursor.execute('''
CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num_speaker INTEGER,
    level INTEGER,
    topic TEXT,
    conversation TEXT,
    questions TEXT
)
''')

# Commit changes and close the connection
conn.commit()
conn.close()

print("Database created successfully!")

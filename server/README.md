### Server
Server is run on my local IP Address. You can change it to `127.0.0.1`, however if done, you need to do the same to all other occurances in the website as well. Come on! you can handle it! 💪💪

- to run server
```
python server.py
```

### Model
Please try and avoid manipulating the prompts because we did a lot of work on regex and string manipulation to get it running smoothly 
- command for running model

```
 python ollama.py --topic=1 --level=1 --length=10 --num_questions=10 --num_speakers=2
```

- to return result of server to file

```
 python ollama.py --topic=1 --level=1 --length=10 --num_questions=10 --num_speakers=2 > filename.txt
```

### DB
- to create database and tables
```
python create_db.py
```

- to seed database with random values
```
python db.py --add=true
```

- to get all conversation from database
```
python db.py --get_all_conversations=true
```

- to get conversation by id
```
python db.py --get_conversation=7
```

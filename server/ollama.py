"""
Created on Wed Aug  7 17:47:10 2024

@author: ammar
"""

from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
import random
import re

# prepare the model using Ollama
llm = Ollama(model='llama3', base_url="http://172.20.10.3:11434")

topics = [
    "Sport", "Science", "History", "Scientific Discovery", "Movie",
    "Celebrity", "Food", "Holiday", "Natural Disasters", "Technology",
    "Competition", "College", "Party", "Love Life", "Religion", "Animals",
    "Artificial Intelligence", "Biology", "Space or Planets", "TV Show"
]

conv_type = [
    "monologue of a person giving a talk or speech",
    "dialog conversation between two people",
    "conversation among three people",
]

levels = ["beginner", "intermediate", "upper-intermediate", "advanced", "expert"]

def generate_conversation_and_questions(num_speaker, num_questions, level_idx, length, topic_idx=None):
    """
    @param num_speaker: int, number of speakers
    @param level: int, level of English
    @param topic_idx: int, index of topic
    @return: tuple, topic conversation and questions
    """

    if topic_idx is None:
        topic_idx=random.randint(0, len(topics) - 1)

    if level_idx > len(levels) - 1 or level_idx < 0:
        raise ValueError("Invalid level index")


    topic = topics[topic_idx]
    level = levels[level_idx]

    conversation_builder_prompt = f"""Generate a conversation between {num_speaker} individuals. The topic of the conversation is {topic}. The conversation should be approximately {length} sentences long. Use {level} to guide the language and complexity of the dialogue. Ensure the conversation has natural dialogue flow, relevant details, and interactions that reflect the specified topic and grammar level. Also, begin and end a conversation with `---`

        Example Conversation (3 people, topic: 'weekend hiking trip', length: 14 sentences, grammar level: intermediate):
        ---
        <Person_1>: Hey, have you guys finalized the plans for our weekend hiking trip?
        <Person_2>: Not yet. I was thinking of packing some sandwiches and snacks. What about you, <Person_3>?
        <Person_3>: I can bring a portable grill for some hot dogs. Should we plan for breakfast as well?
        <Person_1>: Good idea! I could bring some eggs and bacon. Should we meet at the trailhead around 8 AM?
        <Person_2>: 8 AM sounds perfect. I'll bring a cooler for the food. Also, do we need to bring any special gear?
        <Person_3>: I think we should have enough gear, but it might be good to bring an extra set of rain jackets, just in case.
        <Person_1>: Agreed. I'll make sure to pack those. What about transportation? Are we carpooling?
        <Person_2>: I'm fine with carpooling. We can all meet at my place and go from there.
        <Person_3>: Works for me. I'll also bring a first-aid kit just in case. Anything else we should consider?
        <Person_1>: Maybe some sunscreen and bug spray. It's supposed to be sunny, and the bugs might be out.
        <Person_2>: Good call. I'll grab those too. I think we're all set then!
        <Person_3>: Sounds like a plan. I'm really looking forward to this trip. See you both on Saturday!
        <Person_1>: Can't wait! See you then.
        <Person_2>: See you!
        ---
        """
    conversation_command = f"Generate a conversation following the above format based on the specified parameters: {num_speaker} people, topic: '{topic}', length: {length} sentences, grammar level: {level}."

    monologue_builder_prompt = f"""Generate a monologue by a single individual. The topic of the monologue is {topic}. The monologue should be approximately {length} sentences long. Use {level} to guide the language and complexity of the speech. Ensure the monologue has a natural flow, relevant details, and a coherent structure that reflects the specified topic and grammar level.

        Example Monologue (topic: 'overcoming fear', length: 10 sentences, grammar level: intermediate):
        ---
        Fear has always been a part of my life, lurking in the shadows of my mind. For years, it held me back, preventing me from pursuing my dreams and living life to the fullest. I remember countless nights lying awake, paralyzed by the thought of failure or embarrassment. But one day, I realized that my fear was nothing more than a creation of my own imagination. I decided to face it head-on, taking small steps each day to challenge my comfort zone. It wasn't easy, and there were times when I wanted to retreat back into my shell. However, with each small victory, I grew stronger and more confident. Now, I stand here before you, not as someone who has conquered fear entirely, but as someone who has learned to dance with it. Fear no longer controls me; instead, it motivates me to push harder and reach higher. If I can leave you with one message today, it's this: don't let fear dictate your life – embrace it, learn from it, and use it as a stepping stone to your greatest achievements.
        ---
        """

    monologue_command=f"Generate a monologue following the above format based on the specified parameters: topic: '{topic}', length: {length} sentences, grammar level: {level}."



    conversation_prompt = ChatPromptTemplate.from_messages([
        ("system", conversation_builder_prompt if num_speaker > 1 else monologue_builder_prompt),
        ("user", "{input}")
    ])

    conversation_chain = conversation_prompt | llm

    response = conversation_chain.invoke({"input": conversation_command if num_speaker > 1 else monologue_command})

    conversation = response.split('---')
    conversation = max(conversation, key=len)


    question_builder_prompt = f"""
    Conversation: 
    ---
    {conversation}
    ---

    Generate a set of {num_questions} multiple-choice questions from the conversation above. The difficulty level should be "{level}". Each question should be followed by four answer options, with one correct answer indicated.

        Ensure that:
        1. Questions are clear and unambiguous.
        2. Answers are concise but complete.
        3. The content accurately reflects the specified subject and difficulty level.
        4. Each question has four answer options with only one correct answer.
        5. Each question is preceeded by `---`.

        Example Set (subject: "World Geography", difficulty level: "intermediate", 3 questions):

        ---
        Q1: Which of the following countries does NOT border Brazil?
        A. Chile
        B. Argentina
        C. Bolivia
        D. Peru
        Correct Answer: A. Chile
        ---
        Q3: What is the capital city of Japan?
        A. Tokyo
        B. Kyoto
        C. Osaka
        D. Hiroshima
        Correct Answer: A. Tokyo
        ---
        """


    question_prompt = ChatPromptTemplate.from_messages([
        ("system", question_builder_prompt),
        ("user", "{input}")
    ])

    question_chain = question_prompt | llm

    question_command = f"Generate a set of questions and answers following the above format based on the specified parameters: subject: '{topic}', difficulty level: '{level}', number of questions: {num_questions}."""
    questions = question_chain.invoke({"input": question_command})

    return topic, conversation, questions


def parse_questions(response: str, delimiter: str = '---'):
    # Find the index of the first occurrence of the delimiter
    index = response.find(delimiter)
    
    # If the delimiter is found, return the substring after the delimiter
    if index == -1:
        raise Exception(f"Delimiter '{delimiter}' not found in the response.")

    response = response[index + len(delimiter):].strip()

    # Regular expression to capture each question block
    question_blocks = re.split(r'---', response.strip())

    questions = []

    for block in question_blocks:
        lines = block.strip().split('\n')
        if len(lines) < 4:
            continue

        # Extract question text
        pattern = re.compile(r'^Q\d+:\s*')
        question = pattern.sub('', lines[0]).strip()


        # Extract options
        options = ["" for _ in lines[1:-1]]
        for option_line in lines[1:-1]:
            index, option = option_line.split('.', 1)
            index = index.strip()
            option = option.strip()
            options[ord(index) - ord('A')] = option

        # Extract correct answer
        correct_answer = lines[-1].replace('Correct Answer:', '').strip() # correct answer structure: "A. Chile"
        correct_index = ord(correct_answer[0]) - ord('A')
        correct_answer = correct_answer[2:].strip()

        if correct_index < 1:
            continue

        questions.append({
            'question': question,
            'options': options,
            'correct': {
                'index': correct_index,
                'value': correct_answer
            }
        })

    return questions

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Generate conversation and parse multiple-choice questions.')
    parser.add_argument('--topic', type=int, help=f'Index of the subject of the conversation \n{topics}')
    parser.add_argument('--level', type=int, help=f'The difficulty level of the questions from 0 to {len(levels) - 1}.')
    parser.add_argument('--length', type=int, help='The length of the conversation in sentences.')
    parser.add_argument('--num_questions', type=int, help='The number of questions to generate.')
    parser.add_argument('--num_speakers', type=int, help='The number of speakers in the conversation. if one speaker, the conversation will be monologue.')

    args = parser.parse_args()



    num_speakers = args.num_speakers if args.num_speakers else int(input("enter the number of the speaker: "))
    num_questions = args.num_questions if args.num_questions else int(input("enter the number of questions you want to generate: "))
    level_idx = args.level if args.level else int(input("""what is your english level?\n
                1) beginner\n
                2) intermediate\n
                3) upper-intermediate\n
                4) advanced: \n""")) - 1
    length = args.length if args.length else int(input("Enter the length of the conversation in sentences: "))
    topic_idx = args.topic

    if level_idx > len(levels) - 1 or level_idx < 0:
        raise ValueError("Invalid level index")
    if num_speakers < 1:
        raise ValueError("Invalid number of speakers. Choose a number greater than 0.")

    topic, conversation, questions = generate_conversation_and_questions(num_speakers, num_questions, level_idx, length, topic_idx=topic_idx)

    print("The converation on the topic (%s)\n\nCONVERSATION:\n%s" % (topic.upper(), conversation.strip()))

    print("\n\n")

    questions = parse_questions(questions)

    print("QUESTIONS:\n%s" % (questions))

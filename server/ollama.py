"""
Created on Wed Aug  7 17:47:10 2024

@author: ammar
"""

from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
import random

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

levels = ["beginner", "intermediate", "upper-intermediate", "advanced"]

def generate_conversation_and_questions(num_speaker, level, topic_idx=random.randint(0, len(topics) - 1)):
    """
    @param num_speaker: int, number of speakers
    @param level: int, level of English
    @param topic_idx: int, index of topic
    @return: tuple, topic conversation and questions
    """

    if topic_idx > len(topics) - 1 or topic_idx < 0:
        raise ValueError("Invalid topic index")

    conversation_builder_prompt = f"""You are a helpful assistant that helps a person learning English.
    The goal is to generate a conversation for {levels[level]} level English learner about a certain topic.
    The topic is about {topics[topic_idx]}. Please write a {conv_type[num_speaker]}.
    Here is an example of the conversation:

    -----
    Alex: Hey Jamie, did you hear about the latest discovery in particle physics?
    Jamie: No, what happened?
    Alex: Scientists at CERN discovered a new type of subatomic particle that could change our understanding of the fundamental forces of the universe.
    Jamie: That's incredible! What exactly did they find?
    Alex: They found evidence of a particle called a tetraquark. Unlike regular particles made of three quarks, this one is made of four.
    -----

    """
    command = f"Write a new and creative {conv_type[num_speaker]} and adjust it for {levels[level]} level English learner.\nIn writing, follow the writing rule just as shown in the example."

    conversation_prompt = ChatPromptTemplate.from_messages([
        ("system", conversation_builder_prompt),
        ("user", "{input}")
    ])

    conversation_chain = conversation_prompt | llm

    response = conversation_chain.invoke({"input": command})

    conversation = response.split('-----')
    conversation = max(conversation, key=len)

    question_builder_prompt = f"""Here is a {conv_type[num_speaker]} about {topics[topic_idx]}.

    {conversation}

    """

    question_prompt = ChatPromptTemplate.from_messages([
        ("system", question_builder_prompt),
        ("user", "{input}")
    ])

    question_chain = question_prompt | llm

    question_command = f"Write 5 questions according to that conversation for {levels[level]} level English learner."
    questions = question_chain.invoke({"input": question_command})

    return topics[topic_idx], conversation, questions

if __name__ == "__main__":
    print("Testing...")
    # input the nunmber of speaker
    num_speaker = int(input("enter the number of the speaker: "))

    # input the level of English
    level = int(input("""what is your english level?\n
                1) beginner\n
                2) intermediate\n
                3) upper-intermediate\n
                4) advanced: \n""")) - 1

    topic_idx = random.randint(0, len(topics)-1)

    topic, conversation, question = generate_conversation_and_questions(num_speaker, level, topic_idx)

    print("The converation on the topic (%s) is: %s" % (topic.upper(), conversation))

    print("\n\n\n------------------\n\n\n")
    print("The questions are: \n%s" % (question))

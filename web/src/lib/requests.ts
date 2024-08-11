export interface Speaker {
  name: string;
  message: string;
}

type Option = {
  _index: number;
  value: string;
};

type CorrectAnswer = {
  _index: number;
  value: string;
};

export type Question = {
  question: string;
  options: Option[];
  correct: CorrectAnswer;
};

export interface ConversationResponse {
  conversation: Speaker[]; // TODO: do this string manipulation in the backend as well
  id: number;
  level: number;
  num_speakers: number;
  questions: Question[];
  topic: string;
}

const urls = {
  getConversation: (id: number) =>
    `http://172.20.10.2:5000/conversations/${id}`,
  generateConversation: (
    level?: number,
    length?: number,
    num_speakers?: number,
    num_questions?: number,
  ) =>
    `http://172.20.10.2:5000/generate?level=${level}&length=${length}&num_speakers=${num_speakers}&num_questions=${num_questions}`,
} as const;

export async function getConversation(
  id?: number,
): Promise<ConversationResponse> {
  return fetchConversation(urls.getConversation(id));
}

export async function generateConversation(
  level?: number,
  length?: number,
  num_speakers?: number,
  num_questions?: number,
): Promise<ConversationResponse> {
  return fetchConversation(
    urls.generateConversation(level, length, num_speakers, num_questions),
  );
}

async function fetchConversation(url: string): Promise<ConversationResponse> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();

    // Format conversation string into array of speakers
    const formattedConversation: Speaker[] = data.conversation
      .split("\n")
      .filter((line: string) => line !== "")
      .map((line: string) => {
        const [name, message] = line.split(": ");
        return { name, message };
      });

    console.log("formattedConversation", formattedConversation);
    // Return formatted data with correct types
    return {
      conversation: formattedConversation,
      id: data.id,
      level: data.level,
      num_speakers: data.num_speakers,
      questions: data.questions,
      topic: data.topic,
    };
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
}

import { useState, useEffect } from "react";

export const useOllamaConversation = (
  id?: number,
): [ConversationResponse | null, boolean, Error | null] => {
  const [conversationData, setConversationData] =
    useState<ConversationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await getConversation(id);
        setConversationData(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  return [conversationData, loading, error];
};

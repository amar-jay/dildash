export interface Speaker {
  name: string;
  message: string;
}

export interface Question {
  question: string;
  options: { option: string }[];
  answer: { index: number; value: string };
}

export interface ConversationResponse {
  conversation: Speaker[];
  id: number;
  level: number;
  num_speaker: number;
  questions: Question[];
  topic: string;
}

export async function getConversation(
  id?: number,
): Promise<ConversationResponse> {
  if (id === undefined) {
    id = Math.floor(Math.random() * 10) + 1;
  }

  try {
    const response = await fetch(
      `http://172.20.10.2:5000/conversations/${id}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();

    // Format conversation string into array of speakers
    const formattedConversation: Speaker[] = data.conversation
      .split("\n")
      .map((line: string) => {
        const [name, message] = line.split(": ");
        return { name, message };
      });

    // Format questions string into array of questions
    const formattedQuestions: Question[] = data.questions
      .split("\n\n")
      .filter((section: string) => section.trim())
      .map((section: string) => {
        const lines = section.split("\n");
        const questionText = lines.shift()!.trim();
        const optionsTexts = lines.map((line) => line.trim());

        const options = optionsTexts.map((optionText, index) => ({
          option: optionText.replace(/^[a-z]$$/i, ""),
          correct:
            index === optionsTexts.length - 1 && optionText.includes("Answer:"),
        }));

        const answer =
          optionsTexts
            .filter(
              (optionText, index) =>
                optionsTexts.length - 1 === index &&
                optionText.includes("Answer:"),
            )[0]
            ?.replace("Answer: ", "") ?? "No answer found";

        return {
          question: questionText,
          options,
          answer: { value: answer, index: null },
        };
      });

    const formattedAnwers: Question[] = data.questions
      .split("\n\n")
      .filter((section: string) => section.trim())
      .map((section: string) => {
        const lines = section.split("\n");
        const questionText = lines.shift()!.trim();
        const optionsTexts = lines.map((line) => line.trim());

        const options = optionsTexts.map((optionText, index) => ({
          option: optionText.replace(/^[a-z]$$/i, ""),
          correct:
            index === optionsTexts.length - 1 && optionText.includes("Answer:"),
        }));

        const answer =
          optionsTexts
            .filter(
              (optionText, index) =>
                optionsTexts.length - 1 === index &&
                optionText.includes("Answer:"),
            )[0]
            ?.replace("Answer: ", "") ?? "No answer found";

        return {
          question: questionText,
          options,
          answer: { value: answer, index: null },
        };
      });

    // Return formatted data with correct types
    return {
      conversation: formattedConversation,
      id: data.id,
      level: data.level,
      num_speaker: data.num_speaker,
      questions: formattedQuestions,
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

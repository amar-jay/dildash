import React, { useState } from "react";
import { useOllamaConversation, type Question } from "@/lib/requests";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Forward,
  MessageCircleQuestion,
  RefreshCw,
  TextQuote,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const QuestionComponent = ({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: () => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSubmit = () => {
    if (selectedOption !== "") {
      setIsAnswered(true);
      //     onAnswer(selectedOption);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <p className="font-medium mb-2">{question.question}</p>
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem
                value={optionIndex.toString()}
                id={`option-${optionIndex}`}
                disabled={isAnswered}
              />
              <Label htmlFor={`option-${optionIndex}`}>{option.option}</Label>
            </div>
          ))}
        </RadioGroup>
        {!isAnswered && (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === ""}
            className="mt-2"
          >
            Submit Answer
          </Button>
        )}
        {isAnswered && (
          <div className="mt-4 p-2 bg-green-100 rounded">
            <p className="font-semibold">Correct Answer:</p>
            <p> {question.answer.value}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const QuestionsSection = ({ questions }: { questions: Question[] }) => {
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const handleAnswer = () => {
    setAnsweredQuestions((prev) => (prev < questions.length ? prev + 1 : 0));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        ({answeredQuestions}/{questions.length} answered)
      </h3>
      <QuestionComponent
        question={questions[answeredQuestions]}
        onAnswer={handleAnswer}
      />
      <Separator />
      <Button
        onClick={handleAnswer}
        disabled={answeredQuestions === questions.length - 1}
        className="my-5 w-full"
      >
        Skip Question <Forward className="ml-5 h-4 w-4" />
      </Button>
    </div>
  );
};

enum View {
  Conversation = "conversation",
  Answers = "answers",
}
const OllamaConversation = () => {
  const [conversationData, loading, error] = useOllamaConversation(10);
  const [view, setView] = React.useState<View>(View.Answers);

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  const refreshData = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-3xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          <span className="mr-36">Error fetching data: {error.message}</span>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 "
            onClick={refreshData}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!conversationData) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No Data Found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Learning Conversation
          <div>
            {" "}
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                if (view === View.Conversation) {
                  setView(View.Answers);
                } else {
                  setView(View.Conversation);
                }
              }}
              className="mr-2"
            >
              {view === View.Conversation ? (
                <>
                  <MessageCircleQuestion className="mr-2 h-4 w-4" /> Questions
                </>
              ) : (
                <>
                  <TextQuote className="mr-2 h-4 w-4" /> Answers
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {view === View.Conversation ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Conversation</h3>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                {conversationData.conversation.map((speaker, index) => (
                  <div key={index} className="mb-2">
                    {speaker.name.length > 0 && speaker.message.length > 0 ? (
                      <>
                        <span className="font-semibold">{speaker.name}:</span>{" "}
                        {speaker.message}
                      </>
                    ) : null}
                  </div>
                ))}
              </ScrollArea>
            </div>
          ) : (
            <div>
              <h1 className="text-lg font-semibold mb-2">Questions</h1>
              <QuestionsSection questions={conversationData.questions} />
              {/*
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              {conversationData.questions.map((question, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-6">
                    <p className="font-medium mb-2">{question.question}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex}>{option.option}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
               */}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between">
        <Badge variant="outline" className="mb-2">
          Level: {conversationData.level}
        </Badge>
        <Badge variant="outline" className="mb-2">
          Speakers: {conversationData.num_speaker}
        </Badge>
        <Badge variant="outline" className="mb-2">
          Topic: {conversationData.topic}
        </Badge>
      </CardFooter>
    </Card>
  );
};

const _OllamaConversation = () => {
  const [conversationData, loading, error] = useOllamaConversation(10);

  if (loading) {
    return <div>Loading...</div>;
  }

  const refreshData = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div>
        <button onClick={refreshData}>
          Error fetching data: {error.message}
        </button>
      </div>
    );
  }

  if (!conversationData) {
    return <div>No Data Found</div>;
  }

  return (
    <div>
      <h2>Conversation</h2>
      {conversationData.conversation.map((speaker, index) => (
        <p key={index}>
          {speaker.name}: {speaker.message}
        </p>
      ))}

      <h2>Questions</h2>
      {conversationData.questions.map((question, index) => (
        <div key={index}>
          <p>{question.question}</p>
          {question.options.map((option, optionIndex) => (
            <p key={optionIndex}>{option.option}</p>
          ))}
        </div>
      ))}

      <p>Level: {conversationData.level}</p>
      <p>Number of Speakers: {conversationData.num_speaker}</p>
      <p>Topic: {conversationData.topic}</p>

      {/* Refresh Button */}
      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
};

export default OllamaConversation;

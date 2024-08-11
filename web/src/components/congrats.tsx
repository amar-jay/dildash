import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Sparkles } from "lucide-react";

export const CongratsCard = ({ score, totalQuestions }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div>
      <Confetti />
      <Card className={`w-full max-w-md text-center relative`}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2 animate-popIn">
            Congratulations!
          </CardTitle>
          <CardDescription className="animate-fadeInUp">
            You've completed the quiz!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-6xl font-bold mb-4 animate-scoreCount : ""}`}>
            {score}/{totalQuestions}
          </div>
          <div className="text-2xl mb-6 animate-fadeInUp delay-300">
            Your score: {percentage}%
          </div>
          <div className="relative mb-6">
            <div className="animate-trophyEntrance">
              <Trophy
                className="mx-auto text-yellow-500 animate-trophyBounce"
                size={64}
              />
            </div>
            <Star
              className="absolute top-0 left-1/4 text-yellow-300 animate-spin"
              size={24}
            />
            <Star
              className="absolute bottom-0 right-1/4 text-yellow-300 animate-spin"
              size={24}
            />
            <Sparkles
              className="absolute top-1/2 left-0 text-yellow-200 animate-pulse"
              size={24}
            />
            <Sparkles
              className="absolute top-1/2 right-0 text-yellow-200 animate-pulse"
              size={24}
            />
          </div>
          <Button className="w-full">Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(50)].map((_, index) => (
        <div
          key={index}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            animationDelay: `${Math.random() * 5}s`,
            backgroundColor: [
              "#ff0000",
              "#00ff00",
              "#0000ff",
              "#ffff00",
              "#ff00ff",
            ][Math.floor(Math.random() * 5)],
          }}
        />
      ))}
    </div>
  );
};

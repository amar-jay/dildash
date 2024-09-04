import { Icons } from "@/components/icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { quizThemes } from "@/lib/quiz-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "./ui/skeleton";

function MainCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-24 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-56" /> {/* Description */}
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-between p-4">
            <Skeleton className="h-6 w-6 mb-3" /> {/* Icon */}
            <Skeleton className="h-4 w-20" /> {/* Text */}
          </div>
          <div className="flex flex-col items-center justify-between p-4">
            <Skeleton className="h-6 w-6 mb-3" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex flex-col items-center justify-between p-4">
            <Skeleton className="h-6 w-6 mb-3" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-4 w-12" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-12" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Select */}
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-4 w-64" /> {/* Label */}
          <Skeleton className="h-20 w-full" /> {/* Textarea */}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" /> {/* Button */}
      </CardFooter>
    </Card>
  );
}

export default function MainPageCard() {
  const [loading, setLoading] = useState(false);
  /*
  // simulate loading page
  useEffect(() => {
    // Simulate a network request delay
    const timer = setTimeout(
      () => {
        setLoading(!loading); // Set loading to false after the delay
      },
      loading ? 1000 : 5000,
    ); // 2-second delay

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [loading]); // Empty dependency array ensures this effect runs only once on mount

  */
  return loading ? <MainCardSkeleton /> : <MainCard />;
}

function MainCard() {
  const [level, setLevel] = useState("intermediate");
  const [name, setName] = useState("");
  const [tone, setTone] = useState("");
  const [theme, setTheme] = useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle>DilDash</CardTitle>
        <CardDescription>
          Choose your level blah blah blah blah blah
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup
          onValueChange={(v) => setLevel(v)}
          defaultValue={level}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="beginner"
              id="beginner"
              className="peer sr-only"
              aria-label="beginner"
            />
            <Label
              htmlFor="beginner"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              Beginner
              <Icons.level_beginner className="mb-3 h-6 w-6" />
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="intermediate"
              id="intermediate"
              className="peer sr-only"
              aria-label="intermediate"
            />
            <Label
              htmlFor="intermediate"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.level_intermediate className="mb-3 h-6 w-6" />
              Intermediate
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="advanced"
              id="advanced"
              className="peer sr-only"
              aria-label="advanced"
            />
            <Label
              htmlFor="advanced"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary "
            >
              <Icons.level_advanced className="mb-3 h-6 w-6" />
              Advanced
            </Label>
          </div>
        </RadioGroup>
        <div className="gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="First Last"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tone">Tone</Label>
            <Select onValueChange={(v) => setTone(v)} defaultValue={tone}>
              <SelectTrigger id="tone" aria-label="Tone">
                <SelectValue placeholder="Tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="adult">Adult</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="month">Theme</Label>
            <Select onValueChange={(v) => setTheme(v)} defaultValue={theme}>
              <SelectTrigger id="Theme" aria-label="Theme">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {quizThemes.map((theme, i) => (
                  <SelectItem key={i} value={theme.toLowerCase()}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="number">Anything extra you would like to add</Label>
          <Textarea id="number" placeholder="" />
        </div>
      </CardContent>
      <CardFooter>
        <a
          href={`/player?theme=${theme}&tone=${tone}&level=${level}&name=${name}`}
        >
          <Button className="w-full">Continue</Button>
        </a>
      </CardFooter>
    </Card>
  );
}

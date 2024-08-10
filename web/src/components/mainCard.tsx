import { Icons } from "@/components/icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

  return loading ? <MainCardSkeleton /> : <MainCard />;
}

function MainCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DilDask</CardTitle>
        <CardDescription>
          Choose your level blah blah blah blah blah
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem
              value="card"
              id="card"
              className="peer sr-only"
              aria-label="Card"
            />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.level_beginner className="mb-3 h-6 w-6" />
              Beginner
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="paypal"
              id="paypal"
              className="peer sr-only"
              aria-label="Paypal"
            />
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.level_intermediate className="mb-3 h-6 w-6" />
              Intermediate
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="apple"
              id="apple"
              className="peer sr-only"
              aria-label="Apple"
            />
            <Label
              htmlFor="apple"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary "
            >
              <Icons.level_advanced className="mb-3 h-6 w-6" />
              Advanced
            </Label>
          </div>
        </RadioGroup>
        <div className="gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="First Last" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tone">Tone</Label>
            <Select>
              <SelectTrigger id="tone" aria-label="Tone">
                <SelectValue placeholder="Tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Child</SelectItem>
                <SelectItem value="2">Adult</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Select>
              <SelectTrigger id="year" aria-label="Year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                    {new Date().getFullYear() + i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="month">Theme</Label>
            <Select>
              <SelectTrigger id="Theme" aria-label="Theme">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sports</SelectItem>
                <SelectItem value="2">Academics</SelectItem>
                <SelectItem value="3">Hospital</SelectItem>
                <SelectItem value="4">Food</SelectItem>
                <SelectItem value="5">Tourism</SelectItem>
                <SelectItem value="6">Politics</SelectItem>
                <SelectItem value="7">Global News</SelectItem>
                <SelectItem value="8">Family</SelectItem>
                <SelectItem value="9">Love Life</SelectItem>
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
        <a href="/player">
          <Button className="w-full">Continue</Button>
        </a>
      </CardFooter>
    </Card>
  );
}

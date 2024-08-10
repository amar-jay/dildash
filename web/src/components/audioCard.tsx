import React, { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AudioTranscriptionPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Audio Title */}
            <h2 className="text-2xl font-semibold text-center">Audio Title</h2>

            {/* Waveform Placeholder */}
            <div className="w-full h-24 bg-gray-100 rounded-md"></div>

            {/* Audio Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <Slider
                  defaultValue={[70]}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0:00</span>
                <span>3:45</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transcript" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="transcript">
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[300px] w-full rounded-md pr-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your transcript will appear here as the audio plays...
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardContent className="p-4">
              <textarea
                className="w-full h-[300px] p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add your notes here..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AudioTranscriptionPage;

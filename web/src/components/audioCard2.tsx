import { useState } from "react";
import {
  Play,
  Pause,
  AudioWaveformIcon as TranscriptionIcon,
  Volume2,
  Mic,
  Download,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AudioPlayerProps {
  isTranscribing: boolean;
  isPlaying: boolean;
  volume: number;
  setVolume: (value: number) => void;
  setIsTranscribing: (value: boolean) => void;
  skipBack: () => void;
  skipForward: () => void;
  togglePlayPause: () => void;
}

const AudioPlayer = ({
  isPlaying,
  setIsTranscribing,
  togglePlayPause,
}: AudioPlayerProps) => {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Audio Title and Transcription Toggle */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Listening Practice</h2>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsTranscribing(false)}
                  id="transcription-mode"
                >
                  <TranscriptionIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Live Transcription</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Waveform Placeholder */}
          <div className="w-full h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-md"></div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider defaultValue={[0]} max={100} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0:00</span>
              <span>3:45</span>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <SkipBackIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Need premium to use this</p>
                  {/*
                    <p>Skip back 10 seconds</p>
                    */}
                </TooltipContent>
              </Tooltip>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    disabled
                  >
                    <SkipForwardIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Need premium to use this</p>
                  {/*
                    <p>Skip forward 10 seconds</p>
                    */}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-gray-500" />
              <Slider defaultValue={[70]} max={100} step={1} className="w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
function AudioTranscriptionTabs({ transcripts }: { transcripts: string }) {
  return (
    <Tabs defaultValue="transcript" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="transcript">Transcript</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="transcript">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Mic className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Transcribing...</span>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Transcript
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md pr-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {transcripts || (
                  <span>
                    Your transcript will appear here as the audio plays...
                  </span>
                )}
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notes">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <textarea
              className="w-full h-[300px] p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your notes here..."
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function AudioTranscriptionTabsSplit({ transcripts }: { transcripts: string }) {
  return (
    <div defaultValue="transcript" className="w-full">
      <h1 className="font-bold text-4xl text-center mb-5">Transcript</h1>
      <div className="grid grid-cols-2 gap-5">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Mic className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Transcribing...</span>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Transcript
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md pr-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {transcripts || (
                  <span>
                    Your transcript will appear here as the audio plays...
                  </span>
                )}
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4">
            <textarea
              className="w-full h-[300px] p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your notes here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function SimpleAudioPlayer({
  skipBack,
  skipForward,
  togglePlayPause,
  isPlaying,
}: AudioPlayerProps) {
  return (
    <div className="audio-player fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex items-center justify-center p-4 shadow-lg">
      <Button
        variant="ghost"
        onClick={skipBack}
        aria-label="Skip backward 10 seconds"
      >
        <SkipBackIcon />
      </Button>
      <Button
        variant="ghost"
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <Button
        variant="ghost"
        onClick={skipForward}
        aria-label="Skip forward 10 seconds"
      >
        <SkipForwardIcon />
      </Button>
    </div>
  );
}

function useAudioPlayer() {
  const [isTranscribing, setTranscribing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const skipForward = () => {};
  const [transcripts] = useState("Here are the transcripts");
  const skipBack = () => {};
  const togglePlayPause = () => {};

  const setIsTranscribing = (value: boolean) => {
    // transcription delay simulation
    setTimeout(() => {
      setTranscribing((prevState) => !prevState);
    }, 2000);
  };
  return {
    volume,
    transcripts,
    isTranscribing,
    setIsTranscribing,
    setVolume,
    skipBack,
    skipForward,
    togglePlayPause,
    isPlaying,
    setIsPlaying,
  };
}

const FloatingAudioPlayer = ({
  skipBack,
  skipForward,
  togglePlayPause,
  isPlaying,
  volume,
  isTranscribing,
  setIsTranscribing,
  setVolume,
}: AudioPlayerProps) => {
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-full shadow-sm p-2 flex items-center space-x-2 border-primary border-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={skipBack}>
              <SkipBackIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Skip back 10 seconds</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={togglePlayPause}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? "Pause" : "Play"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={skipForward}>
              <SkipForwardIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Skip forward 10 seconds</p>
          </TooltipContent>
        </Tooltip>

        <Slider className="w-48" max={100} step={1} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              onClick={() => setIsTranscribing(false)}
              id="transcription-mode"
            >
              <TranscriptionIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Live Transcription</p>
          </TooltipContent>
        </Tooltip>
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVolumeVisible(!isVolumeVisible)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust Volume</p>
            </TooltipContent>
          </Tooltip>

          {isVolumeVisible && (
            <div className="absolute bottom-full mb-2 px-2 py-2 bg-white left-1/2 transform -translate-x-1/2 rounded-lg border-2 ">
              <Slider
                orientation="vertical"
                className="h-24"
                value={[volume]}
                onValueChange={(newVolume) => setVolume(newVolume[0])}
                max={100}
                step={1}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function AudioTranscriptionPage() {
  const {
    isTranscribing,
    isPlaying,
    volume,
    transcripts,
    setIsTranscribing,
    setVolume,
    skipBack,
    skipForward,
    togglePlayPause,
  } = useAudioPlayer();
  //const audioRef = useRef<HTMLAudioElement>(null);
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-6 w-[64rem]">
        {isTranscribing ? (
          <>
            <AudioTranscriptionTabsSplit transcripts={transcripts} />
            <FloatingAudioPlayer
              isTranscribing={isTranscribing}
              isPlaying={isPlaying}
              setIsTranscribing={setIsTranscribing}
              skipForward={skipForward}
              skipBack={skipBack}
              togglePlayPause={togglePlayPause}
              volume={volume}
              setVolume={setVolume}
            />
          </>
        ) : (
          <AudioPlayer
            isTranscribing={isTranscribing}
            isPlaying={isPlaying}
            setIsTranscribing={setIsTranscribing}
            skipForward={skipForward}
            skipBack={skipBack}
            togglePlayPause={togglePlayPause}
            volume={volume}
            setVolume={setVolume}
          />
        )}
        {/*
         */}
        {/*
      <audio ref={audioRef} src="path/to/your/audio/file.mp3" />
        */}
      </div>
    </TooltipProvider>
  );
}
export default AudioTranscriptionPage;

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  CaptionsIcon as TranscriptionIcon,
  CaptionsOffIcon as NoTranscriptionIcon,
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
import { useOllamaConversation, type Speaker } from "@/lib/requests";
import { formatTime } from "@/lib/utils";

interface AudioPlayerProps {
  isTranscribing: boolean;
  isPlaying: boolean;
  volume: number;
  setVolume: (value: number) => void;
  setIsTranscribing: (value: boolean) => void;
  skipBack: () => void;
  skipForward: () => void;
  togglePlayPause: () => void;
  currentTime: number;
  audioDuration: number;
  handleSeek: (value: number[]) => void;
}

const AudioPlayer = ({
  isPlaying,
  setIsTranscribing,
  togglePlayPause,
  currentTime,
  audioDuration: duration,
  skipBack,
  skipForward,
  handleSeek,
}: AudioPlayerProps) => {
  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Audio Title and Transcription Toggle */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Listening Player</h2>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={() => setIsTranscribing(false)}
                  id="transcription-mode"
                >
                  <NoTranscriptionIcon className="h-4 w-4" />
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
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
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
                    onClick={skipBack}
                  >
                    <SkipBackIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Skip back 10 seconds</p>
                </TooltipContent>
              </Tooltip>
              <Button
                variant="default"
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
                    onClick={skipForward}
                  >
                    <SkipForwardIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Skip forward 10 seconds</p>
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
function AudioTranscriptionTabs({ transcripts }: { transcripts?: Speaker[] }) {
  return (
    <Tabs defaultValue="transcript" className="w-full md:hidden">
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
                {transcripts ? (
                  transcripts.map((speaker, index) => (
                    <div key={index} className="mb-2">
                      {speaker.name.length > 0 && speaker.message.length > 0 ? (
                        <>
                          <span className="font-semibold">{speaker.name}:</span>{" "}
                          {speaker.message}
                        </>
                      ) : null}
                    </div>
                  ))
                ) : (
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
              className="w-full h-[300px] p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-[1px] focus:ring-blue-500"
              placeholder="Add your notes here..."
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function AudioTranscriptionTabsSplit({
  transcripts,
}: {
  transcripts?: Speaker[];
}) {
  const downloadTranscripts = () => {};
  return (
    <div defaultValue="transcript" className="w-full hidden md:block">
      <h1 className="font-bold text-4xl text-center mb-5">Listening Player</h1>
      <div className="grid grid-cols-2 gap-5">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Mic className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Transcribing...</span>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTranscripts}>
                <Download className="h-4 w-4 mr-2" />
                Download Transcript
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md pr-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {transcripts ? (
                  transcripts.map((speaker, index) => (
                    <div key={index} className="mb-2">
                      {speaker.name.length > 0 && speaker.message.length > 0 ? (
                        <>
                          <span className="font-semibold">{speaker.name}:</span>{" "}
                          {speaker.message}
                        </>
                      ) : null}
                    </div>
                  ))
                ) : (
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
/*
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
        variant="default"
        onClick={togglePlayPause}
        className="rounded-full"
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

*/
function useAudioPlayer() {
  const [isTranscribing, setTranscribing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  const [conversationData, loading, error] = useOllamaConversation(7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const skipForward = () => {
    // skip 10 seconds forward
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime += 10;
  };

  const skipBack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime -= 10;
  };
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  const setIsTranscribing = (_: boolean) => {
    // transcription delay simulation
    setTimeout(() => {
      setTranscribing((prevState) => !prevState);
    }, 2000);
  };

  const handleTimeUpdate = () => {
    // throttle this function

    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  useEffect(() => {
    setDuration(audioRef.current?.duration || 0);
  }, [audioRef.current]);
  return {
    volume,
    loading,
    error,
    transcripts: conversationData?.conversation,
    isTranscribing,
    currentTime,
    duration,
    setIsTranscribing,
    setVolume,
    skipBack,
    skipForward,
    togglePlayPause,
    isPlaying,
    setIsPlaying,
    audioRef,
    handleLoadedMetadata,
    handleTimeUpdate,
    handleSeek,
  };
}

const FloatingAudioPlayer = ({
  skipBack,
  skipForward,
  togglePlayPause,
  isPlaying,
  volume,
  setIsTranscribing,
  setVolume,
  currentTime,
  audioDuration: duration,
  handleSeek,
}: AudioPlayerProps) => {
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-full shadow-sm p-2 flex items-center space-x-2 border-primary border-[1px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full"
              size="icon"
              onClick={skipBack}
            >
              <SkipBackIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Skip back 10 seconds</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? "Pause" : "Play"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full"
              size="icon"
              onClick={skipForward}
            >
              <SkipForwardIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Skip forward 10 seconds</p>
          </TooltipContent>
        </Tooltip>

        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={handleSeek}
          className="w-48"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              onClick={() => setIsTranscribing(false)}
              id="transcription-mode"
              className="rounded-full"
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
                className="rounded-full"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust Volume</p>
            </TooltipContent>
          </Tooltip>
          {duration != 0 && duration - currentTime < 50 && (
            <div className="absolute bottom-full mb-0 sm:ml-12 md:ml-24 lg:ml-36 px-1 py-1 bg-white left-1/2 transform -translate-x-1/2 rounded-lg border-[1px] ">
              <Button>
                <a href={`/questions`}>Go to Questions</a>
              </Button>
            </div>
          )}

          {isVolumeVisible && (
            <div className="absolute bottom-full mb-2 px-2 py-2 bg-white left-1/2 transform -translate-x-1/2 rounded-lg border-[1px] ">
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

interface AudioPageProps {
  name: string;
  audioUrl: string;
}
export default function AudioTranscriptionPage({
  //name,
  audioUrl,
}: AudioPageProps) {
  const {
    audioRef,
    isTranscribing,
    isPlaying,
    volume,
    transcripts,
    setIsTranscribing,
    setVolume,
    skipBack,
    skipForward,
    togglePlayPause,
    handleSeek,
    duration,
    currentTime,
    handleLoadedMetadata,
    handleTimeUpdate,
  } = useAudioPlayer();
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-6 w-[32rem] md:w-[64rem]">
        {isTranscribing ? (
          <>
            <AudioTranscriptionTabsSplit transcripts={transcripts} />
            <AudioTranscriptionTabs transcripts={transcripts} />
            <FloatingAudioPlayer
              isTranscribing={isTranscribing}
              isPlaying={isPlaying}
              audioDuration={duration}
              currentTime={currentTime}
              volume={volume}
              handleSeek={handleSeek}
              setIsTranscribing={setIsTranscribing}
              skipForward={skipForward}
              skipBack={skipBack}
              togglePlayPause={togglePlayPause}
              setVolume={setVolume}
            />
          </>
        ) : (
          <AudioPlayer
            isTranscribing={isTranscribing}
            isPlaying={isPlaying}
            audioDuration={duration}
            currentTime={currentTime}
            volume={volume}
            handleSeek={handleSeek}
            setIsTranscribing={setIsTranscribing}
            skipForward={skipForward}
            skipBack={skipBack}
            togglePlayPause={togglePlayPause}
            setVolume={setVolume}
          />
        )}
        {/*
         */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate} // changed it to handle it in a useEffect
        />
        {/*
         */}
      </div>
    </TooltipProvider>
  );
}

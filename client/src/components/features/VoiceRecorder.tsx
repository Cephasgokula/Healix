"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Pause, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onUpload?: (audioBlob: Blob, transcript: string) => Promise<void>;
  className?: string;
}

export function VoiceRecorder({ onUpload, className }: VoiceRecorderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [transcript, setTranscript] = React.useState("");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = React.useRef<any>(null);

  // Initialize speech recognition
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          if (finalTranscript) {
            setTranscript((prev) => prev + finalTranscript);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start speech recognition
      if (recognitionRef.current) {
        setTranscript("");
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUpload = async () => {
    if (audioBlob && onUpload) {
      setIsUploading(true);
      try {
        await onUpload(audioBlob, transcript);
        resetRecorder();
        setIsOpen(false);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const resetRecorder = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscript("");
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 flex items-center justify-center text-white",
          className
        )}
      >
        <Mic className="h-6 w-6" />
      </motion.button>

      {/* Recording Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isRecording ? "Recording..." : audioBlob ? "Review Recording" : "Voice Symptom Recording"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-6">
            {/* Recording Visualization */}
            <div className="relative">
              <motion.div
                animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center",
                  isRecording
                    ? "bg-destructive/20"
                    : audioBlob
                    ? "bg-secondary/20"
                    : "bg-primary/20"
                )}
              >
                <motion.div
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.75 }}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center",
                    isRecording
                      ? "bg-destructive/30"
                      : audioBlob
                      ? "bg-secondary/30"
                      : "bg-primary/30"
                  )}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      isRecording
                        ? "bg-destructive text-destructive-foreground"
                        : audioBlob
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {isRecording ? (
                      <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Audio Playback */}
            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}

            {/* Controls */}
            <div className="flex items-center gap-4">
              {!audioBlob ? (
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={isRecording ? stopRecording : startRecording}
                  className="rounded-full px-8"
                >
                  {isRecording ? (
                    <>
                      <Square className="h-5 w-5 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="icon" onClick={togglePlayback} className="rounded-full">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="outline" onClick={resetRecorder} className="rounded-full">
                    <X className="h-5 w-5 mr-2" />
                    Discard
                  </Button>
                  <Button onClick={handleUpload} disabled={isUploading} className="rounded-full">
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Submit"}
                  </Button>
                </>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="w-full">
                <p className="text-sm font-medium text-muted-foreground mb-2">Transcript:</p>
                <div className="bg-muted rounded-lg p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm">{transcript}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

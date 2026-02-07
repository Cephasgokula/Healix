"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Search,
  Play,
  Pause,
  Download,
  Trash2,
  Eye,
  Clock,
  Loader2,
} from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Backend API base URL
const API_URL = "http://localhost:3001";

// Recording type from backend
interface Recording {
  id: string;
  fileId: string;
  name: string;
  email: string;
  transcript: string;
  sentimentScore: number;
  urgencyRank: number;
  uploadDate: string;
  aiAnalysis?: {
    severity: string;
    detectedSymptoms: string[];
  };
}

const getUrgencyColor = (urgencyRank: number) => {
  switch (urgencyRank) {
    case 1:
      return "bg-[#DC2626] text-white"; // critical
    case 2:
      return "bg-[#EA580C] text-white"; // high
    case 3:
      return "bg-[#FBBF24] text-black"; // medium
    default:
      return "bg-[#22C55E] text-white"; // low
  }
};

const getUrgencyLabel = (urgencyRank: number) => {
  switch (urgencyRank) {
    case 1: return "critical";
    case 2: return "high";
    case 3: return "medium";
    default: return "low";
  }
};

export default function AudioPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRecording, setSelectedRecording] = React.useState<Recording | null>(null);
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const [recordings, setRecordings] = React.useState<Recording[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Fetch recordings from API
  React.useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await fetch(`${API_URL}/audios`);
        const data = await response.json();
        setRecordings(data);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
        toast.error("Failed to load recordings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecordings();
  }, []);

  const filteredRecordings = recordings.filter(
    (recording) =>
      recording.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.transcript?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlay = (recording: Recording) => {
    if (playingId === recording.id) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
    } else {
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Start new playback
      const audio = new Audio(`${API_URL}/audio/${recording.fileId}`);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        toast.error("Failed to play audio");
        setPlayingId(null);
      };
      audio.play();
      audioRef.current = audio;
      setPlayingId(recording.id);
    }
  };

  const handleDownload = (recording: Recording) => {
    window.open(`${API_URL}/audio/${recording.fileId}`, "_blank");
  };

  return (
    <PageLayout variant="admin">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <Mic className="h-8 w-8 text-accent" />
              Audio Recordings
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage patient voice recordings
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {isLoading ? "Loading..." : `${recordings.length} recordings total`}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user or transcript..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recordings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                Recordings ({filteredRecordings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredRecordings.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  No recordings found
                </div>
              ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Transcript Preview</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecordings.map((recording) => (
                      <TableRow key={recording.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                              <Mic className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <span className="font-medium">{recording.name || "Anonymous"}</span>
                              <p className="text-xs text-muted-foreground">{recording.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-muted-foreground text-sm">
                            {recording.transcript || "No transcript"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getUrgencyColor(recording.urgencyRank)}>
                            {getUrgencyLabel(recording.urgencyRank)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {recording.sentimentScore}/100
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(recording.uploadDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePlay(recording)}
                            >
                              {playingId === recording.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRecording(recording)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownload(recording)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transcript Dialog */}
      <Dialog open={!!selectedRecording} onOpenChange={() => setSelectedRecording(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-accent" />
              Recording Details
            </DialogTitle>
            <DialogDescription>
              Full transcript and recording information
            </DialogDescription>
          </DialogHeader>
          {selectedRecording && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{selectedRecording.name || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecording.email} • {new Date(selectedRecording.uploadDate).toLocaleString()}
                  </p>
                </div>
                <Badge className={getUrgencyColor(selectedRecording.urgencyRank)}>
                  {getUrgencyLabel(selectedRecording.urgencyRank)}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Transcript</h4>
                <p className="p-4 rounded-lg bg-muted/30 text-muted-foreground">
                  {selectedRecording.transcript || "No transcript available"}
                </p>
              </div>
              {selectedRecording.aiAnalysis && (
                <div>
                  <h4 className="font-medium mb-2">AI Analysis</h4>
                  <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Severity:</span>{" "}
                      <span className="font-medium">{selectedRecording.aiAnalysis.severity}</span>
                    </p>
                    {selectedRecording.aiAnalysis.detectedSymptoms?.length > 0 && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Symptoms:</span>{" "}
                        {selectedRecording.aiAnalysis.detectedSymptoms.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Button 
                  className="flex-1"
                  onClick={() => togglePlay(selectedRecording)}
                >
                  {playingId === selectedRecording.id ? (
                    <><Pause className="mr-2 h-4 w-4" /> Pause</>
                  ) : (
                    <><Play className="mr-2 h-4 w-4" /> Play Recording</>
                  )}
                </Button>
                <Button variant="outline" onClick={() => handleDownload(selectedRecording)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

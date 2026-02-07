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
  Filter,
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

// Mock audio recordings data
const mockRecordings = [
  {
    id: "1",
    userId: "u1",
    userName: "Priya Patel",
    duration: "2:34",
    transcript: "I have been experiencing severe headaches for the past three days. The pain is mostly on the right side of my head and gets worse in the evening. I also feel nauseous sometimes.",
    urgency: "medium",
    createdAt: "2024-04-01T10:30:00Z",
    status: "processed",
  },
  {
    id: "2",
    userId: "u2",
    userName: "Rajesh Kumar",
    transcript: "Chest pain that started suddenly this morning. Sharp pain that radiates to my left arm. Difficulty breathing. I'm very worried.",
    duration: "1:45",
    urgency: "critical",
    createdAt: "2024-04-01T09:15:00Z",
    status: "processed",
  },
  {
    id: "3",
    userId: "u3",
    userName: "Ananya Gupta",
    transcript: "Mild fever and sore throat for two days. Taking over-the-counter medication but not improving much.",
    duration: "1:12",
    urgency: "low",
    createdAt: "2024-04-01T08:00:00Z",
    status: "processed",
  },
  {
    id: "4",
    userId: "u4",
    userName: "Vikram Singh",
    transcript: "Stomach pain after eating. Bloating and gas. Happens almost every day now.",
    duration: "1:58",
    urgency: "medium",
    createdAt: "2024-03-31T15:45:00Z",
    status: "pending",
  },
  {
    id: "5",
    userId: "u5",
    userName: "Kavita Nair",
    transcript: "High blood pressure readings. Getting 160/100 consistently. On medication but no improvement.",
    duration: "2:10",
    urgency: "high",
    createdAt: "2024-03-31T14:20:00Z",
    status: "processed",
  },
];

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "critical":
      return "bg-[#DC2626] text-white";
    case "high":
      return "bg-[#EA580C] text-white";
    case "medium":
      return "bg-[#FBBF24] text-black";
    case "low":
      return "bg-[#22C55E] text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function AudioPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRecording, setSelectedRecording] = React.useState<typeof mockRecordings[0] | null>(null);
  const [playingId, setPlayingId] = React.useState<string | null>(null);

  const filteredRecordings = mockRecordings.filter(
    (recording) =>
      recording.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.transcript.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
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
            {mockRecordings.length} recordings total
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Transcript Preview</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
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
                            <span className="font-medium">{recording.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {recording.duration}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-muted-foreground text-sm">
                            {recording.transcript}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getUrgencyColor(recording.urgency)}>
                            {recording.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              recording.status === "processed"
                                ? "text-secondary border-secondary"
                                : "text-yellow-500 border-yellow-500"
                            }
                          >
                            {recording.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(recording.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePlay(recording.id)}
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
                            <Button variant="ghost" size="icon">
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
                  <p className="font-medium">{selectedRecording.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRecording.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge className={getUrgencyColor(selectedRecording.urgency)}>
                  {selectedRecording.urgency}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Transcript</h4>
                <p className="p-4 rounded-lg bg-muted/30 text-muted-foreground">
                  {selectedRecording.transcript}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button className="flex-1">
                  <Play className="mr-2 h-4 w-4" />
                  Play Recording
                </Button>
                <Button variant="outline">
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

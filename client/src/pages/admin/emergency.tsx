"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  Clock,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EmergencyPatient } from "@/types";
import { getEmergencyRanking } from "@/lib/api";
import { toast } from "sonner";

// Mock emergency data removed - now fetching from API

const getUrgencyColor = (level: string) => {
  switch (level) {
    case "critical":
      return { bg: "bg-[#DC2626]", text: "text-white", border: "border-[#DC2626]" };
    case "high":
      return { bg: "bg-[#EA580C]", text: "text-white", border: "border-[#EA580C]" };
    case "medium":
      return { bg: "bg-[#FBBF24]", text: "text-black", border: "border-[#FBBF24]" };
    case "low":
      return { bg: "bg-[#22C55E]", text: "text-white", border: "border-[#22C55E]" };
    default:
      return { bg: "bg-gray-200", text: "text-gray-800", border: "border-gray-200" };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-500 border-yellow-500";
    case "in-progress":
      return "text-primary border-primary";
    case "resolved":
      return "text-secondary border-secondary";
    default:
      return "text-muted-foreground";
  }
};

const getTimeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return new Date(date).toLocaleDateString();
};

export default function EmergencyPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [emergencies, setEmergencies] = React.useState<EmergencyPatient[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch emergency data from API on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmergencyRanking();
        setEmergencies(data);
      } catch (error) {
        console.error("Failed to fetch emergency data:", error);
        toast.error("Failed to load emergency data. Please ensure the server is running.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEmergencies = emergencies.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const stats = {
    critical: emergencies.filter((e) => e.urgencyLevel === "critical").length,
    high: emergencies.filter((e) => e.urgencyLevel === "high").length,
    pending: emergencies.filter((e) => e.status === "pending").length,
  };

  return (
    <PageLayout variant="admin">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            Emergency Ranking
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered urgency ranking of patient cases for triage
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="bg-[#DC2626]/10 border-[#DC2626]/20 border shadow-none">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#DC2626]">{stats.critical}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </CardContent>
          </Card>
          <Card className="bg-[#EA580C]/10 border-[#EA580C]/20 border shadow-none">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#EA580C]">{stats.high}</p>
              <p className="text-sm text-muted-foreground">High</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/20 border shadow-none">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Emergency Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Emergency Queue (Sorted by AI Urgency Score)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {filteredEmergencies.map((emergency, index) => {
                    const colors = getUrgencyColor(emergency.urgencyLevel);
                    const isExpanded = expandedId === emergency._id;

                    return (
                      <motion.div
                        key={emergency._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded-lg border-2 ${colors.border} overflow-hidden`}
                      >
                        {/* Header */}
                        <div
                          className={`p-4 cursor-pointer ${colors.bg} ${colors.text}`}
                          onClick={() => toggleExpand(emergency._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl font-bold">#{index + 1}</div>
                              <div>
                                <p className="font-semibold">{emergency.name}</p>
                                <p className="text-sm opacity-80">
                                  Score: {emergency.urgencyScore}/100
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={`${getStatusColor(emergency.status)} bg-white/90`}>
                                {emergency.status}
                              </Badge>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="p-4 bg-white dark:bg-slate-800 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {getTimeAgo(emergency.createdAt)}
                            </div>

                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                Symptoms
                              </h4>
                              <p className="text-muted-foreground p-3 rounded-lg bg-muted/50">
                                {emergency.symptoms}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {emergency.status !== "resolved" && (
                                <>
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Contact Patient
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Mark In-Progress
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-secondary border-secondary">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Resolve
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Users,
  Mic,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    href: "/admin/users",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Audio Recordings",
    value: "3,421",
    change: "+8%",
    trend: "up",
    icon: Mic,
    href: "/admin/audio",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Emergency Cases",
    value: "147",
    change: "-5%",
    trend: "down",
    icon: AlertTriangle,
    href: "/admin/emergency",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Diagnoses Today",
    value: "892",
    change: "+23%",
    trend: "up",
    icon: Activity,
    href: "/admin",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

const recentUsers = [
  { id: "1", name: "Dr. Arun Sharma", email: "arun@hospital.com", role: "Doctor", joinedAt: "2 hours ago" },
  { id: "2", name: "Priya Patel", email: "priya@email.com", role: "Patient", joinedAt: "5 hours ago" },
  { id: "3", name: "Rajesh Kumar", email: "rajesh@email.com", role: "Patient", joinedAt: "Yesterday" },
  { id: "4", name: "Dr. Sunita Reddy", email: "sunita@hospital.com", role: "Doctor", joinedAt: "Yesterday" },
];

const emergencyCases = [
  { id: "1", patient: "Anonymous", urgency: "critical", symptoms: "Chest pain, shortness of breath", time: "10 min ago" },
  { id: "2", patient: "John D.", urgency: "high", symptoms: "Severe abdominal pain", time: "25 min ago" },
  { id: "3", patient: "Jane S.", urgency: "medium", symptoms: "High fever, headache", time: "1 hour ago" },
];

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "critical":
      return "bg-[#DC2626] text-white";
    case "high":
      return "bg-[#EA580C] text-white";
    case "medium":
      return "bg-[#FBBF24] text-black";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function AdminDashboard() {
  return (
    <PageLayout variant="admin">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with Healix today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="bg-white dark:bg-slate-800 border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-secondary" : "text-destructive"}`}>
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-4">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Users
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/users">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.role === "Doctor" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{user.joinedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Cases */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Emergency Queue
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/emergency">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyCases.map((emergency) => (
                    <div key={emergency.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{emergency.patient}</span>
                        <Badge className={getUrgencyColor(emergency.urgency)}>
                          {emergency.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{emergency.symptoms}</p>
                      <p className="text-xs text-muted-foreground mt-2">{emergency.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-primary to-accent text-white border-0 shadow-lg">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Need to process emergency cases?</h3>
                <p className="text-white/80 text-sm mt-1">
                  Review AI-ranked emergency cases and triage patients efficiently.
                </p>
              </div>
              <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link href="/admin/emergency">
                  View Emergency Queue
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}

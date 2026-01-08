"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Mail, Calendar, Users, Sparkles } from "lucide-react";

export default function MentorshipRequestPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "general",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        setForm(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || ''
        }));
      }
    }
    fetchUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/mentorship/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?._id || null,
          userName: form.name,
          userEmail: form.email,
          userPhone: form.phone || null,
          type: form.type,
          subject: form.subject || "General Mentorship Request",
          message: form.message,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.back();
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to send request:", error);
    } finally {
      setSubmitting(false);
    }
  }

  const charCount = form.message.length;
  const minChars = 50;
  const isValid = charCount >= minChars && form.name && form.email && form.subject;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4 animate-bounce">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
          <p className="text-muted-foreground mb-4">
            We'll reach out within 24 hours to help you with your challenges.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting you back...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
            <Users className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Get Personal Mentorship</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with mentors who've mastered these concepts and can guide you through challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200">
            <Mail className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-bold mb-1">Email Response</h3>
            <p className="text-sm text-muted-foreground">Detailed help via email within 24 hours</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-bold mb-1">Live Session</h3>
            <p className="text-sm text-muted-foreground">Schedule 1-on-1 call if needed</p>
          </Card>
        </div>

        <Card className="p-8 border-2">
          <h2 className="text-2xl font-bold mb-6">Request Mentoring Session</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="type">Request Type *</Label>
                <select
                  id="type"
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Help</option>
                  <option value="career">Career Guidance</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g., Need help with Dynamic Programming"
                className="mt-1.5"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="message">What challenges are you facing? *</Label>
                <Badge variant={charCount >= minChars ? "default" : "outline"}>
                  {charCount}/{minChars}
                </Badge>
              </div>
              <Textarea
                id="message"
                required
                rows={8}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your challenges in detail..."
                className="mt-1.5 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 <strong>Be specific!</strong> Mention topics, concepts you're struggling with. The more detail (50+ words), the better we can help.
              </p>
            </div>

            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>What to expect:</strong> Our mentors will analyze your request and provide personalized guidance with targeted resources.
                </div>
              </div>
            </Card>

            <Button
              type="submit"
              disabled={submitting || !isValid}
              className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Sending...
                </span>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Send Mentorship Request
                </>
              )}
            </Button>

            {!isValid && (charCount > 0 || form.name || form.email) && (
              <p className="text-xs text-orange-600 text-center">
                {!form.name && "Please enter your name. "}
                {!form.email && "Please enter your email. "}
                {!form.subject && "Please enter a subject. "}
                {charCount < minChars && `Write ${minChars - charCount} more characters.`}
              </p>
            )}
          </form>
        </Card>

        <Card className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-300">
          <p className="text-sm text-center text-yellow-900 dark:text-yellow-200">
            ⚡ <strong>Fast response:</strong> We typically respond within 24 hours
          </p>
        </Card>
      </div>
    </div>
  );
}

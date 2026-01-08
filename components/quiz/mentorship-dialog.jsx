"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Mail } from "lucide-react";

export function MentorshipDialog({ open, onOpenChange, roadmap, percentage, attemptNumber }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "a8b92b0d-9f1f-4fd5-b884-ba1facd5e12e",
          name: form.name,
          email: form.email,
          phone: form.phone || "Not provided",
          message: `Roadmap: ${roadmap.title}\nBest Score: ${percentage}%\nAttempts: ${attemptNumber}\n\nMessage:\n${form.message}`,
          subject: `Quiz Help Request - ${roadmap.title}`,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(false);
          setForm({ name: "", email: "", phone: "", message: "" });
        }, 2500);
      }
    } catch (error) {
      console.error("Failed to send request:", error);
    } finally {
      setSubmitting(false);
    }
  }

  const charCount = form.message.length;
  const minChars = 50;
  const isMessageValid = charCount >= minChars;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            🤝 Get Personal Mentorship
          </DialogTitle>
          <DialogDescription className="text-base">
            Connect with mentors who've been in your shoes—they've struggled with these concepts and successfully mastered them. Get guidance from experienced developers.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8 animate-in zoom-in duration-300">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Request Sent Successfully!
            </h3>
            <p className="text-muted-foreground">
              We'll reach out within 24 hours to help you succeed.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Two Options */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-purple-200">
                <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-bold mb-1">Email Response</h4>
                <p className="text-xs text-muted-foreground">Get detailed help via email</p>
              </div>
              <a
                href="https://topmate.io/daksh_saini12/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <h4 className="font-bold mb-1">Book Live Session</h4>
                <p className="text-xs opacity-90">Schedule 1-on-1 call instantly</p>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="message">What topics are you struggling with? *</Label>
                  <span className={`text-xs ${charCount >= minChars ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {charCount}/{minChars} chars {charCount < minChars && `(${minChars - charCount} more)`}
                  </span>
                </div>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Example: I'm struggling with SQL joins - specifically understanding LEFT vs INNER joins. I've watched tutorials but still confused when to use each type. I need help with:&#10;&#10;• Understanding the difference between JOIN types&#10;• Practical examples with real data&#10;• Common mistakes to avoid&#10;• When to use which join in production&#10;&#10;I keep getting wrong results in my queries and don't understand why..."
                  className="mt-1 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  💡 <strong>Be specific!</strong> Mention exact concepts, error patterns, or where you get stuck. The more detail you provide (50-100 words), the better we can help you.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold mb-2">📊 Your Current Progress:</p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Roadmap</p>
                    <p className="font-bold truncate">{roadmap.title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Best Score</p>
                    <p className="font-bold">{percentage}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Attempts</p>
                    <p className="font-bold">{attemptNumber}</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting || !isMessageValid}
                className="w-full h-12 text-base"
              >
                {submitting ? (
                  <>
                    <span className="animate-pulse">Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    Send Mentorship Request
                  </>
                )}
              </Button>

              {!isMessageValid && charCount > 0 && (
                <p className="text-xs text-orange-600 text-center">
                  Please write at least {minChars - charCount} more characters to help us understand your challenge better.
                </p>
              )}
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

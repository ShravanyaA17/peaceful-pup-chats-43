import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  BookOpen,
  Download,
  Calendar,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Journal() {
  const [journalEntry, setJournalEntry] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const journalPrompts = [
    "What made me smile today?",
    "What challenged me today and how did I handle it?",
    "What am I grateful for right now?",
    "How am I feeling in this moment?",
    "What do I need more of in my life?",
    "What am I proud of myself for?",
    "What would I tell a friend going through what I'm experiencing?",
    "What small step can I take tomorrow to care for myself?",
  ];

  const downloadPDF = async () => {
    if (!contentRef.current || !journalEntry.trim()) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#faf9f7",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const today = new Date().toLocaleDateString();
      pdf.save(`Peace-Journal-${today}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-comfort p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-comfort border-peace-pink/20">
          <div ref={contentRef}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-peace-purple/20 to-peace-pink/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-peace-purple" />
              </div>
              <h1 className="text-3xl font-bold text-peace-text-soft mb-4">
                Your Peaceful Journal
              </h1>
              <p className="text-peace-text-gentle leading-relaxed max-w-2xl mx-auto">
                This is your safe space to explore your thoughts and feelings.
                Let your words flow freely, without judgment.
              </p>
            </div>

            <div className="space-y-8">
              {/* Journal prompts */}
              <div>
                <h3 className="text-lg font-semibold text-peace-text-soft mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-peace-purple" />
                  Writing prompts to get you started
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {journalPrompts.map((prompt, index) => (
                    <Card
                      key={index}
                      className="p-4 hover:bg-peace-warm/30 transition-colors cursor-pointer border-peace-pink/20"
                      onClick={() => setJournalEntry(prompt + "\n\n")}
                    >
                      <p className="text-peace-text-soft text-sm">{prompt}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Writing area */}
              <div>
                <h3 className="text-lg font-semibold text-peace-text-soft mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-peace-purple" />
                  Write your thoughts
                </h3>
                <Textarea
                  placeholder="Let your thoughts flow here... What's on your mind today?"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="min-h-[300px] resize-none text-base leading-relaxed"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2 text-peace-text-gentle text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadPDF}
                      disabled={!journalEntry.trim()}
                      variant="comfort"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>

              {/* Encouragement */}
              <div className="bg-peace-warm/50 p-6 rounded-xl border border-peace-pink/20">
                <p className="text-peace-text-soft leading-relaxed text-center">
                  <strong>Remember:</strong> There's no wrong way to journal.
                  Your words are valid, your feelings matter, and this space is
                  completely yours.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

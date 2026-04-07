'use client';

import React, { useEffect, useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle2, Download, AlertCircle, Search, Send, Bot, X, MessageCircle, Presentation, FileDown, ArrowRight, RotateCcw, Eye, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function GeneratePage() {
  const [step, setStep] = useState(1);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState<number | "">(10);
  const [difficulty, setDifficulty] = useState("Medium");
  const [topic, setTopic] = useState("");
  const [includeAnswers, setIncludeAnswers] = useState(false);

  // Processing State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingText, setLoadingText] = useState("");

  // Results State
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealAll, setRevealAll] = useState(false);

  // --- CHAT TUTOR STATE ---
  const [fileId, setFileId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([
    { role: "assistant", content: "Hi! I'm your AI Tutor. Ask me anything about the document or the quiz!" }
  ]);

  // Ref for auto-scrolling chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- PPT CONVERSION STATE ---
  const [activeTab, setActiveTab] = useState<'pdf' | 'ppt'>('pdf');
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedPdfBlob, setConvertedPdfBlob] = useState<Blob | null>(null);

  // --- SIDEBAR RESIZE STATE ---
  const [chatWidth, setChatWidth] = useState(400); // Default width 400px

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    const startWidth = chatWidth;
    const startPosition = mouseDownEvent.clientX;

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = startWidth - (mouseMoveEvent.clientX - startPosition);
      setChatWidth(Math.max(300, Math.min(newWidth, 800)));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading, isChatOpen]);

  useEffect(() => {
    const savedMcqs = localStorage.getItem('questai_mcqs');
    const savedStep = localStorage.getItem('questai_step');
    const savedTopic = localStorage.getItem('questai_topic');
    const savedFileId = localStorage.getItem('questai_file_id');
    const savedChat = localStorage.getItem('questai_chat');

    if (savedMcqs && savedStep === '3') {
      setMcqs(JSON.parse(savedMcqs));
      setStep(3);
      if (savedTopic) setTopic(savedTopic);
      if (savedFileId) setFileId(savedFileId);
      if (savedChat) setChatMessages(JSON.parse(savedChat));
    }
  }, []);

  // --- THE JANITOR (Cleanup on Page Leave) ---
  useEffect(() => {
    return () => {
      if (fileId) {
        fetch(`${API_BASE_URL}/cleanup/${fileId}`, {
          method: 'POST',
          keepalive: true
        }).catch(err => console.error("Cleanup failed:", err));
      }
    };
  }, [fileId]);

  const handleGenerate = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setStep(2);

    try {
      setLoadingText("Reading and vectorizing PDF document...");
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.detail || "Failed to upload PDF");
      setFileId(uploadData.file_id);

      setLoadingText(`AI is searching for '${topic || "main concepts"}' and generating questions...`);
      const generateRes = await fetch(`${API_BASE_URL}/generate-mcqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: uploadData.file_id,
          num_questions: numQuestions,
          difficulty: difficulty,
          topic: topic.trim() === "" ? "main concepts and key details" : topic
        }),
      });
      const generateData = await generateRes.json();
      if (!generateRes.ok) throw new Error(generateData.detail || "Failed to generate MCQs");
      if (generateData.status === "error") throw new Error(generateData.message);

      setMcqs(generateData.mcqs);
      setStep(3);

      localStorage.setItem("questai_mcqs", JSON.stringify(generateData.mcqs));
      localStorage.setItem("questai_step", "3");
      localStorage.setItem("questai_topic", topic);
      localStorage.setItem("questai_file_id", uploadData.file_id);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (includeAnswers: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/download-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mcqs, include_answers: includeAnswers }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF paper");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MCQ_Paper_${difficulty}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error downloading PDF.");
    }
  };

  // --- SEND CHAT MESSAGE ---
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !fileId) return;

    const userMessage = chatInput.trim();
    setChatInput("");

    const updatedMessages = [...chatMessages, { role: "user", content: userMessage }];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: fileId,
          message: userMessage,
          history: chatMessages
        })
      });

      const data = await res.json();

      if (res.ok) {
        setChatMessages(prev => {
          const newHistory = [...prev, { role: "assistant", content: data.reply }];
          localStorage.setItem('questai_chat', JSON.stringify(newHistory));
          return newHistory;
        });
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.detail}` }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't connect to the server." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- PPT CONVERSION HANDLERS ---
  const handleConvertPpt = async () => {
    if (!pptFile) {
      setError("Please select a PPT or PPTX file first.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", pptFile);

      const res = await fetch(`${API_BASE_URL}/convert-ppt`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to convert PPT");
      }

      const blob = await res.blob();
      setConvertedPdfBlob(blob);

    } catch (err: any) {
      setError(err.message || "Something went wrong during conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadConvertedPdf = () => {
    if (!convertedPdfBlob || !pptFile) return;
    const url = window.URL.createObjectURL(convertedPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pptFile.name.replace(/\.pptx?$/i, '.pdf');
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handlePassToGenerator = () => {
    if (!convertedPdfBlob || !pptFile) return;
    const newPdfFile = new File([convertedPdfBlob], pptFile.name.replace(/\.pptx?$/i, '.pdf'), { type: 'application/pdf' });
    setFile(newPdfFile);
    setActiveTab('pdf');
  };

  return (
    <main className="relative flex flex-col items-center flex-1 px-4 sm:px-6 pt-12 pb-20 w-full overflow-hidden">

      {/* STEP 1: Upload & Configure */}
      {step === 1 && (
        <div className="relative z-10 w-full max-w-2xl p-6 sm:p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Configure Your Quiz</h2>

          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">

            {/* --- TAB SWITCHER --- */}
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'pdf' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Generate from PDF
              </button>
              <button
                onClick={() => setActiveTab('ppt')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'ppt' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Convert PPT
              </button>
            </div>

            {/* --- TAB 1: PDF MCQ GENERATOR --- */}
            {activeTab === 'pdf' && (
              <div className="animate-in fade-in">
                <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-6 sm:p-8 hover:border-purple-500 hover:bg-purple-500/5 transition-all text-center mb-6">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none relative z-0">
                    {file ? (
                      <>
                        <FileText className="w-10 h-10 text-purple-400" />
                        <p className="text-white font-medium break-all px-4">{file.name}</p>
                        <p className="text-xs text-green-400">PDF Ready for Generation!</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 text-gray-400" />
                        <p className="text-gray-300">Drag & drop your PDF here</p>
                        <p className="text-xs text-gray-500">or tap to browse</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Number of Questions</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={numQuestions || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNumQuestions(value === "" ? "" : parseInt(value));
                      }}
                      className="w-full p-3.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full p-3.5 bg-[#111] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white appearance-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Search className="w-4 h-4" /> Focus Topic (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 'Newton's Laws' or leave blank"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-600"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!file}
                  className="w-full py-4 font-bold text-black bg-white rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white transition-all"
                >
                  Generate MCQs Now
                </button>
              </div>
            )}

            {/* --- TAB 2: PPT TO PDF CONVERTER --- */}
            {activeTab === 'ppt' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">

                {/* PPT Dropzone */}
                {!convertedPdfBlob && !isConverting && (
                  <>
                    <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-6 sm:p-8 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-center mb-6">
                      <input
                        type="file"
                        accept=".ppt,.pptx"
                        onChange={(e) => setPptFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none relative z-0">
                        {pptFile ? (
                          <>
                            <Presentation className="w-10 h-10 text-orange-400" />
                            <p className="text-white font-medium break-all px-4">{pptFile.name}</p>
                            <p className="text-xs text-gray-500">Ready to convert</p>
                          </>
                        ) : (
                          <>
                            <Presentation className="w-10 h-10 text-gray-400" />
                            <p className="text-gray-300">Drag & drop your PPT/PPTX here</p>
                            <p className="text-xs text-gray-500">or tap to browse</p>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleConvertPpt}
                      disabled={!pptFile}
                      className="w-full py-4 font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      Convert to PDF
                    </button>
                  </>
                )}

                {/* Converting Loading State */}
                {isConverting && (
                  <div className="flex flex-col items-center justify-center py-12 border border-white/10 rounded-xl bg-black/20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-white font-medium">Converting Presentation...</p>
                    <p className="text-sm text-gray-400 text-center mt-2 px-6">
                      This takes a few seconds as we render the slides.
                    </p>
                  </div>
                )}

                {/* Conversion Success State */}
                {convertedPdfBlob && !isConverting && (
                  <div className="flex flex-col items-center py-8 px-4 border border-green-500/30 bg-green-500/5 rounded-xl animate-in zoom-in-95">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2 text-center">Conversion Successful!</h3>
                    <p className="text-sm text-gray-400 mb-8 text-center max-w-sm">
                      Your PowerPoint has been perfectly converted to a PDF. What would you like to do next?
                    </p>

                    <div className="flex flex-col w-full gap-3 sm:px-6">
                      <button
                        onClick={handleDownloadConvertedPdf}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
                      >
                        <FileDown className="w-4 h-4" /> Download the PDF
                      </button>

                      <button
                        onClick={handlePassToGenerator}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium shadow-lg transition-all"
                      >
                        Generate MCQs from PDF <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setConvertedPdfBlob(null);
                          setPptFile(null);
                        }}
                        className="mt-4 text-sm text-gray-500 hover:text-white underline underline-offset-2"
                      >
                        Convert another file
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: Loading */}
      {step === 2 && (
        <div className="flex flex-col items-center justify-center mt-24 px-4 animate-in fade-in text-center">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-6" />
          <h2 className="text-2xl font-bold mb-2 text-white">Analyzing Document</h2>
          <p className="text-gray-400 max-w-md">{loadingText}</p>
        </div>
      )}

      {/* STEP 3: Verification */}
      {step === 3 && (
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 relative">

          {/* Responsive Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-white/10 pb-6 md:border-0 md:pb-0">
            <div>
              <div className="flex items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Review Questions</h2>


              </div>

              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Topic: <span className="text-purple-400 font-medium">{topic || "Main Concepts"}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
              <button
                onClick={() => {
                  setStep(1);
                  setMcqs([]);
                  setFileId(null);
                  setSelectedAnswers({}); // Clear answers on reset
                  setRevealAll(false);    // Reset reveal state
                  localStorage.removeItem("questai_mcqs");
                  localStorage.removeItem("questai_step");
                  localStorage.removeItem("questai_topic");
                  localStorage.removeItem("questai_file_id");
                  localStorage.removeItem("questai_chat");
                  setChatMessages([{ role: "assistant", content: "Hi! I'm your AI Tutor. Ask me anything about the document or the quiz!" }]);
                }}
                title="Upload a new document"
                className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Document</span>
                <span className="sm:hidden">Reset</span>
              </button>
              <button
                onClick={() => setRevealAll(!revealAll)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${revealAll
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
              >
                <Eye className="w-4 h-4" />
                {revealAll ? "Hide Answers" : "Reveal Answers"}
              </button>

              {/* iOS-Style Toggle Switch (For PDF Export) */}
              <label className="flex items-center gap-3 cursor-pointer group w-full sm:w-auto justify-between sm:justify-start border-l border-white/10 pl-0 sm:pl-6">
                <span className={`text-sm font-medium transition-colors ${includeAnswers ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'}`} title="Include answers in downloaded PDF">
                  PDF Key
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={includeAnswers}
                    onChange={() => setIncludeAnswers(!includeAnswers)}
                  />
                  <div className={`block w-11 h-6 rounded-full transition-colors duration-300 ${includeAnswers ? 'bg-blue-500' : 'bg-white/10'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${includeAnswers ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </label>

              {/* Single Download Button */}
              <button
                onClick={() => handleDownload(includeAnswers)}
                className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto text-sm font-bold text-black bg-white rounded-xl hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>

          {/* Floating Action Button */}
          {mcqs && mcqs.length > 0 && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-4 bg-purple-600 text-white rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:bg-purple-500 hover:scale-105 transition-all flex items-center gap-2 z-40"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-bold pr-2 hidden sm:block">Ask AI Tutor</span>
            </button>
          )}

          {/* MCQs List (INTERACTIVE) */}
          <div className="space-y-6">
            {mcqs.map((mcq, index) => {
              const isAnswered = selectedAnswers[index] !== undefined;

              return (
                <div key={index} className="p-5 sm:p-6 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 flex gap-3 text-white">
                    <span className="text-purple-400 flex-shrink-0">{index + 1}.</span>
                    {mcq.question}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-8">
                    {mcq.options.map((opt: string, optIndex: number) => {
                      const isCorrectAnswer = opt === mcq.answer;
                      const isUserSelection = selectedAnswers[index] === opt;

                      // Logic for determining styling
                      let optionStyle = "border-white/5 bg-white/5 text-gray-300 hover:bg-white/10 cursor-pointer";
                      let Icon = null;

                      if (revealAll || isAnswered) {
                        // Once answered (or revealed), lock interactions
                        if (isCorrectAnswer) {
                          optionStyle = "border-green-500/50 bg-green-500/10 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.15)] cursor-default";
                          Icon = <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 animate-in zoom-in" />;
                        } else if (isUserSelection && !isCorrectAnswer) {
                          optionStyle = "border-red-500/50 bg-red-500/10 text-red-100 cursor-default";
                          Icon = <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 animate-in zoom-in" />;
                        } else {
                          optionStyle = "border-white/5 bg-white/5 text-gray-600 opacity-50 cursor-default";
                        }
                      }

                      return (
                        <div
                          key={optIndex}
                          onClick={() => {
                            if (!isAnswered && !revealAll) {
                              setSelectedAnswers(prev => ({ ...prev, [index]: opt }));
                            }
                          }}
                          className={`p-3.5 rounded-xl border text-sm flex items-center justify-between transition-all duration-300 ${optionStyle}`}
                        >
                          <span className="pr-2">{String.fromCharCode(65 + optIndex)}. {opt}</span>
                          {Icon}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- AI TUTOR SLIDE-OUT PANEL --- */}
          {/* Overlay for mobile when drawer is open */}
          {isChatOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsChatOpen(false)}
            />
          )}

          <div
            style={{
              '--chat-width': `${chatWidth}px`,
            } as React.CSSProperties}
            className={`fixed top-0 right-0 h-full bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out w-full md:w-[var(--chat-width)] translate-x-full ${isChatOpen ? '!translate-x-0' : ''}`}
          >
            {/* Desktop Resizer Handle */}
            <div
              onMouseDown={startResizing}
              className="absolute left-0 top-0 w-2 h-full cursor-col-resize hover:bg-purple-500/50 transition-colors z-50 hidden md:block"
            />

            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Bot className="text-purple-400 w-5 h-5" /> Document Tutor
              </h3>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] sm:max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white/5 text-gray-200 border border-white/10 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Target paragraphs
                        p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,

                        // Target bold text to make it pop
                        strong: ({ node, ...props }) => <strong className="font-semibold text-purple-300" {...props} />,

                        // Style numbered lists
                        ol: ({ node, ...props }) => <ol className="mb-4 space-y-2 list-decimal list-outside ml-4 marker:text-purple-400 marker:font-bold" {...props} />,

                        // Create custom styled bullet points
                        ul: ({ node, ...props }) => <ul className="mb-4 space-y-2 list-none" {...props} />,
                        li: ({ node, ...props }) => (
                          <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5 flex-shrink-0">✦</span>
                            <span {...props} />
                          </li>
                        ),

                        // Style Headings
                        h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mt-4 mb-2 pb-1 border-b border-white/10" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-white mt-3 mb-1 uppercase tracking-wider" {...props} />,

                        // Style inline code and code blocks
                        code: ({ node, ...props }: any) => {
                          const inline = (props.className || '').includes('language-');
                          return inline ? (
                            <code className="bg-black/30 text-purple-200 px-1.5 py-0.5 rounded-md text-xs font-mono border border-purple-500/20" {...props} />
                          ) : (
                            <div className="bg-[#050505] p-3 rounded-xl border border-white/10 my-3 overflow-x-auto shadow-inner">
                              <code className="text-xs font-mono text-gray-300 block" {...props} />
                            </div>
                          );
                        },

                        // Style blockquotes for emphasis
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-2 border-purple-500 pl-4 py-1 my-3 bg-purple-500/5 text-gray-300 italic rounded-r-lg" {...props} />
                        ),

                        // Style Tables
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
                            <table className="w-full text-left text-sm" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => <th className="bg-white/5 px-4 py-2 font-semibold text-white border-b border-white/10" {...props} />,
                        td: ({ node, ...props }) => <td className="px-4 py-2 border-b border-white/5 text-gray-300" {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3.5 rounded-2xl bg-white/10 border border-white/10 rounded-bl-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    <span className="text-sm text-gray-400 font-medium">thinking...</span>
                  </div>
                </div>
              )}
              {/* Invisible div to attach auto-scroll ref */}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/50 pb-safe">
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question about the PDF..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Reset Flow Button */}
          <div className="mt-12 mb-8 flex justify-center">
            <button
              onClick={() => {
                setStep(1);
                setMcqs([]);
                setFileId(null);
                localStorage.removeItem("questai_mcqs");
                localStorage.removeItem("questai_step");
                localStorage.removeItem("questai_topic");
                localStorage.removeItem("questai_file_id");
                localStorage.removeItem("questai_chat");
                setChatMessages([{ role: "assistant", content: "Hi! I'm your AI Tutor. Ask me anything about the document or the quiz!" }]);
              }}
              className="text-sm font-medium text-gray-500 hover:text-white underline underline-offset-4 transition-colors"
            >
              Generate New Questions
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
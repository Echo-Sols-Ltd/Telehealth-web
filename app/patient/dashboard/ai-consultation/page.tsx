"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Mic, MoreVertical, Send, Menu } from "lucide-react";
import type { UserData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "../components/sidebar";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIConsultation() {
  const [userInitials, setUserInitials] = useState("JD");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get user initials and profile image from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserStr = localStorage.getItem("currentUser");
      const savedProfileImage = localStorage.getItem("userProfileImage");

      if (currentUserStr) {
        try {
          const currentUser: UserData = JSON.parse(currentUserStr);
          const getInitials = (fullName: string): string => {
            const names = fullName.trim().split(/\s+/);
            if (names.length >= 2) {
              return (
                names[0].charAt(0).toUpperCase() +
                names[names.length - 1].charAt(0).toUpperCase()
              );
            } else if (names.length === 1) {
              return names[0].charAt(0).toUpperCase();
            }
            return "JD";
          };
          setUserInitials(getInitials(currentUser.fullName));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      if (savedProfileImage) {
        setUserProfileImage(savedProfileImage);
      }

      // Listen for profile image updates
      const handleProfileImageUpdate = (e: CustomEvent) => {
        setUserProfileImage(e.detail);
      };
      window.addEventListener(
        "profileImageUpdated",
        handleProfileImageUpdate as EventListener
      );

      return () => {
        window.removeEventListener(
          "profileImageUpdated",
          handleProfileImageUpdate as EventListener
        );
      };
    }
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      // Check if we got a response (even if status is not ok, we might have a fallback response)
      if (data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else if (!response.ok) {
        // If no response and error status, show error message
        throw new Error(data.error || "Failed to get AI response");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          error.message?.includes("quota") || error.message?.includes("billing")
            ? "I'm currently using a fallback response system. For the best experience, please configure your OpenAI API key. However, I can still provide general health information based on your questions."
            : "I'm sorry, I encountered an error. Please try again or contact support if the problem persists.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatMessage = (text: string) => {
    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n/);
    return paragraphs.map((para, idx) => {
      // Check if paragraph contains numbered list
      if (/^\d+\.\s/.test(para.trim())) {
        const lines = para.split(/\n/);
        return (
          <div key={idx} className="space-y-2">
            {lines.map((line, lineIdx) => {
              if (/^\d+\.\s\*\*/.test(line.trim())) {
                // Bold list items
                const match = line.match(/^(\d+\.\s)\*\*(.+?)\*\*:\s*(.+)$/);
                if (match) {
                  return (
                    <p key={lineIdx} className="ml-4">
                      {match[1]}
                      <strong>{match[2]}</strong>: {match[3]}
                    </p>
                  );
                }
              }
              return (
                <p key={lineIdx} className={lineIdx === 0 ? "" : "ml-4"}>
                  {line}
                </p>
              );
            })}
          </div>
        );
      }
      // Regular paragraph
      return (
        <p key={idx} className={idx > 0 ? "mt-4" : ""}>
          {para}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content - Add left margin on desktop to account for fixed sidebar */}
      <main className="flex-1 flex flex-col bg-background w-full overflow-hidden lg:ml-96">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-4">
              {/* Hamburger menu for mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold font-roboto text-gray-900">
                AI Chat
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarFallback className="bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 text-white font-roboto text-sm sm:text-base">
                    TH
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm sm:text-base font-roboto text-gray-700 hidden sm:inline">
                  Telehealth
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12"
              >
                <MoreVertical className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12"
              >
                <Avatar className="h-9 w-9 sm:h-11 sm:w-11">
                  {userProfileImage ? (
                    <AvatarImage src={userProfileImage} alt="Profile" />
                  ) : null}
                  <AvatarFallback className="font-roboto text-sm sm:text-base bg-[#6685FF] text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Today Label */}
          {messages.length > 0 && (
            <div className="text-center">
              <span className="text-sm sm:text-base font-roboto text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                Today
              </span>
            </div>
          )}

          {/* Messages */}
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <h2 className="text-xl sm:text-2xl font-roboto font-semibold text-gray-700">
                  Welcome to AI Consultation
                </h2>
                <p className="text-sm sm:text-base font-roboto text-gray-500 max-w-md">
                  Ask me anything about your health, wellness, or medical
                  questions. I'm here to provide general guidance and
                  information.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 sm:gap-4 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI Avatar (left side) */}
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                      <AvatarFallback className="bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 text-white font-roboto text-sm sm:text-base">
                        TH
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 sm:px-6 py-3 sm:py-4 ${
                      message.sender === "user"
                        ? "bg-[#6685FF] text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`text-sm sm:text-base font-roboto whitespace-pre-wrap ${
                        message.sender === "user"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {message.sender === "ai"
                        ? formatMessage(message.text)
                        : message.text}
                    </div>
                  </div>

                  {/* User Avatar (right side) */}
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                      {userProfileImage ? (
                        <AvatarImage src={userProfileImage} alt="Profile" />
                      ) : null}
                      <AvatarFallback className="font-roboto text-sm sm:text-base bg-[#6685FF] text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 sm:gap-4 justify-start">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                    <AvatarFallback className="bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 text-white font-roboto text-sm sm:text-base">
                      TH
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex gap-2">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-background border-t p-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 sm:gap-4"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0"
            >
              <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-blue-50 border-0 text-base sm:text-lg font-roboto h-12 sm:h-14 rounded-full px-4 sm:px-6"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0"
            >
              <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

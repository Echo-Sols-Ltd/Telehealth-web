"use client";

import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import { Bell, Menu, MessageCircle, Mic, Plus, Search } from "lucide-react";
import { Sidebar } from "../components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type Conversation = {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
  avatar: string;
  status: "active" | "archived";
};

type ChatMessage = {
  id: number;
  sender: "doctor" | "patient";
  text: string;
  time: string;
};

const DOCTOR_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "John Doe",
    preview: "My heart rate is 97 bpm...",
    time: "11:30 PM",
    unread: false,
    avatar: "/images/@profile.png",
    status: "active",
  },
  {
    id: 2,
    name: "Emily Stone",
    preview: "Should I adjust the dosage?",
    time: "10:15 PM",
    unread: true,
    avatar: "/images/@profile.png",
    status: "active",
  },
  {
    id: 3,
    name: "Chris Paul",
    preview: "Thanks doctor, see you soon.",
    time: "Yesterday",
    unread: false,
    avatar: "/images/@profile.png",
    status: "archived",
  },
];

const DOCTOR_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      sender: "patient",
      text: "My heart rate is 97 bpm. What can I do to improve my health?",
      time: "11:25 PM",
    },
    {
      id: 2,
      sender: "doctor",
      text: "Thanks for sharing your heart rate. It's slightly elevated but still within range. Are you feeling any other symptoms?",
      time: "11:27 PM",
    },
    {
      id: 3,
      sender: "patient",
      text: "No, just feeling a bit tired.",
      time: "11:28 PM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "patient",
      text: "Should I adjust the dosage?",
      time: "10:10 PM",
    },
  ],
  3: [
    {
      id: 1,
      sender: "patient",
      text: "Thanks doctor, see you soon.",
      time: "Yesterday",
    },
  ],
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const PATIENT_AUTO_REPLY =
  "Thank you for the clarification, doctor. I'll follow your instructions.";

export default function DoctorChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("JD");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState(DOCTOR_CONVERSATIONS);
  const [messagesByConversation, setMessagesByConversation] =
    useState<Record<number, ChatMessage[]>>(DOCTOR_MESSAGES);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(DOCTOR_CONVERSATIONS[0]?.id ?? null);
  const [messageInput, setMessageInput] = useState("");

  const {
    supported: speechSupported,
    listening,
    transcript,
    isFinal: isTranscriptFinal,
    toggleListening,
    resetTranscript,
  } = useSpeechRecognition({ lang: "en-US", continuous: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentUserStr = localStorage.getItem("currentUser");
    const savedProfileImage = localStorage.getItem("userProfileImage");

    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr) as { fullName?: string };
        if (currentUser.fullName) {
          const names = currentUser.fullName.trim().split(/\s+/);
          const initials =
            names.length >= 2
              ? `${names[0][0]}${names[names.length - 1][0]}`
              : names[0][0];
          setUserInitials(initials.toUpperCase());
        }
      } catch {
        setUserInitials("JD");
      }
    }

    if (savedProfileImage) {
      setUserProfileImage(savedProfileImage);
    }
  }, []);

  useEffect(() => {
    if (!transcript) return;
    setMessageInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if (isTranscriptFinal) {
      // doctor can press send after final result
    }
  }, [isTranscriptFinal]);

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.status === tab &&
      conversation.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const selectedMessages =
    (selectedConversationId &&
      messagesByConversation[selectedConversationId]) ||
    [];

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unread: false }
          : conversation
      )
    );
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId) return;

    const trimmed = messageInput.trim();
    const timestamp = formatTime(new Date());
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "doctor",
      text: trimmed,
      time: timestamp,
    };
    const conversationId = selectedConversationId;

    setMessagesByConversation((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] ?? []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              preview: trimmed,
              time: timestamp,
              unread: false,
            }
          : conversation
      )
    );

    setMessageInput("");

    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now(),
        sender: "patient",
        text: PATIENT_AUTO_REPLY,
        time: formatTime(new Date()),
      };
      setMessagesByConversation((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), reply],
      }));
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                preview: reply.text,
                time: reply.time,
                unread: conversationId !== selectedConversationId,
              }
            : conversation
        )
      );
    }, 1200);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleMicClick = () => {
    if (!speechSupported) {
      alert(
        "Voice input is not supported in this browser. Please use a modern browser like Chrome or Edge."
      );
      return;
    }

    if (!listening) {
      resetTranscript();
    }

    toggleListening();
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6fb]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 lg:ml-96">
        <header className="sticky top-0 z-30 bg-[#f5f6fb]/90 backdrop-blur border-b">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7b8ab0]" />
                  <Input
                    placeholder="Search conversations"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-12 bg-[#dfe4ff] border-0 text-base font-roboto h-12 placeholder:text-[#7b8ab0]"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <MessageCircle className="h-5 w-5 text-[#0c1a3f]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Bell className="h-6 w-6 sm:h-7 sm:w-7 fill-[#061242]" />
              </Button>
              <Avatar className="h-10 w-10 border border-[#e0e6ff]">
                {userProfileImage ? (
                  <AvatarImage src={userProfileImage} alt="Profile" />
                ) : null}
                <AvatarFallback className="bg-[#6685ff] text-white font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex border border-gray-200 rounded-full overflow-hidden text-sm font-semibold">
                  {(["active", "archived"] as const).map((value) => (
                    <button
                      key={value}
                      onClick={() => setTab(value)}
                      className={`flex-1 py-2 transition ${
                        tab === value
                          ? "bg-[#6685FF] text-white"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {value.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full p-4 flex items-start gap-3 border-b border-gray-100 text-left transition ${
                      conversation.id === selectedConversationId
                        ? "bg-[#eef1ff]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Image
                      src={conversation.avatar}
                      alt={conversation.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {conversation.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {conversation.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.preview}
                      </p>
                      {conversation.unread && (
                        <span className="inline-block w-2 h-2 bg-[#6685FF] rounded-full mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat panel */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="bg-[#e4e7ff] p-5 flex items-center gap-3 rounded-t-3xl border-b border-gray-200">
                    <Image
                      src="/images/doc.png"
                      alt="Doctor"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Chatting with</p>
                      <h2 className="text-2xl font-bold text-[#0b1235]">
                        {selectedConversation.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="text-center">
                      <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                        Today
                      </span>
                    </div>
                    {selectedMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          message.sender === "doctor"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.sender === "patient" && (
                          <Image
                            src={selectedConversation.avatar}
                            alt={selectedConversation.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover shrink-0"
                          />
                        )}
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                            message.sender === "doctor"
                              ? "bg-[#6685FF] text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          <span
                            className={`text-xs mt-2 block ${
                              message.sender === "doctor"
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {message.time}
                          </span>
                        </div>
                        {message.sender === "doctor" && (
                          <div className="w-10 h-10 rounded-full bg-[#6685FF] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                            Me
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10">
                        <Plus className="h-5 w-5" />
                      </Button>
                      <Input
                        value={messageInput}
                        onChange={(event) =>
                          setMessageInput(event.target.value)
                        }
                        onKeyDown={handleInputKeyDown}
                        placeholder="Type something..."
                        className="flex-1 bg-[#eef0ff] border-0 h-12 rounded-full px-4"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleMicClick}
                        className={`h-10 w-10 rounded-full ${
                          listening
                            ? "bg-[#526ACC] text-white animate-pulse"
                            : ""
                        }`}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={handleSendMessage}
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a conversation to continue chatting
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

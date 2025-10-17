"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Trash2, Copy, Bot, Sparkles, SquarePen } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { streamChatWithBot } from "@/lib/api/chatbot";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
  lastUpdated: Date;
}

const ChatbotPageClient = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Cuộc hội thoại mới",
      preview: "Bắt đầu cuộc trò chuyện...",
      messages: [],
      lastUpdated: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const cancelStreamRef = useRef<(() => void) | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistories]);

  // Cleanup stream khi component unmount
  useEffect(() => {
    return () => {
      if (cancelStreamRef.current) {
        cancelStreamRef.current();
      }
    };
  }, []);

  const getCurrentChat = () => {
    return chatHistories.find((chat) => chat.id === activeChat);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: "user",
      timestamp: new Date(),
    };

    // Thêm tin nhắn người dùng
    setChatHistories((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, newUserMessage],
              lastUpdated: new Date(),
              preview: userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : ""),
              title: chat.messages.length === 0 ? userMessage.slice(0, 20) + "..." : chat.title,
            }
          : chat
      )
    );

    setMessage("");
    setIsTyping(true);

    // Tạo tin nhắn bot trống để streaming vào
    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
      id: botMessageId,
      content: "",
      sender: "bot",
      timestamp: new Date(),
      isStreaming: true,
    };

    setChatHistories((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, initialBotMessage],
            }
          : chat
      )
    );

    // Bắt đầu streaming
    cancelStreamRef.current = streamChatWithBot(userMessage, {
      onStart: () => {
        console.log("Streaming started");
      },

      onContent: (content: string) => {
        // Cập nhật nội dung streaming
        setChatHistories((prev) =>
          prev.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          content: msg.content + content,
                        }
                      : msg
                  ),
                  lastUpdated: new Date(),
                }
              : chat
          )
        );
      },

      onComplete: (fullContent: string) => {
        // Hoàn thành streaming
        setChatHistories((prev) =>
          prev.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          content: fullContent,
                          isStreaming: false,
                        }
                      : msg
                  ),
                  lastUpdated: new Date(),
                }
              : chat
          )
        );
        setIsTyping(false);
        cancelStreamRef.current = null;
      },

      onError: (error: string) => {
        console.error("Streaming error:", error);
        setChatHistories((prev) =>
          prev.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          content: `⚠️ ${error}`,
                          isStreaming: false,
                        }
                      : msg
                  ),
                }
              : chat
          )
        );
        setIsTyping(false);
        cancelStreamRef.current = null;
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: "Cuộc hội thoại mới",
      preview: "Bắt đầu cuộc trò chuyện...",
      messages: [],
      lastUpdated: new Date(),
    };

    setChatHistories((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const clearChat = () => {
    setChatHistories((prev) =>
      prev.map((chat) =>
        chat.id === activeChat ? { ...chat, messages: [], preview: "Cuộc trò chuyện trống..." } : chat
      )
    );
  };

  const deleteChat = (chatId: string) => {
    setChatHistories((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChat === chatId && chatHistories.length > 1) {
      const remainingChats = chatHistories.filter((chat) => chat.id !== chatId);
      setActiveChat(remainingChats[0]?.id || "");
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentChat = getCurrentChat();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground">Trợ lý ảo</h1>
              <p className="text-xs text-muted-foreground">Career Point</p>
            </div>
          </div>

          <Button
            onClick={createNewChat}
            className="w-full justify-start gap-2 bg-transparent border-none shadow-none hover:shadow-none hover:bg-gray-300/20 text-slate-800 cursor-pointer text-base"
            variant="outline">
            <SquarePen className="w-4 h-4" />
            Cuộc hội trò chuyện mới
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {chatHistories.map((chat) => (
              <Card
                key={chat.id}
                className={cn(
                  "p-3 cursor-pointer transition-colors hover:bg-sidebar-accent group",
                  activeChat === chat.id && "bg-sidebar-accent border-primary"
                )}
                onClick={() => setActiveChat(chat.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <h3 className="text-sm font-medium truncate text-sidebar-foreground">{chat.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.preview}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(chat.lastUpdated)}</p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 p-1 h-auto hover:bg-red-400 hover:text-white cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="px-8 py-4 border-t border-sidebar-border mr-8">
          <Button
            onClick={clearChat}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-white cursor-pointer">
            <Trash2 className="w-4 h-4" />
            Xoá cuộc hội thoại
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border bg-card">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-card-foreground">{currentChat?.title || "AI Assistant"}</h2>
              <p className="text-sm text-muted-foreground">{isTyping ? "Đang trả lời..." : "Sẵn sàng hỗ trợ bạn"}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {currentChat?.messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Xin chào, bạn cần tìm công việc gì hôm nay?
              </div>
            )}

            {currentChat?.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex gap-3 group", msg.sender === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[70%] space-y-1", msg.sender === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "px-4 py-2 rounded-3xl relative",
                      msg.sender === "bot" ? "bg-transparent" : "bg-[#e9eef6] text-slate-800",
                      msg.sender === "user" && "rounded-tr-sm"
                    )}>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                      {msg.isStreaming && <span className="inline-block animate-pulse">Đang tạo phản hồi...</span>}
                    </p>

                    {!msg.isStreaming && msg.content && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "absolute opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto cursor-pointer",
                          msg.sender === "user" ? "right-0 -bottom-7" : "left-2 -bottom-7"
                        )}
                        onClick={() => copyMessage(msg.content)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center border border-slate-300 rounded-4xl bg-background px-2">
              <TextareaAutosize
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                minRows={1}
                maxRows={6}
                disabled={isTyping}
                className="flex-1 resize-none rounded-4xl bg-transparent px-4 py-3 text-base focus:outline-none mr-2"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="h-9 w-9 rounded-full">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPageClient;

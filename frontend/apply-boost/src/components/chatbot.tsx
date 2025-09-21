"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiService } from "@/lib/api";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

interface ChatbotProps {
    className?: string;
}

export function Chatbot({ className }: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "Hi! I'm your ApplyBoost assistant. I can help you with job application questions and career advice.",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: inputValue.trim(),
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const data = await apiService.sendChatMessage(userMessage.text);
            const botMessage: Message = {
                id: `bot-${Date.now()}`,
                text: data.response,
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                text:
                    error instanceof Error
                        ? error.message
                        : "Sorry, I couldn't connect to the server. Please try again later.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Bubble */}
            <Button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
                    isOpen ? "scale-0" : "scale-100"
                } ${className}`}
            >
                <MessageCircle className="w-6 h-6" />
            </Button>

            {/* Chat Popup */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
                    <Card className="w-full max-w-md h-[32rem] bg-card/95 backdrop-blur-sm border-primary/20 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4 slide-in-from-right-4 duration-300 flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-primary/5 border-b border-primary/10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        ApplyBoost Assistant
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Always here to help
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 p-0 hover:bg-muted"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>

                        <CardContent className="flex flex-col flex-1 p-0 min-h-0">
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${
                                            message.sender === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        {message.sender === "bot" && (
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Bot className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                                                message.sender === "user"
                                                    ? "bg-primary text-primary-foreground ml-auto"
                                                    : "bg-muted text-foreground"
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap">
                                                {message.text}
                                            </p>
                                            <p
                                                className={`text-xs mt-1 opacity-70 ${
                                                    message.sender === "user"
                                                        ? "text-primary-foreground/70"
                                                        : "text-muted-foreground"
                                                }`}
                                            >
                                                {message.timestamp.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        {message.sender === "user" && (
                                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                                                <User className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="bg-muted p-3 rounded-2xl">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-75"></div>
                                                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-150"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="border-t border-border p-4 shrink-0">
                                <div className="flex gap-2">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) =>
                                            setInputValue(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask me anything about job applications..."
                                        disabled={isLoading}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        disabled={
                                            !inputValue.trim() || isLoading
                                        }
                                        size="sm"
                                        className="px-3"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}

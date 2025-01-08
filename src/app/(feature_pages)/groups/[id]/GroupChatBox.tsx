"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { GroupMessage } from "@/types/schema";

interface GroupChatBoxProps {
  groupProfileUsername: string;
  groupId: string;
  initialMessages: GroupMessage[];
}

export default function GroupChatBox({
  groupId,
  initialMessages,
  groupProfileUsername,
}: GroupChatBoxProps) {
  const [messages, setMessages] = useState<GroupMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel("group_chat:" + groupId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages" },
        (payload) => {
          console.log(payload);
          const newMessage = payload.new as GroupMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, supabase]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from("group_messages").insert({
        group_id: groupId,
        message: newMessage,
        sender_username: groupProfileUsername,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[700px] flex flex-col">
      <CardContent className="flex flex-col h-full p-4 space-y-4">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col space-y-1 border p-2">
              <span className="text-sm font-medium text-gray-600">
                {message.sender_username}
              </span>
              <div className="rounded-lg p-1 max-w-[80%] break-words">
                {message.message}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

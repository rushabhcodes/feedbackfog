"use client"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Page = ({ params }: { params: { username: string } }) => {
  const [selectedMessage, setSelectedMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(["Hello, are you Spiderman","Who are you? ","What is your name"]);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (message: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const data = {
        username: params.username,
        content: message.content,
      };
      const response = await axios.post<ApiResponse>("/api/send-message", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      setSelectedMessage(""); // Reset the selected message after sending
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectMessage = (message: string) => {
    setSelectedMessage(message);
    form.setValue("content", message); // Set the form value to populate the textarea
  };

  const handleSuggestMessage = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/suggest-messages");
      setSuggestedMessages(response.data.messages); // Assuming the API response contains an array of messages
    } catch (error) {
      console.error("Failed to fetch suggested messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch suggested messages",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Public Profile Link
        </h1>
        <div className="shadow-md rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xl font-semibold mb-2">
                      Send Anonymous Message to {params.username}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="rounded-md shadow-sm"
                        placeholder="Write your anonymous message here"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div className="mt-8">
          <Button onClick={handleSuggestMessage}>Suggest Messages</Button>
          <div className="flex flex-col items-center space-y-4 mt-4">
            <h2 className="text-lg font-bold mb-4">
              Select a message to send anonymously:
            </h2>
            <div className="flex flex-col items-start space-y-2">
              {suggestedMessages.map((message, index) => (
                <button
                  key={index}
                  className={`py-2 px-4 rounded-md focus:outline-none`}
                  onClick={() => handleSelectMessage(message)}
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;

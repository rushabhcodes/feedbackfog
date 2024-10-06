"use client";
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
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "Are you Batman?",
    "What is your real name?",
    "What is your favorite color?",
  ]);
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
      const response = await axios.post<ApiResponse>(
        "/api/send-message",
        data
      );
      toast({
        title: "Success",
        description: response.data.message,
      });
      setSelectedMessage(""); // Reset the selected message after sending
      form.reset(); // Reset the form after submission
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
      const response = await axios.get<ApiResponse>("/api/suggest-messages"); // Ensure correct route
      console.log("Suggested messages:", response.data.questions);
      
      // Set the suggested messages (assuming the API response contains 'questions' as an array of strings)
      if (response.data.questions) {
        setSuggestedMessages(response.data.questions); // Map Message[] to string[]
      }
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
        <h1 className="text-4xl font-bold mb-6 text-center">
          Send a Message to {params.username}
        </h1>
        <div className="shadow-md rounded-lg p-6 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xl font-semibold mb-2">
                      Your Anonymous Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="rounded-md shadow-sm focus:ring focus:ring-blue-500"
                        placeholder="Write your anonymous message here"
                        rows={4}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform ${
                  isSubmitting ? "opacity-50" : "hover:scale-105"
                }`}
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
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-lg font-bold mb-4 text-center">
              Select a message to send anonymously:
            </h2>
            <div className="flex flex-col items-start space-y-2 w-full">
              {suggestedMessages.map((message, index) => (
                <Button
                  variant={"outline"}
                  key={index}
                  className={`w-full flex items-center justify-start text-start py-2 px-4 rounded-md focus:outline-none transition-all transform hover:scale-105`}
                  onClick={() => handleSelectMessage(message)}
                >
                  {message}
                </Button>
              ))}
            </div>
            <Button
              variant={"secondary"}
              onClick={handleSuggestMessage}
              className="w-full mb-4 font-medium rounded-md shadow-sm py-2 transition-transform transform hover:scale-105"
            >
              Suggest Messages
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;

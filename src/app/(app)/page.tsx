"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import messages from "@/data/messages.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <main className="flex flex-col flex-grow items-center justify-center px-4 py-12 md:px-24">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl font-extrabold md:text-6xl">
            Send Messages Anonymously
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Create a unique link, share it, and start receiving messages directly to your dashboard without revealing your identity.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-md shadow-lg rounded-lg overflow-hidden"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-4">
                  <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="text-lg font-semibold">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-md text-center">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-black hover:text-gray-600 transition-colors duration-200" />
          <CarouselNext className="text-black hover:text-gray-600 transition-colors duration-200" />
        </Carousel>
        <div className="mt-8">
          <Button className="font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200">
            <Link href={"/dashboard"}>Go to Dashboard</Link>
          </Button>
        </div>
      </main>
      <footer className="mt-24 text-center p-4 md:p-6 text-gray-600">
        &copy; 2024 Rushabh Patil. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
  
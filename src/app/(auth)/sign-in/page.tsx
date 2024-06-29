"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const { toast } = useToast();
  const route = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      toast({
        title: "Sign In Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    if (result?.url) {
      console.log(result.url);
      route.replace("/dashboard");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Feedback Fog
            </h1>
            <p className="mb-4">
              Sign in to your account to get started with Feedback Fog
            </p>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="joe@example.com or joe"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>&#8201;</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>

                      <FormDescription>&#8201;</FormDescription>
                    </FormItem>
                  )}
                />
                <Button type="submit">Sign In</Button>
              </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign Up
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

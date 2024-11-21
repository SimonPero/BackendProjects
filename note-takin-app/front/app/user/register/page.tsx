"use client";

import { registerUser } from "@/app/action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPass: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPass, {
    path: ["confirmPass"],
    message: "Passwords do not match.",
  });

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPass: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerUser(values);
  }

  return (
    <div className="justify-self-center flex-col p-2 my-2 w-[20rem]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 flex  flex-col items-center"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Put your username here!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="emailexample@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input placeholder="Put your password here!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPass"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please, confirm your password."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
      <div className="border-t my-4"></div>
      <Link href={"/user/login"} className="text-blue-500 hover:underline">
        Already have an account? Login in here
      </Link>
    </div>
  );
}

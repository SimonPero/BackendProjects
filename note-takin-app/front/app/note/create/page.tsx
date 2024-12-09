"use client";

import { createNote } from "@/app/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title must exist.",
  }),
  content: z.string().min(1, {
    message: "Content must exist.",
  }),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createNote(values);
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
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Put a title here!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Content</FormLabel>
                <FormControl className="max-h-4/5">
                  <Textarea
                    placeholder="Write anything you want as if it were a Markdown file!"
                    className="w-full p-2 border rounded h-[30vh] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Add note
          </Button>
        </form>
      </Form>
    </div>
  );
}

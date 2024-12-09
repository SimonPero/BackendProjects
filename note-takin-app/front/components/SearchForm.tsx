"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { searchNotes } from "@/app/actions";
import { NoteDto } from "@/types/dto/note.dto";
import { Input } from "./ui/input";
import { FormField, FormItem, FormControl, FormMessage, Form } from "./ui/form";

const formSchema = z.object({
  search: z.string().min(1),
});

interface SearchFormProps {
  notes: NoteDto[];
}

export default function SearchForm({ notes }: SearchFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { search: "" },
  });

  async function onSubmit(values: { search: string }) {
    await searchNotes(notes, values.search);
  }

  return (
    <div className="relative mr-3 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative w-full">
                    <Input 
                      placeholder="Search" 
                      {...field} 
                      className="w-full pl-4 pr-10 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 bg-transparent"
                    />
                    <button 
                      type="submit" 
                      className="absolute top-1/2 right-3 transform -translate-y-1/2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.includes(".") ? file.name.split(".").pop() : "";
    if (fileType === "md") return true;
  }
  return false;
}

const MAX_FILE_SIZE = 150000; // 150 KB

const fileSchema = z.object({
  file: z
    .custom<File>()
    .refine(
      (file: File | undefined) => file && file.size > 0,
      "File is required"
    )
    .refine((file) => file?.size < MAX_FILE_SIZE, "Max size is 150KB.")
    .refine(
      (file) => file && checkFileType(file),
      "Only .md formats are supported."
    ),
});

export default function FileForm() {
  const { language } = useLanguage();
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof fileSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className=" mt-3">
          {language === "en" ? "Submit" : "Subir"}
        </Button>
      </form>
    </Form>
  );
}

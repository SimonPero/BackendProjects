"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadMdFile } from "@/app/actions";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";

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

export default function FileForm({
  uploadFinished,
}: {
  uploadFinished: () => void;
}) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof fileSchema>) {
    setServerError(null);

    try {
      setIsLoading(true);
      const data = await uploadMdFile(values.file);
      form.reset();
      uploadFinished();
      router.push(`/note/${data.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else if (typeof error === "string") {
        setServerError(error);
      } else {
        setServerError(
          language === "en"
            ? "An unexpected error occurred during upload."
            : "Ocurrió un error inesperado durante la carga."
        );
      }

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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

        {serverError && (
          <div className="text-red-500 text-sm">{serverError}</div>
        )}

        <Button type="submit" className="mt-3" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner />
              {language === "en" ? "Uploading..." : "Subiendo..."}
            </>
          ) : language === "en" ? (
            "Submit"
          ) : (
            "Subir"
          )}
        </Button>
      </form>
    </Form>
  );
}

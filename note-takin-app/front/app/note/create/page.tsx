"use client";

import { createNote } from "@/app/actions";
import FileForm from "@/components/FileForm";
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
import { useLanguage } from "@/contexts/LanguageContext";

export default function Page() {
  const { language } = useLanguage();

  // Mensajes de error dinámicos basados en el idioma
  const errorMessages = {
    en: {
      title: "Title must exist.",
      content: "Content must exist.",
    },
    es: {
      title: "El título debe existir.",
      content: "El contenido debe existir.",
    },
  };

  // Esquema de validación con Zod dinámico
  const formSchema = z.object({
    title: z.string().min(1, { message: errorMessages[language].title }),
    content: z.string().min(1, { message: errorMessages[language].content }),
  });

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
          className="space-y-2 flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{language === "en" ? "Title" : "Título"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      language === "en"
                        ? "Put a title here!"
                        : "Pon un título aquí"
                    }
                    {...field}
                  />
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
                <FormLabel>
                  {language === "en" ? "Content" : "Contenido"}
                </FormLabel>
                <FormControl className="max-h-4/5">
                  <Textarea
                    placeholder={
                      language === "en"
                        ? "Write anything you want as if it were a Markdown file!"
                        : "Escribe lo que quieras como si fuera un archivo Markdown"
                    }
                    className="w-full p-2 border rounded h-[30vh] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {language === "en" ? "Add note" : "Agregar nota"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

"use client";

import { registerUser } from "@/app/actions";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  const { language } = useLanguage();

  const errorMessages = {
    en: {
      name: "Name must be at least 2 characters.",
      email: "Invalid email address.",
      password: "Password must be at least 8 characters.",
      confirmPass: "Passwords do not match.",
      required: "This field is required.",
    },
    es: {
      name: "El nombre debe tener al menos 2 caracteres.",
      email: "Dirección de correo no válida.",
      password: "La contraseña debe tener al menos 8 caracteres.",
      confirmPass: "Las contraseñas no coinciden.",
      required: "Este campo es obligatorio.",
    },
  };

  const formSchema = z
    .object({
      name: z
        .string()
        .min(2, { message: errorMessages[language].name })
        .min(1, { message: errorMessages[language].required }),
      email: z
        .string()
        .email({ message: errorMessages[language].email })
        .min(1, { message: errorMessages[language].required }),
      password: z
        .string()
        .min(8, { message: errorMessages[language].password })
        .min(1, { message: errorMessages[language].required }),
      confirmPass: z
        .string()
        .min(8, { message: errorMessages[language].password })
        .min(1, { message: errorMessages[language].required }),
    })
    .refine((data) => data.password === data.confirmPass, {
      path: ["confirmPass"],
      message: errorMessages[language].confirmPass,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPass: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await registerUser(values);
    redirect("/user/login")
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
                <FormLabel>
                  {language === "en" ? "Username" : "Nombre de Usuario"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      language === "en"
                        ? "Put your username here!"
                        : "Pon tu nombre de usuario aquí"
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
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      language === "en"
                        ? "emailexample@example.com"
                        : "ejemplodeemail@ejemplo.com"
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
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {language === "en" ? "Password" : "Contraseña"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={
                      language === "en"
                        ? "Put your password here!"
                        : "Pon tu contraseña aquí"
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
            name="confirmPass"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {language === "en"
                    ? "Confirm Password"
                    : "Confirmar Contraseña"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={
                      language === "en"
                        ? "Please, confirm your password."
                        : "Por favor, confirma tu contraseña"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {language === "en" ? "Register" : "Registrarse"}
          </Button>
        </form>
      </Form>
      <div className="border-t my-4"></div>
      <Link href={"/user/login"} className="text-blue-500 hover:underline">
        {language === "en"
          ? "Already have an account? Login in here"
          : "¿Ya tienes una cuenta? Inicia sesión aquí"}
      </Link>
    </div>
  );
}

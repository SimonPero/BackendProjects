"use client";

import { loginUser } from "@/app/actions";
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

export default function LoginPage() {
  const { language } = useLanguage();

  const errorMessages = {
    en: {
      email: "Invalid email address.",
      password: "Password must be at least 8 characters.",
      required: "This field is required.",
    },
    es: {
      email: "Correo electrónico no válido.",
      password: "La contraseña debe tener al menos 8 caracteres.",
      required: "Este campo es obligatorio.",
    },
  };

  const formSchema = z.object({
    email: z
      .string()
      .email({ message: errorMessages[language].email })
      .min(1, { message: errorMessages[language].required }),
    password: z
      .string()
      .min(8, { message: errorMessages[language].password })
      .min(1, { message: errorMessages[language].required }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await loginUser(values.email, values.password);
    redirect("/");
  }

  return (
    <div className="flex justify-self-center flex-col p-2 my-2 w-[20rem]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {language === "en" ? "Email" : "Correo electrónico"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      language === "en"
                        ? "emailexample@example.com"
                        : "correo@ejemplo.com"
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
                        ? "Enter your password"
                        : "Ingrese su contraseña"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {language === "en" ? "Log In" : "Iniciar sesión"}
          </Button>
        </form>
      </Form>
      <div className="border-t my-4"></div>
      <Link href={"/user/register"} className="text-blue-500 hover:underline">
        {language === "en"
          ? "Don't have an account? Sign up here"
          : "¿No tienes una cuenta? Regístrate aquí"}
      </Link>
    </div>
  );
}

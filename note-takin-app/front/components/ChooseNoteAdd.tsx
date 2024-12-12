"use client";

import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { PencilLine } from "lucide-react";

import FileForm from "./FileForm";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ChooseNoteAdd() {
  const { language } = useLanguage();
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);

  function manualNote() {
    setOpenMainDialog(false);
    redirect("/note/create");
  }

  return (
    <>
      <AlertDialog open={openMainDialog} onOpenChange={setOpenMainDialog}>
        <AlertDialogTrigger
          className="mr-3 p-2 hover:shadow-md hover:shadow-stone-950"
          onClick={() => setOpenMainDialog(true)}
        >
          <PencilLine className="size-6" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Create your note" : "Crea una anotación"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "Would you like to write a new note or upload a file instead?"
                : "¿Quieres escribir una nota o subir un arhivo preexistente?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenFileDialog(true)}>
              {language === "en" ? "Upload a File" : "Subir archivo"}
            </AlertDialogCancel>

            <AlertDialogAction onClick={manualNote}>
              {language === "en" ? "Write a note" : "Escribe una anotación"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openFileDialog} onOpenChange={setOpenFileDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Upload a File" : "Subir archivo"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "You can upload a file in .md format with a size limit of 150 KB."
                : "Puedes subir un archivo md con un limite de 150 KB"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FileForm />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenFileDialog(false)}>
              {language === "en" ? "Cancel" : "Cancelar"}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

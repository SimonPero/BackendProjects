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
import { PencilLine, Upload } from "lucide-react";

import FileForm from "./FileForm"; // Import your file upload component
import { redirect } from "next/navigation";
import { useState } from "react";

export default function ChooseNoteAdd() {
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
            <AlertDialogTitle>Create your note</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to write a new note or upload a file instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenFileDialog(true)}>
              Upload a File
            </AlertDialogCancel>

            <AlertDialogAction onClick={manualNote}>
              Write a note
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openFileDialog} onOpenChange={setOpenFileDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upload a File</AlertDialogTitle>
            <AlertDialogDescription>
              You can upload a file in .md format with a size limit of 150 KB.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FileForm />
          <AlertDialogFooter>
            {/* Cancel Button to close the file dialog */}
            <AlertDialogCancel onClick={() => setOpenFileDialog(false)}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

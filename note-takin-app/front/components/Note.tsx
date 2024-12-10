import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { NoteDto } from "@/types/dto/note.dto";

export default function Note({
  id,
  title,
  updatedAt,
  content,
}: NoteDto) {
  const truncatedContent =
    content.length > 30 ? `${content.slice(0, 30)}...` : content;

  return (
    <Card key={id} className="w-[18rem]">
      <CardHeader>
        <CardTitle className="truncate md:overflow-clip">{title}</CardTitle>
        <CardDescription>
          {new Date(updatedAt).toLocaleDateString()}
        </CardDescription>
        <CardDescription>{truncatedContent}</CardDescription>
      </CardHeader>
    </Card>
  );
}

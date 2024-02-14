import { Note } from "../pages/Notes";
import { Link } from "react-router-dom";

interface Props {
  note: Note;
}

const NoteCard = ({ note }: Props) => {
  const newDate = new Date(note.date_created);
  const markdown = note.markdown;

  return (
    <Link
      to="/"
      className="flex flex-col bg-slate-100 mb-2 p-2 rounded-md text-slate-600 hover:text-slate-600 hover:bg-slate-200 transition transition-duration-150"
    >
      <div className="text-green-700">{newDate.toLocaleString()}</div>
      <div>
        {markdown.length > 200 ? markdown.slice(0, 200) + "..." : markdown}
      </div>
    </Link>
  );
};

export default NoteCard;

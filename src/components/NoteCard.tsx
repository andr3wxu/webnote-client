import { Note } from "../pages/Notes";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Props {
  note: Note;
}

const NoteCard = ({ note }: Props) => {
  const newDate = new Date(note.date_created);
  const markdown = note.markdown;

  const navigate = useNavigate();

  const handleClick = () => {
    Cookies.set("load_existing_note_id", note.id.toString());
    navigate("/");
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col w-full bg-slate-100 mb-2 p-2 rounded-md text-slate-600 hover:text-slate-600 hover:bg-slate-200 hover:border-slate-200 transition transition-duration-150"
    >
      <div className="text-green-700">{newDate.toLocaleString()}</div>
      <div>
        {markdown.length > 200 ? markdown.slice(0, 200) + "..." : markdown}
      </div>
    </button>
  );
};

export default NoteCard;

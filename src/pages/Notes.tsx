import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import NoteCard from "../components/NoteCard";

export type Note = {
  id: number;
  user: number;
  date_created: string;
  markdown: string;
  url: string;
};

const Notes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [noteList, setNoteList] = useState<Note[]>([]);

  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      await axios({
        method: "get",
        url: "http://localhost:8000/api/test-token/",
        headers: {
          Authorization: `Token ${Cookies.get("wn_auth_token")}`,
        },
      });
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
      console.log("User unauthenticated");
      navigate("/login");
    }
  };

  const getNotes = async () => {
    await checkAuth();
    if (isLoggedIn) {
      const response = await axios({
        method: "get",
        url: `http://localhost:8000/api/notes/${Cookies.get("wn_user_id")}/`,
        headers: {
          Authorization: `Token ${Cookies.get("wn_auth_token")}`,
        },
      });
      setNoteList(response.data);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    console.log("Updated noteList:", noteList);
  }, [noteList]);

  return (
    <div>
      <section className="flex flex-row">
        <h1 className="mb-2 font-semibold">My Notes</h1>
        <Link
          to="/"
          className="ml-auto rounded-md border-2 border-slate-200 p-1 mb-2 text-green-700 bg-slate-100 hover:bg-green-700 hover:border-green-800 hover:text-white transition transition-duration-150"
        >
          Back
        </Link>
      </section>

      {noteList.map((note) => {
        return <NoteCard note={note} />;
      })}
    </div>
  );
};

export default Notes;

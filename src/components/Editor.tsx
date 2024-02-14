import { ChangeEvent, useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const Editor = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [preview, setPreview] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [highlight, setHighlight] = useState(false);

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
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleSave = () => {
    checkAuth();
    if (isLoggedIn) {
      console.log(markdown);
      console.log(Cookies.get("wn_auth_token"));
    } else {
      setHighlight(true);
    }
  };

  const handleLogout = async () => {
    try {
      await axios({
        method: "post",
        url: "http://localhost:8000/api/logout/",
        headers: {
          Authorization: `Token ${Cookies.get("wn_auth_token")}`,
        },
      });
      Cookies.remove("wn_auth_token");
      setIsLoggedIn(false);
    } catch {
      console.log("Logout unsuccessful");
    }
  };

  // NOTE: To load Login/Logout
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="flex flex-col" id="editor">
      <div className="flex flex-row gap-2" id="button-panel">
        <button
          onClick={handleSave}
          className="rounded-md border-2 border-green-700 p-1 mb-2 text-white bg-green-700 hover:bg-green-700 hover:text-white transition transition-duration-150"
        >
          Save
        </button>
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="rounded-md border-2 border-slate-200 p-1 mb-2 text-green-700 bg-slate-100 hover:bg-green-700 hover:text-white transition transition-duration-150"
            >
              Logout
            </button>
            <Link
              to="notes"
              className="rounded-md border-2 border-slate-200 p-1 mb-2 text-green-700 bg-slate-100 hover:bg-green-700 hover:border-green-800 hover:text-white transition transition-duration-150"
            >
              Notes
            </Link>
          </>
        ) : (
          <Link
            to="login"
            className="rounded-md border-2 border-slate-200 p-1 mb-2 text-green-700 bg-slate-100 hover:bg-green-700 hover:border-green-800 hover:text-white transition transition-duration-150"
          >
            Login
          </Link>
        )}
        <button
          onClick={handlePreview}
          className="rounded-md border-2 border-slate-200 p-1 mb-2 text-green-700 bg-slate-100 hover:bg-green-700 hover:text-white transition transition-duration-150"
        >
          {preview ? "Hide" : "Show"} Preview
        </button>
      </div>
      <textarea
        rows={10}
        cols={50}
        value={markdown}
        placeholder="Start typing to take a note..."
        onChange={handleChange}
        className="bg-slate-100 p-3 rounded-md"
      ></textarea>
      {preview ? (
        <>
          <div className="bg-slate-100 text-left mt-3 p-3 rounded-md min-h-20">
            <Markdown
              components={{
                h1: "h1",
              }}
              remarkPlugins={[remarkGfm]}
            >
              {markdown}
            </Markdown>
          </div>
        </>
      ) : (
        <></>
      )}
      <div
        className={`p-2 text-slate-${highlight ? "500 font-semibold" : "400"}`}
        id="save-progress-message"
      >
        {isLoggedIn ? "" : "Login to save your progress."}
      </div>
    </div>
  );
};

export default Editor;

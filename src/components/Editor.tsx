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
  const [editingExisting, setEditingExisting] = useState(false); // NOTE: checks whether an existing note is being edited

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
      console.log("User unauthenticated!");
    }
  };

  const checkAndLoadNoteWithURL = async () => {
    chrome.windows.getCurrent({ populate: true }, (window) => {
      chrome.tabs.query({ active: true, windowId: window.id }, (tabs) => {
        if (tabs[0].url) {
          const url = new URL(tabs[0].url);
          const sendRequest = async () => {
            try {
              const response = await axios({
                method: "post",
                url: "http://localhost:8000/api/url/",
                headers: {
                  Authorization: `Token ${Cookies.get("wn_auth_token")}`,
                },
                data: {
                  url: url,
                  user_id: Cookies.get("wn_user_id"),
                },
              });
              setMarkdown(response.data.markdown);
              setEditingExisting(true);
            } catch {
              console.log("No note with URL found.");
            }
          };
          sendRequest();
        }
      });
    });
  };

  const loadNoteFromNotes = async () => {
    if (Cookies.get("load_existing_note_id")) {
      try {
        const response = await axios({
          method: "get",
          url: `http://localhost:8000/api/note/${Cookies.get(
            "load_existing_note_id"
          )}/`,
          headers: {
            Authorization: `Token ${Cookies.get("wn_auth_token")}`,
          },
        });
        setMarkdown(response.data.markdown);
        setEditingExisting(true);
      } catch {
        console.log("Unexpected load error.");
      }
    } else {
      setMarkdown("");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleSave = async () => {
    checkAuth();
    if (isLoggedIn) {
      console.log("Contents:", markdown);
      if (editingExisting) {
        try {
          await axios({
            method: "patch",
            url: `http://localhost:8000/api/note/${Cookies.get(
              "load_existing_note_id"
            )}/`,
            headers: {
              Authorization: `Token ${Cookies.get("wn_auth_token")}`,
            },
            data: { markdown: markdown },
          });
        } catch {
          console.log("Patch failed.");
        }
      } else {
        chrome.windows.getCurrent({ populate: true }, (window) => {
          chrome.tabs.query({ active: true, windowId: window.id }, (tabs) => {
            if (tabs[0].url) {
              const url = new URL(tabs[0].url);
              const sendRequest = async () => {
                try {
                  await axios({
                    method: "post",
                    url: `http://localhost:8000/api/notes/${Cookies.get(
                      "wn_user_id"
                    )}/`,
                    headers: {
                      Authorization: `Token ${Cookies.get("wn_auth_token")}`,
                    },
                    data: {
                      user: Cookies.get("wn_user_id"),
                      markdown: markdown,
                      url: url,
                    },
                  });
                } catch {
                  console.log("New note save failed.");
                }
              };
              sendRequest();
            }
          });
        });
      }
    } else {
      setHighlight(true);
    }
  };

  const handleNew = () => {
    Cookies.remove("load_existing_note_id");
    setMarkdown("");
    setEditingExisting(false);
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
      Cookies.remove("wn_user_id");
      Cookies.remove("load_existing_note_id");
      setMarkdown("");
      setIsLoggedIn(false);
      setEditingExisting(false);
    } catch {
      console.log("Logout unsuccessful");
    }
  };

  // NOTE: To load Login/Logout
  useEffect(() => {
    checkAuth();
    checkAndLoadNoteWithURL();
    loadNoteFromNotes();
  }, []);

  return (
    <div className="flex flex-col" id="editor">
      <div className="flex flex-row gap-2" id="button-panel">
        <button
          onClick={handleSave}
          className="rounded-md border-2 border-green-700 p-1 mb-2 text-white bg-green-700 hover:bg-green-800 hover:text-white active:bg-slate-100 active:border-slate-200 active:text-green-700 transition transition-duration-150"
        >
          Save
        </button>
        <button
          onClick={handleNew}
          className="rounded-md border-2 border-green-700 p-1 mb-2 text-green-700 bg-slate-100 hover:bg-green-700 hover:text-white transition transition-duration-150"
        >
          New
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
        className={`${isLoggedIn ? "" : "p-2"} text-slate-${
          highlight ? "500 font-semibold" : "400"
        }`}
        id="save-progress-message"
      >
        {isLoggedIn ? "" : "Login to save your progress."}
      </div>
      <div className={`p-2 text-green-700`} id="editing-existing-message">
        {editingExisting ? "Editing existing note!" : ""}
      </div>
    </div>
  );
};

export default Editor;

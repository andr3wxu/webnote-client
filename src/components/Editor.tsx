import { ChangeEvent, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Editor = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [preview, setPreview] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const handlePreviewChange = (event: ChangeEvent<HTMLDivElement>) => {
    setMarkdown((event.target as HTMLDivElement).innerText);
  };

  const handleClick = () => {
    setPreview(!preview);
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full flex flex-col">
          <div className="flex flex-row gap-1">
            <button
              onClick={handleClick}
              className="rounded-md border-2 border-green-700 p-1 mb-1 text-white bg-green-700 hover:bg-green-700 hover:text-white transition transition-duration-150"
            >
              Save
            </button>
            <button
              onClick={handleClick}
              className="rounded-md border-2 border-slate-200 p-1 mb-1 text-green-700 bg-slate-100 hover:bg-green-700 hover:text-white transition transition-duration-150"
            >
              {preview ? "Hide" : "Show"} Preview
            </button>
          </div>
          {/* <textarea
            rows={10}
            cols={50}
            value={markdown}
            placeholder="Start typing to take a note..."
            onChange={handleChange}
            className="border-2 border-slate-200 bg-slate-100 p-3 rounded-md"
          ></textarea> */}
        </div>
        {preview ? (
          <>
            <div
              contentEditable
              onInput={handlePreviewChange}
              className="bg-slate-100 text-left"
            >
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
      </div>
    </>
  );
};

export default Editor;

import "./App.css";
import Editor from "./components/Editor";

function App() {
  // const onClick = async () => {
  //   chrome.windows.getCurrent({ populate: true }, (window) => {
  //     chrome.tabs.query({ active: true, windowId: window.id }, ([tab]) => {
  //       chrome.scripting.executeScript({
  //         target: { tabId: tab.id! },
  //         func: () => {
  //           document.body.style.backgroundColor = "black";
  //           document.body.style.fontFamily = "roboto";
  //         },
  //       });
  //     });
  //   });
  // };

  return (
    <>
      <div className="w-full">
        <Editor />
      </div>
    </>
  );
}

export default App;

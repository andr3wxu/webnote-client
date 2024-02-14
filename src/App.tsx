import { MemoryRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Default from "./pages/Default";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Notes from "./pages/Notes";

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
      <Router basename="/">
        <Routes>
          <Route path="" element={<Default />} />
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="notes" element={<Notes />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

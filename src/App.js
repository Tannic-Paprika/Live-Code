import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import EditorPage from "./page/EditorPage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { createSubmission, getLanguages } from "./api/api";

function App() {
  useEffect(()=>{
    const init = async()=>{
      // const languages = await createSubmission();
      // console.log(languages);
    }
    init();
  })
  return (
    <>
      <Toaster position="top-right"></Toaster>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomIdEncoded/:userNameEncoded" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

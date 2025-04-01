import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wiki from "./components/Wiki";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Wiki />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

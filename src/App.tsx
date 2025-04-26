import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wiki from "./components/Wiki";

function App() {
  return (
    <BrowserRouter basename="/wiki">
      <Routes>
        <Route path="/*" element={<Wiki />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

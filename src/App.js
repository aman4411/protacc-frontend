import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
// import other pages when created

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/services" element={<Services />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Homepage";
import ConsultancyPage from "./pages/Consultancy";
// import more pages...

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="consultancy" element={<ConsultancyPage />} />
                    {/* Add more routes here */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

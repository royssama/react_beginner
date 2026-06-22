import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import B001Page from "./pages/B001Page";
import StudyPage from "./pages/StudyPage";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            B001 화면
          </NavLink>
          <NavLink to="/study" className={({ isActive }) => (isActive ? "active" : "")}>
            React 학습
          </NavLink>
        </nav>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<B001Page />} />
            <Route path="/study" element={<StudyPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

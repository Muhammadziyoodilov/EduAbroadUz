import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Universities from "./pages/Universities/Universities";
import UniversityDetail from "./pages/UniversityDetail/UniversityDetail";
import Compare from "./pages/Compare/Compare";
import MyPlan from "./pages/MyPlan/MyPlan";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Grants from "./pages/Grants/Grants";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const { i18n } = useTranslation();

  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/universities/:id" element={<UniversityDetail />} />
            <Route path="/grant" element={<Grants />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/my-plan" element={<MyPlan />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

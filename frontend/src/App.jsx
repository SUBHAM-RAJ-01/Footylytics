import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import PWALoader from "./components/PWALoader";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LiveScores from "./pages/LiveScores";
import Fixtures from "./pages/Fixtures";
import Standings from "./pages/Standings";
import Predictions from "./pages/Predictions";
import MyTeam from "./pages/MyTeam";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Success from "./pages/Success";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Developer from "./pages/Developer";
import { checkScheduledNotifications } from "./utils/notifications";

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // Check and reschedule notifications on app load
  useEffect(() => {
    checkScheduledNotifications();
  }, []);

  return (
    <>
      <AnimatePresence>
        <PWALoader />
      </AnimatePresence>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="live" element={<LiveScores />} />
                <Route path="fixtures" element={<Fixtures />} />
                <Route path="standings" element={<Standings />} />
                <Route path="standings/:leagueId" element={<Standings />} />
                <Route path="predictions" element={<Predictions />} />
                <Route path="my-team" element={<MyTeam />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="settings" element={<Settings />} />
                <Route path="success" element={<Success />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsOfService />} />
                <Route path="developer" element={<Developer />} />
              </Route>
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

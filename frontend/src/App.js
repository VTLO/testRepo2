import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import DiagnosticWizard from "@/pages/DiagnosticWizard";
import Dashboard from "@/pages/Dashboard";
import ActionPlan from "@/pages/ActionPlan";
import ChatAssistant from "@/pages/ChatAssistant";
import EmergencyMode from "@/pages/EmergencyMode";
import LearningCenter from "@/pages/LearningCenter";
import Settings from "@/pages/Settings";
import PrivacyPage from "@/pages/PrivacyPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/diagnostic" element={<DiagnosticWizard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plan" element={<ActionPlan />} />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="/urgence" element={<EmergencyMode />} />
          <Route path="/apprendre" element={<LearningCenter />} />
          <Route path="/parametres" element={<Settings />} />
          <Route path="/confidentialite" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;

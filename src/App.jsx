import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AmaliaCorner from "./pages/AmaliaCorner";
import AccountSettings from "./pages/AccountSettings";
import Onboarding from "./pages/Onboarding";
import NormalChat from "./pages/NormalChat";
import SafeSpaceChat from "./pages/SafeSpaceChat";
import Feedback from "./pages/Feedback";
import Diagnostic from "./pages/Diagnostic";
import NotFound from "./pages/NotFound";
import DiagnosticModal from "./components/DiagnosticComponents/DiagnosticModal";
import DiagnosticComplete from "./components/DiagnosticComponents/DiagnosticComplete";

const PrivateRoute = ({ children, requireDiagnostic = true }) => {
  const accessToken = localStorage.getItem("accessToken");
  const onboardingComplete =
    localStorage.getItem("onboardingComplete") === "true";
  const diagnosticComplete =
    localStorage.getItem("diagnosticComplete") === "true";

  if (!accessToken || !onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (requireDiagnostic && !diagnosticComplete) {
    return <Navigate to="/diagnostic" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requireDiagnostic={true}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/amalia-corner"
          element={
            <PrivateRoute requireDiagnostic={true}>
              <AmaliaCorner />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/account-settings"
          element={
            <PrivateRoute requireDiagnostic={true}>
              <AccountSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/normal-chat"
          element={
            <PrivateRoute requireDiagnostic={true}>
              <NormalChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/safe-space-chat"
          element={
            <PrivateRoute requireDiagnostic={true}>
              <SafeSpaceChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/feedback"
          element={
            <PrivateRoute requireDiagnostic={true}>
              <Feedback />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic"
          element={
            <PrivateRoute requireDiagnostic={false}>
              <DiagnosticModal />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic/steps"
          element={
            <PrivateRoute requireDiagnostic={false}>
              <Diagnostic />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic/completed"
          element={
            <PrivateRoute requireDiagnostic={false}>
              <DiagnosticComplete />
            </PrivateRoute>
          }
        />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;

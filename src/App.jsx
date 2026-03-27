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
import ResetPassword from "./pages/ResetPassword";
import DiagnosticModal from "./components/DiagnosticComponents/DiagnosticModal";
import DiagnosticComplete from "./components/DiagnosticComponents/DiagnosticComplete";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? children : <Navigate to="/not-found" replace />;
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
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/amalia-corner"
          element={
            <PrivateRoute>
              <AmaliaCorner />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/account-settings"
          element={
            <PrivateRoute>
              <AccountSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/normal-chat"
          element={
            <PrivateRoute>
              <NormalChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/safe-space-chat"
          element={
            <PrivateRoute>
              <SafeSpaceChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/feedback"
          element={
            <PrivateRoute>
              <Feedback />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic"
          element={
            <PrivateRoute>
              <DiagnosticModal />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic/steps"
          element={
            <PrivateRoute>
              <Diagnostic />
            </PrivateRoute>
          }
        />
        <Route
          path="/diagnostic/completed"
          element={
            <PrivateRoute>
              <DiagnosticComplete />
            </PrivateRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;

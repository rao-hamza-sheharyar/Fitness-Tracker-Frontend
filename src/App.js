import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import UsersTable from "./components/UsersTable";
import UserDashboard from "./components/UserDashboard";
import DietPlanForm from "./components/DietPlanForm";
import HomePage from "./components/HomePage";
import Layout from "./components/Layout";
import VerifyEmail from "./components/VerifyEmail";
import UserDetail from "./components/UserDetail";

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />/
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Authenticated routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <UsersTable />
            </ProtectedRoute>
          }
        />

        {/* Shared dashboard: for user or admin-viewing-a-user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:userId"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />

        {/* CREATE diet plan (for admin) */}
        <Route
          path="/admin/users/:userId/diet_plans/new"
          element={
            <ProtectedRoute>
              <DietPlanForm />
            </ProtectedRoute>
          }
        />

        {/* EDIT diet plan (for admin) */}
        <Route
          path="/admin/users/:userId/diet_plans/:planId/edit"
          element={
            <ProtectedRoute>
              <DietPlanForm isEdit={true} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/:userId/diet_plans/:planId/edit"
          element={<ProtectedRoute><DietPlanForm isEdit={true} /></ProtectedRoute>}
        />
      </Routes>
      </Layout>
    </Router>
  );
}

export default App;

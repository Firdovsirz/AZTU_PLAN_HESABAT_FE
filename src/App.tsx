import { jwtDecode } from "jwt-decode";
import Home from "./pages/Dashboard/Home";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import AppLayout from "./layout/AppLayout";
import type { JwtPayload } from "jwt-decode";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";
import MyPlanPage from "./pages/MyPlanPage/MyPlanPage";
import DekansPage from "./pages/DekansPage/DekansPage";
import FacultyPage from "./pages/FacultyPage/FacultyPage";
import NewPlanPage from "./pages/NewPlanPage/NewPlanPage";
import DocViewPage from "./pages/DocViewPage/DocViewPage";
import ArchivePage from "./pages/ArchivePage/ArchivePage";
import EditPlanPage from "./pages/EditPlanPage/EditPlanPage";
import AllUsersPage from "./pages/AllUsersPage/AllUsersPage";
import AllPlansPage from "./pages/AllPlansPage/AllPlansPage";
import { ScrollToTop } from "./components/common/ScrollToTop";
import MyHesabatPage from "./pages/MyHesabatPage/MyHesabatPage";
import NewPasswordPage from "./pages/AuthPages/NewPasswordPage";
import MyCafedrasPage from "./pages/MyCafedrasPage/MyCafedrasPage";
import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage";
import UserContentPage from "./pages/UserContentPage/UserContentPage";
import ReportUsersPage from "./pages/ReportUsersPage/ReportUsersPage";
import OtpVerificationPage from "./pages/AuthPages/OtpVerificationPage";
import FacultyDetailsPage from "./pages/FacultyDetailsPage/FacultyDetailsPage";
import CafedraDetailsPage from "./pages/CafedraDetailsPage/CafedraDetailsPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MyHesabatDetailsPage from "./pages/MyHesabatDetailsPage/MyHesabatDetailsPage";
import SubmittedHesabatsPage from "./pages/SubmittedHesabatsPage/SubmittedHesabatsPage";
import ApproveWaitingUsersPage from "./pages/ApproveWaitingUsersPage/ApproveWaitingUsersPage";

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export default function App() {
  const token = useSelector((state: RootState) => state.auth.token);
  const isValid = isTokenValid(token);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={isValid ? <AppLayout /> : <Navigate to="/" />}>
            <Route index path="/home" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />

            {/* User */}
            <Route path="/all-users" element={<AllUsersPage />} />
            <Route path="/user/:finKod" element={<UserContentPage />} />
            <Route path="/report-users" element={<ReportUsersPage />} />
            <Route path="/approve-waiting-users" element={<ApproveWaitingUsersPage />} />

            {/* Dekan */}
            <Route path="/dekans" element={<DekansPage />} />

            {/* Cafedra director */}
            <Route path="/cafedra-directors" element={<CafedraDetailsPage />} />

            {/* Faculties */}
            <Route path="/faculties" element={<FacultyPage />} />
            <Route path="/faculties/:faculty_code" element={<FacultyDetailsPage />} />

            {/* Cafedras */}
            <Route path="/cafedra/:cafedra_code" element={<CafedraDetailsPage />} />
            <Route path="/my-cafedras" element={<MyCafedrasPage />} />

            {/* Plan */}
            <Route path="/new-plan" element={<NewPlanPage />} />
            <Route path="/my-plan" element={<MyPlanPage />} />
            <Route path="/all-plans" element={<AllPlansPage />} />
            <Route path="/edit-plan" element={<EditPlanPage />} />

            {/* Hesabat */}
            <Route path="/my-hesabat" element={<MyHesabatPage />} />
            <Route path="/my-hesabat-details" element={<MyHesabatDetailsPage />} />
            <Route path="/submitted-hesabats" element={<SubmittedHesabatsPage />} />

            {/* Doc */}
            <Route path="/doc/*" element={<DocViewPage />} />

            {/* Archive */}
            <Route path="/archive" element={<ArchivePage />} />

          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/otp-verification/:finKod" element={<OtpVerificationPage />} />
          <Route path="/reset-password/:token" element={<NewPasswordPage />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

import Blank from "./pages/Blank";
import Calendar from "./pages/Calendar";
import Home from "./pages/Dashboard/Home";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import BarChart from "./pages/Charts/BarChart";
import UserProfiles from "./pages/UserProfiles";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import MyPlanPage from "./pages/MyPlanPage/MyPlanPage";
import DekansPage from "./pages/DekansPage/DekansPage";
import FacultyPage from "./pages/FacultyPage/FacultyPage";
import NewPlanPage from "./pages/NewPlanPage/NewPlanPage";
import DocViewPage from "./pages/DocViewPage/DocViewPage";
import AllUsersPage from "./pages/AllUsersPage/AllUsersPage";
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
import ApproveWaitingUsersPage from "./pages/ApproveWaitingUsersPage/ApproveWaitingUsersPage";

export default function App() {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={token ? <AppLayout /> : <Navigate to="/" />}>
            <Route index path="/home" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

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

            {/* Hesabat */}
            <Route path="/my-hesabat" element={<MyHesabatPage />} />
            <Route path="/my-hesabat-details" element={<MyHesabatDetailsPage />} />

            {/* Doc */}
            <Route path="/doc/*" element={<DocViewPage />} />

            {/* Archive */}
            {/* <Route path="/archive" element={<DocViewPage />} /> */}

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
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

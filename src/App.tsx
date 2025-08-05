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
import FacultyPage from "./pages/FacultyPage/FacultyPage";
import NewPlanPage from "./pages/NewPlanPage/NewPlanPage";
import DocViewPage from "./pages/DocViewPage/DocViewPage";
import { ScrollToTop } from "./components/common/ScrollToTop";
import MyHesabatPage from "./pages/MyHesabatPage/MyHesabatPage";
import MyCafedrasPage from "./pages/MyCafedrasPage/MyCafedrasPage";
import UserContentPage from "./pages/UserContentPage/UserContentPage";
import ReportUsersPage from "./pages/ReportUsersPage/ReportUsersPage";
import FacultyDetailsPage from "./pages/FacultyDetailsPage/FacultyDetailsPage";
import CafedraDetailsPage from "./pages/CafedraDetailsPage/CafedraDetailsPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MyHesabatDetailsPage from "./pages/MyHesabatDetailsPage/MyHesabatDetailsPage";
import ApproveWaitingUsersPage from "./pages/ApproveWaitingUsersPage/ApproveWaitingUsersPage";

export default function App() {
  const token = useSelector((state: RootState) => state.auth.token);
  const faculty_code = useSelector((state: RootState) => state.auth.faculty_code);
  const cafedra_code = useSelector((state: RootState) => state.auth.cafedra_code);
  const duty_code = useSelector((state: RootState) => state.auth.duty_code);
  const role = useSelector((state: RootState) => state.auth.role);
  console.log(token, faculty_code, cafedra_code, duty_code, role);
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
            <Route path="/user/:finKod" element={<UserContentPage />} />
            <Route path="/report-users" element={<ReportUsersPage />} />
            <Route path="/approve-waiting-users" element={<ApproveWaitingUsersPage />} />

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
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

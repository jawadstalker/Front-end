import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// =====================================================
// Auth
// =====================================================

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import OTPLogin from "./Pages/Auth/OTPLogin";
import VerifyOTP from "./Pages/Auth/VerifyOTP";

// =====================================================
// General
// =====================================================

import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";

// =====================================================
// Volunteer
// =====================================================

import VolunteerDashboard from "./Pages/Volunteer/Dashboard";
import VolunteerMissions from "./Pages/Volunteer/Missions";

// =====================================================
// Admin
// =====================================================

import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminProfile from "./Pages/Admin/Profile";
import AdminDisasters from "./Pages/Admin/Disasters";
import AdminCreateDisaster from "./Pages/Admin/CreateDisaster";
import AdminEditDisaster from "./Pages/Admin/EditDisaster";
import AdminMissions from "./Pages/Admin/Missions";
import AdminVolunteers from "./Pages/Admin/Volunteers";
import AdminCreateMission from "./Pages/Admin/CreateMission";
import AdminEditMission from "./Pages/Admin/EditMission";
import AdminUsers from "./Pages/Admin/Users";

// =====================================================
// Coordinator
// =====================================================

import CoordinatorMissions from "./Pages/Coordinator/Missions";
import CoordinatorCreateMission from "./Pages/Coordinator/CreateMission";
import CoordinatorEditMission from "./Pages/Coordinator/EditMission";
import CoordinatorUsers from "./Pages/Coordinator/Users";

// توجه:
// اگر نام یا مسیر فایل Disasters شما دقیقاً همین است، این import درست است.
import Disasters from "./pages/coordinator/Disasters";

// =====================================================
// Layouts
// =====================================================

import Layout from "./Components/Layout";
import AdminLayout from "./Components/AdminLayout";
import CoordinatorLayout from "./Components/CoordinatorLayout";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* =====================================================
              AUTH
          ===================================================== */}

          {/* صفحه اصلی ورود */}
          <Route
            path="/"
            element={<Login />}
          />

          {/* مسیر استاندارد صفحه ورود */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* ثبت نام */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* ورود با OTP */}
          <Route
            path="/otp-login"
            element={<OTPLogin />}
          />

          {/* تایید OTP */}
          <Route
            path="/verify-otp"
            element={<VerifyOTP />}
          />


          {/* =====================================================
              GENERAL
          ===================================================== */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />


          {/* =====================================================
              VOLUNTEER
          ===================================================== */}

          <Route
            path="/volunteer/dashboard"
            element={
              <Layout>
                <VolunteerDashboard />
              </Layout>
            }
          />

          <Route
            path="/volunteer/missions"
            element={
              <Layout>
                <VolunteerMissions />
              </Layout>
            }
          />


          {/* =====================================================
              COORDINATOR
          ===================================================== */}

          {/* مدیریت مأموریت‌ها */}

          <Route
            path="/coordinator/missions"
            element={
              <CoordinatorLayout>
                <CoordinatorMissions />
              </CoordinatorLayout>
            }
          />

          {/* ایجاد مأموریت */}

          <Route
            path="/coordinator/create-mission"
            element={
              <CoordinatorLayout>
                <CoordinatorCreateMission />
              </CoordinatorLayout>
            }
          />

          {/* ویرایش مأموریت */}

          <Route
            path="/coordinator/missions/edit/:id"
            element={
              <CoordinatorLayout>
                <CoordinatorEditMission />
              </CoordinatorLayout>
            }
          />

          {/* مدیریت بحران‌ها */}

          <Route
            path="/coordinator/disasters"
            element={
              <CoordinatorLayout>
                <Disasters />
              </CoordinatorLayout>
            }
          />

          {/* مدیریت کاربران */}

          <Route
            path="/coordinator/users"
            element={
              <CoordinatorLayout>
                <CoordinatorUsers />
              </CoordinatorLayout>
            }
          />


          {/* =====================================================
              ADMIN
          ===================================================== */}

          {/* Dashboard */}

          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />

          {/* Profile */}

          <Route
            path="/admin/profile"
            element={
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            }
          />

          {/* Disasters */}

          <Route
            path="/admin/disasters"
            element={
              <AdminLayout>
                <AdminDisasters />
              </AdminLayout>
            }
          />

          {/* Create Disaster */}

          <Route
            path="/admin/disasters/create"
            element={
              <AdminLayout>
                <AdminCreateDisaster />
              </AdminLayout>
            }
          />

          {/* Edit Disaster */}

          <Route
            path="/admin/disasters/edit/:id"
            element={
              <AdminLayout>
                <AdminEditDisaster />
              </AdminLayout>
            }
          />

          {/* Missions */}

          <Route
            path="/admin/missions"
            element={
              <AdminLayout>
                <AdminMissions />
              </AdminLayout>
            }
          />

          {/* Create Mission */}

          <Route
            path="/admin/missions/create"
            element={
              <AdminLayout>
                <AdminCreateMission />
              </AdminLayout>
            }
          />

          {/* Edit Mission */}

          <Route
            path="/admin/missions/edit/:id"
            element={
              <AdminLayout>
                <AdminEditMission />
              </AdminLayout>
            }
          />

          {/* Volunteers */}

          <Route
            path="/admin/volunteers"
            element={
              <AdminLayout>
                <AdminVolunteers />
              </AdminLayout>
            }
          />

          {/* Users */}

          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />

        </Routes>
      </BrowserRouter>


      {/* =====================================================
          TOAST
      ===================================================== */}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}
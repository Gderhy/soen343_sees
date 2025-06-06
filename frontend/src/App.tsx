import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import Header from "./components/Header/Header";
import { AuthProvider } from "./contexts/AuthContext";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import EventDetail from "./pages/EventDetail/EventDetail";
import EditEvent from "./pages/EditEvent/EditEvent";
import ManageMyEvents from "./pages/ManageMyEvents/ManageMyEvents";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import RegisterStakeholder from "./pages/RegisterStakeholder/RegisterStakeholder";
import StakeholderPortal from "./pages/StakeholderPortal/StakeholderPortal";
import LiveEvent from "./pages/LiveEvent/LiveEvent";
import AttendingEvents from "./pages/AttendingEvents/AttendingEvents";
import ManageAttendees from "./pages/ManageAttendees/ManageAttendees";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/event/live/:id" element={<LiveEvent/>} />

        {/* Routes that require authentication */}
        <Route element={<ProtectedRoute redirectTo="/login" requireAuth={true} />}>
          <Route path="/attending-events" element={<AttendingEvents />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/manage-my-events" element={<ManageMyEvents />} />
          <Route path="/manage-attendees/:id" element={<ManageAttendees />} />
        </Route>

        {/* Routes only for guests (unauthenticated users) */}
        <Route element={<ProtectedRoute redirectTo="/" requireAuth={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/register-stakeholder"
            element={<RegisterStakeholder />}
          />
        </Route>

        {/* Admin Routes */}
        <Route
          element={<ProtectedRoute redirectTo="/" requiredSystemRole="admin" />}
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Stakeholder Routes */}
        <Route
          element={
            <ProtectedRoute redirectTo="/" requiredSystemRole="stakeholder" />
          }
        >
          <Route path="/stakeholder-portal" element={<StakeholderPortal />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import Header from "./components/Header/Header";
import { AuthProvider } from "./contexts/AuthContext";
import CreateEvent from "./pages/EditCreateEvent/CreateEvent";
import EventDetail from "./pages/EventDetail/EventDetail";
import EditEvent from "./pages/EditCreateEvent/EditEvent";
import ManageMyEvents from "./pages/ManageMyEvents/ManageMyEvents";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import RegisterStakeholder from "./pages/RegisterStakeholder/RegisterStakeholder";


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />

        {/* Routes that require authentication */}
        <Route element={<ProtectedRoute redirectTo="/login" requireAuth={true} />}>
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/manage-my-events" element={<ManageMyEvents />} />
        </Route>

        {/* Routes only for guests (unauthenticated users) */}
        <Route element={<ProtectedRoute redirectTo="/" requireAuth={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-stakeholder" element={<RegisterStakeholder />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute redirectTo="/" requiredSystemRole="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

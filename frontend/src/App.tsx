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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

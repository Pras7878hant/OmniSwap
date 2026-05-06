import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import Notes from "./pages/Notes";
import ExamRoadmap from "./pages/ExamRoadmap";

import PrivateRoute from "./components/PrivateRoute";
import Chat from "./pages/Chat";

import Whiteboard from "./pages/Whiteboard";
import Roadmap from "./pages/Roadmap";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/exam-roadmap" element={<ExamRoadmap />} />
        <Route path="/whiteboard/:roomId" element={<Whiteboard />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <PrivateRoute>
              <Matches />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

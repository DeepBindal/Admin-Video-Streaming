import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Navbar";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import CreateVideo from "./pages/CreateVideo";
import VideoDetails from "./pages/VideoDetails";
import Analytis from "./pages/Analytics";
import EditVideo from "./pages/EditVideo";
import BottomBar from "./components/BottomBar";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Nav />

      {/* Main content */}
      <main className="flex montserrat-font-family flex-row">
        <Sidebar />
        <section className="custom-scrollbar main-container">
          <div className="w-full max-w-4xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-video" element={<CreateVideo />} />
            <Route path="/video/:id" element={<VideoDetails />} />
            <Route path="/video/edit/:id" element={<EditVideo />} />
            <Route path="/analytics" element={<Analytis />} />
          </Routes>
          </div>
        </section>
      </main>
      <BottomBar />

      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
}

export default App;

import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />    
    </Routes>
  );
}

export default App;

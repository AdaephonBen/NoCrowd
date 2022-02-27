import "./App.css";
import Navbar from "./components/navbar";
import Landing from "./pages/landing";
import Order from "./pages/order";
import OrderConfirmation from "./pages/order_confirmation";
import Caterer from "./pages/caterer";
import react, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Done from "./pages/done";

function App() {
  const [orderid, setOrderid] = useState([]);
  const [googleResponse, setGoogleResponse] = useState({});
  console.log(localStorage.getItem("order"));
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/order"
            element={<Order setOrderid={setOrderid} sgr={setGoogleResponse} />}
          />
          <Route
            path="/confirm"
            element={<OrderConfirmation googleResponse={googleResponse} />}
          />
          <Route path="/caterer" element={<Caterer />} />
          <Route path="/done" element={<Done />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

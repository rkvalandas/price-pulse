import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import Login from "./components/User/Login";
import Signup from "./components/User/Signup";
import App from "./App.jsx";
import Product from "./components/Product/Product.jsx";
import Home from "./components/Home/Home.jsx";
import Alerts from "./components/Alerts/Alerts.jsx";
import ForgotPassword from "./components/User/ForgotPassword.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="product" element={<Product />} />
      <Route path="alerts" element={<Alerts />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(

    <RouterProvider router={router} />

);

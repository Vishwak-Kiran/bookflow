import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import { productsData } from "./api/Api";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./Home";
import Cart from "./pages/Cart";
import "./App.css";
import HashLoader from "react-spinners/HashLoader";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Singup";
import { AvailableCopiesProvider } from "./context/AvailableCopiesContext";

const Layout = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <div>
      {loading ? (
        <div className="App">
          <HashLoader color={"#36d7b7"} loading={loading} size={100} />
        </div>
      ) : (
        <>
          <Header />
          <ScrollRestoration />
          <Home />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
};

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        loader: productsData,
      },
      // {
      //   path: "/product/:id",
      //   element: <Product />,
      // },
      {
        path: "/cart",

        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="font-bodyFont">
      <UserAuthContextProvider>
        <AvailableCopiesProvider>
          <RouterProvider router={router} />
        </AvailableCopiesProvider>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;

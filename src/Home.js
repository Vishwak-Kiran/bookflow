import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Search from "./components/Search";
import { useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const data = useLoaderData();
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(data.data);
  }, [data]);
  return (
    <div>
      <Search />
    </div>
  );
};

export default Home;

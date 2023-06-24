import { createContext, useContext, useEffect, useState } from "react";

const availableCopies = createContext();

export function AvailableCopiesProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setCartItems(JSON.parse(storedItems));
    }
  }, []);

  const localStore = () => {
    const string = JSON.stringify(cartItems);
    localStorage.setItem("cartItems", string);
  };

  useEffect(() => {
    localStore();
  }, [cartItems]);

  return (
    <availableCopies.Provider value={{ cartItems, setCartItems }}>
      {children}
    </availableCopies.Provider>
  );
}

export function useAvailableCopies() {
  return useContext(availableCopies);
}

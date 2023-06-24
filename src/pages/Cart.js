import React, { useEffect, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useUserAuth } from "../context/UserAuthContext";
import { useAvailableCopies } from "../context/AvailableCopiesContext";
import {
  decrementQuantity,
  deleteItem,
  increamentQuantity,
  resetCart,
} from "../redux/bazarSlice";
import HashLoader from "react-spinners/HashLoader";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Cart = () => {
  const { user, logIn, googleSignIn, logOut } = useUserAuth();
  const { cartItems, setCartItems } = useAvailableCopies();
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const [confirmMsg, setConfirmMsg] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  const productData = useSelector((state) => state.bazar.productData);
  console.log(productData);
  const [payNow, setPayNow] = useState(false);
  const [totalAmt, setTotalAmt] = useState("");
  useEffect(() => {
    let price = 0;
    productData.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price.toFixed(2));
  }, [productData]);

  const handleCheckout = () => {
    if (user) {
      setShowConfirm(!showConfirm);
      setPayNow(true);
    } else {
      toast.error("Please sign in to Checkout");
    }
  };

  const handleConfirm = () => {
    if (user) {
      const cartItemIds = productData.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));
      setCartItems(cartItemIds);
      dispatch(resetCart());
      setConfirmMsg(true);
    }
    console.log(cartItems);
  };

  return (
    <div>
      {loading ? (
        <div className="App">
          <HashLoader color={"#36d7b7"} loading={loading} size={100} />
        </div>
      ) : (
        <div>
          <Header />
          <img
            className="w-full h-60 object-cover"
            src="https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="cartImg"
          />
          {productData.length > 0 ? (
            <div className="max-w-screen-xl mx-auto py-20 flex">
              <CartItem />
              <div className="w-1/3 bg-[#fafafa] py-6 px-4">
                <div className=" flex flex-col gap-6 border-b-[1px] border-b-gray-400 pb-6">
                  <h2 className="text-2xl font-medium ">cart totals</h2>
                  <p className="flex items-center gap-4 text-base">
                    Subtotal{" "}
                    <span className="font-titleFont font-bold text-lg">
                      ${totalAmt}
                    </span>
                  </p>
                  <p className="flex items-start gap-4 text-base">
                    Shipping{" "}
                    <span>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Quos, veritatis.
                    </span>
                  </p>
                </div>
                <p className="font-titleFont font-semibold flex justify-between mt-6">
                  Total <span className="text-xl font-bold">${totalAmt}</span>
                </p>
                <button
                  onClick={handleCheckout}
                  className="text-base bg-black text-white w-full py-3 mt-6 hover:bg-gray-800 duration-300"
                >
                  proceed to checkout
                </button>
                {showConfirm && (
                  <button
                    onClick={handleConfirm}
                    className="text-base bg-black text-white w-full py-3 mt-6 hover:bg-gray-800 duration-300"
                  >
                    proceed to checkout
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-screen-xl mx-auto py-10 flex flex-col items-center gap-2 justify-center">
              {confirmMsg ? (
                <p className="text-xl text-orange-600 font-titleFont font-semibold">
                  Thank you for renting with us. Your order has been placed
                </p>
              ) : (
                <p className="text-xl text-orange-600 font-titleFont font-semibold">
                  Your Cart is Empty. Please go back to Shopping and add
                  products to Cart.
                </p>
              )}
              <Link to="/home">
                <button className="flex items-center gap-1 text-gray-400 hover:text-black duration-300">
                  <span>
                    <HiOutlineArrowLeft />
                  </span>
                  go shopping
                </button>
              </Link>
            </div>
          )}
          <ToastContainer
            position="top-left"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Cart;

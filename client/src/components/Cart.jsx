import React from "react";
import CartCount from "./cart/CartCount";
import CartEmpty from "./cart/CartEmpty";
import CartItem from "./cart/CartItem";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartState,
  selectTotalAmount,
  selectTotalQTY,
  setClearCartItems,
  setCloseCart,
  setGetTotals,
  setOpenCart,
} from "../app/CartSlice";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const dispatch = useDispatch();
  const ifCartState = useSelector(selectCartState);
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const totalQTY = useSelector(selectTotalQTY);

  useEffect(() => {
    dispatch(setGetTotals());
  }, [cartItems, dispatch]);

  const onCartToogle = () => {
    dispatch(
      setCloseCart({
        cartState: false,
      })
    );
  };
  const onClearCartItems = (payment) => {
    dispatch(setClearCartItems(payment ? payment : ""));
  };

  // Payment Integration
  async function makePayment() {
    const stripe = await loadStripe(`${import.meta.env.VITE_STRIPE_KEY}`);
    const body = {
      products: cartItems,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND}/api/create-checkout-session`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session?.id,
    });
    if (result?.error) {
      console.log(result?.error);
    } else {
      onClearCartItems("payment");
    }
  }
  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 blur-effect-theme w-full h-screen opacity-100 z-[250] ${
          ifCartState
            ? "opacity-100 visible translate-x-0"
            : "opacity-0 invisible translate-x-8"
        }`}
      >
        <div className={` blur-effect-theme max-w-xl w-full absolute right-0`}>
          <CartCount
            totalQTY={totalQTY}
            onCartToogle={onCartToogle}
            onClearCartItems={onClearCartItems}
          />
          {cartItems.length === 0 ? (
            <CartEmpty onCartToogle={onCartToogle} />
          ) : (
            <div>
              <div className="flex items-start justify-start flex-col gap-y-7 lg:gap-y-5 overflow-y-scroll h-[81vh] py-3 scroll-smooth scroll-hidden">
                {cartItems?.map((item, i) => (
                  <CartItem key={i} item={item} />
                ))}
              </div>
              <div className="fixed bottom-0 bg-white w-full px-5 py-2 grid items-center ">
                <div className="flex items-center justify-between">
                  <h1 className="text-base font-semibold uppercase">
                    Subtotal
                  </h1>
                  <h1 className="text-sm rounded bg-theme-cart text-slate-100 px-1 py-0.5">
                    ${totalAmount}
                  </h1>
                </div>
                <div className="grid items-center gap-2">
                  <p className="text-sm font-medium text-center">
                    Tax and Shipping Will Calculate At Shipping
                  </p>
                  <button
                    type="button"
                    className="button-theme bg-theme-cart text-white"
                    onClick={makePayment}
                  >
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;

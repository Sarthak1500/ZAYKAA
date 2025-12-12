import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    url,
    currency,
    deliveryCharge,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const isCartEmpty = getTotalCartAmount() === 0;

  const handleRemoveItem = (itemId) => {
    const quantity = cartItems[itemId];
    for (let i = 0; i < quantity; i++) {
      removeFromCart(itemId);
    }
  };

  if (isCartEmpty) {
    return (
      <div className="cart">
        <div className="empty-cart-container">
          <div className="empty-cart-content">
            <img
              src={assets.basket_icon}
              alt="Empty cart"
              className="empty-cart-icon"
            />
            <h3>Your Cart is Empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <p className="empty-cart-subtext">
              Browse our delicious menu and add your favorite items!
            </p>
            <button className="explore-menu-btn" onClick={() => navigate("/")}>
              Explore Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p>{" "}
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>
                    {currency}
                    {item.price}
                  </p>

                  <div className="cart-quantity-controls">
                    <button
                      className="quantity-btn decrease"
                      onClick={() => removeFromCart(item._id)}
                    ></button>
                    <span className="quantity-display">
                      {cartItems[item._id]}
                    </span>
                    <button
                      className="quantity-btn increase"
                      onClick={() => addToCart(item._id)}
                    >
                      +
                    </button>
                  </div>

                  <p>
                    {currency}
                    {item.price * cartItems[item._id]}
                  </p>
                  <p
                    className="cart-items-remove-icon"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    ✕
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                {currency}
                {getTotalCartAmount() === 0 ? 0 : deliveryCharge}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + deliveryCharge}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

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
    token,
    setShowLogin,
  } = useContext(StoreContext);

  console.log("setShowLogin:", setShowLogin);

  const navigate = useNavigate();

  const isCartEmpty = getTotalCartAmount() === 0;

  const handleRemoveItem = (itemId) => {
    const quantity = cartItems[itemId];
    for (let i = 0; i < quantity; i++) {
      removeFromCart(itemId);
    }
  };

  if (!token) {
    return (
      <div className="cart login-required">
        <div className="login-required-card">
          <img
            src={assets.basket_icon}
            alt="Login Required"
            className="login-required-icon"
          />

          <h2>Login Required</h2>
          <p>Please log in to view your cart and place orders.</p>

          <div className="login-required-actions">
            <button
              className="login-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>

            <button className="browse-btn" onClick={() => navigate("/")}>
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <p>Add some delicious food to get started</p>

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
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {food_list.map((item) =>
          cartItems[item._id] > 0 ? (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
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
          ) : null
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>

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
              {deliveryCharge}
            </p>
          </div>

          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>
              {currency}
              {getTotalCartAmount() + deliveryCharge}
            </b>
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

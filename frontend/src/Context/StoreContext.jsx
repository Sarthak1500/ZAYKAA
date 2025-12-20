import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { menu_list as staticMenuList } from "../assets/assets";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:4000";

  const [food_list, setFoodList] = useState([]);
  const [menu_list] = useState(staticMenuList);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  
  const currency = "₹";
  const deliveryCharge = 50;

  const api = useMemo(() => {
    return axios.create({
      baseURL: url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, [token]);

  const addToCart = useCallback(
    async (itemId) => {
      setCartItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));

      if (!token) return;

      try {
        await api.post("/api/cart/add", { itemId });
      } catch (err) {
        console.error("Add to cart failed:", err.message);
      }
    },
    [api, token]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      setCartItems((prev) => {
        const qty = prev[itemId];
        if (!qty) return prev;

        const updated = { ...prev };
        updated[itemId] = qty - 1;

        if (updated[itemId] <= 0) delete updated[itemId];

        return updated;
      });

      if (!token) return;

      try {
        await api.post("/api/cart/remove", { itemId });
      } catch (err) {
        console.error("Remove from cart failed:", err.message);
      }
    },
    [api, token]
  );

  const getTotalCartAmount = useCallback(() => {
    if (!food_list.length) return 0;

    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = food_list.find((p) => p._id === id);
      return product ? total + product.price * qty : total;
    }, 0);
  }, [cartItems, food_list]);

  const fetchFoodList = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data?.data || []);
    } catch (err) {
      console.error("Fetch foods failed:", err.message);
    }
  }, []);

  const loadCartData = useCallback(async () => {
    if (!token) return;
    
    try {
      const res = await api.post("/api/cart/get");
      setCartItems(res.data?.cartData || {});
    } catch (err) {
      console.error("Cart load failed:", err.message);
    }
  }, [api, token]);

  const logout = useCallback(() => {
    setToken("");
    setCartItems({});
    localStorage.removeItem("token");
    toast.info("Logged out successfully");
  }, []);


  useEffect(() => {
    fetchFoodList();

    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, [fetchFoodList]);

  useEffect(() => {
    if (token) loadCartData();
  }, [token, loadCartData]);

  const contextValue = useMemo(
    () => ({
      url,
      food_list,
      menu_list,
      cartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      token,
      setToken,
      setCartItems,
      currency,
      deliveryCharge,
      loadCartData,
      logout,
      showLogin,
      setShowLogin,
    }),
    [
      food_list,
      menu_list,
      cartItems,
      token,
      getTotalCartAmount,
      addToCart,
      removeFromCart,
      loadCartData,
      logout,
      showLogin,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
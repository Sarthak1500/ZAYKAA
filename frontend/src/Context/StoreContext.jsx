// import { createContext, useEffect, useState } from "react";
// import { food_list, menu_list } from "../assets/assets";
// import axios from "axios";
// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {

//     const url = "http://localhost:4000"
//     const [food_list, setFoodList] = useState([]);
//     const [cartItems, setCartItems] = useState({});
//     const [token, setToken] = useState("")
//     const currency = "₹";
//     const deliveryCharge = 50;

//     const addToCart = async (itemId) => {
//         if (!cartItems[itemId]) {
//             setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
//         }
//         else {
//             setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
//         }
//         if (token) {
//             await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
//         }
//     }

//     const removeFromCart = async (itemId) => {
//         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
//         if (token) {
//             await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
//         }
//     }

//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
//         for (const item in cartItems) {
//             try {
//               if (cartItems[item] > 0) {
//                 let itemInfo = food_list.find((product) => product._id === item);
//                 totalAmount += itemInfo.price * cartItems[item];
//             }
//             } catch (error) {

//             }

//         }
//         return totalAmount;
//     }

//     const fetchFoodList = async () => {
//         const response = await axios.get(url + "/api/food/list");
//         setFoodList(response.data.data)
//     }

//     const loadCartData = async (token) => {
//         const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
//         setCartItems(response.data.cartData);
//     }

//     useEffect(() => {
//         async function loadData() {
//             await fetchFoodList();
//             if (localStorage.getItem("token")) {
//                 setToken(localStorage.getItem("token"))
//                 await loadCartData({ token: localStorage.getItem("token") })
//             }
//         }
//         loadData()
//     }, [])

//     const contextValue = {
//         url,
//         food_list,
//         menu_list,
//         cartItems,
//         addToCart,
//         removeFromCart,
//         getTotalCartAmount,
//         token,
//         setToken,
//         loadCartData,
//         setCartItems,
//         currency,
//         deliveryCharge
//     };

//     return (
//         <StoreContext.Provider value={contextValue}>
//             {props.children}
//         </StoreContext.Provider>
//     )

// }

// export default StoreContextProvider;








import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { menu_list as staticMenuList } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:4000";

  const [food_list, setFoodList] = useState([]);
  const [menu_list] = useState(staticMenuList);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

  const currency = "₹";
  const deliveryCharge = 50;

  // OPTIMIZED AXIOS INSTANCE
  const api = useMemo(() => {
    return axios.create({
      baseURL: url,
      headers: token ? { token } : {},
    });
  }, [token]);

  // ADD TO CART
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
        console.error("Add failed:", err.message);
      }
    },
    [api, token]
  );

  // REMOVE FROM CART
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
        console.error("Remove failed:", err.message);
      }
    },
    [api, token]
  );

  // TOTAL AMOUNT
  const getTotalCartAmount = useCallback(() => {
    if (!food_list.length) return 0;

    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = food_list.find((p) => p._id === id);
      return product ? total + product.price * qty : total;
    }, 0);
  }, [cartItems, food_list]);

  // FETCH FOOD LIST
  const fetchFoodList = useCallback(async () => {
    try {
      const res = await api.get("/api/food/list");
      setFoodList(res.data?.data || []);
    } catch (err) {
      console.error("Fetch foods failed:", err.message);
    }
  }, [api]);

  // LOAD CART DATA WHEN TOKEN PRESENT
  const loadCartData = useCallback(async () => {
    try {
      const res = await api.post("/api/cart/get");
      setCartItems(res.data?.cartData || {});
    } catch (err) {
      console.error("Cart load failed:", err.message);
    }
  }, [api]);

  // INITIAL LOAD
  useEffect(() => {
    fetchFoodList();

    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, [fetchFoodList]);

  // LOAD CART WHEN TOKEN CHANGES
  useEffect(() => {
    if (token) loadCartData();
  }, [token, loadCartData]);

  // MEMOIZED CONTEXT VALUE
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
    }),
    [
      url,
      food_list,
      menu_list,
      cartItems,
      token,
      getTotalCartAmount,
      addToCart,
      removeFromCart,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

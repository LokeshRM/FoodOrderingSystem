import { useState } from "react";
import Meals from "../components/Meals/Meals";
import Header from "./Layout/Header";
import Cart from "./Cart/Cart";
import CartProvider from "../store/CartProvider";
import Order from "./Orders/Order";

function App(props) {
    const [cartIsShown, setCartIsShown] = useState(false);
    const [OrderIsShown, setOrderIsShown] = useState(false);

    const handleShowCart = () => {
        setCartIsShown(true);
    };

    const handleHideCart = () => {
        setCartIsShown(false);
    };

    const handleShowOrders = () => {
        setOrderIsShown(true);
    };

    const handleHideOrders = () => {
        setOrderIsShown(false);
    };

    return (
        <CartProvider>
            {cartIsShown && <Cart onHideCart={handleHideCart} />}
            {OrderIsShown && <Order onHideOrder={handleHideOrders} />}
            <Header
                onShowCart={handleShowCart}
                onShowOrder={handleShowOrders}
                logout={props.logout}
            />
            <main>
                <Meals />
            </main>
        </CartProvider>
    );
}

export default App;

import { useState } from "react";
import Meals from "./supply/Meals/Meals";
import Header from "./supply/Layout/Header";
import Order from "./supply/Orders/Order";
import Cart from "./supply/Cart/Cart";

function Supplier(props) {
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
        <>
            {cartIsShown && <Cart onHideCart={handleHideCart} />}
            {OrderIsShown && <Order onHideOrder={handleHideOrders} />}
            <Header
                onShowOrder={handleShowOrders}
                onShowCart={handleShowCart}
                logout={props.logout}
            />
            <main>
                <Meals />
            </main>
        </>
    );
}

export default Supplier;

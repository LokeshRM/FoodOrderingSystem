import React from "react";
import HeaderCartButton from "./HeaderCartButton";
import HeaderDeliveryButton from "./HeaderDeliveryButton";
import Logout from "./logout";

const Header = (props) => {
    return (
        <>
            <header className="fixed top-0 left-0 w-full h-16 md:h-24 leading-1 bg-yellow-650 text-white flex justify-around items-center px-8 md:px-5% shadow-md z-10">
                <h1 className="text-2xl md:text-[2rem]">Foodie kart</h1>
                <HeaderDeliveryButton
                    className="flex-1"
                    onClick={props.onShowOrder}
                />
                <HeaderCartButton onClick={props.onShowCart} />
                <Logout logout={props.logout} />
            </header>
            <div className="w-full h-25 z-0 overflow-hidden">
                <img
                    className="w-8/7 h-full object-cover transform-img"
                    src="/meals.jpg"
                    alt="A table full of delicious food"
                />
            </div>
        </>
    );
};

export default Header;

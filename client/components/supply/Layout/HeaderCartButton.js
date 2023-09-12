import { useState } from "react";

const HeaderCartButton = (props) => {
    const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);

    const btnClasses = `cursor-pointer font-inherit font-bold border-none bg-yellow-650 text-white py-2.5 md:py-3 px-6 md:px-12 flex justify-around items-center rounded-2xl md:rounded-3xl hover:bg-red-950 group ${
        btnIsHighlighted ? "animate-bump" : ""
    }`;

    return (
        <button className={btnClasses} onClick={props.onClick}>
            <span className="text-sm md:text-base">Add Food Item</span>
        </button>
    );
};

export default HeaderCartButton;

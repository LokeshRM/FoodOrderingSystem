import React, { useRef, useState } from "react";

const isEmpty = (value) => value.trim() === "";

const Checkout = (props) => {
    const nameInputRef = useRef();
    const streetInputRef = useRef();
    const postalCodeInputRef = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();

        const enteredName = nameInputRef.current.value;
        const enteredStreet = streetInputRef.current.value;
        const enteredPostalCode = postalCodeInputRef.current.value;

        const enteredNameIsValid = !isEmpty(enteredName);
        const enteredStreetIsValid = !isEmpty(enteredStreet);
        const enteredPostalCodeIsValid = !isEmpty(enteredPostalCode);

        const formIsValid =
            enteredNameIsValid &&
            enteredStreetIsValid &&
            enteredPostalCodeIsValid;

        if (!formIsValid) return;
        let temp = {
            name: enteredName,
            description: enteredStreet,
            price: enteredPostalCode,
        };
        // var orders = JSON.parse(localStorage.getItem("orders") || "[]");
        // orders.push(temp);
        // localStorage.setItem("orders", JSON.stringify(orders));
        props.onSubmit(temp);
    };
    return (
        <>
            <form
                className="my-4 mx-0 h-[19rem] overflow-auto"
                onSubmit={handleSubmit}
            >
                <div className="mb-2">
                    <label className={`font-bold mb-1 block`} htmlFor="name">
                        Name
                    </label>
                    <input
                        className={`font-inherit custom-border rounded w-80 max-w-full`}
                        type="text"
                        id="name"
                        ref={nameInputRef}
                    />
                </div>
                <div className="mb-2">
                    <label className={`font-bold mb-1 block`} htmlFor="street">
                        description
                    </label>
                    <input
                        className={`font-inherit custom-border rounded w-80 max-w-full `}
                        type="text"
                        id="street"
                        ref={streetInputRef}
                    />
                </div>
                <div className="mb-2">
                    <label className={`font-bold mb-1 block`} htmlFor="postal">
                        Price
                    </label>
                    <input
                        className={`font-inherit custom-border rounded w-80 max-w-full `}
                        type="text"
                        id="postal"
                        ref={postalCodeInputRef}
                    />
                </div>

                <button className="checkout-btn bg-yellow-980 text-white border border-solid border-yellow-980 hover:bg-yellow-880 active:bg-yellow-880">
                    Confirm
                </button>
            </form>
        </>
    );
};

export default Checkout;

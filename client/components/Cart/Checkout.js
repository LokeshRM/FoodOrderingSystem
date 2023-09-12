import React, { useRef, useState, useContext } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import CartContext from "../../store/cart-context";

const isEmpty = (value) => value.trim() === "";
const isFiveChars = (value) => value.length === 5;

const Checkout = (props) => {
    const cartContext = useContext(CartContext);
    const [formInputsValidity, setFormInputsValidity] = useState({
        name: true,
        street: true,
        postalCode: true,
        city: true,
    });

    const nameInputRef = useRef();
    const streetInputRef = useRef();
    const postalCodeInputRef = useRef();
    const cityInputRef = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();

        const enteredName = nameInputRef.current.value;
        const enteredStreet = streetInputRef.current.value;
        const enteredPostalCode = postalCodeInputRef.current.value;
        const enteredCity = cityInputRef.current.value;

        const enteredNameIsValid = !isEmpty(enteredName);
        const enteredStreetIsValid = !isEmpty(enteredStreet);
        const enteredPostalCodeIsValid = isFiveChars(enteredPostalCode);
        const enteredCityIsValid = !isEmpty(enteredCity);

        setFormInputsValidity({
            name: enteredNameIsValid,
            Street: enteredStreetIsValid,
            postalCode: enteredPostalCodeIsValid,
            city: enteredCityIsValid,
        });

        const formIsValid =
            enteredNameIsValid &&
            enteredStreetIsValid &&
            enteredCityIsValid &&
            enteredPostalCodeIsValid;

        if (!formIsValid) return;
        let temp = {
            name: enteredName,
            street: enteredStreet,
            postalCode: enteredPostalCode,
            city: enteredCity,
            amount: cartContext.totalAmount,
        };
        // var orders = JSON.parse(localStorage.getItem("orders") || "[]");
        // orders.push(temp);
        // localStorage.setItem("orders", JSON.stringify(orders));
        props.onSubmit(temp);
    };
    return (
        <>
            <p className="text-center text-2xl font-bold">Enter your details</p>
            <form
                className="my-4 mx-0 h-[19rem] overflow-auto"
                onSubmit={handleSubmit}
            >
                <div className="mb-2">
                    <label
                        className={`font-bold mb-1 block ${
                            formInputsValidity.name ? "" : "text-red-450"
                        }`}
                        htmlFor="name"
                    >
                        Your Name
                    </label>
                    <input
                        className={`font-inherit custom-border rounded w-80 max-w-full ${
                            formInputsValidity.name
                                ? ""
                                : "border-red-550 bg-red-75"
                        }`}
                        type="text"
                        id="name"
                        ref={nameInputRef}
                    />
                    {!formInputsValidity.name && (
                        <p>Please enter a valid name!</p>
                    )}
                </div>
                <div className="mb-2">
                    <label
                        className={`font-bold mb-1 block ${
                            formInputsValidity.street ? "" : "text-red-450"
                        }`}
                        htmlFor="street"
                    >
                        Street
                    </label>
                    <input
                        className={`font-inherit custom-border rounded w-80 max-w-full ${
                            formInputsValidity.street
                                ? ""
                                : "border-red-550 bg-red-75"
                        }`}
                        type="text"
                        id="street"
                        ref={streetInputRef}
                    />
                    {!formInputsValidity.street && (
                        <p>Please enter a valid street!</p>
                    )}
                </div>
                <div className="mb-2">
                    <label
                        className={`font-bold mb-1 block ${
                            formInputsValidity.postalCode ? "" : "text-red-450"
                        }`}
                        htmlFor="postal"
                    >
                        Postal
                    </label>
                    <input
                        className={`font-inherit custom-border rounded w-80 max-w-full ${
                            formInputsValidity.postalCode
                                ? ""
                                : "border-red-550 bg-red-75"
                        }`}
                        type="text"
                        id="postal"
                        ref={postalCodeInputRef}
                    />
                    {!formInputsValidity.postalCode && (
                        <p>
                            Please enter a valid postal code (5 characters
                            long)!
                        </p>
                    )}
                </div>
                <div className="mb-2">
                    <label
                        className={`font-bold mb-1 block ${
                            formInputsValidity.city ? "" : "text-red-450"
                        }`}
                        htmlFor="city"
                    >
                        City
                    </label>
                    <input
                        className={`font-inherit custom-border rounded w-80 max-w-full ${
                            formInputsValidity.city
                                ? ""
                                : "border-red-550 bg-red-75"
                        }`}
                        type="text"
                        id="city"
                        ref={cityInputRef}
                    />
                    {!formInputsValidity.city && (
                        <p>Please enter a valid city!</p>
                    )}
                </div>
                <div className="flex justify-end gap-4 mt-5">
                    <button
                        className="checkout-btn flex-none mr-auto"
                        type="button"
                        onClick={props.onBack}
                    >
                        <ArrowLeftIcon className="h-3 mr-2" />
                        back
                    </button>
                    <button
                        className="checkout-btn"
                        type="button"
                        onClick={props.onCancel}
                    >
                        Cancel
                    </button>
                    <button className="checkout-btn bg-yellow-980 text-white border border-solid border-yellow-980 hover:bg-yellow-880 active:bg-yellow-880">
                        Confirm
                    </button>
                </div>
            </form>
        </>
    );
};

export default Checkout;

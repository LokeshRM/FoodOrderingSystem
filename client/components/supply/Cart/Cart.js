import { useContext, useState } from "react";
import dynamic from "next/dynamic";

const Modal = dynamic(
    () => {
        return import("../../UI/Modal");
    },
    { ssr: false }
);

import Checkout from "./Checkout";

const Cart = (props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);

    const handleSubmitOrder = async (userData) => {
        setIsSubmitting(true);
        await fetch("https://fos-backend.up.railway.app/addItems", {
            method: "POST",
            // mode: "no-cors",
            body: JSON.stringify({
                supply_id: localStorage.getItem("supply_id"),
                data: userData,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        setIsSubmitting(false);
        setDidSubmit(true);
    };

    const modalActions = (
        <div className="text-right">
            <button
                className="cart-btn text-yellow-750 border-yellow-750"
                onClick={props.onHideCart}
            >
                Close
            </button>
            {/* {hasItems && (
                <button
                    className="cart-btn bg-yellow-750 text-white"
                    onClick={handleSubmitOrder}
                >
                    Order
                </button>
            )} */}
        </div>
    );

    const cartModalContent = (
        <>
            <p className="text-center text-2xl font-bold">Enter Item details</p>
            <Checkout onSubmit={handleSubmitOrder} />
            {modalActions}
        </>
    );

    const isSubmittingModalContent = (
        <p className="text-2xl">Sending item data...</p>
    );

    const didSubmitModalContent = (
        <>
            <p className="text-2xl">Successfully sent order!</p>
            <div className="text-right">
                <button
                    className="cart-btn text-yellow-750 border-yellow-750"
                    onClick={props.onHideCart}
                >
                    Close
                </button>
            </div>
        </>
    );

    return (
        <Modal onClose={props.onHideCart}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {didSubmit && didSubmitModalContent}
        </Modal>
    );
};

export default Cart;

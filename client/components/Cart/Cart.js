import { useContext, useState } from "react";
import dynamic from "next/dynamic";

const Modal = dynamic(
    () => {
        return import("../UI/Modal");
    },
    { ssr: false }
);

import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const cartContext = useContext(CartContext);

    const totalAmount = `Rs ${cartContext.totalAmount.toFixed(2)}`;
    const hasItems = cartContext.items.length > 0;

    const handleCartItemAdd = (item) => {
        item.type = "2";
        cartContext.addItem(item);
    };
    const handleCartItemRemove = (id) => {
        cartContext.removeItem(id);
    };

    const handleOrder = () => {
        setIsCheckout(true);
    };

    const handleForm = () => {
        setIsCheckout(false);
    };

    const handleSubmitOrder = async (userData) => {
        setIsSubmitting(true);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit`, {
            method: "POST",
            // mode: "no-cors",
            body: JSON.stringify({
                cust_id: localStorage.getItem("custId"),
                orderedItems: cartContext.items,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        setIsSubmitting(false);
        setDidSubmit(true);
        cartContext.clearCart();
    };

    const cartItems = cartContext.items.map((cartItem) => (
        <ul
            className="list-none m-0 p-0 max-h-80 overflow-auto"
            key={cartItem.id}
        >
            <CartItem
                id={cartItem.id}
                name={cartItem.name}
                amount={cartItem.amount}
                price={cartItem.price}
                onAdd={handleCartItemAdd.bind(null, cartItem)}
                onRemove={handleCartItemRemove.bind(null, cartItem.id)}
            />
        </ul>
    ));

    const modalActions = (
        <div className="text-right">
            <button
                className="cart-btn text-yellow-750 border-yellow-750"
                onClick={props.onHideCart}
            >
                Close
            </button>
            {hasItems && (
                <button
                    className="cart-btn bg-yellow-750 text-white"
                    onClick={handleSubmitOrder}
                >
                    Order
                </button>
            )}
        </div>
    );

    const cartFull = (
        <>
            {cartItems}
            <div className="flex items-center justify-between font-bold text-2xl my-4 mx-0">
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
        </>
    );

    const cartModalContent = (
        <>
            {!isCheckout && cartFull}
            {isCheckout && (
                <Checkout
                    onBack={handleForm}
                    onCancel={props.onHideCart}
                    onSubmit={handleSubmitOrder}
                />
            )}
            {!isCheckout && modalActions}
        </>
    );

    const isSubmittingModalContent = (
        <p className="text-2xl">Sending order data...</p>
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

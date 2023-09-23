import { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import OrderItem from "./OrderItem";

const Modal = dynamic(
    () => {
        return import("../UI/Modal");
    },
    { ssr: false }
);

const Order = (props) => {
    const [orderItems, setOrderItems] = useState([]);
    useEffect(() => {
        const getFunction = async () => {
            const res = await fetch(
                "https://fos-backend.up.railway.app/getOrders",
                {
                    method: "POST",
                    // mode: "no-cors",
                    body: JSON.stringify({
                        cust_id: localStorage.getItem("custId"),
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            let data = await res.json();
            console.log(data);

            setOrderItems(data);
        };
        getFunction().catch((error) => {
            console.log(error.message);
        });
    }, []);

    const orderList = orderItems.map((item) => {
        return (
            <OrderItem
                key={item.delivery_id}
                name={item.cust_name}
                address={item.cust_address}
                mob={item.phno}
                foodname={item.food_name}
                quantity={item.food_quantity}
                price={item.payment}
                date={item.order_date}
                time={item.order_time}
            />
        );
    });

    return (
        <Modal onClose={props.onHideOrder}>
            <h1>Orders</h1>
            <div className="max-h-80 overflow-auto">{orderList}</div>

            <div className="text-right">
                <button
                    className="cart-btn text-yellow-750 border-yellow-750"
                    onClick={props.onHideOrder}
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default Order;

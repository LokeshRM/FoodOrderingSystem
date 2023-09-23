const OrderItem = (props) => {
    //const amount = `$${props.amount.toFixed(2)}`;

    return (
        <div className="mb-5 flex rounded-md border-2 border-solid border-black">
            <div className="flex-1 ml-5">
                <h3 className="underline underline-offset-4">Food Details</h3>
                <p>{props.foodname}</p>
                <p>Quantity : {props.quantity}</p>
                <p>Total Price : {props.price}</p>
                <p>Time : {props.time}</p>
            </div>
            <div className="mr-20">
                <h3 className="underline underline-offset-4">Address</h3>
                <p>User Name : {props.name}</p>
                <p>{props.address}</p>
                <p>Phone no : {props.mob}</p>
                <p>
                    Date :{" "}
                    {new Date(props.date)
                        .toLocaleString(undefined, { timeZone: "Asia/Kolkata" })
                        .slice(0, -13)}
                </p>
            </div>
        </div>
    );
};

export default OrderItem;

const MealItem = (props) => {
    const price = `Rs ${props.price.toFixed(2)}`;

    return (
        <>
            <li className="flex justify-between m-4 pb-4 border-bottom">
                <div>
                    <h3 className="mt-0 mx-0 mb-1">{props.name}</h3>
                    <div className="italic">{props.description}</div>
                    <div className="mt-1 font-bold text-xl text-yellow-550">
                        {price}
                    </div>
                </div>
            </li>
        </>
    );
};

export default MealItem;

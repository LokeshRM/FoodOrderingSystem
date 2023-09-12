import { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons/lib";

import Card from "../../UI/Card";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch("http://localhost:8000/supplyItems", {
                method: "POST",
                // mode: "no-cors",
                body: JSON.stringify({
                    supply_id: localStorage.getItem("supply_id"),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Something went wrong!");

            const responseData = await response.json();
            console.log(responseData);
            const loadedMeals = [];
            for (const key in responseData) {
                loadedMeals.push({
                    id: responseData[key].FOOD_ID,
                    name: responseData[key].NAME,
                    description: responseData[key].DESCRIPTION,
                    price: +responseData[key].PRICE,
                    supply_id: responseData[key].SUPPLY_ID,
                });
            }
            console.log("is running");
            setMeals(loadedMeals);
            setIsLoading(false);
        };
        const timer = setTimeout(() => {
            fetchMeals().catch((error) => {
                setIsLoading(false);
                setHttpError(error.message);
            });
            return () => {
                clearTimeout(timer);
            };
        }, 300);
        setInterval(fetchMeals, 5000);
    }, []);

    const mealsList = meals.map((meal) => (
        <MealItem
            id={meal.id}
            key={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}
            supply_id={meal.supply_id}
        />
    ));

    if (isLoading) {
        return (
            <section className="text-center p-4 bg-white shadow-md rounded-2xl max-w-[60rem] w-[90%] my-8 mx-auto">
                <IconContext.Provider value={{ className: "spinner" }}>
                    <ImSpinner9 />
                </IconContext.Provider>
            </section>
        );
    }

    if (httpError) {
        return (
            <section className="p-4 bg-white shadow-md rounded-2xl max-w-[60rem] w-[90%] my-8 mx-auto text-center">
                <p className="text-2xl text-red-600">{httpError}</p>
            </section>
        );
    }

    return (
        <section className="max-w-[60rem] w-[90%] my-8 mx-auto animate-meals-appear">
            <Card>
                <ul className="list-none m-0 p-0">{mealsList}</ul>
            </Card>
        </section>
    );
};

export default AvailableMeals;

import { useState, useRef } from "react";
const isEmpty = (value) => value.trim() === "";

function Login(props) {
    const [styleIt, setStyle] = useState("btn1");
    const [isRegister, setIsRegister] = useState(false);
    const [formInputsValidity, setFormInputsValidity] = useState({
        name: true,
        number: true,
        address: true,
    });
    const nameInputRef = useRef();
    const numberInputRef = useRef();
    const addressInputRef = useRef();
    const suppliernameInputRef = useRef();
    const supplieraddressInputRef = useRef();

    const handleRegister = () => {
        setStyle("btn2");
        setIsRegister(true);
    };

    const handleLogin = () => {
        setStyle("btn1");
        setIsRegister(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const enteredName = nameInputRef.current.value;
        const enteredNumber = numberInputRef.current.value;
        const enteredAddress = addressInputRef.current.value;

        const enteredNameIsValid = !isEmpty(enteredName);
        const enteredNumberIsValid = !isEmpty(enteredNumber);
        const enteredAddressIsValid = !isEmpty(enteredAddress);

        setFormInputsValidity({
            name: enteredNameIsValid,
            number: enteredNumberIsValid,
            address: enteredAddressIsValid,
        });

        const formIsValid =
            enteredNameIsValid && enteredNumberIsValid && enteredAddressIsValid;

        if (!formIsValid) return;
        let temp = {
            name: enteredName,
            number: enteredNumber,
            address: enteredAddress,
        };
        console.log(temp);
        props.onSubmit(temp);
    };

    const handleSupplierSubmit = (event) => {
        event.preventDefault();

        const enteredName = suppliernameInputRef.current.value;
        const enteredAddress = supplieraddressInputRef.current.value;

        const enteredNameIsValid = !isEmpty(enteredName);
        const enteredAddressIsValid = !isEmpty(enteredAddress);

        const formIsValid = enteredNameIsValid && enteredAddressIsValid;

        if (!formIsValid) return;
        let temp = {
            name: enteredName,
            address: enteredAddress,
        };
        console.log(temp);
        props.onSupply(temp);
    };

    return (
        <div className="hey">
            <div className="form-box">
                <div className="button-box">
                    <div className={styleIt}></div>
                    <button
                        type="button"
                        className="toggle-btn"
                        onClick={handleLogin}
                    >
                        {" "}
                        User{" "}
                    </button>
                    <button
                        type="button"
                        className="toggle-btn"
                        onClick={handleRegister}
                    >
                        {" "}
                        Supplier{" "}
                    </button>
                </div>

                {!isRegister && (
                    <form className="input-group" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input-feild"
                            ref={nameInputRef}
                            placeholder="Full Name"
                            required
                        />

                        <input
                            type="tel"
                            className="input-feild"
                            placeholder="10 digit Mobile number"
                            ref={numberInputRef}
                            pattern="[0-9]{10}"
                            required
                        />
                        <textarea
                            rows="4"
                            cols="20"
                            className="input-feild textarea"
                            ref={addressInputRef}
                            placeholder="Full Address"
                            required
                        ></textarea>
                        <button type="submit" className="submit-btn">
                            {" "}
                            SignUp{" "}
                        </button>
                    </form>
                )}
                {isRegister && (
                    <form
                        className="input-group"
                        onSubmit={handleSupplierSubmit}
                    >
                        <input
                            type="text"
                            className="input-feild"
                            placeholder="Supplier Name"
                            ref={suppliernameInputRef}
                            required
                        />

                        <textarea
                            rows="4"
                            cols="20"
                            className="input-feild textarea"
                            placeholder="Location"
                            ref={supplieraddressInputRef}
                            required
                        ></textarea>

                        <button type="submit" className="submit-btn">
                            SignUp
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;

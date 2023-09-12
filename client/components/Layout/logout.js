const Logout = (props) => {
    const btnClasses = `cursor-pointer font-inherit font-bold border-none bg-yellow-650 text-white py-2.5 ml-auto mr-4 md:py-4 px-6 md:px-12 flex justify-around items-center rounded-2xl md:rounded-3xl hover:bg-red-950 active:bg-red-950`;
    return (
        <button className={btnClasses} onClick={props.logout}>
            <span className="text-sm md:text-base">Logout</span>
        </button>
    );
};

export default Logout;

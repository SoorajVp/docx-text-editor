import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleDarkMode } from "../redux/slice/appSlice";
import { useDispatch, useSelector } from "react-redux";


const Header = () => {
  const { darkMode } = useSelector((store) => store.app)
  const { user_data } = useSelector((store) => store.user)

  const dispatch = useDispatch();
  
  const changeThemeMode = () => {
    dispatch(toggleDarkMode())
  }


  return (
    <header className="flex w-full items-center justify-between bg-neutral-300 dark:bg-black px-6 py-3 font-serif">
      <div className="flex items-center gap-2">
        <Link to="/get-started" className="hidden truncate uppercase text-lg font-semibold text-neutral-700 dark:text-gray-200 md:block">
          Documate
        </Link>
      </div>
      <div className="flex items-center justify-betwee  space-x-2 gap-5 dark:text-white text-neutral-800">
        <Link to="/" className="hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300" >Home</Link>
        <Link to="/edit" className="hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300" >Edit</Link>
        <Link to="/bin" className="hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300" >Bin</Link>

        <label className="flex cursor-pointer select-none items-center">
          <div className="hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300 pr-1">Dark Mode</div>
          <div className="relative">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={changeThemeMode}
              className="sr-only"
            />
            {/* Background changes color based on isChecked */}
            <div className={`block h-6 w-10 rounded-full transition ${darkMode ? "bg-orange-500" : "bg-gray-400 border border-neutral-500"
              }`}
            ></div>
            {/* Dot moves position based on isChecked */}
            <div
              className={`dot absolute top-1 h-4 w-4 rounded-full bg-white transition transform ${darkMode ? "translate-x-5" : "translate-x-1"
                }`}
            ></div>
          </div>
        </label>
        <Link to="/profile" className="flex items-center gap-2">
          <h3 className="hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300">Profile</h3>
          <img src={user_data?.picture || "https://ionicframework.com/docs/img/demos/avatar.svg"} alt="logo" className="h-8 w-8 rounded-full object-cover object-center" />
        </Link>
      </div>
    </header>
  );
};

export default Header;

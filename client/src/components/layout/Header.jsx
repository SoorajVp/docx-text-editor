import { Link } from "react-router-dom";
import { toggleDarkMode } from "../../redux/slice/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoFileTrayFullSharp, IoNotifications } from "react-icons/io5";


const Header = () => {
  const { user_data } = useSelector((store) => store.user)

  return (
    <header className="flex w-full items-center justify-between bg-neutral-300 z-20 dark:bg-black px-6 py-3 font-serif ">
      <div className="flex items-center gap-2">
        <Link to="/get-started" className="flex items-center gap-1 truncate uppercase text-lg font-semibold text-neutral-700 dark:text-gray-200">
          <IoFileTrayFullSharp size={25} /> <span className="bg-gradient-to-r from-black dark:from-white to-gray-500 dark:to-gray-500  bg-clip-text text-transparent">Documate</span> 
        </Link>
      </div>
      <div className="flex items-center justify-betwee gap-3 dark:text-white text-neutral-800">
        {/* <Link to="/" className="hidden md:block hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300" >Media</Link> */}
        <IoNotifications className="text-2xl hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300" />
       
        <Link to="/profile" className="flex group items-center gap-2 border border-white hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-400 p-1 rounded-full transition-all ease-in-out duration-300">
          <h3 className="pl-4 group-hover:text-orange-700 dark:group-hover:text-orange-300 cursor-pointer transition-all ease-in-out duration-300">Profile</h3>
          <img src={user_data?.picture || "https://ionicframework.com/docs/img/demos/avatar.svg"} alt="logo" className="h-8 w-8 rounded-full object-cover object-center" />
        </Link>
      </div>
    </header>
  );
};

export default Header;

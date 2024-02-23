import {
  Home,
  LightMode,
  ModeNight,
  Menu,
  ShoppingCart,
  ShoppingBag,
  Logout,
  Login,
} from "@mui/icons-material";
import { SwipeableDrawer } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Header.css";
import { googleAuthContext } from "../contexts/GoogleAuth";
export function Header() {
  const nav = useNavigate();
  const [user,signIn,signOut]=useContext(googleAuthContext)
  const [drawerOpen, setDrawerOpen] = useState();
  const [darkTheme, setDarkTheme] = useState();
  const [initialScroll, setinitialScroll] = useState(pageYOffset);
  const [showMobileBar, setShowMobileBar] = useState();
  useEffect(() => {
    const handleScroll = () => {
      const actualScroll = window.pageYOffset;
      const checkScroll = initialScroll > actualScroll;
      setinitialScroll(actualScroll);
      setShowMobileBar(checkScroll);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialScroll]);

  const changeTheme = () => {
    setDarkTheme(!darkTheme);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const navItems = [
    {
      title: "Home",
      nav: "/",
      icon: <Home />,
    },
    {
      title: "Products",
      nav: "/Products",
      icon: <ShoppingBag />,
    },
    {
      title: "Go to cart",
      nav: "/Cart",
      icon: <ShoppingCart />,
    },{
      title:`${user?'Logout':'Login'}`,
      icon:user?<Logout color="error"/>:<Login sx={{color:"#E3B23C"}}/>
    },
    {
      title: "Mode",
      icon: darkTheme ? <ModeNight /> : <LightMode />,
    }
  ];


  return (
    <>
      <header className="w-full h-12 bg-[--darker-dark-gray] max-md:hidden md:flex justify-between items-center sm:pl-20 sm:pr-20">
        <div className="max-sm:hidden sm:flex items-center gap-4">
          <img src="src/assets/react.svg" alt="" />
          <p className="text-[--golden-yellow] font-black font-mono text-2xl">FakeStore</p>
        </div>
        <ul className="max-sm:hidden flex gap-5 items-center text-[--white-bone] text-lg font-bold *:cursor-pointer *:transition-colors *:ease-in-out ">
          {navItems.map((item, index) => (
                <li
                  className="hover:text-[--pinky-gray]"
                  key={index}
                  onClick={() => {
                    if(index===3){
                      user?signOut():signIn()
                    }
                    index!==4?nav(item.nav):changeTheme()}}
                >
                  {index!==4?item.title:item.icon}
                </li>
              )
          )}
        </ul>
      </header>
      <header
        className={`${
          showMobileBar ? "bottom-0" : "bottom-[-10rem]"
        } bg-[--dark-gray] transition-all w-full h-12 flex items-center md:hidden max-md:fixed z-[1000] max-md:justify-center border-t-2 border-[--golden-yellow]`}
      >
            <div className=" w-full h-14">
              <ul className="w-full h-full flex bg-[--dark-gray] gap-10 justify-center items-center">
                {navItems.map((item, index) => {
                    return (
                      <li
                        className="hover:text-[--pinky-gray] text-[--white-bone] cursor-pointer"
                        key={index}
                        onClick={() =>{
                          if(index===3){
                            user?signOut():signIn()
                          }
                          index !== 4 ? nav(item.nav) : changeTheme()
                        }
                        }
                      >
                        {item.icon}
                      </li>
                    );
                  } 
                )}
              </ul>
            </div>
      </header>
    </>
  );
}

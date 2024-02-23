import {
  Home,
  Menu,
  ShoppingCart,
  ShoppingBag,
  Logout,
  Login,
  Close,
  Person,
} from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "./Header.css";
import { googleAuthContext } from "../contexts/GoogleAuth";
export function Header() {
  const nav = useNavigate();
  const location = useLocation();
  const [user, signIn, signOut] = useContext(googleAuthContext);
  const [initialScroll, setinitialScroll] = useState(pageYOffset);
  const [showMobileBar, setShowMobileBar] = useState(true);
  const [menuClicked, setMenuClicked] = useState(false);

  

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

  const navItems = [
    {
      title: "Home",
      nav: "/",
      icon: <Home />,
      active: location.pathname === "/" ? true : false,
    },
    {
      title: "Products",
      nav: "/Products",
      icon: <ShoppingBag />,
      active: location.pathname === "/Products" ? true : false,
    },
    {
      title: "Go to cart",
      nav: "/Cart",
      icon: <ShoppingCart />,
      active: location.pathname === "/Cart" ? true : false,
    },
    {
      title: `${user ? "Logout" : "Login"}`,
      icon: user ? (
        <Logout color="error" />
      ) : (
        <Login sx={{ color: "#E3B23C" }} />
      ),
      active: false,
    },
  ];

  return (
    <>
      <header className="w-full h-12 bg-[--darker-dark-gray] max-md:hidden md:flex justify-between items-center sm:px-7">
        <div className="max-sm:hidden sm:flex items-center gap-4">
          <img src="src/assets/react.svg" alt="" />
          <p className="text-[--golden-yellow] font-black font-mono text-2xl">
            FakeStore
          </p>
        </div>
        <aside
          className={`z-10 h-screen transition-[width] ${
            menuClicked ? "w-[10rem]" : "w-[2.5rem]"
          } bg-[var(--darker-dark-gray)] flex-col items-center sm:flex fixed right-0 top-0 p-2 justify-between py-10 text-[var(--pinky-gray)] border-l-2 border-[var(--golden-yellow)]`}
        >
          <div className="icon flex flex-col gap-4 items-center">
            {menuClicked ? (
              <Close
                sx={{
                  fontSize: "2em",
                  color: "var(--pinky-gray)",
                  cursor: "pointer",
                }}
                className="hover:text-[var(--white-bone)]"
                onClick={() => setMenuClicked(!menuClicked)}
              />
            ) : (
              <Menu
                sx={{
                  fontSize: "2em",
                  color: "var(--pinky-gray)",
                  cursor: "pointer",
                }}
                className="hover:text-[var(--white-bone)]"
                onClick={() => setMenuClicked(!menuClicked)}
              />
            )}
            <span className="flex flex-col items-center justify-center text-center gap-2">
              {user ? (
                <img src={user.photoURL} className="rounded-full" />
              ) : (
                <Person
                  sx={
                    menuClicked
                      ? { fontSize: "4em", background: "var(--white-bone)" }
                      : { background: "var(--white-bone)", fontSize: "2em" }
                  }
                  className="rounded-full"
                />
              )}
              {menuClicked && (
                <p className="font-semibold text-[--white-bone] border-[var(--golden-yellow)] border-b-2 px-2 ">
                  {user ? user.displayName : "No account logged"}
                </p>
              )}
            </span>
          </div>

          <ul
            className={`${
              !menuClicked && "w-full"
            } flex flex-col gap-2 *:cursor-pointer`}
          >
            {navItems.map((item, index) => {
              if (index < 3) {
                return (
                  <li
                    key={index}
                    onClick={() => nav(item.nav)}
                    className={`flex items-center gap-2 transition-all ${
                      item.active
                        ? "text-[var(--golden-yellow)]"
                        : "text-[var(--pinky-gray)]"
                    } ${item.active ? "" : "hover:text-[var(--white-bone)]"}`}
                  >
                    <p>{item.icon}</p>
                    <p
                      className={`transition-opacity ${
                        menuClicked ? "visible size-full" : "invisible size-0"
                      }`}
                    >
                      {item.title}
                    </p>
                  </li>
                );
              }
            })}
          </ul>
          <ul
            className={`${
              !menuClicked && "w-full"
            } flex flex-col gap-2 *:cursor-pointer`}
          >
            {navItems.map((item, index) => {
              if (index > 2) {
                return (
                  <li
                    key={index}
                    onClick={
                      (() => (user ? signOut() : (signIn()), nav(item.nav)))
                    }
                    className="hover:text-[var(--white-bone)] flex items-center gap-2"
                  >
                    <p>{item.icon}</p>
                    <p
                      className={`${
                        menuClicked ? "visible size-full" : "size-0 invisible"
                      }`}
                    >
                      {item.title}
                    </p>
                  </li>
                );
              }
            })}
          </ul>
        </aside>
      </header>
      <header
        className={`${
          showMobileBar ? "bottom-0" : "bottom-[-10rem]"
        } bg-[--dark-gray] transition-all w-full h-12 flex items-center md:hidden max-md:fixed z-[1000] max-md:justify-center *:border-t-4 *:border-[--golden-yellow]`}
      >
        <div className="flex items-center text-[var(--pinky-gray)] justify-between w-full h-14 px-10">
          <ul className="w-full h-full flex bg-[--dark-gray] gap-10 justify-center items-center">
            {navItems.map((item, index) => {
              if (index < 3) {
                return (
                  <li
                    key={index}
                    className={`${
                      item.active
                        ? "text-[var(--golden-yellow)]"
                        : "text-[var(--pinky-gray)]"
                    } cursor-pointer hover:text-[--white-bone]`}
                    onClick={() => nav(item.nav)}
                  >
                    {item.icon}
                  </li>
                );
              }
            })}
          </ul>
          <div className="flex items-center gap-2">
            {user ? (
              <img className="size-8 rounded-full" src={user.photoURL} />
            ) : (
              <Person
                sx={{ background: "var(--white-bone)", borderRadius: "50%" }}
              />
            )}
            {navItems.map((item, index) => {
              if (index === 3) {
                return (
                  <p className="cursor-pointer" onClick={() => (user ? signOut() : signIn())}>
                    {item.icon}
                  </p>
                );
              }
            })}
          </div>
        </div>
      </header>
    </>
  );
}

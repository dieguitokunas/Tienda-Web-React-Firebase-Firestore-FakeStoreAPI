import { useContext, useEffect, useState } from "react";
import { UserCartProductsContext } from "../contexts/UserCartProducts";
import { APIContext } from "../contexts/APICall";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Add, Remove } from "@mui/icons-material";
import "./Cart.css";
import Fade from "@mui/material/Fade";
import { Skeleton } from "@mui/material";
import { googleAuthContext } from "../contexts/GoogleAuth";
import { useNavigate } from "react-router";
import PaymentIcon from "react-payment-icons";
export function Cart() {
  const [userProducts, addToCart, removeFromCart, getProducts] = useContext(
    UserCartProductsContext
  );
  const APIProducts = useContext(APIContext);
  const [user, signIn] = useContext(googleAuthContext);
  const [loadPage, setLoadPage] = useState(true);
  const [cartProducts, setCartProducts] = useState(false);
  const nav = useNavigate();
  const checkProducts = async () => {
    try {
      await getProducts();
      if (!userProducts) {
        setTimeout(() => {
          setLoadPage(false);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userProducts && APIProducts && cartProducts) {
      setLoadPage(false);
    } else {
      checkProducts();
    }
  }, [cartProducts]);

  const fillCartProducts = async () => {
    if (
      (APIProducts && userProducts && APIProducts !== null) ||
      (undefined && userProducts !== null) ||
      undefined
    ) {
      try {
        const productsFinder = await Promise.all(
          userProducts.map((p) => {
            const Finded = APIProducts.find((a) => a.id === p.id);
            if (Finded) {
              return { ...p, ...Finded };
            } else {
              return null;
            }
          })
        );
        await new Promise((resolve) => {
          setCartProducts(productsFinder), resolve();
        });
        setLoadPage(false);
      } catch (error) {
        console.error("Error in the try catch of fillCartProducts", error);
      }
    }else{
      setCartProducts(false)
      setLoadPage(false)
    }
  };
  useEffect(() => {
    if(APIProducts){
      fillCartProducts();
    }
  }, [userProducts]);

  const handleRemoveFromCart = async (productId) => {
    try {
      const productToRemove = document.getElementById(
        `cartProductN${productId}`
      );
      productToRemove.style.opacity = 0.4;
      await removeFromCart(productId);
      await getProducts(true);
      productToRemove.style.opacity = 1;
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProductToCart = async (productId) => {
    try {
      const productToRemove = document.getElementById(
        `cartProductN${productId}`
      );
      productToRemove.style.opacity = 0.7;
      productToRemove.style.background = "var(--golden-yellow)";
      await addToCart(productId);
      await getProducts(true);
      productToRemove.style.opacity = 1;
      productToRemove.style.background = "var(--white-bone)";
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveOneFromCart = async (productId) => {
    try {
      const productToRemove = document.getElementById(
        `cartProductN${productId}`
      );
      productToRemove.style.opacity = 0.7;
      productToRemove.style.background = "var(--pinky-gray)";
      await removeFromCart(productId, true);
      productToRemove.style.opacity = 1;
      productToRemove.style.background = "var(--white-bone)";
    } catch {}
  };

  const renderProducts = () => {
    if (loadPage) {
      return Array(3)
        .fill()
        .map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            width={"100%"}
            height={200}
            sx={{ background: "var(--dark-gray)" }}
          />
        ));
    }
    if (!loadPage && user && !userProducts) {
      return (
        <>
          <p className="font-medium text-xl border-b-2 border-[var(--darker-dark-gray)] pl-4 pr-4">
            No items in your cart.
          </p>
          <button
            className="bg-[var(--golden-yellow)] text-[var(--darker-dark-gray)] p-4 rounded-sm border-[1px] border-[var(--darker-dark-gray)]"
            onClick={() => nav("/Products")}
          >
            Search products
          </button>
        </>
      );
    }
    if (!loadPage && !user) {
      return (
        <>
          <p className="font-medium text-xl border-b-2 border-[var(--darker-dark-gray)] pl-4 pr-4">
            Sign In to add products to your cart.
          </p>
          <button
            className="bg-[var(--golden-yellow)] text-[var(--darker-dark-gray)] p-4 rounded-sm border-[1px] border-[var(--darker-dark-gray)] w-1/4 min-w-[14rem]"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        </>
      );
    }

    if (!loadPage && cartProducts) {
      return cartProducts.map((p, index) => (
        <Fade key={index} in={true}>
          <article
            className="relative w-full max-sm:h-56 h-28 flex  text-black border-[1px] border-[var(--darker-dark-gray)] bg-[--white-bone]"
            id={`cartProductN${p.id}`}
          >
            <div className="product w-full h-full max-sm:justify-between flex max-sm:flex-col">
              <div className="img-cont relative sm:w-2/5 max-sm:flex-col flex max-sm:h-full h-full ">
                <div
                  className="w-full max-sm:h-28 sm:h-full sm:border-r-2 border-[--dark-gray]
         "
                >
                  <Remove
                    className="absolute"
                    sx={{
                      color: "var(--white-bone)",
                      background: "var(--dark-gray)",
                    }}
                    onClick={() => handleRemoveFromCart(p.id)}
                  />
                  <img
                    src={p.image}
                    alt=""
                    className="w-full bg-white h-full border-[--dark-gray] max-sm:border-b-2 object-contain object-center"
                  />
                </div>
                <span className=" product text-center title h-full w-full flex justify-center items-center  overflow-hidden">
                  <p className="w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {p.title}
                  </p>
                </span>
              </div>
              <div
                className="*:flex *:flex-col *:w-2/4 max-sm:w-full sm:w-3/5 flex  *:h-full *:justify-center *:items-center h-full
       "
              >
                <span className="">
                  <p className="sm:hidden">Quantity</p>
                  <div className="flex items-center gap-4">
                    <button
                      className=""
                      onClick={() => handleRemoveOneFromCart(p.id)}
                    >
                      <Remove
                        sx={{
                          color: "var(--white-bone)",
                          background: "var(--dark-gray)",
                        }}
                      />
                    </button>
                    <p className="">{parseInt(p.quantity)}</p>
                    <button
                      className=""
                      onClick={() => handleAddProductToCart(p.id)}
                    >
                      <Add
                        sx={{
                          color: "var(--golden-yellow)",
                          background: "var(--dark-gray)",
                        }}
                      />
                    </button>
                  </div>
                </span>
                <span className="">
                  <p className="sm:hidden">Price</p>
                  <p className="">${parseFloat(p.price).toFixed(2)}</p>
                </span>
                <span className="">
                  <p className="sm:hidden">Total</p>
                  <p className=" font-black">
                    ${parseFloat(p.price * p.quantity).toFixed(2)}
                  </p>
                </span>
              </div>
            </div>
          </article>
        </Fade>
      ));
      //  }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-[--pinky-gray] flex max-md:flex-col gap-2 pt-5">
        <section className="max-md:w-full md:w-3/4 bg-[--dark-gray] min-h-screen h-fit overflow-auto cart flex flex-col">
          <div className="headers bg-[var(--white-bone)] text-[var(--darker-dark-gray)] font-bold text-center w-full h-full max-sm:hidden sm:flex items-center">
            <p className="w-2/4 ">Products</p>
            <p className="w-1/4">Quantity</p>
            <p className="w-1/4">Price</p>
            <p className="w-1/4">Total</p>
          </div>

          <div
            className={`products-container w-full min-h-screen bg-[--white-bone] sm:gap-5 max-sm:gap-10 p-2 h-fit flex items-center flex-col ${
              !userProducts && "justify-center text-center "
            } text-pretty `}
          >
            {renderProducts()}
          </div>
        </section>
        <section
          className="max-md:w-full md:w-1/4 h-fit flex-col flex p-1 gap-2 bg-[--white-bone]
         *:w-full *:bg-[var(--darker-dark-gray)] *:rounded-md *:p-2 *:flex *:flex-col *:gap-4
        "
        >
          {loadPage ? (
            <>
              <Skeleton
                width={"100%"}
                height={"14rem"}
                variant="rounded"
                sx={{ background: "var(--dark-gray)" }}
              />
            </>
          ) : (
            <>
              <div className="h-fit">
                <span className="flex flex-col gap-4 *:text-[var(--white-bone)] *:border-[var(--golden-yellow)]">
                  <p className="w-full font-bold text-xl text-[--white-bone] border-b-2">
                    Information
                  </p>
                  <p className="w-full border-b-2">
                    {user ? user.displayName : "..."}
                  </p>
                  <p className="w-full break-words border-b-2">
                    {user ? user.email : "..."}
                  </p>
                </span>
                <button
                  className="bg-[var(--golden-yellow)] p-4 rounded-md border-[var(--dark-gray)] font-bold border-2 text-[var(--darker-dark-gray)]"
                  onClick={() => signIn()}
                >
                  {user ? "Change account" : "Sign In"}
                </button>
              </div>
              <div className="h-fit">
                <span className="flex flex-col justify-center gap-4 *:text-[var(--white-bone)] *:border-[var(--golden-yellow)]">
                  <p className="font-bold text-xl text-[var(--golden-yellow)] border-b-2">
                    Payment
                  </p>
                  <span className="*:font-black *:text-lg flex items-center justify-between gap-2">
                    <p className="">Total: </p>
                    <p className="text-[var(--golden-yellow)] border-b-2">
                      $
                      {cartProducts &&
                        cartProducts
                          .reduce((total, products) => {
                            return (
                              parseFloat(total) +
                              parseFloat(products.price * products.quantity)
                            );
                          }, 0)
                          .toFixed(2)}
                    </p>
                  </span>
                  <p className="font-semibold text-sm">
                    Chose a payment option
                  </p>
                  <ul className="payment-methods flex gap-2 justify-center items-center">
                    <li>
                      <PaymentIcon
                        id="visa"
                        style={{ width: 100 }}
                        className="payment-icon"
                      />
                    </li>
                    <li>
                      <PaymentIcon
                        id="mastercard"
                        style={{ width: 100 }}
                        className="payment-icon"
                      />
                    </li>
                    <li>
                      <PaymentIcon
                        id="paypal"
                        style={{ width: 100 }}
                        className="payment-icon"
                      />
                    </li>
                  </ul>
                  <div className="w-full flex flex-col gap-4 items-center justify-center">
                    <label
                      className="flex items-center gap-2 text-[var(--pinky-gray)]"
                      htmlFor=""
                    >
                      <input
                        type="checkbox"
                        className=" accent-[var(--golden-yellow)]"
                        name=""
                        id=""
                      />
                      <p>I've readed the terms and conditions.</p>
                    </label>
                    <button
                      className={`bg-[var(--golden-yellow)] rounded-sm p-2 w-1/2 text-[var(--darker-dark-gray)!important] ${
                        cartProducts ? "opacity-100" : "opacity-50"
                      }`}
                      disabled={cartProducts ? false : true}
                    >
                      Buy
                    </button>
                  </div>
                </span>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

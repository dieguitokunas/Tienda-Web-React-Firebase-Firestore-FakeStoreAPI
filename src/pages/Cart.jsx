import { useContext, useEffect, useLayoutEffect, useState } from "react";
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

export function Cart() {
  const [userProducts, , removeFromCart, getProducts] = useContext(
    UserCartProductsContext
  );
  const APIProducts = useContext(APIContext);
  const [user, signIn] = useContext(googleAuthContext);
  const [loadPage, setLoadPage] = useState(true);
  const [cartProducts, setCartProducts] = useState(false);
  const [buttonClicked,setButtonClicked]=useState(false)
  const nav=useNavigate()
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
    try {
      const productsFinder = await Promise.all(
        userProducts.map((p) => {
          const Finded = APIProducts.find((a) => a.id === p.id);
          return Finded.length === 0 ? null : { ...p, ...Finded };
        })
      );
      await new Promise((resolve) => {
        setCartProducts(productsFinder), resolve();
      });
      setLoadPage(false);
    } catch (error) {
      console.error("Error in the try catch of fillCartProducts", error);
    }
  };
  useEffect(() => {
    if (APIProducts && userProducts) {
      fillCartProducts();
    }
  }, [APIProducts, userProducts]);


  useEffect(()=>{
    if(!userProducts){
      setCartProducts(userProducts)
    }
  },[buttonClicked])

  const handleRemoveFromCart = async (productId) => {
    try {
      const productToRemove = document.getElementById(`cartProductN${productId}`);
      productToRemove.style.opacity=.4
      await removeFromCart(productId);
      await getProducts(true)
      productToRemove.style.opacity=1
    } catch (error) {
      console.error(error);
    }
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
          <button className="bg-[var(--golden-yellow)] text-[var(--darker-dark-gray)] p-4 rounded-sm border-[1px] border-[var(--darker-dark-gray)]" onClick={()=>nav("/Products")}>
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
      console.log(cartProducts)
      return cartProducts.map((p, index) => (
        <Fade key={index} in={true}>
          <article
            className="relative w-full max-sm:h-56 h-28 flex *:border-[--dark-gray] text-black *:border-r-[1px] border-2 border-[--dark-gray] bg-[--white-bone]"
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
                      color: "var(--golden-yellow)",
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
                    <button className="">
                      <Remove />
                    </button>
                    <p className="">{parseInt(p.quantity)}</p>
                    <button className="">
                      <Add />
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
      <main className="min-h-screen w-full bg-[--pinky-gray] flex max-md:flex-col gap-2 pt-10 *:border-[--dark-gray] *:border-2">
        <section className="max-md:w-full md:w-3/4 p-1 bg-[--dark-gray] min-h-screen h-fit overflow-auto cart flex flex-col">
          <div
            className={`products-container w-full min-h-screen bg-[--white-bone] gap-4 p-2 h-fit flex items-center flex-col ${
              !userProducts && "justify-center text-center "
            } text-pretty `}
          >
            {renderProducts()}
          </div>
        </section>
        <section className="max-md:w-full md:w-1/4 min-h-screen flex-col flex p-1 gap-2 bg-[--white-bone]">
          {loadPage && (
            <>
              <Skeleton
                width={"100%"}
                height={"100%"}
                variant="rectangular"
                sx={{ background: "var(--dark-gray)" }}
              />
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

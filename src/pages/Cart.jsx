import { useContext, useEffect, useState } from "react";
import { UserCartProductsContext } from "../contexts/UserCartProducts";
import { APIContext } from "../contexts/APICall";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Add, Remove, Clear } from "@mui/icons-material";
import "./Cart.css";
import Fade from "@mui/material/Fade";
import { Skeleton } from "@mui/material";
export function Cart() {
  //Call the 'userProducts' state of the UserCartProducts Component
  const [getUserProducts, addTocart, removeFromCart] = useContext(
    UserCartProductsContext
  );
  //Asign the values to a variable so it can be maped or iterated
  const userProducts = getUserProducts;
  //Call the products data of the API
  const APIProducts = useContext(APIContext);
  const [mixedProducts, setMixedProducts] = useState(null);

  useEffect(() => {
    const mixProducts = async () => {
      if (userProducts&& APIProducts&&userProducts.length !== 0 && APIProducts.length !== 0) {
        const combinedProducts = userProducts.map((APIProduct) => {
          const userProduct = APIProducts.find(
            (userProduct) => userProduct.id === APIProduct.id
          );
          if (userProduct) {
            return { ...APIProduct, ...userProduct };
          }
        });
        setMixedProducts(combinedProducts);
      }
    };

    mixProducts();
  }, [getUserProducts]);

  const handleRemoveFromCart = async (productID, index) => {
    try {
      const cartProduct = document.getElementById(`cartProductN${index}`);
      cartProduct.innerHTML =cartProduct.innerHTML+'<div class="absolute w-full h-full bg-[--darker-dark-gray] opacity-10"></div>' 
      await removeFromCart(productID);
      cartProduct.remove()
    } catch (error) {
      console.error(error);
    }
  };

  const productsList =
    mixedProducts && mixedProducts.length !== 0
      ? mixedProducts.map((p, index) => (
          <Fade key={index} in={true}>
            <article className="relative w-full max-sm:h-56 h-28 flex *:border-[--dark-gray] text-black *:border-r-[1px] border-2 border-[--dark-gray] bg-[--white-bone]" id={`cartProductN${index}`}>
              <div
                className="product w-full h-full max-sm:justify-between flex max-sm:flex-col"
                
              >
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
                      onClick={() => handleRemoveFromCart(p.id, index)}
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
        ))
      : Array(10)
          .fill()
          .map((p,index) => (
            <Skeleton
            key={index}
              variant="rectangular"
              width={"100%"}
              height={"10rem"}
              animation="wave"
            ></Skeleton>
          ));

  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-[--pinky-gray] flex max-md:flex-col gap-2 pt-10 *:border-[--dark-gray] *:border-2">
        <section className="max-md:w-full md:w-3/4 p-1 bg-white min-h-screen h-fit overflow-auto cart flex flex-col">
          <div className="max-md:hidden md:flex md:items-center text-center header w-full h-10 border-b-2 border-[--dark-gray]">
            <p className="md:w-2/4">Products</p>
            <p className="md:w-1/4">Quantity</p>
            <p className="md:w-1/4">Price</p>
            <p className="md:w-1/4">Total</p>
          </div>
          <div className="products-container w-full h-full flex flex-col gap-2">
            {productsList}
          </div>
        </section>
        <section className="max-md:w-full md:w-1/4 min-h-screen flex-col flex p-1 gap-2 bg-[--white-bone]"></section>
      </main>
      <Footer />
    </>
  );
}

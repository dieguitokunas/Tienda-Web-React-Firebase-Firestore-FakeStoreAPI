import { useContext,useState,useEffect } from "react";
import { APIContext } from "../contexts/APICall";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Favorite } from "@mui/icons-material";
import { Fade,Skeleton,Accordion,AccordionSummary,AccordionDetails } from "@mui/material";
import { Header } from "../components/Header";

export function Products(){
    const data = useContext(APIContext);
    const [loaded, setLoaded] = useState(false);
    const categories = [
        {
          category: "Men's Clothing",
          value: "Men's Clothing",
          text: "Clothing for men",
        },
        {
          category: "Women's Clothing",
          value: "Women's Clothing",
          text: "Clothing for women",
        },
        {
          category: "Jewelry",
          value: "Jewelry",
          text: "Jewelry accesories",
        },
        {
          category: "Electronics",
          value: "Electronics",
        },
      ];

    const sectionProducts =
    loaded && data.length > 0
      ? data.map((product, index) => (
          <Fade in={true} enter={true} key={index}>
            <article className="flex-col justify-center flex  max-sm:w-4/5 sm:w-full h-full bg-[--white-bone] border border-[--dark-gray] rounded-sm cursor-pointer">
              <div className="image-container relative w-full h-28 rounded-[inherit]">
                <img
                  src={product.image}
                  alt={product.description}
                  className="object-contain border-none w-full h-full bg-white object-center  rounded-[inherit]"
                />
                <Favorite className="absolute top-0 right-0 text-[--dark-gray]" />
              </div>
              <div className="article-content bg-[--white-bone] h-28 justify-center gap-4 p-4 border-[--dark-gray] border-t-2 flex flex-col">
                <div className="article-header flex justify-between items-center ">
                  <span className="w-2/3 h-14 flex flex-col gap-2 overflow-hidden text-ellipsis">
                    <p className="max-h-8 overflow-hidden text-ellipsis font-semibold">
                      {product.title}
                    </p>
                    <p className=" font-normal">{product.category}</p>
                  </span>
                  <span className=" font-bold">
                    <p>${product.price}</p>
                  </span>
                </div>
                <div className="article-buttons flex items-center justify-center gap-5">
                  <button
                    className="w-[8rem] h-8 bg-[--dark-gray]  text-[--white-bone] rounded-sm"
                    onClick={() => signOut()}
                  >
                    Add to cart
                  </button>
                  <button
                    className="w-[8rem] h-8 bg-[--golden-yellow] rounded-sm"
                    onClick={() => !user && signin()}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </article>
          </Fade>
        ))
      : Array(10)
          .fill()
          .map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={"100%"}
              height={"14rem"}
              animation="wave"
            />
          ));

  useEffect(() => {
    if (data) {
      setLoaded(true);
    }
  }, []);

  return(
    <>
    <main className="bg-[--pinky-rose] flex flex-col">
    <Header/>
    <section className="min-h-screen w-full flex max-sm:flex-col max-sm:items-center justify-center gap-5 bg-[--pinky-gray] pt-10">
    <div className="filtros md:w-1/4 max-sm:w-3/4 bg-[--white-bone] flex flex-col gap-6 items-center">
      <div className="options w-full">
        <Accordion expanded={undefined}>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            Categories
          </AccordionSummary>
          <AccordionDetails>
            <ul className="*:border-b-2 border-[--dark-gray] flex flex-col gap-4 *:cursor-pointer">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="w-full flex justify-between items-center"
                  onClick={() => handleCategoriesClick(category.value)}
                  >
                  {category.category}
                  <input
                    type="radio"
                    name="category"
                    id={category.value}
                    className=" appearance-none w-4 h-4 rounded-[50%] bg-[--dark-gray] checked:bg-[--golden-yellow] border-[--pinky-gray] checked:border-[--dark-gray] border-2"
                    />
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      </div>
      <button className="max-sm:w-full sm:w-[10rem] h-10 bg-[--golden-yellow]">
        {" "}
        Filter
      </button>
    </div>
    <div className="pb-10 max-md:w-full md:w-3/4 bg-[--pinky-gray] grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pr-2 pl-2 place-items-center ">
      {sectionProducts}
    </div>
  </section>
  </main>
              </>
  )
}
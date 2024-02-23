import { useContext, useState, useEffect } from "react"
import { APIContext } from "../contexts/APICall"
import { googleAuthContext } from "../contexts/GoogleAuth"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { Favorite } from "@mui/icons-material"
import {
  Fade,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { UserCartProductsContext } from "../contexts/UserCartProducts"
export function Products() {
  //Here we call the response.json that has been saved in the APICall component, and exported within the APIContext Provider.
  const data = useContext(APIContext)
  //We call 3 parameter's here: 1- The user data (The one provided by the Google authentication in the GoogleAuth component), 2- The GoogleSignIn function (called as signin ), wich let's the user signin just with one click whenever the function its called.
  const [user, signin] = useContext(googleAuthContext)
  //Here we call two parameters, the firts its 'called' but never asigned to an alias, it's for acceding to the value with index 1 [the second parameter given in the UserCartProductsContext in the UserCartProducts component]. If we needed, i.e, call only the GoogleSignOut functions above, we need to do it like this [,,signOut]. The 'addTocart' alias call the addProductsToCart function of the UserCartProducts Component.
  const [, addToCart] = useContext(UserCartProductsContext)
  //This is just to control if the articles are renderized as the real 'data' or as a skeleton to represent a charge.
  const [loaded, setLoaded] = useState(false)
  const [inputData,setInputData]=useState('')
  const [optionData,setOptionData]=useState(undefined)
  const [categoryData,setCategoryData]=useState(undefined)
  const categories = [
    {
      category: "Men's Clothing",
      value: "men's clothing",
      text: "Clothing for men",
    },
    {
      category: "Women's Clothing",
      value: "women's clothing",
      text: "Clothing for women",
    },
    {
      category: "Jewelry",
      value: "jewelery",
      text: "Jewelry accesories",
    },
    {
      category: "Electronics",
      value: "electronics",
    },{
      category: "Clear Filters",
      value: "clear"
    }
  ]
  const handleButtonClicked = async (productId, index) => {
    try {
      const btn = document.getElementById(`addToCart-btn-${index}`)
      btn.disabled = true 
      btn.textContent = "Adding..."
      await addToCart(productId)
      btn.disabled = false 
      btn.textContent = "Add to cart"
    } catch (error) {
      console.error(error)
      btn.disabled = false 
    }
  }
  const productsFilter=(filter,condition)=>{
    return (product=>product[filter]===condition)
  }
  const sectionProducts =
    loaded && data.length > 0
      ? data.filter(productsFilter(categoryData,optionData)
      ).filter(product=> {
        return Object.values(product).some(value => {
            if (typeof value === 'string') {
                return value.toLowerCase().includes((inputData.toLowerCase()));
            }
            return false;
        })}).map((product,index) => (
          <Fade in={true} enter={true} key={index}>
            <article className="flex-col justify-center flex  max-sm:w-4/5 sm:w-full h-fit bg-[--white-bone] border border-[--dark-gray] rounded-sm cursor-pointer">
              <div className="image-container relative w-full h-28 rounded-[inherit]">
                <img
                  src={product.image}
                  alt={product.description}
                  className="object-contain border-none w-full h-full bg-white object-center  rounded-[inherit]"
                />
                <Favorite className="absolute top-0 right-0 text-[--dark-gray] " />
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
                    id={`addToCart-btn-${index}`}
                    onClick={() => {
                      !user && signin(),
                        user && handleButtonClicked(product.id, index)
                    }}
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
          ))

  useEffect(() => {
    if (data) {
      setLoaded(true)
    }
  }, [data])

  const handleCategoriesClick=(value)=>{
    const input=document.getElementById(value)
    input.click()
  }
  const clearFilters = () => {
    setInputData('');
    setOptionData(undefined);
    setCategoryData(undefined);
     const inputs = document.querySelectorAll("input[name='category']");
     inputs.forEach(input => {
       input.checked = false;
     });
  };


  const handleFilters=()=>{
    const option = document.querySelector("input[name='category']:checked");
    const selectedCategory = option ? option.value : "";

    const input = document.getElementById("inputData");
    const inputVal = input ? input.value : "";
    setInputData(inputVal);

    if (selectedCategory === "clear") {
      clearFilters()
    } else if (selectedCategory) {
      setOptionData(selectedCategory);
      setCategoryData('category');
    }
  }

  return (
    <>
      <main className="bg-[--pinky-gray] flex flex-col sm:*:pr-12">
        <Header />
        <section className="min-h-screen w-full flex max-sm:flex-col max-sm:items-center justify-center gap-5 bg-[--pinky-gray] pt-10">
          <div className="filtros md:w-1/4 max-sm:w-3/4 bg-[--white-bone] flex flex-col gap-6 items-center">
            <div className="options w-full">
              <TextField
                variant="filled"
                color="inherit"
                className="w-full border-[--dark-gray!important]"
                placeholder="Type here..."
                id="inputData"
                onKeyDown={(event)=>{if(event.keyCode===13){handleFilters()}}}
              />
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
                          value={category.value}
                          className=" appearance-none w-4 h-4 rounded-[50%] bg-[--dark-gray] checked:bg-[--golden-yellow] border-[--pinky-gray] checked:border-[--dark-gray] border-2"
                        />
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </div>
            <button className="max-sm:w-full sm:w-[10rem] h-10 bg-[--golden-yellow]" onClick={()=>handleFilters()}>
              Search
            </button>
          </div>
          <div className="max-md:w-full h-fit md:w-3/4 bg-[--pinky-gray] grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-sm:place-items-center ">
            {sectionProducts}
          </div>
        </section>
      <Footer />
      </main>
    </>
  )
}

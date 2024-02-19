import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APICall";
import { Fade, Skeleton } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Slider from "@mui/material/Slider";
import { googleAuthContext } from "../contexts/GoogleAuth";
import { Favorite } from "@mui/icons-material";
import "../index.css";

export function Index() {
  const inputMarks = [
    {
      value: 0,
    },
  ];
  const data = useContext(APIContext)
  const [user, signin,signOut] = useContext(googleAuthContext);
  const [loaded, setLoaded] = useState(false);
  const sectionProducts = 
  loaded&&data.length>0 ? (
    data.map((product, index) => (
      <Fade in={true} enter={true} key={index}>
        <article className="flex-col justify-center flex w-full h-full bg-[--white-bone] border border-[--dark-gray] rounded-sm cursor-pointer">
          <div className="image-container relative w-full h-28 rounded-[inherit]">
            <img
              src={product.image}
              alt={product.description}
              className="object-contain border-none w-full h-full bg-white object-center  rounded-[inherit]"
            />
            <Favorite className="absolute top-0 right-0 text-white"/>
          </div>
          <div className="article-content bg-[--white-bone] h-28 justify-center gap-4 p-4 border-[--dark-gray] border-t-2 flex flex-col">
            <div className="article-header flex justify-between items-center ">
              <span className="w-2/3 h-6 overflow-hidden text-ellipsis">
                <p>{product.title}</p>
              </span>
              <span className=" font-bold">
                <p>${product.price}</p>
              </span>
            </div>
            <div className="article-buttons flex items-center justify-center gap-5">
              <button className="w-[8rem] h-8 bg-[--dark-gray]  text-[--white-bone] rounded-sm" onClick={()=>!user&&signin()}>
                Add to cart
              </button>
              <button
                className="w-[8rem] h-8 bg-[--golden-yellow] rounded-sm"
                onClick={() => (!user&&signin())}
              >
                Buy
              </button>
            </div>
          </div>
        </article>
      </Fade>
    ))
  ) : (
    Array(10).fill().map((_, index) => (
      <Skeleton key={index} variant="rectangular" width={'100%'} height={'14rem'} animation="wave"/>
    ))
  );

  
useEffect(()=>{
  if(data){
    setLoaded(true)
  }
},[])
  
  return (
    <>
      <div className="h-96 pt-10 pb-10 flex flex-col items-center text-white  category-section ">
        <p>Nuestros productos</p>
        <section className=" w-full min-w-fit h-96 flex max-md:flex-col gap-5 items-center p-10 *:rounded-md rounded-md">
          <div className="w-1/3 h-48 bg-[--golden-yellow]"></div>
          <div className="w-1/3 h-48 bg-[--golden-yellow]"></div>
          <div className="w-1/3 h-48 bg-[--golden-yellow]"></div>
        </section>
      </div>
      <section className="min-h-screen w-full flex max-md:flex-col md:gap-10 bg-[--pinky-gray] pt-10">
        <div className="filtros md:w-1/4 max-md:w-full bg-[--white-bone] flex flex-col gap-6 items-center">
          <div className="options w-full">
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                Categorys
              </AccordionSummary>
              <AccordionDetails>
                <ul className="*:border-b-2 border-[--dark-gray] flex flex-col gap-4 *:cursor-pointer">
                  <li>Electronics</li>
                  <li>Men clothes</li>
                  <li>Women clothes</li>
                  <li>Jewelry</li>
                </ul>
              </AccordionDetails>
            </Accordion>
            <div className="text-[#000000de] p-[16px] w-full flex flex-col justify-center bg-white border-b-[1px] border-[--dark-gray]">
              <p>Search for prices</p>
              <span className="pr-10 pl-10">
              <Slider defaultValue={50} valueLabelDisplay="auto" min={0} max={10000} step={100} />
              </span>
            </div>
          </div>
          <button className="w-[10rem] h-10 bg-[--golden-yellow]">
            {" "}
            Filter
          </button>
        </div>
        <div className="pb-10 max-md:w-full md:w-3/4 bg-[--pinky-gray] grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 pr-2 pl-2 ">
          {sectionProducts}
        </div>
      </section>
    </>
  );
}

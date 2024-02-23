import React from "react";
import {  FlightTakeoff, Hearing } from "@mui/icons-material";
import "../index.css";
import { Header } from "../components/Header";
import PaymentIcon from 'react-payment-icons'
import { Footer } from "../components/Footer";
import Fade from "@mui/material/Fade";
export function Index() {

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


  const layoutData=[{
    title:"We work overseas!",
    text:"Don't worry about not receiving our products.",
    icon:<FlightTakeoff/>
  },{
    title:"Our payment methods",
    text:"We accept a variety of payment methods.",
    icon:[ <PaymentIcon id="paypal"/> ,<PaymentIcon id="visa"/> ,<PaymentIcon id="mastercard"/> ]
  },{
    title:"Need assistance?",
    text:"Our friendly customer support team is here to help! Contact us with any questions or concerns.",
    email:"diegoborras82@gmail.com",
    icon:<Hearing/>
  }]

  

  return (
    <>
      
      <Header />
      <main className="h-fit flex flex-col items-center category-section sm:*:pr-12 ">
        <p className="text-6xl font-black font-serif text-[--white-bone]">
          We sell
        </p>
        <span className="*:font-serif font-bold text-5xl text-[--golden-yellow]">
                  <p>The best</p>
                </span>
    <Fade in={true}>
        <section className=" w-full min-w-fit h-[96] max-h-fit grid grid-cols-3 max-md:grid-cols-1 gap-5 place-items-center p-10 *:rounded-md rounded-md text-[--dark-gray]">
          {categories.map((category, index) => {
            if (index !== 3){
              return(

                <div
                className="max-md:w-3/4 w-full min-h-20 text-center   h-fit p-2 bg-[--golden-yellow]  flex flex-col gap-2 items-center justify-center"
                key={index}
                >
              
                <span className="*:font-sans font-semibold text-lg">
                  <p>{category.text}</p>
                </span>
              </div>
                )
              }
          })}
          {layoutData.map((data,index)=>(
             <div
             className="min-w-fit w-full min-h-60 h-fit p-2 bg-[--dark-gray] text-[--white-bone] text-center flex flex-col gap-2 items-center justify-center "
             key={index}
             >
             <span className="*:font-serif font-bold text-3xl *:text-pretty text-[--golden-yellow]">
               <p>{data.title}</p>
             </span>
             <span className="*:text-pretty">
              <p>{data.text}</p>
             </span>
             <span>
              <p className="text-[--golden-yellow] *:text-pretty font-bold">
              {data.email}
              </p>
             </span>
             <span className="flex items-center justify-center ">
               <p className="flex justify-center  *:w-[100%!important] h-10 *:h-[100%!important] gap-2">{data.icon}</p>
             </span>
           </div>
          ))}
        </section>
    </Fade>
    <Footer/>
      </main>

    </>
  );
}

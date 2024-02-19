import { Home, LightMode,ModeNight, Menu, ShoppingCart } from "@mui/icons-material"
import { SwipeableDrawer } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import './Header.css'
export function Header(){
    const nav=useNavigate()
    const [drawerOpen,setDrawerOpen]=useState()
    const [darkTheme,setDarkTheme]=useState()
    const [initialScroll,setinitialScroll]=useState(pageYOffset)
    const [showMobileBar,setShowMobileBar]=useState()
    useEffect(()=>{
        const handleScroll=()=>{

            const actualScroll=window.pageYOffset
            const checkScroll=initialScroll>actualScroll
            setinitialScroll(actualScroll)
            setShowMobileBar(checkScroll)
        }
        window.addEventListener("scroll",handleScroll)

        return()=>window.removeEventListener("scroll",handleScroll)
        },[initialScroll])

    const changeTheme=()=>{
        setDarkTheme(!darkTheme)
    }
    const handleDrawerClose=()=>{
        setDrawerOpen(false)
    }
    const handleDrawerOpen=()=>{
        setDrawerOpen(true)
    }
    const navItems=[{
        title:"Home",
        nav:"/",
        icon:<Home/>
    },{
        title:"Go to cart",
        nav:"/Cart",
        icon:<ShoppingCart/>
    },{
        title:"Mode",
        icon:darkTheme?<ModeNight/>:<LightMode/>
    }

]
    return(
        <>
        <header className="w-full h-16 bg-[--dark-gray] flex justify-between items-center sm:pl-20 sm:pr-20">
            <div className="max-sm:hidden">
                <img src="src/assets/react.svg" alt="" />
            </div>
            <ul className="max-sm:hidden flex gap-5 items-center text-[--white-bone] text-lg font-bold *:cursor-pointer *:transition-colors *:ease-in-out ">
               {navItems.map((item,index)=>(
                   <li className="hover:text-[--pinky-gray]" key={index} onClick={()=>nav(item.nav)}>{item.title}</li>
               ))}
            </ul>
        </header>
        <header className={`${showMobileBar?'bottom-0':'bottom-[-10rem]'} bg-[--dark-gray] transition-all w-full h-12 flex items-center  max-sm:fixed z-[1000] max-sm:justify-center`}>
            <ul className='sm:hidden'>
            <Menu 
            onClick={()=>setDrawerOpen(true)}
            className="cursor-pointer text-[--white-bone] w-[3rem!important] h-[6rem!important] *:sm:hidden"/>
            <SwipeableDrawer
            open={drawerOpen}
            onOpen={()=>handleDrawerOpen()}
            onClose={()=>handleDrawerClose()}
            anchor="bottom"
            color="black"
            >
                <div className=" w-full h-14">
                    <ul className="w-full h-full flex bg-[--dark-gray] gap-10 justify-center items-center">
                    {navItems.map((item,index)=>(
                        <li className="hover:text-[--pinky-gray] text-[--white-bone]" key={index} onClick={()=>index!==2?nav(item.nav):changeTheme()}>{item.icon}</li>
                        ))}
                    </ul>
                </div>
            </SwipeableDrawer>
                        </ul>

        </header>
        </>
    )
}
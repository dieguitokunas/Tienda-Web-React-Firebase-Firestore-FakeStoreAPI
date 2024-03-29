import {
  AttachEmail,
  LinkedIn,
  PhoneAndroid,
} from "@mui/icons-material";
import "./Footer.css";
export function Footer() {
  return (
    <footer className="footer w-full min-h-96 grid max-sm:grid-cols-1 max-md:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 max-md:gap-20 md:gap-10 p-4 place-items-center pt-20 sm:pr-12">
      <span className="text-[--white-bone] border-[--golden-yellow] w-full h-48 border-r-2 border-b-2 p-2">
        <div className="">
          <p className="font-black text-xl border-b-2">About me</p>
          <span className="flex flex-col gap-4 ">
            <p>Hello! I'm Diego Borrás, a young Web Developer.</p>
            <p>
              If you are interesed in knowing more about my work, you can visit my
              github by{" "}
              <strong className="text-[--golden-yellow] cursor-pointer">
                 <a onClick={()=>window.open("https://github.com/dieguitokunas")}>clicking here</a>
              </strong>
            </p>
          </span>
        </div>
      </span>
      <span className="border-[--golden-yellow] w-full h-48 border-l-2 border-t-2 p-2 flex flex-col">
        <ul className="text-[--white-bone]">
          <p className="font-black text-xl border-b-2 border-[--white-bone]">
            Write me here
          </p>
          <span className="w-full border-[--golden-yellow] border-b-2 border-r-2 flex items-center gap-2 p-2 h-20 cursor-pointer" onClick={()=>window.open("https://mail.google.com/mail/u/0/#inbox?compose=CllgCJTGnQJldtGdcNTtZVFBMGCCzwdqSdXVklDQpSMjbvsVFbbhZgppGnxwnqfqtRGRhPdBHjV")}>
            <AttachEmail className="w-[3rem!important] h-[4rem!important]" />
            <p className="text-sm">diegoborras82@gmail.com</p>
          </span>
        </ul>
      </span>
      <span className="border-[--golden-yellow] w-full h-48 border-r-2 border-b-2 p-2">
        <div className="text-[--white-bone] ">
          <p className="font-black text-xl border-b-2">Contact info</p>
          <ul className="flex flex-col gap-4 border-l-2 border-[--golden-yellow] p-2">
            <li className="flex gap-2">
              <PhoneAndroid />
              +54-9-11-35049242
            </li>
            <li className="flex gap-2">
              <LinkedIn />
              <a onClick={()=>window.open("https://www.linkedin.com/in/diego-borr%C3%A1s-b623352a4/")} className="cursor-pointer">
                Diego Borrás on Linkedin
                </a>
            </li>
          </ul>
        </div>
      </span>
    </footer>
  );
}

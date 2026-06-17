import { useState } from "react";
import email from '@/assets/email.png';
import lock from '@/assets/lock.png';

function LoginComponent() {
      const [active, setActive] = useState(true);
    return (
        <>
         <div className="flex flex-col mt-10 w-full text-sm">
                <div className={`flex text-xs w-full justify-center bg-[#F0F3FF] font-semibold p-1.5 rounded-full`}>
                    <button className={`w-1/2 ${active ? "bg-[#6063EE]" : ""} rounded-full py-2 ${active ? "text-white" : "text-black" }`}>Sign In</button>
                    <button className={`w-1/2 ${active ?  "" : "bg-[#6063EE]"} rounded-full py-2 ${active ? "text-black" : "text-white" }`}>Sign Up</button>
                </div>

                <div className="mt-5 flex flex-col text-xs">
                    <p>Email Address</p>
                    <div className="flex shadow-md p-5 rounded-xl">
                        <img src={email} alt="email icon" />
                        <input type="text" placeholder="hello@example.com" className="ml-3" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginComponent;
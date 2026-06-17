import { useState } from "react";

function SignUpComponent() {
      const [active, setActive] = useState(true);
    return (
        <>
         <div className="flex flex-col mt-10 w-full">
                <div className={`flex text-sm w-full justify-center bg-[#F0F3FF] font-semibold p-1.5 rounded-full border`}>
                    <button className={`w-1/2 ${active ? "bg-[#6063EE]" : ""} rounded-full py-2 ${active ? "text-white" : "text-black" }`}>Sign In</button>
                    <button className={`w-1/2 ${active ?  "" : "bg-[#6063EE]"} rounded-full py-2 ${active ? "text-black" : "text-white" }`}>Sign Up</button>
                </div>
            </div>
        </>
    )
}

export default SignUpComponent;
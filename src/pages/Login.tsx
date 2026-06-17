import { useState } from "react";
import LoginComponent from "@/components/LoginComponent";
import SignUpComponent from "@/components/SignUpComponent";
import WelcomeHeroSection from '@/assets/WelcomeHeroSection.png';
import BoredomBusterLogo from '@/assets/BoredomBusterLogo.png';

function Login() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [active, setActive] = useState(true);
    return (
        <>
        <div className="mx-5">
            <div className="flex mt-4 w-9/12">
                <img src={BoredomBusterLogo} alt="Boredom buster logo" className="" />
            </div>

            <div className="flex flex-col relative mt-10">
                <img src={WelcomeHeroSection} alt="Welcome hero section" className="rounded-2xl z-0 drop-shadow-xl"/>
                <p className="text-sm -mt-20 z-20 text-white/90 ml-5 shadow-xl">Welcome back.</p>
                <span className="text-sm z-20 text-white/90 ml-5 shadow-xl">Your next adventure is just a tap <p>away.</p></span>

            </div >
            <LoginComponent></LoginComponent>
        </div>
        </>
    )
}

export default Login;
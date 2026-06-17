import { useState } from "react";
import FloatingLoginBanner from "../components/FloatingLoginBanner";

function Login() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    return (
        <>
        <div className="flex">
            {/* banner section */}
            <div className="border-1">
                <h3>Boredom Buster</h3>
                <h2>Turn your idle time into achievement.</h2>
                <p>Join over 12,000 explorers gamifying their daily productivity and finding excitement in every small task.</p>
                
                <FloatingLoginBanner />
            </div>
            {/* login section */}
            <div>
                <h3>Welcome Back</h3>
                <p>Log in to resume your progress.</p>
                <p>username</p>
                <input type="text" placeholder="BoredomBuster" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <p>Email Address</p>
                <input type="text" placeholder="explorer@boredombuster.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <p>Password</p>
                <input type="password"  placeholder="****" value={password} hidden onChange={(e) => setPassword(e.target.value)}/>
                <div className="flex">
                    <div>Check Icon</div>
                    <p>Keep me signed in</p>
                </div>
                <button>Sign In =3</button>
                <div className="flex">
                <div className="border-1"></div>
                <p>Or Continue with</p>
                <div className="border-1"></div>
                </div>
                    <button>Google</button>
                    <button>Discord</button>
                <div className="flex">
                <p>New to the journey?<button>Sign Up</button></p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login;
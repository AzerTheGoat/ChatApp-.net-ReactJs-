import {useState} from "react";
import SignIn from "./SignIn";
import MailConfirmationPopup from "./MailConfirmationPopup";
import LoadingPopUp from "./LoadingPopUp";

const Login = ({ login, erreur }) => {
    const [user, setUser] = useState("");
    const [pwd, setpwd] = useState("");
    const [registerButton, setRegisterButton] = useState(false);

    return (
        <>
            <section className="h-screen bg-color4 flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
                <div className="md:w-1/3 max-w-sm">
                    <img
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        alt="Sample image" />
                </div>
                <div>
                    <div className="text-center mb-6">
                        <h1>
                            <strong>Sign in</strong>
                        </h1>
                    </div>
                    <form onSubmit={e => {
                        e.preventDefault();
                        login(user, pwd)
                    }}>
                        <input className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" type="text" placeholder="Email Address" onChange={e => setUser(e.target.value)}/>
                        <input className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" type="password" placeholder="Password"  onChange={e => setpwd(e.target.value)} />
                        <div className="mt-4 flex justify-between font-semibold text-sm">
                            <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
                                <input className="mr-1" type="checkbox" />
                                <span>Remember Me</span>
                            </label>
                            <a className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4" href="#">Forgot Password?</a>
                        </div>
                        <div className="text-center md:text-left">
                            <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider" type="submit">Login</button>
                        </div>
                    </form>
                    {erreur &&
                        <p className="text-red-500 text-xs mt-2">Le username ou le password sont incorrect</p>
                    }
                    <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
                        Don't have an account? <a className="text-red-600 hover:underline hover:underline-offset-4" onClick={() => setRegisterButton(!registerButton)}>Register</a>
                    </div>
                </div>
                {registerButton &&
                    <SignIn setRegisterButton={() => setRegisterButton(true)}/>
                }
            </section>

        </>
);
}

export default Login;
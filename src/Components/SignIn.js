import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import AvatarEditor from "react-avatar-editor";
import MailConfirmationPopup from "./MailConfirmationPopup";
import SetPasswordPopup from "./setPasswordPopup";
import LoadingPopUp from "./LoadingPopUp";

const SignIn = () => {
    const [signButton, setSignButton] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isPhotoPut, setIsPhotoPut] = useState(false);
    const [photoModifyPopup, setPhotoModifyPopup] = useState(false);
    const [usernameAlreadyExist, setUsernameAlreadyExist] = useState(false);
    const [signInSuccess, setSignInSuccess] = useState(false);
    const editorRef = useRef();
    const [photo, setPhoto] = useState(null);
    const [photoModify, setPhotoModify] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [boolShowPopUp , setBoolShowPopUp ] = useState(false);
    const [insertPassword , setInsertPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = {
            "username" : username,
            "email" : email,
            "password": "yiyi",
            "role": "User",
            "job": "Employee",
            "phone":  phone,
            "conversations":  [],
            "photoBytes": photoModify
        };
        axios.post("https://localhost:7039/api/userlogin/signup1", data)
            .then(() => {
                setSignInSuccess(true);
                setBoolShowPopUp(true);
                setUsernameAlreadyExist(false);
                setIsLoading(false);
            } )
            .catch((error) => {
                setUsernameAlreadyExist(true);
                setSignInSuccess(false);
                setIsLoading(false);
            })
    }


    const checkFormValidity = () => {
        // Vérifiez les conditions de validation pour tous les champs
        const isValid = username !== "" && email !== "" && phone !== "" && isPhotoPut;
        console.log(isPhotoPut)
        setIsFormValid(isValid);
    };


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setPhotoModifyPopup(true);
        setPhoto(selectedFile);
    };

    const handlePhotoModify = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            const dataURL = canvas.toDataURL(); // Convertir le canvas en base64
            setPhotoModify(dataURL.split(',')[1]);
            setPhotoModifyPopup(false);
            setIsPhotoPut(true);
        }
    };


    const handlePasswordSet = async() => {
        const dataUploadPhoto = {
            "photo": photoModify,
            "username": username
        };

        let linkphoto = (await axios.post("https://localhost:7039/api/userlogin/upload", dataUploadPhoto)).data;

        console.log("la phototooo link" , linkphoto)

        const data = {
            "username" : username,
            "email" : email,
            "password": password,
            "role": "User",
            "job": "Employee",
            "phone":  phone,
            "conversations":  [],
            "photoBytes": linkphoto
        };
        axios.post("https://localhost:7039/api/userlogin/signup2", data)
            .then(() => {
            } )
            .catch((error) => {
                console.log(error)
            })
    };

    return (
        <section className="dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        {photoModifyPopup && (
                            <div className="h-full flex items-center bg-gray-200">
                                <div className="mb-3">
                                    <AvatarEditor
                                        ref={editorRef}
                                        image={photo}
                                        width={50}
                                        height={50}
                                        border={50}
                                        borderRadius={125}
                                        color={[255, 255, 255, 0.6]}
                                        scale={1}
                                        rotate={0}
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs"
                                    onClick={handlePhotoModify}
                                >
                                    Enregistrer photo
                                </button>
                            </div>
                        )}
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
                            {isPhotoPut &&
                                <img
                                    src={`data:image/png;base64,${photoModify}`}
                                    alt="Photo de profil"
                                    className="w-10 h-10 object-cover ml-2 mr-2  rounded-full transition-transform duration-300 transform-gpu hover:scale-110"
                                />
                            }
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input type="text" name="username" id="username"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Username" required="" onChange={e => {setUsername(e.target.value); checkFormValidity();}}/>
                            </div>
                            <div>
                                <label htmlFor="Email"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email"
                                       placeholder="Email@Email.com"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       required="" onChange={e =>  {setEmail(e.target.value); checkFormValidity();}}/>
                            </div>
                            <div>
                                <label htmlFor="Phone"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                <input
                                    type="number"
                                    name="phone"
                                    id="phone"
                                    placeholder="06123456788"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required=""
                                    onChange={e => {setPhone(e.target.value); checkFormValidity();}}
                                />

                            </div>
                            <div className="w-full">
                                <label className="block mb-1 font-semibold" htmlFor="picture">Picture</label>
                                <input
                                    className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                    type="file" id="picture" onChange={e => {handleFileChange(e); checkFormValidity();}}/>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs"
                                disabled={!isFormValid}
                            >
                                Create an account
                            </button>

                            {usernameAlreadyExist &&
                                <p className="text-red-500 text-xs mt-2 flex justify-center">Le username existe déjà</p>
                            }
                        </form>
                    </div>
                </div>
            </div>

            {isLoading &&
                <LoadingPopUp/>
            }

            {boolShowPopUp &&
                <MailConfirmationPopup setBoolShowPopUp={setBoolShowPopUp} username={username} setInsertPassword={setInsertPassword} handlePasswordSet={handlePasswordSet}/>
            }

            {insertPassword &&
                <SetPasswordPopup handlePasswordSet={handlePasswordSet} setPassword={setPassword} setBoolShowPopUp={setBoolShowPopUp} password={password}/>
            }
        </section>
    );

}

export default SignIn;
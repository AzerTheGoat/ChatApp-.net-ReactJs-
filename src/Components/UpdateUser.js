import AvatarEditor from "react-avatar-editor";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

const UpdateUser = ({ updateusername, updatephone, updatejob, updatephoto, updatepassword, updateemail, updaterole, setUpdateUserButton, link}) => {

    const [username, setUsername] = useState(updateusername);
    const [email, setEmail] = useState(updateemail);
    const [password, setPassword] = useState(updatepassword);
    const [role, setRole] = useState(updaterole);
    const [job, setJob] = useState(updatejob);
    const [phone, setPhone] = useState(updatephone);
    const [photo, setPhoto] = useState(updatephoto);
    const editorRef = useRef();
    const [editedphoto, seteditedPhoto] = useState(null);
    const [isPhotoModify, setisPhotoModify] = useState(false);
    let token = localStorage.getItem('token')


    const handleSave = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            canvas.toBlob((blob) => {
                seteditedPhoto(blob);
            });
        }
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setisPhotoModify(true)
        setPhoto(selectedFile);
    };

    const handleOnClickModify = (e) => {
        try {
            if(isPhotoModify) {
                e.preventDefault();
                const reader = new FileReader();
                reader.readAsDataURL(editedphoto);
                reader.onload = async () => {
                    const base64Photo = reader.result.split(',')[1];

                    const dataUploadPhoto = {
                        "photo": base64Photo,
                        "username": username
                    };

                    let linkphoto = (await axios.post("https://localhost:7039/api/userlogin/upload", dataUploadPhoto)).data;


                    const data = {
                        "username": username,
                        "email": email,
                        "password": password,
                        "role": role,
                        "job": job,
                        "phone": phone,
                        "conversations": [],
                        "photoBytes": base64Photo
                    };
                    if (data) {
                        axios
                            .put(link, data, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(response => {
                                console.log(data)
                                setUpdateUserButton(false)
                                console.log("la data a bien ete transmise" , data)
                            })
                    }
                }
            }else {
                e.preventDefault();
                const data = {
                    "username": username,
                    "email": email,
                    "password": password,
                    "role": role,
                    "job": job,
                    "phone": phone,
                    "conversations": [],
                    "photoBytes": photo
                };
                if (data) {
                    console.log(data)
                    axios
                        .put(link, data, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => {
                            setUpdateUserButton(false)
                            console.log("la data a bien ete transmise" , data)

                        })
                        .catch(error => {
                            console.log(error);
                            console.log("erreur ici dans updateUser");
                        });
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="h-screen w-screen ">
            <div className="fixed bg-gray-200 bg-opacity-50 inset-0 flex items-center justify-center overflow-auto">
                <div className="h-screen mx-20 w-full flex flex-col justify-center">
                    <div className="bg-color4 rounded shadow-lg w-full overflow-auto"
                         onClick={(e) => e.stopPropagation()}>
                        <h5 className="font-bold mb-3 text-center text-lg-start mt-5">Modifier utilisateur</h5>
                        <form onSubmit={handleOnClickModify}>
                            <div className="flex items-center">
                                <div className="w-2/5 overflow-y-auto overflow-auto mr-12 ml-6">
                                    <div className="w-full">
                                        <label className="block mb-1 font-semibold" htmlFor="picture">Picture</label>
                                        <input
                                            className="relative m-0 block w-full bg-gradient-to-r from-gray-300 to-blue-200 min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                            type="file" id="picture" onChange={handleFileChange}/>
                                    </div>
                                    {(updatephoto && !isPhotoModify)&& (
                                        <div className="mb-3 bg-gradient-to-r from-gray-300 to-blue-200">
                                            <AvatarEditor
                                                ref={editorRef}
                                                image={`data:image/png;base64,${updatephoto}`}
                                                width={100}
                                                height={100}
                                                border={100}
                                                borderRadius={125}
                                                color={[255, 255, 255, 0.6]} // Couleur de l'arrière-plan du cercle
                                                scale={1}
                                                rotate={0}
                                                style={{width: '100%', height: '100%'}}
                                            />
                                        </div>)}
                                    {(updatephoto && isPhotoModify)&& (
                                        <div className="mb-3 bg-gradient-to-r from-gray-300 to-blue-200">
                                            <AvatarEditor
                                                ref={editorRef}
                                                image={photo}
                                                width={100}
                                                height={100}
                                                border={100}
                                                borderRadius={125}
                                                color={[255, 255, 255, 0.6]} // Couleur de l'arrière-plan du cercle
                                                scale={1}
                                                rotate={0}
                                                style={{width: '100%', height: '100%'}}
                                            />
                                        </div>)}
                                </div>
                                <div className="w-3/5 overflow-y-auto flex flex-col mr-6">
                                    <div className="mb-3">
                                        <label className="block mb-1 font-semibold" htmlFor="username">Nom
                                            d'utilisateur</label>
                                        <input
                                            className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300  bg-neutral-100 rounded focus:outline-none focus:border-blue-500"
                                            type="text" id="username" placeholder="Username" value={username}
                                            onChange={e => setUsername(e.target.value)} disabled/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
                                        <input
                                            className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            type="email" id="email" placeholder="Email" value={email}
                                            onChange={e => setEmail(e.target.value)}/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block mb-1 font-semibold" htmlFor="password">Password</label>
                                        <input
                                            className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            type="text" id="password" placeholder="Password" value={password}
                                            onChange={e => setPassword(e.target.value)}/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block mb-1 font-semibold" htmlFor="role">Role</label>
                                        <input
                                            className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            type="text" id="role" value={role} placeholder="role"
                                            onChange={e => setRole(e.target.value)}/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block mb-1 font-semibold" htmlFor="job">Job</label>
                                        <input
                                            className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            type="text" id="job" value={job} placeholder="job"
                                            onChange={e => setJob(e.target.value)}/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block mb-1 font-semibold" htmlFor="phone">Phone number</label>
                                        <input
                                            className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            type="text" id="phone" value={phone} placeholder="phone"
                                            onChange={e => setPhone(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                {isPhotoModify && <button className="mb-6 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" type="submit" onClick={handleSave}>Modifer</button>}
                                {!isPhotoModify && <button className="mb-6 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" type="submit">Modifer</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
}

export default UpdateUser;
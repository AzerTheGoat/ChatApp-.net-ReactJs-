import axios from "axios";
import React, {useState, useEffect, useRef} from 'react';
import AvatarEditor from 'react-avatar-editor';
import Chat from "./Chat";
import UpdateUser from "./UpdateUser";


const AdminUI =  ({ logout, messages, sendMessage, getMessage, ownerUsername }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [addUserButton, setAddUserButton] = useState(false);
    const [updateUsername, setUpdateUsername] = useState("");
    const [updatePassword, setUpdatePassword] = useState("");
    const [updateRole, setUpdateRole] = useState("");
    const [updateEmail, setUpdateEmail] = useState("");
    const [updateJob, setUpdateJob] = useState("");
    const [updatePhone, setUpdatePhone] = useState("");
    const [updatePhoto, setUpdatePhoto] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [job, setJob] = useState("");
    const [phone, setPhone] = useState("");
    const [photo, setPhoto] = useState(null);
    const [conv, setConv] = useState([]);
    const [editedPhoto, setEditedPhoto] = useState(null);
    const [goToChat, setGoToChat] = useState(false);
    const [updateUserButton, setUpdateUserButton] = useState(false);
    const editorRef = useRef();
    let token = localStorage.getItem('token')

    useEffect(() => {
        axios
            .get("https://localhost:7039/api/userlogin/getAllUsers", { headers: { 'Authorization': `Bearer ${token}` } })
            .then(response => {
                setUsers(response.data);
            });
    }, [user, updateUserButton]);


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setPhoto(selectedFile);
    };

    const handleSave = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            canvas.toBlob((blob) => {
                setEditedPhoto(blob);
            });
        }
    };

    const handleGoToChat = () =>{
        setGoToChat(true)
    }



    const handleAddUser = async (e) => {
        try {
            e.preventDefault();
            const reader = new FileReader();
            reader.readAsDataURL(editedPhoto);
            reader.onload = async () => {
                const base64Photo = reader.result.split(',')[1];

                const dataUploadPhoto = {
                    "photo": base64Photo,
                    "username": username
                };

                let linkphoto = (await axios.post("https://localhost:7039/api/userlogin/upload", dataUploadPhoto)).data;

                console.log("la phototooo link", linkphoto)

                const data = {
                    "username": username,
                    "email": email,
                    "password": password,
                    "role": role,
                    "job": job,
                    "phone": phone,
                    "conversations": conv,
                    "photoBytes": linkphoto
                };

                setUser(data);
                setAddUserButton(false);
                if (data) {
                    axios
                        .post("https://localhost:7039/api/user/addUser", data, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => {
                            // Récupérer la liste mise à jour des utilisateurs
                            axios
                                .get("https://localhost:7039/api/userlogin/getAllUsers", {headers: {'Authorization': `Bearer ${token}`}})
                                .then(response => {
                                    setUsers(response.data);
                                });
                        })
                        .catch(error => {
                            console.log(error);
                            console.log("erreur ici dans adminUI");
                        });
                }
            };
        } catch (e) {
            console.log(e)
        }
    }

    const arriere = () => {
        setAddUserButton(false)
    }

    const handleDelete = (username) => {
        axios
            .delete(`https://localhost:7039/api/user/deleteUser/${username}`, { headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }})
            .then(response => {
                // Mettre à jour l'état users pour supprimer l'utilisateur de la liste
                setUsers(users.filter(user => user.username !== username));
            })
            .catch(error => {
                // Gérer les erreurs
            });
    }

    const handleButtonAddUser = () => {
        setAddUserButton(true)
    }

    const updateUserB = (usernamee, phonee, passworde, emaile, rolee, jobe, photoe) =>{
        setUpdateUsername(usernamee)
        setUpdatePhoto(photoe)
        setUpdatePhone(phonee)
        setUpdatePassword(passworde)
        setUpdateEmail(emaile)
        setUpdateRole(rolee)
        setUpdateJob(jobe)
        setUpdateUserButton(true)
    }

    const [usernamePhotoMap, setUsernamePhotoMap] = useState(new Map());

 /*x   function AfficherPhotoMain({ username }) {
        if(usernamePhotoMap.has(username)){
            return <img src={usernamePhotoMap.get(username)} alt="User Photohehehio" className="w-10 h-10 object-cover ml-2 mr-2  rounded-full transition-transform duration-300 transform-gpu hover:scale-110"/>
        }
        else {
            if(username !== undefined) {
                return AfficherPhoto(username)
            }
        }
    }
*/

    function AfficherPhoto({ username }) {
        const [imageSrc, setImageSrc] = useState(null);

        useEffect(() => {
            async function fetchImage() {
                const response = await axios.get(`https://localhost:7039/api/userlogin/${username}`);
                const imageUrl = "data:image/png;base64," + response.data;
                setImageSrc(imageUrl);
                setUsernamePhotoMap((prevMap) => {
                    const newMap = new Map(prevMap);
                    newMap.set(username, imageUrl);
                    return newMap;
                });
            }
            if (!usernamePhotoMap.has(username)) {
                fetchImage();
            }
        }, [username, usernamePhotoMap, setUsernamePhotoMap]);

        if (usernamePhotoMap.has(username)) {
            return (
                <img src={usernamePhotoMap.get(username)} alt="User Photo" className="w-10 h-10 object-cover ml-2 mr-2 rounded-full transition-transform duration-300 transform-gpu hover:scale-110" />
            );
        }

        return (
            <img src={imageSrc} alt="profil" className="w-full h-full object-cover rounded-full transition-transform duration-300 transform-gpu hover:scale-110" />
        );
    }

    return (
        <>
            {!goToChat ?
                (<>
                    <section className="h-screen overflow-auto bg-color4">
                        <div>
                            <div className="row">
                                <div className="col-md-12 col-lg-12 col-xl-12 mb-4 mb-md-0">
                                    <h2 className="font-bold mb-3 text-center text-lg-start" onClick={handleGoToChat}>Access to the ChatApp</h2>
                                    <h5 className="font-bold mb-3 text-center text-lg-start">Liste des utilisateurs</h5>
                                    <div className="flex justify-end mb-3">
                                        <button
                                            className="bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white font-bold py-2 px-4 rounded"
                                            onClick={handleButtonAddUser}>Ajouter un utilisateur
                                        </button>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                                <div className="overflow-hidden">
                                                    <table className="min-w-full text-left text-sm font-light">
                                                        <thead className="font-medium dark:border-neutral-500">
                                                            <tr>
                                                                <th className="px-6 py-4 text-center">Nom</th>
                                                                <th className="px-6 py-4 text-center">Email</th>
                                                                <th className="px-6 py-4 text-center">Actions</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {users.map(user => (
                                                                <tr key={user.id} className="hover:bg-blue-100 rounded-lg">
                                                                    <td className="px-4 py-2 flex items-center">
                                                                        <div className="relative w-10 h-10">
                                                                            <AfficherPhoto username={user.username} />
                                                                        </div>
                                                                        <span className="ml-3 flex-grow">{user.username}</span>
                                                                    </td>
                                                                    <td className="px-4 py-2 text-center">{user.email}</td>
                                                                    <td className="px-4 py-2 text-center">
                                                                        <button
                                                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                                            onClick={() => updateUserB(user.username, user.phone, user.password, user.email, user.role, user.job, user.photoBytes)}>Mettre à jour
                                                                        </button>
                                                                        <button
                                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                                            onClick={() => handleDelete(user.username)}>Supprimer
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex justify-center mt-3">
                                    <button
                                        className="bg-transparent hover:bg-gray-500 text-gray-500 hover:text-white font-bold py-2 px-4 rounded"
                                        onClick={logout}>Log Out
                                    </button>
                                </div>

                            </div>
                        </div>
                    </section>
                    <div onClick={arriere}>
                        {addUserButton &&
                            <div className="h-screen w-screen">
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
                                    <div className="h-screen mx-20 w-full flex flex-col justify-center">
                                        <div className="bg-color4 rounded shadow-lg w-full overflow-auto" onClick={(e) => e.stopPropagation()}>
                                            <h5 className="font-bold mb-3 text-center text-lg-start mt-5">Ajouter un utilisateur</h5>
                                            <form onSubmit={handleAddUser}>
                                                <div className="flex items-center">
                                                    <div className="w-2/5 overflow-y-auto overflow-auto mr-12 ml-6">
                                                        <div className="w-full">
                                                            <label className="block mb-1 font-semibold" htmlFor="picture">Picture</label>
                                                            <input className="relative m-0 block w-full bg-gradient-to-r from-gray-300 to-blue-200 min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary" type="file" id="picture" onChange={handleFileChange} />
                                                        </div>
                                                        {photo && (
                                                            <div className="mb-3 bg-gradient-to-r from-gray-300 to-blue-200 ">
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
                                                                    style={{width: '100%', height: '100%' }}
                                                                />
                                                            </div>)}
                                                    </div>
                                                    <div className= "w-3/5 overflow-y-auto flex flex-col mr-6">
                                                        <div className="mb-3">
                                                            <label className="block mb-1 font-semibold" for="username">Nom d'utilisateur</label>
                                                            <input className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500" type="text" id="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="block mb-1 font-semibold" for="email">Email</label>
                                                            <input className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500" type="email" id="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="block mb-1 font-semibold" for="password">Password</label>
                                                            <input className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500" type="text" id="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="block mb-1 font-semibold" for="role">Role</label>
                                                            <input className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500" type="text" id="role" value={role} placeholder="Role"  onChange={e => setRole(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="block mb-1 font-semibold" for="job">Job</label>
                                                            <input className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500" type="text" id="job" value={job} placeholder="Job" onChange={e => setJob(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="block mb-1 font-semibold" for="phone">Phone number</label>
                                                            <input className="w-full px-1 py-1 border bg-gradient-to-r from-gray-100 to-blue-200 border-gray-300 rounded focus:outline-none focus:border-blue-500" type="text" id="phone" value={phone} placeholder="hone" onChange={e => setPhone(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-center">
                                                    <button className="mb-6 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" type="submit" onClick={handleSave}>Ajouter</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>}</div>

                    {updateUserButton &&
                        <div onClick={() => setUpdateUserButton(false)}>
                            <UpdateUser updatejob={updateJob} updateemail={updateEmail} updatepassword={updatePassword} updatephone={updatePhone} updateusername={updateUsername} updatephoto={updatePhoto} updaterole={updateRole} link="https://localhost:7039/api/user/PutUserAdmin" editorRef={editorRef} setUpdateUserButton={setUpdateUserButton} handleFileChange={handleFileChange}/>
                        </div>}

                </>)
                :
                <Chat messages={messages} sendMessage={sendMessage} getMessage={getMessage} ownerUsername={ownerUsername} logout={logout} />
            }
        </>
    );


}

export default AdminUI;

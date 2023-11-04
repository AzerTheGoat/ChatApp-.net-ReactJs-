import axios from "axios";
import React, { useEffect, useState } from "react";

const DestinationDetails = ({ username }) => {
    const [email, setEmail] = useState("");
    const [job, setJob] = useState("");
    const [phone, setPhone] = useState("");
    const [photo, setPhoto] = useState("");
    let token = localStorage.getItem("token");

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handlePopupToggle = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(
                    "https://localhost:7039/api/user/getDetailsUser",
                    {
                        username: username,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const { email, job, phone, photoBytes } = response.data;

                setEmail(email);
                setJob(job);
                setPhone(phone);
                setPhoto(photoBytes);
            } catch (error) {
                // Gérer l'erreur de manière appropriée
            }
        };

        fetchData();
    }, [username]);

    const [usernamePhotoMap, setUsernamePhotoMap] = useState(new Map());

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
        {username === "" ? (<></>
        ) : (<>
            <div className="flex items-center justify-between bg-color4 p-2">
                <div className="flex items-center space-x-2 cursor-pointer w-full">
                    <AfficherPhoto username={username}/>
                    <p className="ml-3 flex-grow">{username}</p>
                    <div
                        className="w-10 h-10 flex flex-col items-end justify-center mr-2"
                        onClick={handlePopupToggle}
                    >
                        <div className="w-6 h-6 rounded-full border border-gray-600 flex flex-col items-center justify-center">
                            <div className="w-1 h-1 bg-gray-600 rounded-full mb-1 "></div>
                            <div className="w-1 h-1 bg-gray-600 rounded-full mb-1"></div>
                            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            {isPopupOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black opacity-50"
                        onClick={handlePopupToggle}
                    ></div>
                    <div className="h-75 w-75 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-gray-600 rounded-lg p-4 shadow-lg">
                            <div className="flex items-center">
                                <AfficherPhoto username={username}/>
                                <div className="text-white">
                                    <p>Username : {username}</p>
                                    <p>Email : {email}</p>
                                    <p>Phone : {phone}</p>
                                    <p>Job : {job}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
        )}
            </>
    );

};

export default DestinationDetails;

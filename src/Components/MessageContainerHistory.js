import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageContainer from "./MessageContainer";
import UpdateUser from "./UpdateUser";
import {map} from "react-bootstrap/ElementChildren";

const MessageContainerHistory = ({ getMessage, messages, destinationn, setSelectedUser, logout , ownerusername}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [destination, setDestination] = useState("");
    const [options, setOptions] = useState([]);
    const [currentUserPhoto, setCurrentUserPhoto] = useState();
    const [showList, setShowList] = useState(true);
    const [enTrainDeChercher, setEnTrainDeChercher] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [updateUserButton, setUpdateUserButton] = useState(false);
    const [usernamePhotoMap, setUsernamePhotoMap] = useState(new Map());



    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('token')
            const response = await axios.get("https://localhost:7039/api/user/cu", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const responsePhoto = await axios.get("https://localhost:7039/api/user/cuPhoto", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCurrentUserPhoto(responsePhoto.data)
            setCurrentUser(response.data);
        };
            fetchData();
        }, [updateUserButton]);



    const handleMouseEnter = (id) => {
        setShowDelete((prevState) => ({ ...prevState, [id]: true }));
    };

    const handleMouseLeave = (id) => {
        setShowDelete((prevState) => ({ ...prevState, [id]: false }));
    };



    useEffect(() => {
        let token = localStorage.getItem("token");
        axios
            .get("https://localhost:7039/api/conversation/getfriends", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setOptions(response.data.$values));
    }, [messages, destinationn]);

    const handleLiClick = (value) => {
        setDestination(value);
        getMessage([]);
        setShowList(false);
        getMessage(value);
        setSearchTerm('')
        setEnTrainDeChercher(false)


    };

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let token = localStorage.getItem("token");
        axios.get('https://localhost:7039/api/userlogin/getAllUsers', {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(response => {
                setData(response.data);
            });
    }, []);


    const handleSearch = event => {
        setSearchTerm(event.target.value);
        setShowList(true)
        if (event.target.value === '') {
            setEnTrainDeChercher(false)
        } else {
            setEnTrainDeChercher(true)
        }    };



    const filteredData = data.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );


    function getTimeValue(timeString) {
        if (timeString === "Just Now") {
            return 0;
        }
        const match = timeString.match(/(\d+)\s(\w+)/);
        if (match) {
            const value = parseInt(match[1]);
            const unit = match[2];
            if (unit.startsWith("min")) {
                return value;
            } else if (unit.startsWith("hour")) {
                return value * 60;
            } else if (unit.startsWith("day")) {
                return value * 60 * 24;
            } else if (unit.startsWith("year")) {
                return value * 60 * 24 * 365;
            }
        }
        return Number.MAX_VALUE;
    }

    options.sort((a, b) => {
        const timeA = getTimeValue(a.timelastmessage);
        const timeB = getTimeValue(b.timelastmessage);
        return timeA - timeB;
    });


    const handleDeleteButton = (username) => {
        const data = {
            "username" : username
        }
        console.log("iudziudui")
        let token = localStorage.getItem("token");
        axios.post('https://localhost:7039/api/conversation/deleteconv', data , {
            headers: {Authorization: `Bearer ${token}`},
        })
    }

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
            <img src={imageSrc} alt="User Photo"  className="w-10 h-10 object-cover ml-2 mr-2  rounded-full transition-transform duration-300 transform-gpu hover:scale-110"/>
        );
    }

    function AfficherPhoto2({ username }) {
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
                <img src={usernamePhotoMap.get(username)} alt="User Photo" className="rounded-full mr-3 shadow-md" width="40" />
            );
        }

        return (
            <img src={imageSrc} alt="User Photo"  className="rounded-full mr-3 shadow-md" width="40"/>
        );
    }







    return (
        <section className="bg-color4 h-full overflow-auto">
            <div className="container py-5">
                <div className="flex flex-col items-center md:items-start">
                    <div className="w-full flex flex-col">
                        <div className="w-full flex flex-row items-center">
                            <img
                                src="https://th.bing.com/th/id/R.f7825926f41f62237a41d66faed9810c?rik=yS5J6lBmSeT%2fDw&pid=ImgRaw&r=0"
                                alt="Logout"
                                className="w-6 h-6 ml-2 cursor-pointer"
                                onClick={logout}
                            />

                            <div onClick={() => setUpdateUserButton(true)}>
                                <AfficherPhoto username={ownerusername}/>
                            </div>


                            <input
                                className="rounded bg-transparent focus:outline-none focus:ring"
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        {showList && searchTerm && (
                            <ul className="my-list" >
                                {filteredData.map((user) => (
                                    <li
                                        key={user.$id}
                                        className="flex items-center bg-transparent rounded-md my-1 hover:bg-blue-200 w-full"
                                        onClick={() => handleLiClick(user.username)}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex flex-row items-center">
                                                <AfficherPhoto2 username={user.username}/>
                                                <div>
                                                    <p className="font-bold mb-1">{user.username}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    {!enTrainDeChercher ?
                        <>
                        {options.length !== 0 ?
                            <ul className="my-list marge" >
                                    {options.map((option) => (
                                        <li
                                            key={option.$id}
                                            className="flex items-center bg-transparent rounded-md my-1 hover:bg-blue-200 w-full relative"
                                            onClick={() => handleLiClick(option.username)}
                                            onMouseEnter={() => handleMouseEnter(option.$id)}
                                            onMouseLeave={() => handleMouseLeave(option.$id)}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex flex-row items-center">
                                                    <AfficherPhoto2 username={option.username}/>
                                                    <div>
                                                        <p className="font-bold mb-1">{option.username}</p>
                                                        <p className="text-sm text-gray-600 overflow-hidden whitespace-nowrap">
                                                            {option.lastMessage.length > 18
                                                                ? `${option.lastMessage.substring(0, 18)}...`
                                                                : option.lastMessage}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    {/*!showDelete[option.$id] && (*/}
                                                        <p className="text-sm text-gray-600 mb-1">{option.timelastmessage}</p>

                                                    {option.state === 1 ? (
                                                        <span className="bg-red-500 text-white rounded-full mr-4 px-2 py-1 text-xs">1</span>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div>
                                            {showDelete[option.$id] && (
                                                <button
                                                    className="delete-button rounded-lg absolute right-0 top-0 bottom-0 bg-red-500 text-white px-4 flex items-center justify-center transition-all duration-500 transform translate-x-3/4 hover:translate-x-0"
                                                    onClick={() => handleDeleteButton(option.username)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                         fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path
                                                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                                        <path
                                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </li>

                                    ))}
                                </ul>
                            : <p></p>}
                    </>
                        :
                    <></>}
                </div>
                </div>
            </div>
            <div className="Detail User">
                { updateUserButton &&
                    <div onClick={() => setUpdateUserButton(false)}>
                        <UpdateUser updaterole={currentUser.role} setUpdateUserButton={setUpdateUserButton} link="https://localhost:7039/api/user/PutCurrentUser" updatephoto={currentUserPhoto} updateusername={currentUser.username} updatephone={currentUser.phone} updatepassword={currentUser.password} updateemail={currentUser.email} updatejob={currentUser.job}/>
                    </div>
                }
            </div>
        </section>

    );
};

export default MessageContainerHistory;

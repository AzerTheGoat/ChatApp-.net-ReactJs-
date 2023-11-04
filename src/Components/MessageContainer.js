import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

const MessageContainer = ({ messages, ownerusername, destination }) => {
    const scrollRef = useRef(null);
    const [currentUserPicture, setCurrentUserPicture] = useState(null);
    const [destinationPicture, setDestinationPicture] = useState(null);
    const [ownerState, setOwnerState] = useState(null);
    const [destState, setDestState] = useState(null);
    const [destConversationUsername, setDestConversationUsername] = useState(null);
    const [ownerConversationUsername, setOwnerConversationUsername] = useState(null);
    useEffect(() => {
        if(messages.length > 9) {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({behavior: 'auto', block: 'end', inline: 'nearest'});
            }
        }else {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
            }
        }
    }, [messages]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = localStorage.getItem("token");
                const data = {
                    "currentUser": ownerusername.toLowerCase(),
                    "otherUser": destination.toLowerCase()
                };

                const response = await axios.post('https://localhost:7039/api/conversation/getPhotoConv', data, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const currentUserPhoto = response.data.currentUserPhoto;
                const otherUserPhoto = response.data.otherUserPhoto;

                setCurrentUserPicture(currentUserPhoto);
                setDestinationPicture(otherUserPhoto);
                setOwnerState(response.data.ownerState);
                setDestState(response.data.destState);
                setOwnerConversationUsername(response.data.ownerUsername);
                setDestConversationUsername(response.data.destUsername);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [ownerusername, destination]);


        function AfficherPhoto({ username }) {
            const [imageSrc, setImageSrc] = useState(null);

            useEffect(() => {
                async function fetchImage() {
                    const response = await axios.get(`https://localhost:7039/api/userlogin/${username}`);
                    setImageSrc("data:image/png;base64," + response.data);
                }
                fetchImage();
            }, [username]);

            return (
                <img src={imageSrc} alt="profil" className="rounded-full mr-3 shadow-md" width="40" />
            );
        }


    return (
        <>
            {messages.length === 0 ? (
                <></>
            ) : (
                <div className="w-full max-h-[calc(100% - 2rem)] overflow-y-auto" ref={scrollRef}>
                    <ul className="list-none" >
                        {messages.map((m, index) => {
                            const isLastMessage = index === messages.length - 1;
                            return (<>
                                    {destination.toLowerCase() === m.user.toLowerCase() || ownerusername.toLowerCase() === m.user.toLowerCase() ? (
                                        ownerusername === m.user ? (
                                            <>
                                                <li className="flex justify-end items-center mb-4" key={index}>
                                                    <div className={`min-w-1/5 max-w-4/5 bg-blue-300 rounded-lg shadow-md p-1`}>
                                                        <div className="flex justify-between items-center">
                                                            <p className="mb-0 break-all">{m.message}</p>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <p className="text-sm text-gray-600 mb-0">
                                                                <i className="far fa-clock overflow-auto"></i> {m.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <AfficherPhoto username={ownerusername}/>
                                                </li>


                                            </>
                                        ) : (
                                            <>
                                                <li className="flex justify-start items-center mb-4" key={index}>
                                                    <AfficherPhoto username={destination}/>
                                                    <div className={`min-w-1/5 max-w-4/5 bg-red-300 rounded-lg shadow-md p-1`}>
                                                        <div className="flex justify-between items-center">
                                                            <p className="mb-0 break-all">{m.message}</p>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <p className="text-sm text-gray-600 mb-0">
                                                                <i className="far fa-clock overflow-auto"></i> {m.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>

                                            </>
                                        )
                                    ) : (
                                        <p></p>
                                    )}
                            </>);
                        })}
                    </ul>
                </div>)}
                    </>
    );
};

export default MessageContainer;

import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import MessageContainerHistory from "./MessageContainerHistory";
import React, { useState } from "react";
import DestinationDetails from "./DestinationDetails";

const Chat = ({ messages, sendMessage, getMessage, ownerUsername, logout}) => {
    const [destination, setDestination] = useState("");
    const [showAddConversation, setShowAddConversation] = useState(false);
    const [destPhoto, setDestPhoto] = useState(null);

    const handleAddConversationClick = () => {
        setShowAddConversation(true);
    };

    const handleSendMessage = (message) => {
        sendMessage(message, destination);
        setShowAddConversation(false);
    };

    const handleLogout = () =>{
        logout()
    }

    function setSelectedUser(username) {
        getMessage(username)
        setDestination(username)
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="w-screen h-screen bg-white rounded-lg shadow-lg overflow-hidden flex">
                <div className="w-1/4 overflow-y-auto mt-0 mb-0 overflow-auto chat-container">
                        <MessageContainerHistory
                            getMessage={(dest) => {
                                setDestination(dest);
                                getMessage(dest);
                            }}
                            messages={messages}
                            destinationn={destination}
                            ownerusername={ownerUsername}
                            setSelectedUser={setSelectedUser}
                            logout={logout}

                        />
                    </div>
                    <div className="w-3/4 overflow-y-auto flex flex-col">
                        <div>
                            <DestinationDetails username={destination}/>
                        </div>
                        <div className="h-full flex-grow bg-gradient-to-r from-gray-300 to-blue-200 overflow-y-auto">
                            <MessageContainer messages={messages} ownerusername={ownerUsername} destination={destination} />
                        </div>
                        <div className="h-auto">
                            <SendMessageForm
                                sendMessage={(message) => sendMessage(message, destination)}
                                destination={destination}
                            />
                        </div>
                    </div>
            </div>
        </div>

    );
};
export default Chat;

import React, { useState } from "react";

const SendMessageForm = ({ sendMessage, destination }) => {
    const [message, setMessage] = useState("");

    return (
        <div className="bg-gradient-to-r from-gray-300 to-blue-200">
            <form
                className="flex items-center "
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(message, destination);
                    setMessage("");
                }}
            >
                <input
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-300 to-blue-200 rounded-l-md border border-r-0 focus:outline-none focus:ring"
                    type="text"
                    placeholder="Message..."
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <button
                    className="px-4 py-2 rounded-r-md  text-white focus:outline-none focus:ring hover:bg-blue-300"
                    type="submit"
                    disabled={!message || !destination}
                >
                    <img
                        src="https://cdn2.iconfinder.com/data/icons/fanaticons/100/Send_Filled-512.png"
                        alt="Logout"
                        className="w-6 h-6 ml-2 cursor-pointer"
                    />
                </button>

            </form>
        </div>
    );
};

export default SendMessageForm;
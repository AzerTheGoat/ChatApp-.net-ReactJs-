import {useEffect, useState} from 'react';
import axios from "axios";

const MailConfirmationPopup = ({ setBoolShowPopUp, username, setInsertPassword}) => {
    const [code, setCode] = useState('');
    const [bonCode, setPasLeBonCode] = useState(false);

    const handleValidation = (e) => {
        e.preventDefault();
        const data = {
            "username": username,
            "token": code
        }
        axios.post("https://localhost:7039/api/userlogin/isgoodtoken", data)
            .then((response) => {
                setInsertPassword(true);
                setBoolShowPopUp(false);
            })
            .catch(() => setPasLeBonCode(true));
    };


    return (
        <div>
                <>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true"
                     className="fixed flex justify-center items-center bg-white bg-opacity-50 top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Confirm your email address
                                </h3>
                                <button type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-hide="staticModal"
                                        onClick={() => setBoolShowPopUp(false)}>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                Insert the code you received by email here
                                <div className="relative mt-3">
                                    <input type="search" id="default-search"
                                           className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder="Insert your token here" value={code} onChange={e => setCode(e.target.value)} required/>
                                    <button type="submit"
                                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            onClick={handleValidation}>Validate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    {
                        bonCode && <p className="text-red-500">Pas le bon code</p>
                    }
            </>
        </div>
    );
};

export default MailConfirmationPopup;

import { Spinner } from "@material-tailwind/react";

const LoadingPopUp = () => {
    return (
        <div className="h-screen w-screen fixed inset-0 flex justify-center items-center">
            <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true"
                 className="fixed flex justify-center items-center bg-white bg-opacity-50 top-0 left-0 right-0 overflow-x-hidden md:inset-0 h-[calc(100%-1rem)]">
                <div className="relative w-80">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-center p-4 border-b rounded-t dark:border-gray-600">
                            <Spinner className="h-8 w-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingPopUp;
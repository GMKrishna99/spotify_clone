'use client'
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from 'react-icons/ai'
import useAuthModal from "@/hooks/useAuthModel";
import { useUser } from "@/hooks/useUser";
import useUploadModel from "@/hooks/useUploadModel";
const Library = () => {

    const authModal = useAuthModal()
    const { user, subscription } = useUser()
    const uploadModel = useUploadModel()
    const onClick = () => {
        if (!user) {
            return authModal.onOpen()
        }
        // check for subscriptions
      
        return uploadModel.onOpen()
    }
    return (
        <div className="flex flex-col ">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist size={26} className="text-neutral-400" />
                    <p className="text-neutral-400 text-md font-medium">
                        Your library
                    </p>
                </div>
                <AiOutlinePlus size={20} className="text-neutral-400 cursor-pointer hover:text-white transition" onClick={onClick} />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-3">
                List of Songs
            </div>
        </div>
    );
};

export default Library;
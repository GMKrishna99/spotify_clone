'use client'

import AuthModal from "@/components/AuthModal";
import Modal from "@/components/Modal";
import UploadModel from "@/components/UploadModel";
import { useEffect, useState } from "react";

const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false)

    // prevent any errors modal can get an error when server side rendering 

    useEffect(() => {
        setIsMounted(true)
    }, [])
    if (!isMounted) {
        return null
    }
    return (
        <>
            <AuthModal />
            <UploadModel />
        </>
    );
};
export default ModalProvider;
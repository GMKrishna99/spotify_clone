"use client"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import uniqid from "uniqid";
import { useRouter } from "next/navigation";

import useUploadModel from "@/hooks/useUploadModel";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";

import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";

const UploadModel = () => {
    const uploadModel = useUploadModel();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser()
    const supabaseClient = useSupabaseClient();
    const router = useRouter()

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,

        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModel.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {
                toast.error("Missing fields");
                return;
            }

            const uniqId = uniqid();
            // upload songs
            const { data: songData, error: songError } = await supabaseClient.storage
                .from('songs')
                .upload(`song-${values.title}-${uniqId}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                })
            if (songError) {
                setIsLoading(false)
                return toast.error('Failed Song Upload')
            }
            // image upload
            const { data: imageData, error: imageError } = await supabaseClient.storage
                .from('images')
                .upload(`image-${values.title}-${uniqId}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })
            if (imageError) {
                setIsLoading(false)
                return toast.error('Failed Image Upload')
            }
            const { error: supabaseError } = await supabaseClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path,
                })
            if (supabaseError) {
                setIsLoading(false)
                return toast.error(supabaseError.message)
            }
            router.refresh();
            setIsLoading(false)
            toast.success("Song added successfully");
            reset()
            uploadModel.onClose();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Modal title="Add a Song" description="upload mp3 files only" isOpen={uploadModel.isOpen} onChange={onChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input id="title" disabled={isLoading} {...register('title', { required: true })} placeholder='Song Title' />
                <Input id="author" disabled={isLoading} {...register('author', { required: true })} placeholder='Song Author' />
                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input id="song" type="file" disabled={isLoading} {...register('song', { required: true })} accept=".mp3" />
                </div>
                <div>
                    <div className="pb-1">
                        Select a song Image
                    </div>
                    <Input id="image" type="file" disabled={isLoading} {...register('image', { required: true })} accept="image/*" />
                </div>
                <Button disabled={isLoading} type="submit" className="w-full">
                    Create
                </Button>
            </form>
        </Modal >
    );
};
export default UploadModel;
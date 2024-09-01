"use client"

import { Media } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface DetailImagePickerProps {
    mainImage: string;
    thumbnailImages: Media[];
}

const DetailImagePicker = ({ mainImage, thumbnailImages }: DetailImagePickerProps) => {
    const [currentImage, setCurrentImage] = useState(mainImage);
    console.log(`main image ${mainImage}`)
    console.log(`thumbnail image ${thumbnailImages}`)

    return (
        <div className="">
            <div className="relative w-full mb-5">
                <Image
                    src={currentImage}
                    alt="Main Product Image"
                    width={300}
                    height={200}
                    priority
                    className="object-contain rounded-xl"
                />
            </div>
            <div className="flex space-x-4 overflow-x-auto">
                {thumbnailImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImage(image.url)}
                        className="flex-shrink-0 border-2 border-transparent"
                    >
                        <Image
                            src={image?.url}
                            alt={`Thumbnail ${index}`}
                            width={50}
                            height={50}
                            priority
                            className="rounded-md object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DetailImagePicker
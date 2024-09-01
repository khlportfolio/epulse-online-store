"use client"

import Image from "next/image";
import { useState } from "react";

interface DetailImagePickerProps {
    mainImage: string;
    thumbnailImages: string[];
}

const DetailImagePicker = ({ mainImage, thumbnailImages }: DetailImagePickerProps) => {
    const [currentImage, setCurrentImage] = useState(mainImage);

    return (
        <div className="">
            <div className="relative w-full mb-5">
                <Image
                    src={currentImage}
                    alt="Main Product Image"
                    width={300}
                    height={200}
                    className="object-contain rounded-xl"
                />
            </div>
            <div className="flex space-x-4 overflow-x-auto">
                {thumbnailImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImage(image)}
                        className="flex-shrink-0 border-2 border-transparent"
                    >
                        <Image
                            src={image}
                            alt={`Thumbnail ${index}`}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DetailImagePicker
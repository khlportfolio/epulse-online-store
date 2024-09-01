"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

interface ImageWithSkeletonProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
}

const ImageWithSkeleton = ({ src, alt, fill = false, className }: ImageWithSkeletonProps) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <Skeleton className="w-full h-full" />
            )}
            <Image
                src={src}
                alt={alt}
                fill={fill}
                className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => setIsLoading(false)} // Hide skeleton if image fails to load
            />
        </div>
    );
};

export default ImageWithSkeleton;

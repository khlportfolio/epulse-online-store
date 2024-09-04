"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./styles.css";
import LoadingButton from "@/components/LoadingButton";
import { useSubmitProductMutation } from "./mutations";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { useRef } from "react"
import { Button } from "@/components/ui/button";
import { ImageIcon, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { createProductSchema } from "@/lib/validation";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface InputEditorProps {
    onSubmitSuccess: () => void;
    categoryId: string;
}

interface CategoryProps {
    id: string;
    name: string;
}

interface SizeProps {
    id: string;
    name: string;
}

interface SizeStockInput {
    sizeId: string;
    stock: number;
}


const InputEditor = ({ onSubmitSuccess, categoryId }: InputEditorProps) => {
    const mutation = useSubmitProductMutation(categoryId);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<CategoryProps[]>([]);
    const [sizes, setSizes] = useState<SizeProps[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [sizeStocks, setSizeStocks] = useState<SizeStockInput[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loadingSizes, setLoadingSizes] = useState<boolean>(true);
    const [isBestProduct, setIsBestProduct] = useState(false);

    const handleBestProductChange = (checked: boolean) => {
        setIsBestProduct(checked);
    };

    const { startUpload, attachments, isUploading, uploadProgress, removeAttachment, reset: resetMediaUpload } = useMediaUpload();

    useEffect(() => {
        async function fetchCategories() {
            const response = await fetch('/api/category/all');
            const data = await response.json();
            setCategories(data);
        }

        async function fetchSizes() {
            setLoadingSizes(true); // Set loading true saat mulai fetch
            try {
                const response = await fetch('/api/size/all');
                const data = await response.json();
                setSizes(data);
                setSizeStocks(data.map((size: SizeProps) => ({ sizeId: size.id, stock: 0 })));
            } catch (error) {
                console.error('Error fetching sizes:', error);
            } finally {
                setLoadingSizes(false); // Set loading false setelah fetch selesai
            }
        }

        fetchCategories();
        fetchSizes();
    }, []);

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const handleSizeStockChange = (sizeId: string, stock: number) => {
        setSizeStocks((prevStocks) => {
            const existingStock = prevStocks.find((s) => s.sizeId === sizeId);
            if (existingStock) {
                return prevStocks.map((s) =>
                    s.sizeId === sizeId ? { ...s, stock } : s
                );
            }
            return [...prevStocks, { sizeId, stock }];
        });
    };

    // Editor for title
    const titleEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter title...",
            }),
        ],
    });

    const priceEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter price...",
            }),
        ],
    });

    const featuresEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter features...",
            }),
        ],
    });

    const materialsEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter materials...",
            }),
        ],
    });

    const summaryEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter summary...",
            }),
        ],
    });

    const detailsSizeEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "Enter size...",
            }),
        ],
    });

    // Get content from editors
    const title = titleEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    const priceText = priceEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    const features = featuresEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    const materials = materialsEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    const summary = summaryEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    const detailsSize = detailsSizeEditor?.getText({
        blockSeparator: "\n",
    }) || "";

    const price = parseInt(priceText, 10);
    const isPriceValid = !isNaN(price) && price > 0;

    async function onSubmit() {
        const validationResult = createProductSchema.safeParse({
            title,
            price: isPriceValid ? price : 0,
            categoryId: selectedCategory,
            features: features.split('\n').filter(Boolean), // Convert to array
            materials: materials.split('\n').filter(Boolean), // Convert to array
            summary,
            detailsSize: detailsSize.split('\n').filter(Boolean),
            sizeStocks,
            mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
            isBestProduct
        });

        if (!validationResult.success) {
            const zodErrors = validationResult.error.errors;
            const formattedErrors: { [key: string]: string } = {};

            zodErrors.forEach((error) => {
                formattedErrors[error.path[0]] = error.message;
            });

            setErrors(formattedErrors);
            return;
        }

        if (!selectedCategory) {
            setErrors(prevErrors => ({ ...prevErrors, categoryId: 'Category is required' }));
            return;
        }

        setIsSubmitting(true);

        mutation.mutate({ title, price: isPriceValid ? price : 0, categoryId: selectedCategory, features: features.split('\n').filter(Boolean), materials: materials.split('\n').filter(Boolean), summary, detailsSize: detailsSize.split('\n').filter(Boolean), sizeStocks, mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[], isBestProduct }, {
            onSuccess: () => {
                titleEditor?.commands.clearContent();
                priceEditor?.commands.clearContent();
                featuresEditor?.commands.clearContent();
                materialsEditor?.commands.clearContent();
                summaryEditor?.commands.clearContent();
                detailsSizeEditor?.commands.clearContent();
                resetMediaUpload();
                onSubmitSuccess();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false); // Stop loading when there's an error
            },
        })
    }

    return (
        <div className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TooltipProvider>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <label className="text-lg font-semibold mb-2">Title</label>
                            <div className="mb-2">
                                <div className="hidden lg:block">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Erigo Shirt</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="block lg:hidden">
                                    <Popover>
                                        <PopoverTrigger>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Erigo Shirt</p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <EditorContent
                            editor={titleEditor}
                            className="w-full max-h-[8rem] overflow-y-auto bg-background rounded-lg px-4 py-2 border border-muted-foreground"
                        />
                        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                    </div>
                </TooltipProvider>
                <TooltipProvider>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <label className="text-lg font-semibold mb-2">Price</label>
                            <div className="mb-2">
                                <div className="hidden lg:block">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Erigo Shirt</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="block lg:hidden">
                                    <Popover>
                                        <PopoverTrigger>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">150000</p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <EditorContent
                            editor={priceEditor}
                            className="w-full max-h-[8rem] overflow-y-auto bg-background rounded-lg px-4 py-2 border border-muted-foreground"
                        />
                        {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                    </div>
                </TooltipProvider>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-2">Category</label>
                    <Select onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full bg-background border border-muted-foreground rounded-lg">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
                </div>
                <TooltipProvider>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <label className="text-lg font-semibold mb-2">Features</label>
                            <div className="mb-2">
                                <div className="hidden lg:block">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Erigo Shirt</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="block lg:hidden">
                                    <Popover>
                                        <PopoverTrigger>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Mudah disetrika</p>
                                            <p className="text-xs">Bahan halus</p>
                                            <p className="text-xs italic text-red-500">Selalu gunakan pemisah enter</p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <EditorContent
                            editor={featuresEditor}
                            className="w-full max-h-[8rem] overflow-y-auto bg-background rounded-lg px-4 py-2 border border-muted-foreground"
                        />
                        {errors.features && <p className="text-red-600 text-sm mt-1">{errors.features}</p>}
                    </div>
                </TooltipProvider>
                <TooltipProvider>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <label className="text-lg font-semibold mb-2">Materials</label>
                            <div className="mb-2">
                                <div className="hidden lg:block">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Erigo Shirt</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="block lg:hidden">
                                    <Popover>
                                        <PopoverTrigger>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Bahan CVC</p>
                                            <p className="text-xs">Cotton</p>
                                            <p className="text-xs italic text-red-500">Selalu gunakan pemisah enter</p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <EditorContent
                            editor={materialsEditor}
                            className="w-full max-h-[8rem] overflow-y-auto bg-background rounded-lg px-4 py-2 border border-muted-foreground"
                        />
                        {errors.materials && <p className="text-red-600 text-sm mt-1">{errors.materials}</p>}
                    </div>
                </TooltipProvider>
                <TooltipProvider>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <label className="text-lg font-semibold mb-2">Summary</label>
                            <div className="mb-2">
                                <div className="hidden lg:block">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Erigo Shirt</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="block lg:hidden">
                                    <Popover>
                                        <PopoverTrigger>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">produk unggulan dari toko kami</p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <EditorContent
                            editor={summaryEditor}
                            className="w-full max-h-[8rem] overflow-y-auto bg-background rounded-lg px-4 py-2 border border-muted-foreground"
                        />
                        {errors.summary && <p className="text-red-600 text-sm mt-1">{errors.summary}</p>}
                    </div>
                </TooltipProvider>
                <TooltipProvider>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <label className="text-lg font-semibold mb-2">Size Details</label>
                            <div className="mb-2">
                                <div className="hidden lg:block">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">Erigo Shirt</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="block lg:hidden">
                                    <Popover>
                                        <PopoverTrigger>
                                            <Info className="text-muted-foreground hover:text-primary cursor-pointer" size={20} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p className="text-xs font-semibold">Contoh input yang benar :</p>
                                            <p className="text-xs">S : 12 x 54 x 65</p>
                                            <p className="text-xs">M : 123 x 56 x 76</p>
                                            <p className="text-xs">L : 123 x 56 x 76</p>
                                            <p className="text-xs italic text-red-500">Selalu gunakan pemisah enter</p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <EditorContent
                            editor={detailsSizeEditor}
                            className="w-full max-h-[8rem] overflow-y-auto bg-background rounded-lg px-4 py-2 border border-muted-foreground"
                        />
                        {errors.detailsSize && <p className="text-red-600 text-sm mt-1">{errors.detailsSize}</p>}
                    </div>
                </TooltipProvider>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="bestProduct"
                        checked={isBestProduct}
                        onCheckedChange={handleBestProductChange}
                    />
                    <label htmlFor="bestProduct" className="text-lg font-semibold">
                        Mark as Best Product
                    </label>
                </div>
            </div>
            <div className="flex flex-col space-y-4">
                <label className="text-lg font-semibold">Size Stock</label>
                {loadingSizes ? (
                    <div className="flex items-center justify-center w-full h-20">
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                ) : (
                    sizes.map((size) => (
                        <div key={size.id} className="flex items-center gap-4">
                            <span className="w-1/3 flex-shrink-0">{size.name}</span>
                            <input
                                type="number"
                                placeholder="Stock"
                                value={sizeStocks.find((s) => s.sizeId === size.id)?.stock || 0}
                                onChange={(e) => handleSizeStockChange(size.id, parseInt(e.target.value, 10))}
                                className="flex-1 p-2 border border-muted-foreground rounded-lg"
                                min={0}
                            />
                        </div>
                    ))
                )}
            </div>
            {!!attachments.length && (
                <AttachmentPreviews
                    attachments={attachments}
                    removeAttachment={removeAttachment}
                />
            )}
            <div className="flex justify-end gap-3 items-center">
                {isUploading && (
                    <>
                        <span className="text-sm">{uploadProgress ?? 0}%</span>
                        <Loader2 className="size-5 animate-spin text-primary" />
                    </>
                )}
                <AddAttachmentsButton
                    onFilesSelected={startUpload}
                    disabled={isUploading || attachments.length >= 5}
                />
                <LoadingButton onClick={onSubmit} loading={mutation.isPending} className="min-w-20">Submit</LoadingButton>
                {/* <LoadingButton onClick={() => { }} loading={true} disabled={false} className="min-w-20">Submit</LoadingButton> */}
            </div>
            <div className="flex justify-start text-xs text-red-500">
                <div className="flex flex-col gap-2">
                    <p className="italic">- Ukuran maksimal setiap gambar 16MB</p>
                    <p className="italic">- hanya bisa memasukkan gambar dengan jumlah 1 - 5</p>
                    <p className="italic">- Gambar utama adalah gambar yang diupload di pertama kali</p>
                    <p className="italic">- Tidak bisa memasukkan gambar lebih dari 5</p>
                    <p className="italic">- Summary berbentuk paragraf</p>
                    <p className="italic">- Features, material, dan size details berbentuk list. Untuk cara input data nya setiap list diberi pemisah enter</p>
                </div>
            </div>
        </div>
    );
};

export default InputEditor;


interface AddAttachmentsButtonProps {
    onFilesSelected: (files: File[]) => void;
    disabled: boolean
}

function AddAttachmentsButton({ onFilesSelected, disabled }: AddAttachmentsButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    return <>
        <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary text-primary"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
        >
            <ImageIcon size={30} />
        </Button>
        <input
            type="file"
            accept="image/*, video/*"
            multiple
            ref={fileInputRef}
            className="sr-only hidden"
            onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length) {
                    onFilesSelected(files);
                    e.target.value = "";
                }
            }}
        />
    </>
}

interface AttachmentPreviewsProps {
    attachments: Attachment[];
    removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({ attachments, removeAttachment }: AttachmentPreviewsProps) {
    return <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm:grid-cols-2")}>
        {attachments.map((attachment) => (
            <AttachmentPreview
                key={attachment.file.name}
                attachment={attachment}
                onRemoveClick={() => removeAttachment(attachment.file.name)}
            />
        ))}
    </div>
}

interface AttachmentPreviewProps {
    attachment: Attachment;
    onRemoveClick: () => void;
}

function AttachmentPreview({ attachment: { file, mediaId, isUploading }, onRemoveClick }: AttachmentPreviewProps) {
    const src = URL.createObjectURL(file);

    return <div className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}>
        {file.type.startsWith("image") ? (
            <Image src={src} alt="Attachment preview" width={100} height={100} className="size-fit max-h-[20rem] rounded-2xl" />
        ) : (
            <video controls className="size-fit max-h-[20rem] rounded-2xl">
                <source src={src} type={file.type} />
            </video>
        )}

        {!isUploading && (
            <button className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60" onClick={onRemoveClick}>
                <X size={20} />
            </button>
        )}
    </div>
}

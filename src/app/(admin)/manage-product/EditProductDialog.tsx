import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LoadingButton from "@/components/LoadingButton";
import { useUpdateProductMutation } from "./mutations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useMediaUpload from "./useMediaUpload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { updateProductSchema } from "@/lib/validation";
import { ProductData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface EditProductDialogProps {
    product: ProductData;
    onClose: () => void;
    open: boolean;
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

const EditProductDialog = ({ product, onClose, open, categoryId }: EditProductDialogProps) => {
    const mutation = useUpdateProductMutation(product.categoryId);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<CategoryProps[]>([]);
    const [sizes, setSizes] = useState<SizeProps[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(product.categoryId);
    const [sizeStocks, setSizeStocks] = useState<SizeStockInput[]>(product.sizeStocks.map(sizeStock => ({
        sizeId: sizeStock.size.id,
        stock: sizeStock.stock
    })) || []);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [loadingSizes, setLoadingSizes] = useState<boolean>(true);
    const [isBestProduct, setIsBestProduct] = useState(product.isBestProduct);


    const handleBestProductChange = (checked: boolean) => {
        setIsBestProduct(checked);
    };

    const { startUpload, attachments, isUploading, uploadProgress, removeAttachment, reset: resetMediaUpload } = useMediaUpload();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            await startUpload(Array.from(files));
        }
    };

    useEffect(() => {
        async function fetchCategories() {
            setLoadingCategories(true);
            try {
                const response = await fetch('/api/category/all');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        }

        async function fetchSizes() {
            setLoadingSizes(true);
            try {
                const response = await fetch('/api/size/all');
                const data = await response.json();
                setSizes(data);
            } catch (error) {
                console.error('Error fetching sizes:', error);
            } finally {
                setLoadingSizes(false);
            }
        }

        fetchCategories();
        fetchSizes();
    }, []);

    const titleEditor = useEditor({
        extensions: [
            StarterKit.configure({ bold: false, italic: false }),
            Placeholder.configure({ placeholder: "Enter title..." }),
        ],
    });

    const priceEditor = useEditor({
        extensions: [
            StarterKit.configure({ bold: false, italic: false }),
            Placeholder.configure({ placeholder: "Enter price..." }),
        ],
    });

    const featuresEditor = useEditor({
        extensions: [
            StarterKit.configure({ bold: false, italic: false }),
            Placeholder.configure({ placeholder: "Enter features..." }),
        ],
    });

    const materialsEditor = useEditor({
        extensions: [
            StarterKit.configure({ bold: false, italic: false }),
            Placeholder.configure({ placeholder: "Enter materials..." }),
        ],
    });

    const summaryEditor = useEditor({
        extensions: [
            StarterKit.configure({ bold: false, italic: false }),
            Placeholder.configure({ placeholder: "Enter summary..." }),
        ],
    });

    const detailsSizeEditor = useEditor({
        extensions: [
            StarterKit.configure({ bold: false, italic: false }),
            Placeholder.configure({ placeholder: "Enter size..." }),
        ],
    });

    useEffect(() => {
        if (titleEditor) {
            titleEditor.commands.setContent(product.title || "");
        }
        if (priceEditor) {
            priceEditor.commands.setContent(product.price.toString() || "");
        }
        if (featuresEditor) {
            featuresEditor.commands.setContent(product.features.join('\n') || "");
        }
        if (materialsEditor) {
            materialsEditor.commands.setContent(product.materials.join('\n') || "");
        }
        if (summaryEditor) {
            summaryEditor.commands.setContent(product.summary || "");
        }
        if (detailsSizeEditor) {
            detailsSizeEditor.commands.setContent(product.detailsSize.join('\n') || "");
        }
    }, [titleEditor, priceEditor, featuresEditor, materialsEditor, summaryEditor, detailsSizeEditor, product]);

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const handleSizeStockChange = (sizeId: string, stock: number) => {
        setSizeStocks(prevStocks => {
            const existingStock = prevStocks.find(s => s.sizeId === sizeId);
            if (existingStock) {
                return prevStocks.map(s =>
                    s.sizeId === sizeId ? { ...s, stock } : s
                );
            }
            return [...prevStocks, { sizeId, stock }];
        });
    };

    async function onSubmit() {
        const validationResult = updateProductSchema.safeParse({
            id: product.id,
            title: titleEditor?.getText({ blockSeparator: "\n" }) || "",
            price: parseInt(priceEditor?.getText({ blockSeparator: "\n" }) || "0", 10),
            categoryId: selectedCategory,
            features: featuresEditor?.getText({ blockSeparator: "\n" }).split('\n').filter(Boolean) || [],
            materials: materialsEditor?.getText({ blockSeparator: "\n" }).split('\n').filter(Boolean) || [],
            summary: summaryEditor?.getText({ blockSeparator: "\n" }) || "",
            detailsSize: detailsSizeEditor?.getText({ blockSeparator: "\n" }).split('\n').filter(Boolean) || [],
            sizeStocks: sizeStocks || [],  // Ensure sizeStocks is always an array
            mediaIds: attachments.map(a => a.mediaId).filter(Boolean) as string[],
            isBestProduct
        });

        if (!validationResult.success) {
            const zodErrors = validationResult.error.errors;
            const formattedErrors: { [key: string]: string } = {};

            zodErrors.forEach(error => {
                formattedErrors[error.path[0]] = error.message;
            });

            setErrors(formattedErrors);
            return;
        }

        setIsSubmitting(true);

        mutation.mutate({
            id: product.id,
            title: titleEditor?.getText({ blockSeparator: "\n" }) || "",
            price: parseInt(priceEditor?.getText({ blockSeparator: "\n" }) || "0", 10),
            categoryId: selectedCategory,
            features: featuresEditor?.getText({ blockSeparator: "\n" }).split('\n').filter(Boolean) || [],
            materials: materialsEditor?.getText({ blockSeparator: "\n" }).split('\n').filter(Boolean) || [],
            summary: summaryEditor?.getText({ blockSeparator: "\n" }) || "",
            detailsSize: detailsSizeEditor?.getText({ blockSeparator: "\n" }).split('\n').filter(Boolean) || [],
            sizeStocks: sizeStocks || [],  // Ensure sizeStocks is always an array
            isBestProduct,
            mediaIds: attachments.map(a => a.mediaId).filter((id): id is string => id !== undefined)
        }, {
            onSuccess: () => {
                titleEditor?.commands.clearContent();
                priceEditor?.commands.clearContent();
                featuresEditor?.commands.clearContent();
                materialsEditor?.commands.clearContent();
                summaryEditor?.commands.clearContent();
                detailsSizeEditor?.commands.clearContent();
                resetMediaUpload();
                onClose();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    }


    console.log(product.id)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-md max-h-[80vh] overflow-y-auto">
                <DialogTitle>Edit Product</DialogTitle>
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
                        {loadingCategories ? (
                            <div className="flex items-center justify-center w-full h-12 bg-gray-200 rounded-lg">
                                <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-blue-500 rounded-full" />
                                <span className="ml-2 text-sm">Loading categories...</span>
                            </div>
                        ) : (
                            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full bg-background border border-muted-foreground rounded-lg">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
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
                <div className="flex flex-col gap-4">
                    <label className="text-lg font-semibold mb-2">Size Stocks</label>
                    {loadingSizes ? (
                        <div className="flex flex-col w-full">
                            {[...Array(3)].map((_, idx) => (
                                <div key={idx} className="flex items-center mb-2 bg-gray-200 rounded-lg p-2">
                                    <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-blue-500 rounded-full" />
                                    <div className="ml-2 flex-1 bg-gray-300 h-6 rounded-md" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        sizes.map(size => (
                            <div key={size.id} className="flex items-center mb-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        sizeStocks.find(stock => stock.sizeId === size.id)?.stock || ""
                                    }
                                    onChange={(e) => handleSizeStockChange(size.id, Number(e.target.value))}
                                    className="w-20 p-2 border border-muted-foreground rounded-lg"
                                    placeholder="Stock"
                                />
                                <span className="ml-2">{size.name}</span>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <Checkbox
                        id="isBestProduct"
                        checked={isBestProduct}
                        onCheckedChange={handleBestProductChange}
                        className="text-primary"
                    />
                    <label htmlFor="isBestProduct" className="text-sm">
                        Best Product
                    </label>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="text-lg font-semibold mb-2">Upload Image</label>
                    <Input type="file" onChange={handleFileChange} />
                    {isUploading && <p>Uploading: {uploadProgress}%</p>}
                    {/* <div className="flex flex-wrap gap-2 mt-2">
                        {attachments.map((attachment) => (
                            <div key={attachment.mediaId} className="relative">
                                <img src={attachment.url} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                                <Button variant="ghost" onClick={() => removeAttachment(attachment.mediaId)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div> */}
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        onClick={onSubmit}
                        loading={isSubmitting || isUploading}
                        className="bg-primary text-white"
                    >
                        Update Product
                    </LoadingButton>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductDialog;

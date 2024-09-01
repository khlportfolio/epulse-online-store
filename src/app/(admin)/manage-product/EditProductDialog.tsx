// "use client"

// import { EditorContent, useEditor } from "@tiptap/react"
// import StarterKit from "@tiptap/starter-kit"
// import Placeholder from "@tiptap/extension-placeholder"
// import { ProductData } from "@/lib/types"
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import LoadingButton from "@/components/LoadingButton"
// import { Button } from "@/components/ui/button"
// import { useUpdateProductMutation } from "./mutations"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useState, useEffect } from "react"

// interface EditProductDialogProps {
//     productContent: ProductData
//     open: boolean
//     onClose: () => void
//     categoryId: string
// }

// interface CategoryProps {
//     id: string,
//     name: string
// }

// const EditProductDialog = ({ productContent, open, onClose, categoryId }: EditProductDialogProps) => {
//     const mutation = useUpdateProductMutation(categoryId)
//     const [categories, setCategories] = useState<CategoryProps[]>([]);
//     const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

//     useEffect(() => {
//         async function fetchCategories() {
//             const response = await fetch('/api/category/all');
//             const data = await response.json();
//             setCategories(data);
//         }
//         fetchCategories();
//     }, []);

//     const handleCategoryChange = (value: string) => {
//         setSelectedCategory(value);
//     };

//     // Editor for title
//     const titleEditor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 bold: false,
//                 italic: false,
//             }),
//             Placeholder.configure({
//                 placeholder: "Enter title...",
//             }),
//         ],
//     });

//     const priceEditor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 bold: false,
//                 italic: false,
//             }),
//             Placeholder.configure({
//                 placeholder: "Enter price...",
//             }),
//         ],
//     });

//     const featuresEditor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 bold: false,
//                 italic: false,
//             }),
//             Placeholder.configure({
//                 placeholder: "Enter features...",
//             }),
//         ],
//     });

//     const materialsEditor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 bold: false,
//                 italic: false,
//             }),
//             Placeholder.configure({
//                 placeholder: "Enter materials...",
//             }),
//         ],
//     });

//     const summaryEditor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 bold: false,
//                 italic: false,
//             }),
//             Placeholder.configure({
//                 placeholder: "Enter summary...",
//             }),
//         ],
//     });

//     const detailsSizeEditor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 bold: false,
//                 italic: false,
//             }),
//             Placeholder.configure({
//                 placeholder: "Enter details size...",
//             }),
//         ],
//     });

//     // Get content from editors
//     const title = titleEditor?.getText({
//         blockSeparator: "\n",
//     }) || "";

//     const price = priceEditor?.getText({
//         blockSeparator: "\n",
//     }) || "";

//     const features = featuresEditor?.getText({
//         blockSeparator: "\n",
//     }) || "";

//     const materials = materialsEditor?.getText({
//         blockSeparator: "\n",
//     }) || "";

//     const summary = summaryEditor?.getText({
//         blockSeparator: "\n",
//     }) || "";

//     const detailsSize = detailsSizeEditor?.getText({
//         blockSeparator: "\n",
//     }) || "";

//     async function onSubmit() {
//         mutation.mutate({ id: productContent.id, title, price, categoryId: selectedCategory || "", features, materials, summary, detailsSize }, {
//             onSuccess: () => {
//                 titleEditor?.commands.clearContent();
//                 priceEditor?.commands.clearContent();
//                 featuresEditor?.commands.clearContent();
//                 materialsEditor?.commands.clearContent();
//                 summaryEditor?.commands.clearContent();
//                 detailsSizeEditor?.commands.clearContent();
//                 onClose()
//             }
//         })
//     }

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Edit Product</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                         <h2 className="text-base mb-2">Title</h2>
//                         <EditorContent
//                             editor={titleEditor}
//                             className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
//                         />
//                     </div>
//                     <div>
//                         <h2 className="text-base mb-2">Price</h2>
//                         <EditorContent
//                             editor={priceEditor}
//                             className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
//                         />
//                     </div>
//                     <div>
//                         <h2 className="text-base mb-2">Category</h2>
//                         <Select onValueChange={handleCategoryChange}>
//                             <SelectTrigger className="w-full bg-background border border-muted-foreground rounded-2xl">
//                                 <SelectValue placeholder="Select a category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {categories.map((category) => (
//                                     <SelectItem key={category.id} value={category.id}>
//                                         {category.name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <h2 className="text-base mb-2">Features</h2>
//                         <EditorContent
//                             editor={featuresEditor}
//                             className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
//                         />
//                     </div>
//                     <div>
//                         <h2 className="text-base mb-2">Material</h2>
//                         <EditorContent
//                             editor={materialsEditor}
//                             className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
//                         />
//                     </div>
//                     <div>
//                         <h2 className="text-base mb-2">Details Size</h2>
//                         <EditorContent
//                             editor={detailsSizeEditor}
//                             className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
//                         />
//                     </div>
//                     <div>
//                         <h2 className="text-base mb-2">Summary</h2>
//                         <EditorContent
//                             editor={summaryEditor}
//                             className="w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-2 border border-muted-foreground"
//                         />
//                     </div>
//                 </div>
//                 <DialogFooter>
//                     <LoadingButton onClick={onSubmit} loading={mutation.isLoading} disabled={!title.trim()} className="min-w-20">
//                         Save Changes
//                     </LoadingButton>
//                     <Button variant="outline" onClick={onClose} disabled={mutation.isLoading}>
//                         Cancel
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default EditProductDialog

const EditProductDialog = () => {
    return (
        <div>EditProductDialog</div>
    )
}

export default EditProductDialog
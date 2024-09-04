import { validateRequest } from "@/auth";
import { getCartItems } from "./actions";
import CartItemsList from "./CartItemList";

const CartPage = async () => {
    const cartItems = await getCartItems();
    const { user } = await validateRequest()

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <h2 className="text-2xl font-semibold">Keranjangmu kosong</h2>
                <p className="mt-2 text-lg">Cari produk terlebih dahulu dan tambahkan ke keranjang</p>
            </div>
        );
    }

    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-primary mb-6">Keranjang Belanja mu</h1>
            {/* Pass cart items to the client component */}
            <CartItemsList
                cartItems={cartItems}
                totalPrice={totalPrice}
                username={user?.username} // Ganti dengan nilai username yang sesuai
            />
        </div>
    );
};

export default CartPage;

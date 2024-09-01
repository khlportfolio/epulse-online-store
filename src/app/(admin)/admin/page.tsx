const Page = () => {
    return (
        <section className="bg-gray-100">
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-primary mb-6">
                    Welcome to Epuise Admin Dashboard
                </h1>
                <p className="text-gray-700 mb-6">
                    As an admin, you have access to manage all aspects of the Epuise online store. Here, you can oversee products, manage orders, and customize your store to enhance the shopping experience for our customers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-primary mb-2">Product Management</h2>
                        <p className="text-gray-600 mb-4">
                            Add, edit, and delete products including shirts, hoodies, and more. Manage product details and categories to keep your inventory up-to-date.
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-primary mb-2">Order Management</h2>
                        <p className="text-gray-600 mb-4">
                            View and manage customer orders. Track order statuses, process returns, and handle customer inquiries.
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-primary mb-2">Store Settings</h2>
                        <p className="text-gray-600 mb-4">
                            Customize store settings including payment options, shipping methods, and store policies to provide a seamless shopping experience.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Getting Started</h2>
                    <p className="text-gray-700 mb-4">
                        Explore the admin dashboard to get familiar with the available features. Make use of the provided tools to efficiently manage your online store.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Page
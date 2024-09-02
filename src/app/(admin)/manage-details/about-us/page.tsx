import DialogAbout from "./DialogAbout";
import DataFetching from "./DataFetching";

const AboutUsPage = () => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-primary">Edit About Us Page</h1>
                <DialogAbout />
            </div>
            <div className="container mx-auto py-10">
                <DataFetching />
            </div>
        </div>
    );
};

export default AboutUsPage;

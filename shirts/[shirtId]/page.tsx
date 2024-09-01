import AddToBagButton from "@/components/AddToBagButton";
import AddToWhislistButton from "@/components/AddToWhislistButton";
import SizeButton from "@/components/SizeButton";
import { SizeProduct } from "@/utils";
import DetailImagePicker from "./DetailImagePicker";

interface PageProps {
  params: { shirtId: string }
}

const Page = ({ params: { shirtId } }: PageProps) => {
  const mainImage = require('../../../../assets/signup-image.jpg');
  const thumbnailImages = [
    require('../../../../assets/login-image.jpg'),
    require('../../../../assets/man-short.jpg'),
    require('../../../../assets/heritage.jpg'),
    require('../../../../assets/heritage.jpg'),
  ];
  return (
    <section className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <DetailImagePicker
            mainImage={mainImage}
            thumbnailImages={thumbnailImages}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="max-sm:mx-auto max-sm:text-center">
            <h2 className="text-primary text-3xl font-bold">Heritage Pocket</h2>
            <h4 className="text-primary text-xl font-semibold">Rp. 150.000</h4>
          </div>
          <div className="max-sm:mx-auto max-sm:text-center">
            <h4 className="text-muted-foreground text-lg font-semibold">Select size</h4>
            <div className="flex flex-wrap gap-3 mt-2">
              {SizeProduct.map((s) => (
                <SizeButton key={s.size}>
                  {s.size}
                </SizeButton>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 max-sm:justify-center">
            <AddToBagButton>
              ADD TO BAG
            </AddToBagButton>
            <AddToWhislistButton>
              ADD TO WHISLIST
            </AddToWhislistButton>
          </div>
          <div>
            <h2 className="text-muted-foreground text-lg font-semibold mb-2">Details</h2>
            <hr className="border-muted-foreground border-t-2 w-16 mb-4" />
            <div className="space-y-4">
              <h3 className="text-muted-foreground text-base font-medium">Heritage Pocket</h3>
              <h3 className="text-muted-foreground text-base font-medium">Material: <span className="font-normal">Bahan CVC</span></h3>
              <div>
                <h4 className="text-muted-foreground text-base font-medium">Fitur:</h4>
                <ul className="text-muted-foreground list-disc list-inside">
                  <li>Mudah disetrika</li>
                  <li>Ukuran pas badan</li>
                </ul>
              </div>
              <div>
                <h4 className="text-muted-foreground text-base font-medium">Ringkasan:</h4>
                <ul className="text-muted-foreground list-disc list-inside">
                  <li>Material CVC dengan sentuhan halus dan tidak mudah kusut</li>
                  <li>Fit modern untuk tampilan smart casual dan ukuran pas badan.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-muted-foreground text-base font-medium">Table Ukuran:</h4>
                <h4 className="text-muted-foreground text-base font-medium">Panjang Badan x Lebar Dada x Lebar Bahu</h4>
                <ul className="text-muted-foreground list-disc list-inside">
                  <li>XS: 70,5cm x 48,5cm x 38,5cm</li>
                  <li>S: 72cm x 51cm x 41cm</li>
                  <li>M: 73,5cm x 53,5cm x 43,5cm</li>
                  <li>L: 75cm x 56m x 46cm</li>
                  <li>XL: 76,5cm x 58,5m x 48,6cm</li>
                  <li>XXL: 78cm x 61m x 51cm</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page
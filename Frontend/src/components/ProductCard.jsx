import React from 'react';
import { Link } from 'react-router-dom';
import SliderComponent from './SliderComponent';

function ProductCard({ productName, price, imageUrls, sizes, currency = "INR", id }) {
    return (
        <div className="bg-white overflow-hidden">
            {/* Product Image Carousel */}
            <div className="relative w-full mx-2 h-96 md:h-96 mb-12 xl:h-[26rem]  ">
                <SliderComponent imageUrls={imageUrls} />
            </div>

            {/* Product Details */}
            <div className="p-4 mt-5">
                <h3 className="text-sm text-secondary">{productName}</h3>
                <p className="text-sm font-body text-secondary">{currency + " " + price}</p>
                {/* Available Sizes */}
                <div className="flex flex-wrap gap-2">
                    {sizes && sizes.map((size) => (
                        <Link
                            to={`/products/${id}`}
                            key={size}
                            className="text-secondary hover:text-tertery text-sm rounded-lg"
                        >
                            {size}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;

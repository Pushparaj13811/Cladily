import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productNavLink } from '../constants/constants';
import LinkSlider from '../components/LinkSlider';
import { products } from "../constants/constants";

function Product() {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState(products.slice(0, 10));
    const productsPerPage = 10;
    const maxPagesToShow = 3;

    let showProductNav = "hidden";
    let showProductInHomepage = "hidden";
    let showProductInProductPage = "p-4 grid grid-cols-1 lg:mx-40  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-6";
    let showPagination = "hidden sm:flex justify-center p-4";

    if (location.pathname === "/") {
        showProductNav = "flex justify-center";
        showProductInHomepage = "p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4";
        showProductInProductPage = "hidden";
        showPagination = "hidden";
    }

    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageScroll = (pageNumber) => {
        setCurrentPage(pageNumber);
        setDisplayedProducts(products.slice((0), pageNumber * productsPerPage));
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setDisplayedProducts(products.slice((pageNumber - 1) * productsPerPage, pageNumber * productsPerPage))

    }

    const getPaginationButtons = () => {
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const half = Math.floor(maxPagesToShow / 2);
            if (currentPage <= half) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage + half >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - half;
                endPage = currentPage + half;
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    };

    const paginationButtons = getPaginationButtons();

    // Infinite Scroll Handler
    const loadMoreProducts = useCallback(() => {
        if (loading) return;
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;

        setLoading(true);
        setTimeout(() => {
            if (currentPage < totalPages) {
                const nextPage = currentPage + 1;
                handlePageScroll(nextPage);
                setCurrentPage(nextPage);
            }
            setLoading(false);
        }, 500);
    }, [loading, currentPage, totalPages]);

    useEffect(() => {
        if (window.innerWidth <= 640) {
            window.addEventListener('scroll', loadMoreProducts);
        }
        return () => {
            window.removeEventListener('scroll', loadMoreProducts);
        };
    }, [loadMoreProducts]);

    return (
        <div>
            <h1 className="text-4xl font-bold font-heading text-secondary text-center p-4">Our Products</h1>

            {/* Product Navigation */}
            <div className={`text-center text-secondary ${showProductNav}`}>
                <LinkSlider navLinks={productNavLink} />
            </div>

            {/* Product Grid for homepage */}
            <div className={`${showProductInHomepage}`}>
                {products.slice(0, 5).map(product => (
                    <ProductCard
                        key={product.id}
                        productName={product.name}
                        price={product.price}
                        imageUrls={product.imageUrls}
                        sizes={product.sizes}
                        id={product.id}
                    />
                ))}
            </div>

            {/* Product Grid for products page */}
            <div className={`${showProductInProductPage}`}>
                {displayedProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        productName={product.name}
                        price={product.price}
                        imageUrls={product.imageUrls}
                        sizes={product.sizes}
                        id={product.id}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className={`${showPagination}`}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-secondary'}`}
                >
                    &laquo;
                </button>
                {paginationButtons.map(pageNumber => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 mx-1 rounded-md ${currentPage === pageNumber ? 'bg-secondary text-primary' : 'bg-primary text-secondary'}`}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-secondary'}`}
                >
                    &raquo;
                </button>
            </div>

            {/* Conditionally render the "View More" button */}
            {location.pathname === "/" && products.length > 5 && (
                <div className="text-center p-4">
                    <Link
                        to="/products"
                        className="bg-secondary text-primary px-4 py-2 rounded"
                    >
                        View More
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Product;

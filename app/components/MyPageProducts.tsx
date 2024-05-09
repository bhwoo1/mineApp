import React, { useEffect, useState } from "react";
import { ProductInfo } from "../Type";
import axios from "axios";
import ProductBlock2 from "./Layout/ProductBlock2";
import Link from "next/link";

type Prop = {
    ids: string[]
}

const MyPageProducts = (props: Prop) => {
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(2); // 한 페이지에 표시할 상품의 수

    useEffect(() => {
        if (Array.isArray(props.ids)) {
            const fetchProducts = async () => {
                let fetchedProducts: ProductInfo[] = [];

                // props.ids의 각 요소에 대해 작업을 수행
                for (const id of props.ids) {
                    const formData = new FormData();
                    formData.append("auctionid", id);

                    try {
                        const res = await axios.post("http://localhost:8080/auctionboardread", formData, {
                            withCredentials: true
                        });
                        const product = res.data;
                        fetchedProducts.push(product);
                    } catch (error) {
                        console.log(error);
                    }
                }

                setProducts(fetchedProducts);
            };

            fetchProducts();
        }
    }, [props.ids]); // props.ids가 변경될 때마다 useEffect 내의 작업을 수행

    // 현재 페이지의 상품 목록 계산
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = products.slice(startIndex, endIndex);

    // 페이지 변경 핸들러
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                {currentProducts.map((product) => (
                    <Link href={`/product/${product.auctionid}`} key={product.auctionid} passHref>
                        <ProductBlock2 product={product} />
                    </Link>
                ))}
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(products.length / pageSize) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 py-1 px-3 border rounded ${currentPage === index + 1 ? "bg-gray-300" : ""}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MyPageProducts;
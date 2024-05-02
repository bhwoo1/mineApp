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

    useEffect(() => {
        if (Array.isArray(props.ids)) {
        const fetchProducts = async () => {

            // props.ids의 각 요소에 대해 작업을 수행
            for (const id of props.ids) {
                const formData = new FormData();
                formData.append("auctionid", id);

                axios.post("http://localhost:8080/auctionboardread", formData, {
                    withCredentials: true
                })
                .then((res) => {
                    const product = res.data;
                    setProducts(prevProducts => [...prevProducts, product]);
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        };

        fetchProducts();
        }
    }, [props.ids]); // props.ids가 변경될 때마다 useEffect 내의 작업을 수행

    return (
        <div className="grid grid-cols-2 gap-2">
            {products.map((product) => (
                <Link href={`/product/${product.auctionid}`} key={product.auctionid} passHref>
                    <ProductBlock2 product={product} />
                </Link>
            ))}
        </div>
    );
}

export default MyPageProducts;
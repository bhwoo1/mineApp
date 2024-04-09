"use client"

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductInfo } from "../Type";



const ProductList = () => {
    const [products, setProducts] = useState<ProductInfo[]>([]);


    useEffect(() => {
        async function fetchAuctions() {
              await axios.get('http://localhost:8080/auctionread', {
                withCredentials: true
              })
              .then((res) => {
                  setProducts(res.data);
                  console.log(res.data);
              })
              .catch((err) => {
                console.log(err);
              })
            }
          fetchAuctions();
    }, []);

    return(
        <div className="grid grid-cols-2 gap-5">
          {products.map((product) => (
            <Link href={`/product/${product.auctionid}`} key={product.auctionid} passHref>
              <div className={`p-4 hover:shadow-lg rounded-lg mt-4 hover:border-t-2 border-t-2 cursor-pointer`} key={product.auctionid} >
                {product.auctionfirsturl ? 
                    <div className="flex flex-col justify-center items-center">
                      <Image src={"http://localhost:8080/" + product.auctionfirsturl} alt='product_image' width={150} height={150}/> 
                    </div>
                  : 
                    <p>이미지 없음</p>
                }
                <p className='text-xl font-semibold'>{product.auctiontitle}</p>
                <p className='text-gray-600'>{product.auctionprice} 원</p>
                <p className='text-gray-500'>{product.auctionendtime}</p>
              </div>
            </Link>
          ))}
        </div>
    );

}

export default ProductList;
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
              // const response = await fetch('http://localhost:8080/auctionread', {
              //   method: 'GET',
              //   credentials: 'include', // 쿠키를 서버로 전송
              // });
              // if (response.ok) {
              //   const data = await response.json();
              //   setPosts(data);
              //   console.log(posts);
              // }
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
        <div>
          {products.map((product) => (
            <Link href={`/product/${product.auctionid}`} key={product.auctionid} passHref>
              <div className={`p-4 hover:shadow-lg rounded-lg mt-4 hover:border-t-2 border-t-2 cursor-pointer`} key={product.auctionid} 
                onClick={() => {
                  alert(product.auctionfirsturl);
                }}
              >
                {product.auctionfirsturl ? <Image src={"/" + product.auctionfirsturl} alt='product_image' width={50} height={50}/> : <p>이미지 없음</p>}
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
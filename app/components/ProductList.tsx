"use client"

import React from "react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductInfo } from "../Type";
import { useRecoilValue } from "recoil";
import { CategoryAtom } from "../recoil/RecoilContext";
import ProductBlock from "./Layout/ProductBlock";
import { useSession } from "next-auth/react";


const ProductList:React.FC = () => {
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const selectedCategory = useRecoilValue(CategoryAtom);
    const {data: session} = useSession();


    useEffect(() => {

        async function fetchAuctions() {
          if(selectedCategory === "all") {
            await axios.post('http://localhost:8080/auctionread', {
                withCredentials: true
              })
              .then((res) => {
                  setProducts(res.data);
              })
              .catch((err) => {
                console.log(err);
              })
          }
          else {
            await axios.get('http://localhost:8080/categorysearch', {
              params: {
                auctioncategory : selectedCategory
              },
              withCredentials: true
            })
            .then((res) => {
              setProducts(res.data);
            })
            .catch((err) => {
              console.log(err);
            })
          }
              
        }
        fetchAuctions();
    }, [selectedCategory]);

    return(
        <div className="mb-96">
          {products.length === 0 ? 
              <div className="flex flex-col justify-center items-center pt-12">
                <p className="font-bold text-xl">등록된 상품이 없습니다.</p>
              </div>
            :
            <div className="grid lg:grid-cols-4 gap-5 sm:grid-cols-2">
              {products.map((product) => (
                <Link href={`/product/${product.auctionid}`} key={product.auctionid} passHref>
                  <ProductBlock product={product} />
                </Link>
              ))}
            </div>
          }
        </div>
    );

}

export default ProductList;
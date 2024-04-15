"use client"

import { ProductInfo } from "@/app/Type";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MainBar from "@/app/components/Layout/MainBar";
import ProductBlock from "@/app/components/Layout/ProductBlock";
import { useRecoilState } from "recoil";
import { SearchAtom } from "@/app/recoil/RecoilContext";

const SearchPage = (props: {
    params: {
        selectedSearchCategory: string,
        encodedKeyword: string
}}) => {
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const [searchKeyword, setSearchKeyword] = useRecoilState(SearchAtom);
    
    useEffect(() => {
        console.log(decodeURIComponent(props.params.encodedKeyword))

        async function fetchAuctions() {
            if (props.params.selectedSearchCategory === "title") {
                await axios.get('http://localhost:8080/titlesearch', {
                    params: {
                        auctiontitle: decodeURIComponent(props.params.encodedKeyword)
                    },
                    withCredentials: true
                })
                .then((res) => {
                    setProducts(res.data);
                    console.log(res.data);
                    setSearchKeyword("");
                })
                .catch((err) => {
                    console.log(err);
                })
            }
            else if (props.params.selectedSearchCategory === "content") {
                await axios.get('http://localhost:8080/contentsearch', {
                    params: {
                        auctioncontent: decodeURIComponent(props.params.encodedKeyword)
                    },
                    withCredentials: true
                })
                .then((res) => {
                    setProducts(res.data);
                    console.log(res.data);
                    setSearchKeyword("");
                })
                .catch((err) => {
                    console.log(err);
                })
            }
            else {
                await axios.get('http://localhost:8080/bothsearch', {
                    params: {
                        auctionkeyword: decodeURIComponent(props.params.encodedKeyword)
                    },
                    withCredentials: true
                })
                .then((res) => {
                    setProducts(res.data);
                    console.log(res.data);
                    setSearchKeyword("");
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        }



        fetchAuctions();
    }, []);
    

    return(
        <main className="flex flex-col justify-between items-center pt-24 mt-4">
            <MainBar />
            <p className="pt-4">검색 된 상품의 갯수 : {products.length}</p>
            {products.length === 0 ? 
              <div className="flex flex-col justify-center items-center pt-12 mb-96">
                <p className="font-bold text-xl">등록된 상품이 없습니다.</p>
              </div>
            :
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5 mb-96">
              {products.map((product) => (
                <Link href={`/product/${product.auctionid}`} key={product.auctionid} passHref>
                  <ProductBlock product={product} />
                </Link>
              ))}
            </div>
          }
        </main>
    );
}

export default SearchPage;
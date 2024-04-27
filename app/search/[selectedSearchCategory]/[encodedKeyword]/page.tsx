"use client"

import { Product, ProductInfo } from "@/app/Type";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MainBar from "@/app/components/Layout/MainBar";
import ProductBlock from "@/app/components/Layout/ProductBlock";
import { useRecoilState } from "recoil";
import { SearchAtom } from "@/app/recoil/RecoilContext";
import ProductList from "@/app/components/ProductList";

const SearchPage = (props: {
    params: {
        selectedSearchCategory: string,
        encodedKeyword: string
}}) => {
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const [searchKeyword, setSearchKeyword] = useRecoilState(SearchAtom);
    const decodeKeyword = decodeURIComponent(props.params.encodedKeyword);
    
    useEffect(() => {
        console.log(decodeURIComponent(props.params.encodedKeyword));
        

        async function fetchAuctions() {
            if (props.params.selectedSearchCategory === "title") {
                await axios.get('http://localhost:8080/titlesearch', {
                    params: {
                        auctiontitle: decodeKeyword
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
                        auctioncontent: decodeKeyword
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
                        auctionkeyword: decodeKeyword
                    },
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
        }



        fetchAuctions();
    }, [decodeKeyword]);
    

    return(
        <main className="flex flex-col justify-between items-center pt-24 mt-4">
            <MainBar />
            <p className="pt-4">검색어 : {decodeKeyword}</p>
            <ProductList products={products} />
        </main>
    );
}

export default SearchPage;
"use client"
import { ProductInfo } from "@/app/Type";
import MainBar from "@/app/components/Layout/MainBar";
import ProductList from "@/app/components/ProductList";
import axios from "axios";
import { useEffect, useState } from "react";

const CategoryPage = (props: {
    params: {
        selectedCategory: string,
        selectedSearchCategory: string,
        searchKeyword: string
    }
}) => {
    const decodeCategory = decodeURIComponent(props.params.selectedCategory);
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const decodeKeyword = decodeURIComponent(props.params.searchKeyword);

    useEffect(() => {
        async function fetchAuctions() {
            try {
              let response;
              if (props.params.selectedCategory === "title") {
                response = await axios.get("http://localhost:8080/categorysearch", {
                  params: {
                    auctioncategory: decodeCategory,
                    auctiontitle: decodeKeyword
                  },
                  withCredentials: true,
                });
              }
              else if (props.params.selectedSearchCategory === "content") {
                response = await axios.get("http://localhost:8080/categorysearch", {
                  params: {
                    auctioncategory: decodeCategory,
                    auctioncontent: decodeKeyword
                  },
                  withCredentials: true,
                });
              }
              else {
                response = await axios.get("http://localhost:8080/categorysearch", {
                  params: {
                    auctioncategory: decodeCategory,
                    auctionkeyword: decodeKeyword
                  },
                  withCredentials: true,
                });
              }
              setProducts(response.data);
              console.log(response.data);           
            } catch (error) {
              console.log(error);
          }
        }
        fetchAuctions();
    }, [decodeCategory, decodeKeyword]);


    return(
        <main className="flex flex-col items-center justify-between pt-24 mt-4">
            <MainBar/>
            <p className="pt-4">검색어 : {decodeKeyword}</p>
            <ProductList products={products} />
        </main>
    );
}


export default CategoryPage;
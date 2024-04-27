"use client"
import { useEffect, useState } from "react";
import MainBar from "../components/Layout/MainBar";
import ProductList from "../components/ProductList";
import { ProductInfo } from "../Type";
import axios from "axios";

const CategoryPage = (props: {
    params: {
        selectedCategory: string
    }
}) => {
    const decodeCategory = decodeURIComponent(props.params.selectedCategory);
    const [products, setProducts] = useState<ProductInfo[]>([]);

    useEffect(() => {
        async function fetchAuctions() {
          try {
            const response = await axios.get("http://localhost:8080/categorysearch", {
                params: {
                  auctioncategory: decodeCategory,
                },
                withCredentials: true,
              });
              setProducts(response.data);
              console.log(response.data)
              
            } catch (error) {
            console.log(error);
        }
      }
      fetchAuctions();
    }, [decodeCategory]);

    return(
        <main className="flex flex-col items-center justify-between pt-24 mt-4">
            <MainBar />
            <ProductList products={products}/>
        </main>
    );
}


export default CategoryPage;
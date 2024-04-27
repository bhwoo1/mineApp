"use client"

import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { ProductInfo } from "../Type";
import ProductBlock from "./Layout/ProductBlock";


type Props = {
  products: ProductInfo[]
}


const ProductList:React.FC<Props> = (props:Props) => {
  const [sortedProducts, setSortedProducts] = useState<ProductInfo[]>(props.products);

  useEffect(() => {
    // props.products가 변경될 때마다 sortedProducts를 업데이트합니다.
    const sortedByRecent = [...props.products].sort((a, b) => {
      return new Date(b.auctiontime).getTime() - new Date(a.auctiontime).getTime();
    });
    setSortedProducts(sortedByRecent);
  }, [props.products]); // props.products가 변경될 때마다 실행되도록 설정합니다.


    const sortedOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const sortedOption = event.target.value;
      if (sortedOption === "recent") {
        const sortedByRecent = [...props.products].sort((a, b) => {
          return new Date(b.auctiontime).getTime() - new Date(a.auctiontime).getTime();
        });
        setSortedProducts(sortedByRecent);
      } else if (sortedOption === "deadline") {
        const sortedByDeadline = [...props.products].sort((a, b) => {
          return new Date(a.auctionendtime).getTime() - new Date(b.auctionendtime).getTime();
        });
        setSortedProducts(sortedByDeadline);
      } else if (sortedOption === "lower") {
        const sortedByLowerPrice = [...props.products].sort((a, b) => Number(a.auctionbidprice) - Number(b.auctionbidprice));
        setSortedProducts(sortedByLowerPrice);
      } else if (sortedOption === "higher") {
        const sortedByHigherPrice = [...props.products].sort((a, b) => Number(b.auctionbidprice) - Number(a.auctionbidprice));
        setSortedProducts(sortedByHigherPrice);
      }

    };


    return (
      <div className="mb-96">
        <p className="pt-4 text-center">등록된 상품 : {props.products.length} 개</p>
        
        {props.products.length === 0 ? (
          <div className="flex flex-col justify-center items-center pt-12">
            <p className="font-bold text-xl">등록된 상품이 없습니다.</p>
          </div>
        ) : (
          <div>
            <select className="border rounded-md py-1 px-2" onChange={sortedOptionChange}>
                <option value="recent" selected>최신순</option>
                <option value="deadline">마감 임박순</option>
                <option value="lower">낮은 가격순</option>
                <option value="higher">높은 가격순</option>
            </select>
            <div className="grid lg:grid-cols-4 gap-5 sm:grid-cols-2">
              {sortedProducts.map((product) => (
                <Link href={`/product/${product.auctionid}`} key={product.auctionid} passHref>
                  <ProductBlock product={product} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );

}

export default ProductList;
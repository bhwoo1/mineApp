"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ProductInfo } from "../Type";
import { useRecoilState } from "recoil";
import { CategoryAtom } from "../recoil/RecoilContext";
import ProductBlock from "./Layout/ProductBlock";

const PAGE_SIZE = 8; // 한 페이지에 표시할 상품의 수

const AuctionList: React.FC = () => {
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useRecoilState(CategoryAtom);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setSelectedCategory("all");
    async function fetchAuctions() {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8080/auctionread", {
          withCredentials: true,
        });
        const sortedByRecent = response.data.sort((a: ProductInfo, b: ProductInfo) => {
          return new Date(b.auctiontime).getTime() - new Date(a.auctiontime).getTime();
        });
        setProducts(sortedByRecent);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => setLoading(false), 500); // After 5 seconds, set loading to false
      }
    }
    fetchAuctions();
  }, []);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sortedOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortedOption = event.target.value;
    if (sortedOption === "recent") {
      const sortedByRecent = [...products].sort((a, b) => new Date(b.auctiontime).getTime() - new Date(a.auctiontime).getTime());
      setProducts(sortedByRecent);
    } else if (sortedOption === "deadline") {
      const sortedByDeadline = [...products].sort((a, b) => new Date(a.auctionendtime).getTime() - new Date(b.auctionendtime).getTime());
      setProducts(sortedByDeadline);
    } else if (sortedOption === "lower") {
      const sortedByLowerPrice = [...products].sort((a, b) => Number(a.auctionbidprice) - Number(b.auctionbidprice));
      setProducts(sortedByLowerPrice);
    } else if (sortedOption === "higher") {
      const sortedByHigherPrice = [...products].sort((a, b) => Number(b.auctionbidprice) - Number(a.auctionbidprice));
      setProducts(sortedByHigherPrice);
    }
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="mb-96">
      <p className="pt-4 text-center">등록된 상품 : {products.length} 개</p>
      {loading ? (
        <div className="flex flex-col justify-center items-center pt-12">
          <p className="font-bold text-xl">Loading...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col justify-center items-center pt-12">
          <p className="font-bold text-xl">등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div>
          <select className="border rounded-md py-1 px-2" onChange={sortedOptionChange}>
            <option value="recent">최신순</option>
            <option value="deadline">마감 임박순</option>
            <option value="lower">낮은 가격순</option>
            <option value="higher">높은 가격순</option>
          </select>
          <div className="grid lg:grid-cols-4 gap-5 sm:grid-cols-2">
            {currentProducts.map((product) => (
              <Link href={`/product/${product.auctionid}`} key={product.auctionid} passHref>
                <ProductBlock product={product} />
              </Link>
            ))}
          </div>
          {/* 페이지네이션 컴포넌트 */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
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
      )}
    </div>
  );
};

export default AuctionList;
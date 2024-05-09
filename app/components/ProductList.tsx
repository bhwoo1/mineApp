import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProductInfo } from "../Type";
import ProductBlock from "./Layout/ProductBlock";

type Props = {
  products: ProductInfo[];
};

const PAGE_SIZE = 8; // 한 페이지에 표시할 상품의 수

const ProductList: React.FC<Props> = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [sortedProducts, setSortedProducts] = useState<ProductInfo[]>([]);

  useEffect(() => {
    setCurrentPage(1); // 상품이 변경될 때마다 첫 번째 페이지로 설정
     // props.products가 변경될 때마다 sortedProducts를 업데이트합니다.
     const sortedByRecent = [...props.products].sort((a, b) => {
      return new Date(b.auctiontime).getTime() - new Date(a.auctiontime).getTime();
    });
    setSortedProducts(sortedByRecent);
  }, [props.products]);

  const totalPages = Math.ceil(props.products.length / PAGE_SIZE); // 전체 페이지 수 계산

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sortedOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortedOption = event.target.value;
    const sortedProducts = [...props.products]; // 정렬에 영향을 미치지 않도록 원본 상품 목록을 복사
    if (sortedOption === "recent") {
      sortedProducts.sort((a, b) => new Date(b.auctiontime).getTime() - new Date(a.auctiontime).getTime());
    } else if (sortedOption === "deadline") {
      sortedProducts.sort((a, b) => new Date(a.auctionendtime).getTime() - new Date(b.auctionendtime).getTime());
    } else if (sortedOption === "lower") {
      sortedProducts.sort((a, b) => Number(a.auctionbidprice) - Number(b.auctionbidprice));
    } else if (sortedOption === "higher") {
      sortedProducts.sort((a, b) => Number(b.auctionbidprice) - Number(a.auctionbidprice));
    }
    setSortedProducts(sortedProducts);

    console.log(sortedProducts);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className="mb-96">
      <p className="pt-4 text-center">등록된 상품 : {props.products.length} 개</p>
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
    </div>
  );
};

export default ProductList;
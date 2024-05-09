import React from "react";
import Image from "next/image";
import { ProductInfo } from "@/app/Type";
import { convertToKoreanTime } from "@/app/AuctionFunctions";

type Prop = {
    product: ProductInfo
}

const ProductBlock2 = ({ product }: Prop) => {
    const endtime = convertToKoreanTime(String(product?.auctionendtime));

    return (
        <div className="flex border p-4 mt-4 cursor-pointer h-44 w-96 bg-white relative">
            {product.auctionfirsturl ? (
                <div className="border mr-4 w-44 h-full">
                    <Image src={"http://localhost:8080/" + product.auctionfirsturl} alt="product_image" width={200} height={150} />
                </div>
            ) : (
                <p>이미지 없음</p>
            )}
            <div className="flex flex-col justify-center">
                <p className="text-xl font-semibold">{product.auctiontitle}</p>
                <p className="text-gray-600">{product.auctionbidprice} 원</p>
                <p className="text-gray-500">{`${endtime.year}년 ${endtime.month}월 ${endtime.day}일 ${endtime.dayOfWeek}요일 ${endtime.hour}시 ${endtime.minute}분`}</p>
                <p className="text-gray-600 text-sm">카테고리: {product.auctioncategory}</p>
                <p className="text-gray-500 pt-4 text-sm">판매자: {product.auctionusername}</p>
                {product.auctioncomplete && <p className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1">마감</p>}
            </div>
        </div>
    );
}

export default ProductBlock2;
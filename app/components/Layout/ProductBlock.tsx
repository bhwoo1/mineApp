import React from "react";
import Image from "next/image";
import { ProductInfo } from "@/app/Type";
import { convertToKoreanTime } from "@/app/AuctionFunctions";

type Prop = {
    product: ProductInfo
}

const ProductBlock= ({product}: Prop) => {
    const endtime = convertToKoreanTime(String(product?.auctionendtime));

    return(
        <div className={`p-4 mt-4 border-2 justify-center items-center cursor-pointer w-96 h-96 flex flex-col bg-white`} >
                    <div className="flex justify-center border-2 mb-4 w-80 h-44">
                      {product.auctionfirsturl ? 
                            <Image src={"http://localhost:8080/" + product.auctionfirsturl} alt='product_image' width={200} height={150}/> 
                        : 
                          <p>이미지 없음</p>
                      }
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className='text-xl font-semibold'>{product.auctiontitle}</p>
                      <p className='text-gray-600'>{product.auctionbidprice} 원</p>
                      <p className='text-gray-500'>{`${endtime.year}년 ${endtime.month}월 ${endtime.day}일 ${endtime.dayOfWeek}요일 ${endtime.hour}시 ${endtime.minute}분`}</p>
                      <p className='text-gray-600 text-sm'>카테고리: {product.auctioncategory}</p>
                      <p className='text-gray-500 pt-4 text-sm'>판매자: {product.auctionusername}</p>
                    </div>
                  </div>
    );
}

export default ProductBlock;
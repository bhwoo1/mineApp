"use client"

import React from "react";
import { CategoryAtom, SearchAtom, SearchCategoryAtom } from "@/app/recoil/RecoilContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";

const MainBar:React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useRecoilState(CategoryAtom);
    const [selectedSearchCategory, setSelectedSearchCategory] = useRecoilState(SearchCategoryAtom);
    const [searchKeyword, setSearchKeyword] = useRecoilState(SearchAtom);
    const router = useRouter()

    const categoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(event.target.value);
    }

    const serchCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedSearchCategory(event.target.value);
    }

    const searchBtnClick = () => {
      if(searchKeyword === "") {
        alert('검색어를 입력해주세요!');
      }
      else {
        const encodedKeyword = encodeURIComponent(searchKeyword);
        router.push(`/search/${selectedSearchCategory}/${encodedKeyword}`);
      }
    }

    return (
        <div className="w-full h-full bg-gray-200 p-4 flex flex-row justify-between">
          <div className="flex flex-row items-center mb-2 md:mb-0">
            <p className="pr-2">카테고리</p>
            <select className="border rounded-md py-1 px-2" value={selectedCategory} onChange={categoryChange}>
              <option value="all" selected>전체</option>
              <option value="의류">의류</option>
              <option value="전자기기">전자기기</option>
              <option value="유이">유아</option>
              <option value="취미/게임/음반">취미/게임/음반</option>
              <option value="스포츠/레저">스포츠/레저</option>
              <option value="식품">식품</option>
              <option value="주방용품">주방용품</option>
              <option value="반려동물">반려동물</option>
              <option value="티켓">티켓</option>
              <option value="미용">미용</option>
            </select>
          </div>
          <div className="flex flex-row items-center">
            <select className="border rounded-md py-1 px-2 mr-2" value={selectedSearchCategory} onChange={serchCategoryChange}>
              <option value="title" selected>제목</option>
              <option value="content">본문</option>
              <option value="title+content">제목+본문</option>
            </select>
            <input
              type="text"
              className="border rounded-md py-1 px-2 mr-2"
              placeholder="검색어를 입력하세요"
              id="searchKeyword" name="searchKeyword"
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-gray-600" onClick={searchBtnClick}>
              검색
            </button>
            <Link href="/productregi"><button className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-gray-600 ml-4">상품 등록</button></Link>
          </div>
        </div>
      );
}

export default MainBar;
"use client"

import { ProductInfo } from "@/app/Type";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MainBar from "@/app/components/Layout/MainBar";
import ProductBlock from "@/app/components/Layout/ProductBlock";
import { useRecoilState } from "recoil";
import { SearchUserAtom } from "@/app/recoil/RecoilContext";
import { MdOutlineCancel } from "react-icons/md";
import { useRouter } from "next/navigation";

const UserSearchPage = () => {
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const [searchUser, setSearchUser] = useRecoilState(SearchUserAtom);
    const router = useRouter();
    
     useEffect(() => {

        async function fetchAuctions() {
                await axios.get('http://localhost:8080/usernamesearch', {
                    params: {
                        auctionuser: searchUser.user
                    },
                    withCredentials: true
                })
                .then((res) => {
                    setProducts(res.data);
                    console.log(searchUser);
                })
                .catch((err) => {
                    console.log(err);
                })
            
        }



        fetchAuctions();
     }, []);


    const searchUserCancel = () => {
        setSearchUser({
            user: "",
            username: ""
        });
        router.push("/");
    }
    

    return(
        <main className="flex flex-col justify-between items-center pt-24 mt-4">
            <MainBar />
            <p className="pt-4">검색 된 상품의 갯수 : {products.length}</p>
            <button className="flex flex-row bg-gray-500 hover:bg-gray-700 items-center text-white font-bold py-2 px-4 rounded" onClick={searchUserCancel}>
                <p className="pr-4">{searchUser.username}</p>
                <MdOutlineCancel />
            </button>
            {products.length === 0 ? 
              <div className="flex flex-col justify-center items-center pt-12 mb-96">
                <p className="font-bold text-xl">Loading...</p>
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

export default UserSearchPage;
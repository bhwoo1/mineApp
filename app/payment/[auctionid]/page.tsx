"use client"
import { ProductInfo } from "@/app/Type";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Payment = (props: {
    params: {auctionid: number}
}) => {
    const [product, setProduct] = useState<ProductInfo | null>();
    const [loading, setLoading] = useState(true);
    const {data: session} = useSession(); 

    useEffect(() => {
        async function fetchAuctions() {
            try {
                const formData = new FormData();
                formData.append("auctionid", String(props.params.auctionid));
                const res = await axios.post('http://localhost:8080/auctionboardread', formData, {
                    withCredentials: true
                });
                if (res.data) {
                    setProduct(res.data);
                    console.log(res.data.auctionbidder)
                } else {
                    console.log("서버로부터 데이터를 수신하지 못했습니다");
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchAuctions();


        console.log(session?.user.email)

    }, []);


    const paymentComplete = () => {
        axios.get("http://localhost:8080/auctionpayment", {
            params: {
                auctionbidprice: product?.auctionbidprice,
                auctionid: product?.auctionid,
                auctionuser: product?.auctionuser 
            },
            withCredentials: true
        })
        .then((res) => {
            console.log(res);
            setTimeout(() => {
                alert("결제가 완료되었습니다.");
                window.opener.postMessage("paymentCompleted", "*"); // 결제가 완료되면 부모 창에 이벤트를 보냄
                window.close();
            }, 2000);
        })
        .catch((err) => {
            console.log(err);
            alert('실패하였습니다. 다시 시도해주십시오.')
        })
    };



    return (
        <main className="flex min-h-screen pt-24 items-center justify-center">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {product?.auctioncomplete ? 
                            <>
                                {product?.auctionbidder === session?.user.email ?
                                    <div className="flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg shadow-lg">
                                        <p className="text-3xl font-bold mb-4">Payment</p>
                                        <div className="flex flex-row items-center justify-center">
                                            <div className="relative w-44 h-44 overflow-hidden rounded-md">
                                                <img src={"http://localhost:8080/" + product?.auctionfirsturl} alt="thumbnail" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col ml-4">
                                                <p className="font-bold text-xl">{product?.auctiontitle}</p>
                                                <p className="text-lg mb-2">{product?.auctionbidprice} 원</p>
                                                <p className="text-sm mb-2">{product?.auctioncategory}</p>
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md" onClick={paymentComplete}>결제</button>
                                            </div>
                                        </div>
                                    </div>
                                :
                                    <div className="flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg shadow-lg">
                                        <p>잘못된 접근입니다.</p>
                                        <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md" onClick={() => window.close()}>뒤로가기</button>
                                    </div>
                                }
                            </>
                        :
                            <div className="flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg shadow-lg">
                                <p>잘못된 접근입니다.</p>
                                <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md" onClick={() => window.close()}>뒤로가기</button>
                            </div>
                    }
                </>
            )}
        </main>
    );
}


export default Payment;
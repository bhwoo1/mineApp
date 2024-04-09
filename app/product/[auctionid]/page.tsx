"use client"

import { ProductInfo } from "@/app/Type"
import axios from "axios"
import { useEffect, useState } from "react"
import Image from 'next/image'
import { useSession } from "next-auth/react"


const Product = (props: {
    params: {auctionid: number}
}) => {
    const [product, setProduct] = useState<ProductInfo>();
    const [selectedImage, setSelectedImage] = useState();
    const {data: session} = useSession();

    useEffect(() => {
        async function fetchAuctions() {
            // await axios.get('http://localhost:8080/auctionread', {
            //     params : {
            //         auctionid : props.params.auctionid
            //     },
            //     withCredentials: true
            // })
            // .then((res) => {
            //     setProduct(res.data);
            //     setSelectedImage(product.auctionfirsturl);
            // })
            // .catch((err) => {
            //   console.log(err);
            // })
            try {
                const res = await axios.get('http://localhost:8080/auctionread', {
                    params: {
                        auctionid: props.params.auctionid
                    },
                    withCredentials: true
                });
                if (res.data) {
                    console.log(res.data);
                    setProduct(res.data);
                    setSelectedImage(res.data.auctionfirsturl);
                } else {
                    console.log("서버로부터 데이터를 수신하지 못했습니다");
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchAuctions();
    }, [product]);

    return(
        <main className="flex min-h-screen flex-col items-center justify-between pt-24">
            {product ? 
                    <div>
                        {product?.auctionimageurl?.map((image, index) => (
                            <div key={index}>
                                <Image src={image} alt='product_image' width={150} height={150} />
                            </div>
                        ))}
                        <p className="font-bold">{product?.auctiontitle}</p>
                        <p>시작 시간 : {product?.auctiontime}</p>
                        <p>종료 시간 : {product?.auctionendtime}</p>
                        <p>현재 가격 : {product?.auctionprice}</p>
                        {product?.auctionuser === session?.user.email ?
                                <>
                                    <button>수정하기</button>
                                </>
                            :
                                <>
                                    <button>입찰하기</button>
                                </>
                        }
                        <p>{product?.auctioncontent}</p>
                    </div>
                : 
                    <div>
                        <p className="font-semibold">X</p>
                    </div>
            }
            
        </main>
    )
}


export default Product;
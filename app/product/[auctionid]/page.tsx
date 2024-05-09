"use client"

import React from "react";
import { ProductInfo } from "@/app/Type";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ImageModal from "@/app/components/Layout/ImageModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { convertToKoreanTime } from "@/app/AuctionFunctions";
import { SearchUserAtom } from "@/app/recoil/RecoilContext";
import { useRecoilState } from "recoil";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import Comment from "@/app/components/Layout/Comment";
import Countdown from "@/app/components/Countdown";


const Product = (props: {
    params: {auctionid: number}
}) => {
    const [product, setProduct] = useState<ProductInfo>();
    const [selectedImage, setSelectedImage] = useState<string>("");
    const {data: session} = useSession();
    const [modalMode, setModalMode] = useState<boolean>(false);
    const [modalImage, setModalImage] = useState<string>("");
    const [bidMode, setBidMode] = useState<boolean>(false);
    const router = useRouter();
    const [newBidPrice, setNewBidPrice] = useState(0);
    const [searchUser, setSearchUser] = useRecoilState(SearchUserAtom);
    const [scrapped, setScrapped] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState(false);

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
                    setSelectedImage(res.data.auctionfirsturl);
                    setSearchUser({
                        user: res.data.auctionuser,
                        username: res.data.auctionusername
                    });
                    console.log(res.data);
                    fetchComplete(res.data.auctionid, res.data.auctionendtime);
                    
                } else {
                    console.log("서버로부터 데이터를 수신하지 못했습니다");
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchAuctions();

        if(session?.user.email) {
            const fetchScrap = async () => {
                    const formData = new FormData();
                    formData.append("user", String(session?.user.email));
                    formData.append("auctionid", String(product?.auctionid));
                    await axios.post("http://localhost:8080/readuser", formData, {
                        withCredentials: true
                    })
                    .then((res) => {
                        const scrapIds = res.data.scrapids;
                        scrapIds.forEach((scrapid: string) => {
                            if (scrapid === String(product?.auctionid)) {
                                setScrapped(true);
                                console.log("스크랩 확인!")
                            }
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            };
            fetchScrap();
        }
        else {
            console.log("작동불가");
        }




        
    }, [product]);


    useEffect(() => {
        const receiveMessage = (event: MessageEvent) => {
            if (event.data === "paymentCompleted") {
                // 결제가 완료되면 Product 컴포넌트를 다시 불러옴
                window.location.reload();
            }
        };

        // 이벤트 수신기 등록
        window.addEventListener("message", receiveMessage);

        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 수신기 제거
            window.removeEventListener("message", receiveMessage);
        };
    }, []);

    const fetchComplete = (auctionid: number, auctionendtime: string) => {
        const formData = new FormData();
        formData.append("auctionid", String(product?.auctionid));
        formData.append("auctionendtime", String(product?.auctionendtime));

        axios.get("http://localhost:8080/auctioncomplete", {
            params: {
                auctionid: String(auctionid),
                auctionendtime: auctionendtime
            },
            withCredentials: true
        })
        .then((res) => {
            console.log(res.data);
            // fetchAuctions();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const productDelete = async () => {
        if(product) {
            if(product?.auctionbidsnum > 0) {
                alert('이미 입찰자가 존재하므로 삭제할 수 없습니다.');
                return;
            }
        }


        
        await axios.delete('http://localhost:8080/auctiondelete', {
            params: {
                auctionid: props.params.auctionid,
                auctionuser: product?.auctionuser
            },
            withCredentials: true
        })
        .then((res) => {
            alert('상품을 삭제하였습니다.');
            console.log(res.data);
            router.push("/");
        })
        .catch((err) => {
            console.log(err);
            alert('상품을 삭제하지 못했습니다.');
        })
        
    }

    const imageChange = (image: string) => {
        setSelectedImage(image);
    }

    const imageClick = (image: string) => {
        setModalMode(true);
        setModalImage(image);
        console.log(image);
    }

    const closeModal = () => {
        setModalMode(false);
        setModalImage("");
    };


    const endtime = convertToKoreanTime(String(product?.auctionendtime));
    const starttime = convertToKoreanTime(String(product?.auctiontime));



    const bidRegist = () => {



        if (!session) {
            alert('로그인이 필요합니다.');
            return;
        }

        if(product?.auctioncomplete) {
            alert('이미 마감된 경매입니다.');
            return;
        }

        const auctionbidprice_str = product?.auctionbidprice;

        if (!auctionbidprice_str) {
            alert('경매 입찰 가격이 정의되지 않았습니다.');
            return;
        }

        const auctionbidprice_num = parseInt(auctionbidprice_str);

        if (isNaN(auctionbidprice_num)) {
            alert('경매 입찰 가격이 유효하지 않습니다.');
            return;
        }

        if (newBidPrice <= auctionbidprice_num) {
            alert('현재 가격보다 높은 금액을 입력하세요!');
            return;
        }

        if(isNaN(newBidPrice)) {
            alert('경매 입찰 가격이 유효하지 않습니다.');
            return;
        }

        if (String(newBidPrice) === String(product?.auctiondirectbid)) {
            directBid();
            return;
        }
            

            
        const formData = new FormData();

        formData.append("auctionid", String(product?.auctionid));
        formData.append("auctionbidprice", product.auctiondirectbid === newBidPrice ? String(product?.auctiondirectbid) : String(newBidPrice));
        formData.append("auctionbidder", String(session.user.email));
        formData.append("auctionbidsnum", String(product?.auctionbidsnum));

            
        const bidSubmit = async () => {
            await axios.post('http://localhost:8080/auctionbidprice',  formData, {
                withCredentials: true
            })
            .then((res) => {
                console.log(res.data);
                alert('입찰이 등록되었습니다.');
                        
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                alert('입찰을 등록하지 못했습니다.');
            })
        }

            
            
        bidSubmit();


    };


    const directBid = () => {
        if (!session) {
            alert('로그인이 필요합니다.');
            return;
        }

        if(product?.auctioncomplete) {
            alert('이미 마감된 경매입니다.');
            return;
        }

        const formData = new FormData();

        formData.append("auctionid", String(product?.auctionid));
        formData.append("auctionbidprice", String(product?.auctiondirectbid));
        formData.append("auctionbidder", String(session.user.email));


        console.log(product?.auctiondirectbid);

        axios.get("http://localhost:8080/auctioncomplete", {
            params: {
                auctionid: String(product?.auctionid),
                auctionbidder: String(session?.user.email),
                auctiondirectbid: String(product?.auctiondirectbid)
            },
            withCredentials: true
        })
        .then((res) => {
            console.log(res.data);
            alert('즉시입찰하였습니다. 경매가 종료됩니다.');
            window.location.reload();
        })
        .catch((err) => {
            console.log(err);
        })
    }
        

    const reqScrap = () => {
        const formData = new FormData();
        formData.append("user", String(session?.user.email));
        formData.append("auctionid", String(product?.auctionid));

        axios.post("http://localhost:8080/scrap", formData, {
            withCredentials: true
        })
        .then((res) => {
            alert("관심목록에 등록했습니다.");
            setScrapped(true);
        })
        .catch((err) => {
            console.log(err);
            alert("관심등록에 실패했습니다.")
        })
    };

    const reqUnscrap = () => {
        const formData = new FormData();
        formData.append("user", String(session?.user.email));
        formData.append("auctionid", String(product?.auctionid));

        axios.put("http://localhost:8080/unscrap", formData, {
            withCredentials: true
        })
        .then((res) => {
            alert("관심목록에서 해제했습니다.");
            setScrapped(false);
        })
        .catch((err) => {
            console.log(err);
            alert("관심해제에 실패했습니다.");
        })

    };


    const openPayment = () => {
        const paymentUrl = `/payment/${product?.auctionid}`;
        const specs = 'width=600,height=600'; // 새 창의 크기 및 스펙 설정

        const popup = window.open(paymentUrl, 'Payment', specs);

        // 새 창이 열렸는지 확인
        if (!popup) {
            alert('팝업 차단이 활성화되어 있습니다. 팝업을 허용해주세요.');
            return;
        }
              
        // 결제 페이지 URL로 이동
        popup.location.href = paymentUrl;
    };

        
        

    


    return(
        <main className="flex min-h-screen flex-col items-center justify-between pt-24">
            {product ? 
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <div className="pr-12">
                                <div className="relative w-60 h-60 overflow-hidden">
                                    <img src={"http://localhost:8080/" + selectedImage} alt="selected_image" className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div className="flex flex-row">
                                    {product?.auctionimageurl?.map((image, index) => (
                                        <div key={index} className="relative w-12 h-12 overflow-hidden cursor-pointer" onClick={() => imageChange(image)}>
                                            <img src={"http://localhost:8080/" + image} alt={`상품 이미지 ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mx-auto p-6">
                                {product.auctioncomplete ? 
                                        <h1 className="text-red-500 text-3xl font-bold pb-4">경매 마감</h1>
                                    :
                                        <Countdown targetDateString={product.auctionendtime} />
                                }
                                <div className="flex flex-row">
                                    {product?.auctionuser != session?.user.email && 
                                        <>
                                            {scrapped ? 
                                                    <p className="text-3xl pr-4 cursor-pointer text-yellow-600" onClick={reqUnscrap}><FaStar /></p>
                                                :
                                                    <p className="text-3xl pr-4 cursor-pointer" onClick={reqScrap}><FaRegStar /></p>
                                            }
                                        </>
                                        
                                    }
                                    <p className="font-bold text-3xl pb-4">{product?.auctiontitle}</p>
                                </div>
                                <div className="flex flex-col pb-2">
                                    <div className="flex items-center pb-4">
                                        <p className="font-semibold mr-2">판매자 :</p>
                                        <Link href={`/search/user`} >
                                            <p className="cursor-pointer">{product?.auctionusername}</p>
                                        </Link>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">시작 시간 :</p>
                                        <p>{`${starttime.year}년 ${starttime.month}월 ${starttime.day}일 ${starttime.dayOfWeek}요일 ${starttime.hour}시 ${starttime.minute}분`}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">종료 시간 :</p>
                                        <p>{`${endtime.year}년 ${endtime.month}월 ${endtime.day}일 ${endtime.dayOfWeek}요일 ${endtime.hour}시 ${endtime.minute}분`}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">시작 가격 :</p>
                                        <p>{product?.auctionprice} 원</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">현재 가격 :</p>
                                        <p>{product?.auctionbidprice} 원</p>
                                    </div>
                                    {product.auctiondirectbid &&
                                        <div className="flex items-center">
                                            <p className="font-semibold mr-2">즉시 입찰가 :</p>
                                            <p className="font-semibold">{product?.auctiondirectbid} 원</p>
                                        </div>
                                    }
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">카테고리 :</p>
                                        <p>{product?.auctioncategory}</p>
                                    </div>
                                </div>
                                <div>
                                    {product?.auctionuser === session?.user.email ? (
                                        <>
                                            {product.auctioncomplete ? 
                                                    <div>
                                                        <p className="text-red-500 text-xl font-bold pb-4">마감된 경매입니다.</p>
                                                        {product?.auctionpay ? 
                                                                <div className="relative flex flex-col" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                                                    <p className="cursor-pointer text-sm text-gray-700">경매가 완전 종료되었습니다.</p>
                                                                    <div className={`${isHovered ? "visible" : "invisible"} text-center bg-white shadow-md p-2 rounded-md mt-1`}>
                                                                        <p className="text-sm text-gray-700">낙찰하신 회원님이 결제까지 완료하셨습니다.</p>
                                                                    </div>
                                                                </div>
                                                            :
                                                                <>
                                                                        <p className="cursor-pointer text-sm text-gray-700">낙찰되었습니다. 결제 대기 중입니다.</p>
                                                                </>
                                                        
                                                        }
                                                    
                                                    </div>
                                                :
                                                <>
                                                    <Link href={`/product/edit/${product.auctionid}`}><button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md mr-2">수정하기</button></Link>
                                                    <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md mr-2" onClick={productDelete}>삭제하기</button>
                                                </>
                                            }
                                        </>   
                                    ) : (
                                        <>
                                            {product?.auctioncomplete ?
                                                    <div>
                                                        <p className="text-red-500 text-xl font-bold pb-4">마감된 경매입니다.</p>
                                                        {product?.auctionpay ? 
                                                                <div className="relative flex flex-col" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                                                    <p className="cursor-pointer text-sm text-gray-700">경매가 완전 종료되었습니다.</p>
                                                                    <div className={`${isHovered ? "visible" : "invisible"} text-center bg-white shadow-md p-2 rounded-md mt-1`}>
                                                                        <p className="text-sm text-gray-700">낙찰하신 회원님이 결제까지 완료하셨습니다.</p>
                                                                    </div>
                                                                </div>
                                                            :
                                                                <>
                                                                    {product?.auctionbidder === session?.user.email &&
                                                                        <>
                                                                            <p className="cursor-pointer text-sm text-gray-700">축하합니다! {session?.user.name} 님께 낙찰되었습니다.</p>
                                                                            <button className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md mr-2" onClick={openPayment}>결제</button>
                                                                        </>
                                                                    }
                                                                </>
                                                        
                                                        }
                                                        
                                                    </div>
                                                :
                                                    <>
                                                        <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md mr-2" onClick={() => setBidMode(true)}>입찰하기</button>
                                                        {product.auctiondirectbid &&
                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md mr-2" onClick={directBid}>즉시입찰</button>
                                                        }
                                                        {product?.auctionuser != session?.user.email && 
                                                            <>
                                                                {scrapped ? 
                                                                        <button className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md mr-2" onClick={reqUnscrap}>관심해제</button>
                                                                    :
                                                                        <button className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md mr-2" onClick={reqScrap}>관심등록</button>
                                                                }
                                                            </>
                                                            
                                                        }
                                                        
                                                        {bidMode &&
                                                            <div className="pt-4">
                                                                <input type="number" id="newBidPrice" name="newBidPrice" value={newBidPrice} onChange={(e) => setNewBidPrice(parseInt(e.target.value, 10))} min={1000} step={100} className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
                                                                <button 
                                                                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md mr-2 ml-2" 
                                                                    onClick={bidRegist}>등록</button>
                                                            </div>
                                                        }
                                                    </>  
                                            }
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="pt-24">
                            <p className="text-3xl font-bold mb-4 text-center text-gray-800 border-b-2 border-gray-300 pb-2">상세 이미지</p>
                            <p className="text-gray-700 text-center pb-12">이미지를 클릭하시면 크게 확인할 수 있습니다.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {product?.auctionimageurl?.map((image, index) => (
                                        <div key={index} className="relative w-96 h-96 overflow-hidden" onClick={() => imageClick(image)}>
                                            <img src={"http://localhost:8080/" + image} alt={`상품 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            <div className="mb-96">
                                <p className="pt-12 text-3xl font-bold mb-4 text-center text-gray-800 border-b-2 border-gray-300 pb-2">상세 설명</p>
                                <p>
                                    {product?.auctioncontent && product.auctioncontent.split('§').map((line, index) => (
                                        <React.Fragment key={index}>
                                        {line}
                                        <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                            <div className="mb-96">
                                <p className="pt-12 text-3xl font-bold mb-4 text-center text-gray-800 border-b-2 border-gray-300 pb-2">Comment</p>
                                <Comment auctionid={product.auctionid} auctionuser={product.auctionuser} />
                            </div>
                        </div>
                    </div>
                : 
                    <div>
                        <p className="font-semibold">Loading...</p>
                    </div>
            }
            {modalMode && modalImage &&
                <div>
                    <ImageModal image={modalImage} closeModal={closeModal}/>
                </div>
            }
            
        </main>
    )
}


export default Product;
"use client"
import { convertToKoreanTime } from "@/app/AuctionFunctions";
import { Product, ProductInfo } from "@/app/Type";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";




const EditProduct = (props: {
    params: {auctionid: number}
}) => {
    const [product, setProduct] = useState<ProductInfo>();
    const {data: session, status: sessionStatus} = useSession();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [totalImages, setTotalImages] = useState<number>(0);

    
   

    useEffect(() => {

        async function fetchAuctions() {
            try {
                const formData = new FormData();
                formData.append("auctionid", String(props.params.auctionid));
                const res = await axios.post('http://localhost:8080/auctionboardread', formData, {
                   
                    withCredentials: true
                });
                if (res.data) {
                    if(session?.user.email != res.data.auctionuser) {
                        router.push(`/product/${props.params.auctionid}`);
                    }

                    setProduct(res.data);
                } else {
                    console.log("서버로부터 데이터를 수신하지 못했습니다");
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchAuctions();
        
    }, []);

    useEffect(() => {
        if (product) {
            const total = (product?.auctionimageurl?.length || 0) + (product?.auctionimages?.length || 0);
            setTotalImages(total);
        }
    }, [product?.auctionimageurl, product?.auctionimages]);


    const editComplete = async () => {

        console.log(product?.auctionimageurl);
        console.log(product?.auctionimages);
        
        const formData = new FormData();
        formData.append('auctiontitle', product?.auctiontitle || '');
        formData.append('auctionid', String(props.params.auctionid));
        formData.append('auctioncategory', product?.auctioncategory || '');
        formData.append('auctioncontent', product?.auctioncontent || '');
        formData.append('auctionuser', product?.auctionuser || '');
        // 이미지 URL 추가
        if (product?.auctionimageurl) {
            for (const imageUrl of product.auctionimageurl) {
                formData.append('auctionoldimg', imageUrl);
            }
        }
        if (product?.auctionimages) {
            for (const image of product.auctionimages) {
                formData.append('auctionimages', image);
            }
        }

        await axios.put(`http://localhost:8080/auctionupdate`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        })
            .then((res) => {
                console.log(res.data)
                alert('수정하였습니다.');
                router.push(`/product/${product?.auctionid}`);
            })
            .catch((err) => {
                console.log(err);
                alert('수정에 실패했습니다!');
            });
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct!,
            [name]: value,
          }));
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct!,
            [name]: value,
        }));
      };


    const endtime = convertToKoreanTime(String(product?.auctionendtime));
    const starttime = convertToKoreanTime(String(product?.auctiontime));


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImages = Array.from(e.target.files).slice(0, 5); // 최대 5개의 이미지 선택
            const newTotalImages = totalImages + selectedImages.length;
            
            if (newTotalImages <= 5) {
                setProduct(prevProduct => ({
                    ...prevProduct!,
                    auctionimages: [...(prevProduct?.auctionimages || []), ...selectedImages]
                }));
                setTotalImages(newTotalImages);
            } else {
                alert("최대 5개의 이미지만 업로드할 수 있습니다.");
            }
        }
    };

    //   const handleRemoveImage = (index: number) => {
    //     setProduct(prevProduct => ({
    //         ...prevProduct!, // null 체크
    //         auctionimages: (prevProduct?.auctionimages || []).filter((_, i) => i !== index)
    //     }));
    // };

    const handleRemoveImage = (index: number) => {
        if(totalImages > 1) {
            setProduct(prevProduct => ({
                ...prevProduct!,
                auctionimages: (prevProduct?.auctionimages || []).filter((_, i) => i !== index)
            }));
            setTotalImages(totalImages - 1);
        } else {
            alert("최소 1개의 이미지가 필요합니다.");
        }
    };

    const handleRemoveOldImage = (index: number) => {
        if(totalImages > 1) {
            setProduct(prevProduct => ({
                ...prevProduct!,
                auctionimageurl: (prevProduct?.auctionimageurl || []).filter((_, i) => i !== index)
            }));
            setTotalImages(totalImages - 1);
        } else {
            alert("최소 1개의 이미지가 필요합니다.");
        }

        
    };

    const handleClickImage = (index: number) => {
        handleRemoveOldImage(index);
    };
    

    return(
        <main className="flex min-h-screen flex-col items-center justify-between pt-24">
            {product ? 
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <div className="pr-12">
                                {/* <div className="relative w-60 h-60 overflow-hidden">
                                    <img src={"http://localhost:8080/" + selectedImage} alt="selected_image" className="w-full h-full object-cover rounded-md" />
                                </div> */}
                                <div className="flex flex-row grid grid-cols-5">
                                    {product?.auctionimageurl?.map((image, index) => (
                                        <div key={index} className="relative w-24 h-24 overflow-hidden cursor-pointer" onClick={() => handleClickImage(index)}>
                                            <img src={"http://localhost:8080/" + image} alt={`상품 이미지 ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                        </div>
                                    ))}
                                </div>
                                <div className="pb-4">
                                    {/* 이미지 미리보기 */}
                                    <div className="flex flex-row pb-4 grid grid-cols-5 pt-4">
                                        {product.auctionimages?.map((image, index) => (
                                        <div key={index} className="relative w-24 h-24 overflow-hidden cursor-pointer" onClick={() => handleRemoveImage(index)}>
                                            <img src={URL.createObjectURL(image)} alt={`상품 이미지 ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                        </div>
                                        ))}
                                    </div>
                                    <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="imageInput" // id 추가
                                            ref={inputRef} // ref 추가
                                    />
                                    <label
                                        htmlFor="imageInput"
                                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md cursor-pointer pb-4"
                                    >
                                        이미지 추가
                                    </label>
                                </div>
                            </div>
                            <div className="mx-auto p-6">
                                <input type="text" className="font-bold text-3xl pb-4 border-2" id="auctiontitle" name="auctiontitle" value={product?.auctiontitle} 
                                onChange={handleInputChange}
                                />
                                <div className="flex flex-col pb-2">
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">시작 시간 :</p>
                                        <p>{`${starttime.year}년 ${starttime.month}월 ${starttime.day}일 ${starttime.dayOfWeek}요일 ${starttime.hour}시 ${starttime.minute}분`}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">종료 시간 :</p>
                                        <p>{`${endtime.year}년 ${endtime.month}월 ${endtime.day}일 ${endtime.dayOfWeek}요일 ${endtime.hour}시 ${endtime.minute}분`}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">현재 가격 :</p>
                                        <p>{product?.auctionprice}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-semibold mr-2">카테고리 :</p>
                                        <select className="border rounded-md py-1 px-2" id="auctioncategory" name="auctioncategory" value={product?.auctioncategory} 
                                        onChange={handleSelectChange}
                                        >
                                            <option value="의류">의류</option>
                                            <option value="전자기기">전자기기</option>
                                            <option value="유아">유아</option>
                                            <option value="취미/게임/음반">취미/게임/음반</option>
                                            <option value="스포츠/레저">스포츠/레저</option>
                                            <option value="식품">식품</option>
                                            <option value="주방용품">주방용품</option>
                                            <option value="반려동물">반려동물</option>
                                            <option value="티켓">티켓</option>
                                            <option value="미용">미용</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <button onClick={editComplete} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md mr-2">수정완료</button>
                                    <Link href={`/product/${product.auctionid}`} ><button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md mr-2">취소</button></Link>
                                </div>
                            </div>
                        </div>
                        <div className="pt-24">
                            <div className="mb-96">
                                <p className="pt-12 text-3xl font-bold mb-4 text-center text-gray-800 border-b-2 border-gray-300 pb-2">상세 설명</p>
                                <input type="text" className="border-2 w-full h-96" id="auctioncontent" name="auctioncontent" value={product?.auctioncontent} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                : 
                    <div>
                        <p className="font-semibold">Loading...</p>
                    </div>
            }
            
        </main>
    );
}



export default EditProduct;
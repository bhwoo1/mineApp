"use client"
import { signIn, useSession } from 'next-auth/react';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { Product } from '../Type';


  const initialProductState: Product = {
    auctionimages: [],
    auctiontitle: '',
    auctionprice: 1000,
    auctioncontent: '',
    auctiontime: new Date(),
    auctionendtime: new Date(),
    auctionuser: '',
    auctioncategory: '',
    auctiondirectbid: null,
    auctionusername: ''
  };
  
  const ProductRegi: React.FC = () => {
    const [product, setProduct] = useState<Product>(initialProductState);
    const [isDirectBidSelected, setIsDirectBidSelected] = useState<boolean>(false);
    const {data: session, status: sessionStatus} = useSession();
    const router = useRouter();

    useEffect(() => {
      console.log(session?.user.name);
      if (sessionStatus === "loading") return; // 세션 로딩 중일 때는 아무것도 하지 않음
      if (!session) {
        signIn("naver", { redirect: true });
      }
    }, [session, sessionStatus]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
      const { name, value } = e.target;
      if (name === 'auctionendtime') {
        setProduct(prevProduct => ({
          ...prevProduct,
          [name]: new Date(value)
        }));
      } else {
        setProduct(prevProduct => ({
          ...prevProduct,
          [name]: value
        }));
      }
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setProduct(prevProduct => ({
        ...prevProduct,
        [name]: value
      }));
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      // 이미지가 없을 때 경고 메시지 표시
      if (product.auctionimages.length === 0) {
        alert('이미지를 등록해주세요.');
        return; // 이미지가 없으면 함수 종료
      }

      if(product.auctiontitle === "") {
        alert('상품 이름을 등록해주세요.');
        return;
      }

      if(product.auctioncategory === "") {
        alert('카테고리를 선택해주세요.');
        return;
      }


      // 현재 시간 가져오기
      const currentTime = new Date();

      // 현재 시간과 입력된 종료 시간 비교
      if (product.auctionendtime < currentTime) {
          // 경고 메시지 표시
          alert('종료 시간은 현재 시간보다 이후여야 합니다.');
          return; // 종료 시간이 이전일 경우 함수 종료
      }


      // 현재 시간으로부터 일주일 후 계산
      const oneWeekLater = new Date(currentTime.getTime() + (7 * 24 * 60 * 60 * 1000));

      // 입력된 종료 시간과 현재 시간으로부터 일주일 후 시간과의 비교
      if (product.auctionendtime <= oneWeekLater) {
          // 경고 메시지 표시
          alert('최소 경매 기간은 7일입니다.');
          return; // 종료 시간이 일주일 이상 이전일 경우 함수 종료
      }


      const formData = new FormData();
      for (const image of product.auctionimages) {
        formData.append('auctionimages', image);
      }
      formData.append('auctiontitle', product.auctiontitle);
      formData.append('auctioncontent', product.auctioncontent);
      formData.append('auctionuser', String(session?.user.email));
      formData.append('auctioncategory', product.auctioncategory);
      formData.append('auctionprice', String(product.auctionprice));
      formData.append('auctionendtime', String(product.auctionendtime));
      formData.append('auctiondirectbid', isDirectBidSelected ? String(product.auctiondirectbid) : '');
      formData.append('auctionusername', String(session?.user.name));

      axios.post("http://localhost:8080/auctionwrite", 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
      })
      .then((res) => {
        console.log(res);
        alert('상품 등록이 완료되었습니다.');
        router.push('/');
      })
      .catch((err) => {
        console.log(err);
        alert('상품 등록에 실패했습니다.');
      });
    };
  
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedImages = Array.from(e.target.files).slice(0, 5); // 최대 5개의 이미지 선택
        if (product.auctionimages.length + selectedImages.length <= 5) {
          setProduct(prevProduct => ({
            ...prevProduct,
            auctionimages: [...prevProduct.auctionimages, ...selectedImages]
          }));
        } else {
          alert("최대 5개까지의 이미지만 업로드할 수 있습니다.");
        }
      }
    };

    const handleRemoveImage = (index: number) => {
      setProduct(prevProduct => ({
        ...prevProduct,
        auctionimages: prevProduct.auctionimages.filter((_, i) => i !== index)
      }));
    };

  
    return (
      <main className='pt-12 mt-12 mb-36 px-20'>
        {session ? 
            <>
              <h2 className="text-3xl font-semibold mb-6">상품 등록</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                  {/* 이미지 미리보기 */}
                  <div className="flex space-x-4 mt-6">
                    {product.auctionimages.map((image, index) => (
                      <div key={index} className="relative w-32 h-32" onClick={() => handleRemoveImage(index)}>
                        <img src={URL.createObjectURL(image)} alt={`상품 이미지 ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                      </div>
                    ))}
                  </div>
                  <label htmlFor="image" className="mb-1">상품 사진 (최대 5개):</label>
                  <input type="file" name="auctionimages" id="image" multiple onChange={handleImageChange} className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="auctiontitle" className="mb-1">상품 이름:</label>
                  <input type="text" id="auctiontitle" name="auctiontitle" value={product.auctiontitle} onChange={handleChange} className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="auctiontitle" className="mb-1">카테고리:</label>
                  <select className="border rounded-md py-1 px-2" id="auctioncategory" name="auctioncategory" value={product.auctioncategory} onChange={handleSelectChange}>
                    <option value="all" selected>
                      전체
                    </option>
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
                <div className="flex flex-col">
                  <label htmlFor="auctionprice" className="mb-1">경매 시작가:</label>
                  <input type="number" id="auctionprice" name="auctionprice" value={product.auctionprice} onChange={handleChange} min={1000} step={100} className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
                  <p className='pt-4'>최소 금액은 1000원 입니다.</p>
                </div>
                <input type="checkbox" id="enableDirectBid" onChange={() => setIsDirectBidSelected(!isDirectBidSelected)} />
                <label htmlFor="enableDirectBid" className='pl-2'>즉시 입찰가 추가</label>
                {isDirectBidSelected && 
                  <div className="flex flex-col">
                    <label htmlFor="auctiondirectbid" className="mb-1">즉시 입찰가:</label>
                    <input type="number" id="auctiondirectbid" name="auctiondirectbid" value={product.auctionprice} onChange={handleChange} min={1000} step={100} className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
                  </div>
                }
                <div className="flex flex-col">
                  <label htmlFor="endtime" className="mb-1">종료 시간:</label>
                  <input type="datetime-local" id="auctionendtime" name="auctionendtime"  onChange={handleChange} className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
                  <p className='pt-4'>최소 경매 기간은 7일입니다.</p>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="description" className="mb-1">상품 설명:</label>
                  <textarea id="description" name="auctioncontent" value={product.auctioncontent} onChange={handleChange} className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"></textarea>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300">등록</button>
              </form>
            </>
          :
            <div className='flex justify-center items-center'>
              <p className='font-semibold text-gray-700'>로그인이 필요합니다.</p>
            </div>
        }
      </main>
    );
  }
export default ProductRegi;
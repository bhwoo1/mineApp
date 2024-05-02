"use client"
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import MyPageProducts from "../components/MyPageProducts";

const MyPage = () => {
    const [scrapIds, setScrapIds] = useState<string[]>([]);
    const [bidIds, setBidIds] = useState<string[]>([]);
    const [writeIds, setWriteIds] = useState<string[]>([]);
    const {data: session, status: sessionStatus} = useSession();

    useEffect(() => {
      // if (sessionStatus === "loading") return; // 세션 로딩 중일 때는 아무것도 하지 않음
      if (sessionStatus === "loading") return; // 세션 로딩 중일 때는 아무것도 하지 않음
      if (!session) {
        signIn("naver", { redirect: true });
      }



      const formData = new FormData();
      formData.append("user", String(session?.user.email));


      axios.post("http://localhost:8080/readuser", formData, {
        withCredentials: true
      })
      .then((res) => {
        console.log(res.data);
        setScrapIds(res.data.scrapids);
        setWriteIds(res.data.writeids);
        setBidIds(res.data.bidids);
      })
      .catch((err) => {
        console.log(err);
      });
    }, []);

    
    

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {session ? 
              <div className="flex flex-col">
              <div className="flex flex-row py-12">
                  <div className="w-150 h-150 rounded-lg overflow-hidden">
                    {session?.user.image &&
                      <Image src={`${session?.user.image}`} alt="main" width={150} height={150} />
                    }
                  </div>
                  <div className="flex flex-col pl-6 pt-10">
                      <p className="text-2xl">오늘은 어떤 보물을 찾으러 오셨나요?</p>
                      <p className="text-3xl font-bold">{session?.user.name} 님.</p>
                  </div>
              </div>
              <div className="pb-12">
                    <p className="font-bold text-xl cursor-pointer" >내가 주목하는 보물들</p>
                    {scrapIds ? 
                        <>
                        {scrapIds.length > 0 ? 
                            <MyPageProducts ids={scrapIds} />
                          :
                          <p className={`text-gray-500`}>회원님의 마음에 드는 보물을 관심 등록해보세요!</p>
                        }
                        </>
                        
                      :
                        <p className={`text-gray-500`}>회원님의 마음에 드는 보물을 관심 등록해보세요!</p>
                    } 
              </div>
              <div className="pb-12">
                    <p className="font-bold text-xl cursor-pointer" >내가 판매하는 보물들</p>
                    {writeIds ?
                      <>
                        {writeIds.length > 0 ? 
                            <MyPageProducts ids={writeIds} />
                          :
                          <p className={`text-gray-500}`}>더 이상 필요없는 보물을 판매해보세요!</p>
                        }
                      </>
                      :
                        <p className={`text-gray-500}`}>더 이상 필요없는 보물을 판매해보세요!</p>
                    }
              </div>
              <div className="pb-12">
                    <p className="font-bold text-xl cursor-pointer" >내가 입찰한 보물들</p>
                    {bidIds ?
                        <>
                        {writeIds.length > 0 ? 
                            <MyPageProducts ids={bidIds} />
                          :
                          <p className={`text-gray-500`}>마음에 드는 보물을 찾으셨나요?</p>
                        }
                      </>
                      :
                        <p className={`text-gray-500`}>마음에 드는 보물을 찾으셨나요?</p>
                    }
              </div>
            </div>
          :
            <div className='flex justify-center items-center'>
              <p className='font-semibold text-gray-700'>로그인이 필요합니다.</p>
            </div>
        }
      </main>
    );
  }

  export default MyPage;
  
"use client"
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyPage = () => {
    const [toggleStates, setToggleStates] = useState<boolean[]>(Array(2).fill(false));
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || !session.user || !session.user.name) {
            router.push("/");
        }
    }, [session, router]);

    const toggleClick = (index: number) => {
        const newToggleStates = [...toggleStates];
        newToggleStates[index] = !newToggleStates[index];
        setToggleStates(newToggleStates);
    };

    
    

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col">
          <div className="flex flex-row py-12">
              <div className="w-150 h-150 rounded-lg overflow-hidden">
                <Image src={`${session?.user.image}`} alt="main" width={150} height={150} />
              </div>
              <div className="flex flex-col pl-6 pt-10">
                  <p className="text-2xl">오늘은 어떤 보물을 찾으러 오셨나요?</p>
                  <p className="text-3xl font-bold">{session?.user.name} 님.</p>
              </div>
          </div>
          <div className="pb-12">
                <p className="font-bold text-xl cursor-pointer" onClick={() => toggleClick(0)}>내가 주목하는 보물들</p>
                <p className={`text-gray-500 ${toggleStates[0] ? "visible" : "invisible"}`}>회원님의 마음에 드는 보물을 관심 등록해보세요!</p>
          </div>
          <div className="pb-12">
                <p className="font-bold text-xl cursor-pointer" onClick={() => toggleClick(1)}>내가 판매하는 보물들</p>
                <p className={`text-gray-500 ${toggleStates[1] ? "visible" : "invisible"}`}>더 이상 필요없는 보물을 판매해보세요!</p>
          </div>
        </div>

      </main>
    );
  }

  export default MyPage;
  
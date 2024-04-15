"use client";

import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";


const Navbar:React.FC = () => {
  const {data: session} = useSession();


  const loginBtnClick = () => {
    signIn("naver", { redirect: true, callbackUrl: "/" });
    
    const formData = new FormData();

        formData.append("user", String(session?.user.email));
        formData.append("username", String(session?.user.name));
        axios.post('http://localhost:8080/saveuser', formData, {
          withCredentials: true
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }

  return (
    <header className="fixed left-0 right-0 top-0 bg-gray-800 py-4 z-50 user-not-selectable">
      <nav className="container mx-auto flex items-center justify-between">
        <p className="font-bold text-white">MINE</p>
        <ul className="flex items-center justify-end space-x-4">
          <li>
            <Link href="/">
              <p className="text-white">홈</p>
            </Link>
          </li>
          {session ? 
                (   
                    <ul className="flex items-center justify-end space-x-4">
                        <li>
                            <Link href="/mypage"><p className="text-white cursor-pointer">{session.user.name} 님</p></Link>
                        </li>
                        <li>
                            <p className="text-white cursor-pointer" onClick={() => signOut()}>{<Image src="/btnD_logout.png" alt="logout" width={122} height={40} />}</p>
                        </li>
                    </ul>
                ) 
              : 
                (
                    <li>
                        <p className="text-white cursor-pointer" onClick={loginBtnClick}><Image src="/btnD_login.png" alt="login" width={110} height={40} /></p>
                    </li>
                )
            }
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
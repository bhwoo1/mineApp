"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";


const Navbar:React.FC = () => {
  const {data: session} = useSession();


  const loginBtnClick = async () => {
      await signIn("naver", { redirect: true, callbackUrl: "/" });
      // await signIn("naver", {redirect: false});

  }

  useEffect(() => {
    if (session && session.user && session.user.email && session.user.name) {
      const formData = new FormData();
      formData.append("user", String(session.user.email));
      formData.append("username", String(session.user.name));
      
      axios.post('http://localhost:8080/saveuser', formData, {
          withCredentials: true
      })
      .then((res) => {
          console.log(res.data);
      })
      .catch((err) => {
          console.log(err);
      });
  } else {
      console.log("User session information is incomplete.");
  }
  }, [session])

  return (
    <header className="fixed left-0 right-0 top-0 bg-gray-800 py-4 z-50 user-not-selectable">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/"><img src="/M_I_N_E-removebg-preview.png" alt="logo" width='88' height='4' /></Link>
        <ul className="flex items-center justify-end space-x-4">
          <li>
            <Link href="/">
              <p className="text-white font-bold">홈</p>
            </Link>
          </li>
          {session ? 
                (   
                    <ul className="flex items-center justify-end space-x-4">
                        <li>
                            <Link href="/mypage"><p className="text-white cursor-pointer font-bold">{session.user.name} 님</p></Link>
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
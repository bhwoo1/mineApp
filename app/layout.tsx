import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import Navbar from "./components/Layout/NavBar";
import Footer from "./components/Layout/Footer";
import RecoilContextProvider from "./recoil/RecoilContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MINE | 마음 속 간직한 인생 보물 찾기",
  description: "원하시는 상품을 경매를 통해 손에 넣어보세요! 필요 없는 상품을 다른 사람에게 판매하세요!",
  icons : {
    icon: "/3.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilContextProvider>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </RecoilContextProvider>
      </body>
    </html>
  );
}

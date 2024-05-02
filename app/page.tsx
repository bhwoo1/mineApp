import AuctionList from "./components/AuctionList";
import MainBar from "./components/Layout/MainBar";

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-between pt-24 mt-4">
      <MainBar />
      <AuctionList />
    </main>
  );
}
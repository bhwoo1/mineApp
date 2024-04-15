import MainBar from "./components/Layout/MainBar";
import ProductList from "./components/ProductList";

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-between pt-24 mt-4">
      <MainBar />
      <ProductList />
    </main>
  );
}
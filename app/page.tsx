import ProductList from "./components/ProductList";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-24">
      {/* <h1 className="text-4xl font-semibold">Main Page</h1> */}
      <ProductList />
    </main>
  );
}
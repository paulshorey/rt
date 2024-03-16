import Counter from "@/features/counter/Counter";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="container-5xl">
      <Header />
      <div className="flex flex-col items-center justify-center h-[60vh] border-blue-500 border-[1px] relative">
        <Counter />
      </div>
    </main>
  );
}

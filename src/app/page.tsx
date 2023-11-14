import Image from "next/image";
import Test from "../components/Test";
import FirebaseCrud from "@/components/FirebaseCrud/FirebaseCrud";

export default function Home() {
  return (
    <main>
      <FirebaseCrud />
    </main>
  );
}

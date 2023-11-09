"use client";
import firestore from "../utils/firestore";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<string>("");

  const onClickUpLoadButton = async () => {
    const data = {
      title: value,
      createdAt: new Date(),
      useId: "AUserId",
    };
    console.log(data);
    await addDoc(collection(firestore, `main`), {
      ...data,
    });
  };

  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={onClickUpLoadButton}>전송</button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<string>("");

  const onClickUpLoadButton = async () => {
    const data = {
      title: value,
      createdAt: new Date(),
      useId: "AUserId AUserId AUserId AUserId",
    };
    const data2 = {
      title: value,
      createdAt: new Date(),
      useId: "AUserId AUserId AUserId AUserId",
    };
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

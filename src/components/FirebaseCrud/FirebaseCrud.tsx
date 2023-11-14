"use client";
import { useEffect, useState } from "react";
import FirebaseConfig from "@/utils/firebase";
import { ref, set, get, update, remove, child } from "firebase/database";
const dataBase = FirebaseConfig();

type KeyValue = { [key: string]: string };

const FirebaseCrud = () => {
  const reArr: KeyValue = {
    userName: "",
    fullName: "",
    phone: "",
    dob: "",
  };
  const [userName, setUserName] = useState<KeyValue>(reArr);
  const forInArr = (obj: KeyValue) => {
    const arr: { name: string; value: string }[] = [];
    for (var prop in obj) {
      arr.push({ name: prop, value: obj[prop] }); // a 1, b 2, c 3
    }
    return arr;
  };
  const useInfoArr = forInArr(userName);
  const isNullOrWhiteSpace = (value: string) => {
    value = value.toString();
    return value === null || value.replaceAll("", "").length < 1;
  };
  const InsertData = () => {
    let nullCheck = false;
    for (let i = 0; i < useInfoArr.length; i++) {
      const element = useInfoArr[i];
      if (isNullOrWhiteSpace(element.name)) {
        nullCheck = true;
      }
    }
    if (nullCheck) {
      alert("fill all the fields");
      return;
    }
    set(ref(dataBase, "Customer/" + userName["userName"]), {
      fullName: userName["fullName"],
      phone: userName["phone"],
      dob: userName["dob"],
    });
  };

  const selectData = () => {
    const dbRef = ref(dataBase);
    get(child(dbRef, "Customer/" + userName["userName"]))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUserName((prev) => {
            prev = { ...prev, ["fullName"]: snapshot.val().fullName };
            prev = { ...prev, ["phone"]: snapshot.val().phone };
            prev = { ...prev, ["dob"]: snapshot.val().dob };

            return prev;
          });
        } else {
          alert("no data available");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error data retrieval was unsuccessful");
      });
  };

  const userInfoOnChange = (key: string, value: string) => {
    setUserName((prev) => {
      return { ...prev, [key]: value };
    });
  };

  useEffect(() => {
    console.log(userName);
  }, [userName]);

  return (
    <div className="flex flex-col gap-2 p-10">
      {useInfoArr.map((el, index) => {
        return (
          <div key={index}>
            <label
              htmlFor={el.name + index}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {el.name}
            </label>
            <div className="mt-2">
              <input
                id={el.name + index}
                name={el.name + index}
                value={el.value}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => userInfoOnChange(el.name, e.target.value)}
              />
            </div>
          </div>
        );
      })}
      <div className="flex flex-row gap=2">
        <button
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => selectData()}
        >
          selectData
        </button>
        <button
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => InsertData()}
        >
          InsertData
        </button>
      </div>
    </div>
  );
};

export default FirebaseCrud;

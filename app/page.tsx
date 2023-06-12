"use client";
import { getUser, createUser } from "@/lib";
import { User } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Home() {
  const { push } = useRouter();
  const [newAdd, setNewAdd] = useState<string>();
  const [userAdd, setUserAdd] = useState<string>("");
  const createNewUser = async () => {
    const res = await createUser({ cache: "no-store" });
    const user: User[] = res.body.data;
    setNewAdd(user[0].address);
  };

  const authUser = async () => {
    const user = await getUser({
      headers: { address: userAdd },
      cache: "no-store",
    });

    if (user) {
      push(`/${userAdd}`);
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid Address");
    }
  };

  const handleAddChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target?.value;
    setUserAdd(val);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-14 px-20">
      <div className="sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 font-mono effect px-10 py-16 border-none rounded-lg flex flex-col md:flex-row items-center gap-20">
        <form className="items-center gap-6 flex-col flex">
          <span className="text-3xl">Sign In</span>
          <input
            type="text"
            value={userAdd}
            onChange={handleAddChange}
            className="px-2 py-1 rounded text-black"
            placeholder="Enter your address"
          />
          <button
            type="button"
            onClick={authUser}
            className="rounded w-2xl bg-green-700 px-6 py-2"
          >
            Proceed
          </button>
        </form>
        <span className="text-2xl">OR</span>
        <form className="items-center gap-6 flex-col flex">
          <div className="text-3xl text-center">Create New</div>
          {newAdd && (
            <div className="effect flex items-center px-4 py-1 gap-2 rounded justify-between">
              <div>
                {newAdd?.slice(0, 4)}...{newAdd?.slice(-4)}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  toast.success("Link Copied");
                  navigator.clipboard.writeText(newAdd);
                }}
              >
                <ClipboardIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
          <button
            onClick={createNewUser}
            type="button"
            className="rounded w-2xl bg-green-700 px-6 py-2"
          >
            Proceed
          </button>
        </form>
      </div>
    </main>
  );
}

"use client";

import {
    TxnObject,
    checkBalance,
    checkUser,
    getUser,
    sendJobcoins,
} from "@/lib";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default async function Dashboard({
    params,
}: {
    params: { user: string };
}) {
    const router = useRouter();
    const pathname = usePathname();
    const userDetails = await getUser({
        headers: { address: params.user },
        cache: "no-store",
    });
    const sendTxn = async (txnObject: TxnObject) => {
        const isBalanceEnough = await checkBalance({
            user: params.user,
            amount: txnObject.amount,
        });
        if (!isBalanceEnough) {
            toast.error("Insufficient funds!");
            return;
        }
        const isValidUser = await checkUser({ user: txnObject.to });
        if (!isValidUser) {
            toast.error("Invalid Address!");
            return;
        }
        const res = await sendJobcoins({
            txn: txnObject,
        });
        if (res.body.data) {
            toast.success("Transaction Successfull!");
            router.refresh();
        }
    };
    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const val = e.target as HTMLFormElement;
        let txnObject: TxnObject = {
            from: params.user,
            to: val.to.value,
            amount: parseFloat(val.amount.value),
        };
        sendTxn(txnObject);
    }

    return (
        <main className="flex min-h-screen flex-col items-center py-10 px-8 sm:px-20">
            <div className="flex justify-between mb-4 w-full">
                <div className="effect sm:text-base text-xs flex items-center p-2 gap-2 rounded-lg justify-between">
                    <div>
                        {params.user?.slice(0, 6)}...{params.user?.slice(-4)}
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            toast.success("Link Copied");
                            navigator.clipboard.writeText(params.user);
                        }}
                    >
                        <ClipboardIcon className="h-4 w-4 text-white" />
                    </button>
                </div>
                <div
                    onClick={() => {
                        router.push(pathname + "/transactions");
                    }}
                    className="rounded-lg sm:text-base text-xs effect p-2 items-center flex cursor-pointer"
                >
                    Transaction History
                </div>
                <div className="effect sm:text-base text-xs p-2 flex flex-col sm:flex-row rounded-lg justify-between items-center gap-1 sm:gap-4">
                    Balance :{" "}
                    <div className="bg-black effect rounded px-2 py-1">
                        {userDetails[0]?.balance}
                    </div>
                </div>
            </div>
            <div className="w-5xl sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 font-mono text-center effect p-14 border-none rounded-lg">
                <form
                    onSubmit={onSubmit}
                    className="items-center gap-6 justify-between flex-col flex"
                >
                    <span className="text-4xl">Send Jobcoins</span>
                    <input
                        type="text"
                        name="to"
                        className="px-2 py-1 rounded text-black"
                        placeholder="Enter Address"
                    />
                    <input
                        type="number"
                        name="amount"
                        className="px-2 py-1 rounded text-black"
                        placeholder="Enter Amount"
                    />
                    <button
                        type="submit"
                        className="rounded w-2xl bg-green-700 px-6 py-2"
                    >
                        Send
                    </button>
                </form>
            </div>
        </main>
    );
}

"use client";
import { TransactionsResponse, getTransactions } from "@/lib";
import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Transaction History",
        },
    },
    scales: {
        x: {
            min: "2023-06-11 00:00:00",
            type: "time" as const,
            title: {
                display: true,
                text: "Days",
            },
            time: {
                unit: "day" as const,
            },
        },
        y: {
            title: {
                display: true,
                text: "Amount",
            },
            min: 0,
        },
    },
};

export default async function TransactionChart({
    params,
}: {
    params: { user: string };
}) {
    console.log(params);
    const txns = await getTransactions<TransactionsResponse[]>({
        headers: { address: params.user },
        cache: "no-store",
    });
    const data = {
        labels: txns?.map((txn) => new Date(txn?.created_at)),
        datasets: [
            {
                label: "Transaction Data",
                data: txns?.map((txn) => txn?.amount),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                tension: 0.5,
            },
        ],
    };

    return (
        <div className="sm:w-1/2 w-full p-2 sm:p-8 effect absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Line options={options} data={data} />
        </div>
    );
}

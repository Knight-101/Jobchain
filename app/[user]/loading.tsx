"use client";
import { InfinitySpin } from "react-loader-spinner";

export default function Loading() {
    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <InfinitySpin width="200" color="#4fa94d" />
        </div>
    );
}

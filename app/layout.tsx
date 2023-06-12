"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Jobchain',
//   description: 'Create and send jobcoins',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <div className='font-mono pt-10 text-5xl'>JobChain</div>
        {children}
      </body>
    </html>
  )
}

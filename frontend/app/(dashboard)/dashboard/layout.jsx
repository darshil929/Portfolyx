"use client"
import {useEffect} from "react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"

import { useRouter } from "next/navigation";




export default function DashboardLayout({ children }) {
  const router = useRouter();

  // useEffect(()=>{

  //   fetch('http://localhost:8000/user/dashboard',{credentials: "include",}).then(response => { if (response.statusCode !== 200) {
  //     router.push('/login')
  //   }}).catch(e => {console.log(e) })


  // },[])
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-4">{children}</main>
      </div>
    </>
  )
}

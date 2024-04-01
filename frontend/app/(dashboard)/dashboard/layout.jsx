"use client"
import {useEffect,useState} from "react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"

import { useRouter } from "next/navigation";




export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user,setUser] = useState(null)

  // useEffect(()=>{
    useEffect(()=>{
      fetch('http://localhost:8000/user/dashboard',{credentials: "include"}).then(response => { if (response.status != 200) {
        // console.log(response)
        router.push('/login')
      }
    else{
      return response.json()
    }}).then(data => {console.log(data);setUser(data)}).catch(e => {console.log(e) })
  
    fetch('http://localhost:8000/stock/',{credentials: "include"}).then(response => { if (response.status != 200) {
      // console.log(response)
      router.push('/login')
    }
  else{
    return response.json()
  }}).then(data => {console.log(data);setStocks(data)}).catch(e => {console.log(e) })
  
  
    },[])

  // },[])
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        {user&&<Sidebar wallet={user?.wallet}/>}
        <main className="w-full pt-4">{children}</main>
      </div>
    </>
  )
}

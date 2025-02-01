'use client'
import SideBar from "@/components/SideBar";
import { useParams } from 'next/navigation'

export default function Profile(){
    const params = useParams()

    console.log(params.id)
    return(
        <div className="flex">
            <SideBar/>
            {params.id}
        </div>
    )
}
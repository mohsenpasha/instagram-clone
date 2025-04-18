'use client'
import SideBar from "@/components/SideBar";
import { appWithTranslation } from "next-i18next";
import '../../i18n';
import StorySlider from "./components/StorySlider";
import { useEffect, useState } from "react";
import { fetchSimpleGet } from "./api/simpleGet";
import { useDispatch, useSelector } from "react-redux";
import { changeStoriesHolder } from "./store/slices/storySlice";
import { RootState } from "./store/store";
import { StoryList } from "./components/Story";

function Home() {
  const storyToggle = useSelector((state: RootState)=> state.story.storyToggle)
  const [isLoading,setIsloading] = useState(false)
  const dispatch = useDispatch()
  async function fetchStories(){
    console.log('fetching story')
    setIsloading(true)
    const response = await fetchSimpleGet('http://localhost:8000/homestories')
    const jsonRes = await response.json()
    dispatch(changeStoriesHolder(jsonRes))
    setIsloading(false)
  }
  useEffect(()=>{
    fetchStories()
  },[])
  return (
    <>
      <div className="flex justify-between">
        <SideBar/>
        <div className="flex justify-center w-full md:w-[100vw-72px] xl:w-10/12">
          <div className="w-full md:px-4 xl:px-0 lg:w-[930px]">
            <StorySlider/>
          </div>
        </div>
      </div>
      {storyToggle && 
        <StoryList />
      }
    </>
  );
}
export default appWithTranslation(Home)
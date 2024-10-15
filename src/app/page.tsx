"use client"
import Card from "@/components/Card";
import Image from "next/image";
import {IconMarker} from "@codexteam/icons"
import {IconAddBorder} from "@codexteam/icons"
import {IconText} from "@codexteam/icons"
import {IconTrash} from "@codexteam/icons"
import { useUserStore } from '@/store/store';


export default function Home() {
  const currentTool = useUserStore((state:any) => state.currentTool);
  const setCurrentTool = useUserStore((state:any) => state.setCurrentTool);

  return (
    <div className="">
      <div className="p-10 flex justify-center items-center">
        <div className="mr-10" id="toolbar">

          <h1>Toolbar</h1>
          <div onClick={()=>{
            setCurrentTool("Brush");
          }} className={`${currentTool=="Brush"?"text-black rounded-xl bg-primary":""}`}>
        <span  className={`icon text-3xl`} dangerouslySetInnerHTML={{ __html: IconMarker }} />
          </div>

          <div onClick={()=>{
            setCurrentTool("Shape")
          }} className={`${currentTool=="Shape"?"text-black rounded-xl bg-primary":""}`}>
        <span  className="icon text-3xl" dangerouslySetInnerHTML={{ __html: IconAddBorder }} />
          </div>

          <div onClick={()=>{
            setCurrentTool("Text")
          }} className={`${currentTool=="Text"?"text-black rounded-xl bg-primary":""}`}>
        <span  className="icon text-3xl" dangerouslySetInnerHTML={{ __html: IconText }} />
          </div>

          
        </div>
      <Card/>
      </div>
    </div>
  );
}

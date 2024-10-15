"use client"
import Card from "@/components/Card";
import Image from "next/image";
import {IconMarker} from "@codexteam/icons"
import {IconAddBorder} from "@codexteam/icons"
import {IconText} from "@codexteam/icons"
import {IconTrash} from "@codexteam/icons"


export default function Home() {
  return (
    <div className="my-10">
      <div className="flex justify-center items-center">
        <div className="mr-10" id="toolbar">
        <span  className="icon text-3xl" dangerouslySetInnerHTML={{ __html: IconMarker }} />
        <span  className="icon text-3xl" dangerouslySetInnerHTML={{ __html: IconAddBorder }} />
        <span  className="icon text-3xl" dangerouslySetInnerHTML={{ __html: IconText }} />
        <span  className="icon text-3xl" dangerouslySetInnerHTML={{ __html: IconTrash }} />
        </div>
      <Card/>
      </div>
    </div>
  );
}

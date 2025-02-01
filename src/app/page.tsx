'use client'
import SideBar from "@/components/SideBar";
import { appWithTranslation } from "next-i18next";
import '../../i18n';

function Home() {
  return (
    <div>
      <SideBar/>
    </div>
  );
}
export default appWithTranslation(Home)
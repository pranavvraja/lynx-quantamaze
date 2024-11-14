"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import lightimage from "../../public/light.png";
import darkimage from "../../public/dark.png";

export const HeroImage = () => {
    const { theme } = useTheme();
    return (

        <div className="relative group md:mt-14 ">
            <div className="shadow absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-gradient-to-b from-primary/50 to-background rounded-sm blur-3xl"></div>
            <Image
                width={1200}
                height={1200}
                className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-seondary  "
                src={
                    theme === "light"
                        ? lightimage
                        : darkimage
                }
                alt="dashboard"
            />

            <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background "></div>
        </div>
    );
};
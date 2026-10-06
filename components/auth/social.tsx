"use client"

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";


export const Social = () => {
    return (
        <div className="flex gap-4 w-full justify-center items-center mr-27 ml-27 ">
            <Button
                variant="outline"
                size='lg'
                className="w-full"
            >
                <FcGoogle />
            </Button>
            <Button
                variant="outline"
                size="lg"
                className="w-full"
            >
                <FaGithub />
            </Button>
        </div>
    )
}
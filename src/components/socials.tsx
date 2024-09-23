"use client";
import { Twitch } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "./ui/use-toast";

export default function Socials() {
    const [twitchUrl, setTwitchUrl] = useState("");
    const { data: session } = useSession();
    const loggedInUserId = session?.userId;
    async function handleSubmit(e:React.FormEvent<HTMLFormElement>):Promise<void> {
        e.preventDefault();
        const response = await fetch("/api/socials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUserId, twitchUrl }),
        });

        if (response.ok) {
            const data = await response.json();
            toast({
                title: data.message || "Twitch URL added successfully",
                duration: 3000,
            });
        } else {
            const errorData = await response.json(); 
            toast({
                title: errorData.error || "Error adding Twitch URL",
                duration: 3000,
            });
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex items-center">
                <Twitch className="w-10 h-10 text-purple-500 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-purple-700" />
                <form className="flex items-center ml-2" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Enter your twitch channel url" 
                        className="border rounded-l-md px-2 py-1 w-[250px]"
                        onChange={(e)=>{setTwitchUrl(e.target.value)}}
                    />
                    <button className="bg-purple-500 text-white rounded-r-md px-3 py-1 hover:bg-purple-700 transition ml-4">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

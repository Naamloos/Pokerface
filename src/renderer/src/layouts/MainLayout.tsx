import { PropsWithChildren } from "react";
import Balatro from "../components/Balatro";

export default function MainLayout({children} : PropsWithChildren<{}>)
{
    return (
        <>
            <Balatro />
            <div className="container mx-auto px-4 py-8 text-white text-lg">
                {children}
            </div>
        </>
    );
};
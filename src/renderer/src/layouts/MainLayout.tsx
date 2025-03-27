import { PropsWithChildren } from "react";
import Balatro from "../components/Balatro";

export default function MainLayout({children} : PropsWithChildren<{}>)
{
    return (
        <>
            <Balatro 
                color1="#448ee4"
                color2="#006BB4"
                color3="#162325"
            />
            <div className="container mx-auto px-4 py-8 text-white text-lg">
            {children}
            </div>
        </>
    );
};
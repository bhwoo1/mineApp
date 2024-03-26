import React from "react";

const Footer:React.FC = () => {

    return(
        <footer>
            <div className='flex flex-row items-center justify-center p-4 text-center bottom-0 w-full h-16 border-t-2 mt-20 user-not-selectable'>
                <p className="font-semibold pr-2">Made by </p>
                <p className="font-bold"> BH WOO</p>
            </div>
        </footer>
    );
}

export default Footer;
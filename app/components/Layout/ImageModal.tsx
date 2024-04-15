import React, { useEffect, useRef } from "react";

type Prop = {
    image: string,
    closeModal: () => void;
}

const ImageModal: React.FC<Prop> = (props: Prop) => {
    const parentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const image = new Image();
        image.src = "http://localhost:8080/" + props.image;
        image.onload = () => {
            if (parentRef.current) {
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                const imageWidth = image.width;
                const imageHeight = image.height;

                let width = imageWidth;
                let height = imageHeight;

                if (imageWidth > screenWidth || imageHeight > screenHeight) {
                    const widthRatio = screenWidth / imageWidth;
                    const heightRatio = screenHeight / imageHeight;
                    const scale = Math.min(widthRatio, heightRatio);

                    width *= scale;
                    height *= scale;
                }

                parentRef.current.style.width = width + "px";
                parentRef.current.style.height = height + "px";
            }
        };
    }, [props.image]);

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            props.closeModal();
        }
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center" onClick={handleClickOutside}>
            <div ref={parentRef} className="relative bg-black bg-opacity-60 p-4" onClick={props.closeModal}>
                <img src={"http://localhost:8080/" + props.image} alt="modal_image" className="max-w-full max-h-full mx-auto" />
            </div>
        </div>
    );
}

export default ImageModal;
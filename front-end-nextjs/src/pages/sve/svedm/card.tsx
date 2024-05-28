import Image from 'next/image';
import { AspectRatio } from '@mantine/core';
import React, { MouseEventHandler } from 'react';

interface SveCardProps {
    /* */
    key: string
    imageUrl : string
    /* */
    variant?: 'small' | 'large'
}





// カードのクラスコンポーネント
const SveCard = ({
        key,
        imageUrl,
        variant = 'small'
    }: SveCardProps) => {
        const { size, imgSize} = (() => {
            switch (variant) {
                case 'small':
                    return {size: {}, imgSize: 200}
                case 'large':
                    return {size: {}, imgSize: 400}
            }
        })()

    // style
    // const clickedCardList = (e : React.MouseEvent<HTMLImageElement, MouseEvent>, key : string) => {
    //     console.log(e);
    //     console.log("card clicked: " + key);
    //     return 
    // };

  return (
    <div>
        <AspectRatio ratio={ 460 / 640 } >
            <Image
                src={imageUrl}
                // src="/imt/sd.png"
                alt="image"
                fill
                // style={{ objectFit: "cover" }}
                // onClick={(e) => clickedCardList(e, key)}
            />
        </AspectRatio>
    </div>
  )
};

export default SveCard
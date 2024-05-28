import SveCard from './card'
import { ActionIcon, Button, Center, Space } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PlusIcon, MinusIcon, StarIcon } from '@heroicons/react/24/solid'
import { CardInfo } from "./deck-edit-types";
import React, { useState } from 'react';

// キー入力上下で増減もいいかも..

export default function CardDetail ( props : any ) {

  const [iconColor, setIconColor] = useState('gray'); // 初期色を設定

  // ここで　関連カードも持ちたい いや、onchangeか？
  // カード情報を毎回問い合わせたほうが早いかも..

  let selectedCard : CardInfo = {
    cardid : props.cardid,
    imgpath : props.imgpath,
    cost : props.cost,
    hp : props.hp,
    atk : props.atk,
    collaboname : props.collaboname,
    kind : props.kind,
    cardlimit : props.cardlimit,
    relation_card_id_list : props.relation_card_id_list
  }

  const insertCardToDeck = () => {
    // エボルブカードの場合
    if ( selectedCard.kind?.includes(2) ) {
      props.onDeckEditFunc( selectedCard , 2)
    } else {
      props.onDeckEditFunc( selectedCard , 0)
    }

  };
  const removeCardFromDeck = () => {
    // エボルブカードの場合
    if ( selectedCard.kind?.includes(2) ) {
      props.onDeckEditFunc( selectedCard , 3)
    } else {
      props.onDeckEditFunc( selectedCard , 1)
    }
  };

  const reraltionCardChange = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>, c_id : string) => {
    props.onRelCardFunc(c_id)
  };

  const handleFavorite = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (iconColor === 'gray') {
      setIconColor('yellow'); 
      // お気に入り情報の更新
      // 上限を超えていた場合は警告

      notifications.show({
        title: 'お気に入り登録',
        message: 'お気に入り登録数の上限です。',
        color: "red",
      })
    } else {
      setIconColor('gray');
      // お気に入り情報の更新
    }
  };

  // style
  const divStyle = {
    paddingTop: '1%',
    paddingBottom: '2%',
    paddingLeft: '4%',
    paddingRight: "4%" 
  };

  return (
    <div>
    {selectedCard.cardid === undefined || selectedCard.imgpath === ''  ? (
        <p>カード未選択</p>
      ) : (  
        <div>
          {/* TODO */}
          {/* <ActionIcon onClick={(e) => handleFavorite(e)} color={iconColor} >
            <StarIcon/>
          </ActionIcon> */}
          <div style={divStyle}>
            <SveCard key="key" imageUrl={props.imgpath} />
          </div>
          <div>
          {/* ボタン */}
          {/* <ActionIcon color="red" size="xl" variant="filled" radius="md" onClick={insertCardToDeck}>
            <PlusIcon />
          </ActionIcon>
          <ActionIcon color="blue" size="xl" variant="filled" radius="md" onClick={removeCardFromDeck}>
            <MinusIcon />
          </ActionIcon> */}
          <Center>
            <Button leftIcon={<PlusIcon/>} size="lg" color="red" onClick={insertCardToDeck}>
              ADD
            </Button>
            　
            <Button leftIcon={<MinusIcon/>} size="lg" color="blue" onClick={removeCardFromDeck}>
              REMOVE
            </Button>
          </Center>
          
          {/* 関連カード  */}
          {selectedCard.relation_card_id_list?.map((item, index) => (          
          // トークンは除外する

          !(item == "") &&
          <Center>
          <Button size="sm" variant="outline" color="dark" onClick={(e) => reraltionCardChange(e, item)}>
            エボルブ切り替え
          </Button>
          </Center>
          ))}
          </div>

          <Space h="xl" />
          <Space h="xl" />
        </div>
      )}      
    </div>
  )
}
import Image from 'next/image';
import { ScrollArea, Box, Stack } from '@mantine/core';
import { Grid, Switch, Button } from '@mantine/core';
import SveCard from './card'
import { CardInfo, CardDto, SearchConf, SearchConfDefault } from "./deck-edit-types";
import React, { useEffect, useState } from "react"
import CardSearch from "./deck-edit-card-search";

const searchedCardObj: Array<CardDto> = [];

let selectedCard : CardInfo = {
  cardid : "",
  cardlimit : 0,
  collaboname : "",
  cost : -1,
  hp : -1,
  atk : -1,
  imgpath : "",
  kind : [1],
  relation_card_id_list : []
};

let sortedCardList: Array<CardDto>;

export default function CardList ( props:any ) {

  const [searchedCardList, setSearchedCardList] = useState(searchedCardObj)
  // const [searchedCardList, setSearchedCardList] = useState<Array<CardDto>>([])
  const [searchConf, setSearchConf] = useState<SearchConf>(SearchConfDefault)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

   useEffect(() => {
    //SearchAndSort(searchConfDefault)
    SearchAndSort(SearchConfDefault)
   }, [props.cardList])

    // キーが入力されるたびに反応するイベントハンドラ
    const handleKeyDown = (event:any) => {
      // トークンは飛ばしたい
      let sortedCardListTmp = sortedCardList.filter(subArray => !subArray.kind_id_list.includes(5))
      let index = sortedCardListTmp.findIndex((elem) => elem.card_id === selectedCard.cardid);
      // console.log(index)   
      switch (event.key) {
        // case 'Enter' :
        //   props.onDeckEditFunc( selectedCard , 0)
        //   break;
        
        // case 'ArrowUp':
        //   props.onKeyInput('Up');
        //   break;
        // case 'ArrowDown':
        //   props.onKeyInput('Down');
        //   break;
        case 'ArrowLeft':
          props.onKeyInput('Left');
          // 現在位置 - 1
          if(index != -1 || index < sortedCardListTmp.length - 1) { 
            let cardDtoObj : CardDto = sortedCardListTmp.at(index-1) as CardDto
            let obj2 : CardInfo = {
              cardid : cardDtoObj?.card_id as string,
              imgpath : "/img/svedm/cardlist/" + cardDtoObj?.pack_id + "/" + cardDtoObj?.card_id + ".png",
              cost : cardDtoObj?.cost as number,
              hp : cardDtoObj?.hp as number,
              atk : cardDtoObj?.atk as number,
              collaboname : cardDtoObj?.collabo_name as string,
              kind : cardDtoObj?.kind_id_list as number[],
              cardlimit : cardDtoObj?.card_limit as number,
              relation_card_id_list : cardDtoObj?.relation_card_id_list as string[],
            }
            props.onCardFunc( obj2 )
            selectedCard = obj2
          }

          break;
        case 'ArrowRight':
          props.onKeyInput('Right');
          // 現在位置 + 1
          if(index != -1 ) {
            // 末尾だったら先頭に戻る
            let cardDtoObj : CardDto
            if (index < sortedCardListTmp.length-1 ) {
              cardDtoObj = sortedCardListTmp.at(index+1) as CardDto
            } else {
              cardDtoObj = sortedCardListTmp.at(0) as CardDto
            }
            let obj2 : CardInfo = {
              cardid : cardDtoObj?.card_id as string,
              imgpath : "/img/svedm/cardlist/" + cardDtoObj?.pack_id + "/" + cardDtoObj?.card_id + ".png",
              cost : cardDtoObj?.cost as number,
              hp : cardDtoObj?.hp as number,
              atk : cardDtoObj?.atk as number,
              collaboname : cardDtoObj?.collabo_name as string,
              kind : cardDtoObj?.kind_id_list as number[],
              cardlimit : cardDtoObj?.card_limit as number,
              relation_card_id_list : cardDtoObj?.relation_card_id_list as string[],
            }
            props.onCardFunc( obj2 )
            selectedCard = obj2
          }

          break;
        default:
          props.onKeyInput("");
          break;
      }
    }

  const containerStyle = {
    backgroundColor: 'gray',
    border: '1px solid',
  };

  const styleTest = {
    width : '90%'
  }




  // item.card_id, "/img/svedm/cardlist/" + item.pack_id + "/" + item.card_id + ".png", item.cost, item.collabo_name, item.kind_id_list, item.card_limit, item.relation_card_id_list
  const changeCard = (e : React.MouseEvent<HTMLDivElement, MouseEvent>, cardDto : CardDto) => {
    let obj : CardInfo = {
      cardid : cardDto.card_id,
      imgpath : "/img/svedm/cardlist/" + cardDto.pack_id + "/" + cardDto.card_id + ".png",
      cost : cardDto.cost,
      hp : cardDto.hp,
      atk : cardDto.atk,
      collaboname : cardDto.collabo_name,
      kind : cardDto.kind_id_list,
      cardlimit : cardDto.card_limit,
      relation_card_id_list : cardDto.relation_card_id_list,
    }
    props.onCardFunc( obj )

    // 追加
    // もし現在選択状態ならデッキに addしたい
    if (selectedCard.cardid == obj.cardid) {
      
      if ( obj.collaboname.includes("[E]") ) {
        // エボルブならエボルブデッキに追加
        props.onDeckEditFunc( obj , 2)
      } else {
        props.onDeckEditFunc( obj , 0)
      }
    } 

    selectedCard = obj
    // console.log(obj)

    return 
  };

  // カードの絞り込み、並び替え
  const SearchAndSort = (sconf : SearchConf) => {
    let seachSortList = Array.from(props.cardList as CardDto[])

    // 名前で絞り込みがある場合
    if (sconf.cardName != "") {
      seachSortList = seachSortList.filter(subArray => subArray.collabo_name.includes(sconf.cardName as string))
    }

    // テキストで絞り込みがある場合
    if (sconf.searchText != "") {
      seachSortList = seachSortList.filter(subArray => subArray.text.includes(sconf.searchText as string))
    }


    // 種族(type)で絞り込み
    if (sconf.cardType?.length as number > 0) {
      seachSortList = seachSortList.filter((dto) => {
        return sconf.cardType?.some((cardType) => dto.type_id_list.includes(cardType));
      });
    }

    // 効果(effect)で絞り込み
    if (sconf.cardEffect?.length as number > 0) {
      seachSortList = seachSortList.filter((dto) => {
        return sconf.cardEffect?.some((cardEffect) => dto.effect_id_list.includes(cardEffect));
      });
    }

    // 種類で絞り込み
    if (sconf.cardKind?.length as number > 0) {
      seachSortList = seachSortList.filter((dto) => {
        return sconf.cardKind?.some((cardKind) => dto.kind_id_list.includes(cardKind));
      });
    }

    // クラスで絞り込み
    if (sconf.class !== "both") {
      if (sconf.class == "class") {
        // ニュートラルを含まない
        seachSortList = seachSortList.filter(subArray => subArray.class_id != 7)
      } else if (sconf.class == "neutral") {
        // ニュートラルのみ
        seachSortList = seachSortList.filter(subArray => subArray.class_id == 7)
      }
      
    }

    // エボルブできるかで絞り込み
    if (sconf.canEvolve) {
      seachSortList = seachSortList.filter((item) => item.relation_card_id_list?.length >= 1 
        && item.relation_card_id_list?.at(0)?.length as number > 1)
    }

    // パックで絞り込み
    if (sconf.cardPack != 0) {
      seachSortList = seachSortList.filter((item) => item.pack_id === sconf.cardPack)
    }

    // エボルブのオンオフでカードの除外
    if (sconf.evolveFlag) {
      seachSortList = seachSortList.filter(subArray => subArray.kind_id_list.includes(2))
    } else {
      seachSortList = seachSortList.filter(subArray => !subArray.kind_id_list.includes(2))
      
      // コストの範囲で絞り込み
      if (sconf.costRange !== undefined) {
        let numMin = sconf.costRange[0]
        let numMax = sconf.costRange[1]
        if(sconf.costRange[1] == 10) {
          numMax = 99999
        }
        seachSortList = seachSortList.filter(subArray => {
          return subArray.cost >= numMin  && subArray.cost <= numMax
        })
      }
    }

    // HPの範囲で絞り込み
    if (sconf.hpRange !== undefined) {
      let numMin = sconf.hpRange[0]
      let numMax = sconf.hpRange[1]
      if(sconf.hpRange[1] == 10) {
        numMax = 99999
      }
      seachSortList = seachSortList.filter(subArray => {
        return subArray.hp >= numMin  && subArray.hp <= numMax
      })
    }

    // ATKの範囲で絞り込み
    if (sconf.atkRange !== undefined) {
      let numMin = sconf.atkRange[0]
      let numMax = sconf.atkRange[1]
      if(sconf.atkRange[1] == 10) {
        numMax = 99999
      }
      seachSortList = seachSortList.filter(subArray => {
        return subArray.atk >= numMin  && subArray.atk <= numMax
      })
    }

    // とりあえずコスト > ID順
    seachSortList.sort((a, b) => a.card_id.localeCompare(b.card_id));
    seachSortList.sort((a, b) => a.cost - b.cost);

    // リストの先頭を選択済みにする。
    if (seachSortList.at(0)) {
      selectedCard.cardid = (seachSortList?.at(0)?.card_id) as string
    }

    setSearchedCardList(seachSortList)
    // 矢印キーでの操作に必要
    sortedCardList = seachSortList
    // これいらないかも？
    setSearchConf(sconf)

    
  }

  // If session exists, display content
  return (
    <div>
    <CardSearch sconf={searchConf} onSearchFunc={SearchAndSort} cardList={searchedCardList}> </CardSearch>
    <Stack align="center">
      カードリスト
    </Stack>
    <ScrollArea>
    <Stack align="center" >
    {/* <ScrollArea w={350}> */}
    
      <Box h={600} w={"90%"}>
        <div style={styleTest}>
        <Grid columns={5} gutterXs="md" gutterMd="sm">
      
          {searchedCardList.map((item) => (          
          // トークンは除外する
          !item.kind_id_list.includes(5) &&
          <Grid.Col span={1} style={{ 
            backgroundColor : selectedCard.cardid == item.card_id ? 'white' : 'grey',
            border: '1px solid',
          }}>
            <div onClick={(e) => changeCard(e, item)}>
              
              <SveCard key={item.card_id} imageUrl= {"/img/svedm/cardlist/" + item.pack_id + "/" + item.card_id + ".png"}/>

            </div>     
          </Grid.Col>
          
          ))}


        </Grid>
        </div>
      </Box>
    </Stack>

    </ScrollArea>
    </div>
  )
}
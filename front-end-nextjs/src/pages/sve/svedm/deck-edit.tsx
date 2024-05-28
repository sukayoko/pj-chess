import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import AccessDenied from "components/access-denied"
import { useRouter } from 'next/router';
import {
  Button,
  TextInput,
  Grid,
  MediaQuery,
  useMantineTheme,
  Container,
  Flex,
  Space,
  Tabs,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import CardDetail from  "./deck-edit-card-detail";
import CardDeckArea from "./deck-edit-deck-area";
import CardList from "./deck-edit-card-list";
import { packMap } from "./svedm-map";
import { CardInfo, DeckDto, DeckDetailDto, CardDto } from "./deck-edit-types";
import DeckEditStatModal from "./deck-edit-stat-modal";
import { CircleStackIcon, StarIcon } from '@heroicons/react/24/solid'

// デッキ
const DeckObj: Array<CardInfo> = [];
// エボルブデッキsetDeck
const EvolveDeckObj: Array<CardInfo> = [];

export default function DeckEdit(props : any, ref : any) {
  const router = useRouter();
  const { data: session } = useSession()
  const [deckname, setDeckName] = useState(router.query.deckname)
  const [deckkind, setDeckKind] = useState(router.query.deckkind); // ココ
  const [edittype, setEditType] = useState(router.query.edittype); // ココ
  const [deckcode, setDeckCode] = useState(router.query.deckcode); // ココ
  const theme = useMantineTheme();

  const [selectCardObj, setCard] = useState<CardInfo>();
  const [deck, setDeck] = useState(DeckObj)
  const [evolvedeck, setEvolveDeck] = useState(EvolveDeckObj)
  // キーボード入力
  const [direction, setDirection] = useState("");
  const childRef = useRef(null);
  // 画面に表示するカード一覧を格納する変数
  const [cardlist, setCardList] = useState<CardDto[]>([]);

  useEffect(() => {
    // console.log("http://alforest.net:38081/api/v1/cards")
    // APIを呼び出してレスポンスを取得
    // クエリでクラスを指定
    //fetch(process.env.API_ENDPOINT_URL + "/cards" )
    const params = new URLSearchParams()
    params.append('class', deckkind as string )
    
    const url =  process.env.NEXT_PUBLIC_API_ENDPOINT_URL +  "/cards?" + 'class=' + deckkind

    if (edittype === 'new') {
      setDeckName("Deck Name")  
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // レスポンスのJSONをパースして配列に取得
        const parsedData = data.data;
        setCardList(parsedData);

          // 編集タイプが更新で、デッキコードが渡された場合はデッキを読み込む
        // sessionが存在するなら、デッキリストを取得する
        if (session && edittype === 'edit' || edittype === 'import') {
          let searchDeckData : DeckDto = {
          deck_code : deckcode as string
          } 

        const url =  process.env.NEXT_PUBLIC_API_ENDPOINT_URL +  "/deck/get"
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchDeckData),
        })
        .then(response => response.json())
        .then(data => {
          // レスポンスのJSONをパースして配列に取得
          const deckData = data.data

          let tmpDeck : Array<CardInfo> = [];
          let tmpEvplveDeck : Array<CardInfo> = [];

          // todo 通常とエボルブでデッキを分ける。
          deckData.forEach( (element:DeckDetailDto ) => {

            for (let c_num = 0; c_num < element.card_num; c_num++) {
              let tmpCard = searchCard(parsedData, element.card_id)

              let selectedCard : CardInfo = {
                cardid : element.card_id,
                imgpath : "/img/svedm/cardlist/" + packMap.get(element.card_id.split("-")[0]) + "/" + element.card_id + ".png",
                cost : tmpCard?.cost as number,
                hp : tmpCard?.hp as number,
                atk : tmpCard?.atk as number,
                collaboname : tmpCard?.collabo_name as string,
                kind : tmpCard?.kind_id_list as number[],
                cardlimit : tmpCard?.card_limit as number,
                relation_card_id_list : tmpCard?.relation_card_id_list as string[],
              }

              if( selectedCard.kind.includes(2) ) {
                tmpEvplveDeck.push(selectedCard)                
              } else {
                tmpDeck.push(selectedCard)
              }
            }
          });
          setDeck(tmpDeck)
          setEvolveDeck(tmpEvplveDeck)
        })
        .catch(error => {
          console.error('Error fetching items:', error);
        });
        }
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  },[]);
  

  if (!session) {
    return (
        <AccessDenied />
    )
  }

  // デッキ保存後メニューに飛ぶ
  // card_id でソートが必要
  const saveDeck = () => {
    const deckObj : DeckDto = {
      deck_code : deckcode as string,
      owner : session.user?.email as string,
      name : deckname as string,
      outline : "outline",
      deck_kind : parseInt(deckkind as string)
    }

    let deckDetailObj : DeckDetailDto
    let tempCid = ""
    let tempCardNum = 0

    const deckDetailObjArray : DeckDetailDto[] = []
    for (let i = 0; i < deck.length; i++) {
      tempCid = deck[i].cardid
      if (( i+1 ==  deck.length || tempCid !== deck[i+1].cardid )) {
        deckDetailObj = {
          card_id : tempCid,
          card_num : tempCardNum + 1,
          card_flag : 1
        }
        deckDetailObjArray.push(deckDetailObj)
        tempCardNum = 0
      } else {
        tempCardNum = tempCardNum + 1
      }
    }

    tempCid = ""
    tempCardNum = 0

    for (let i = 0; i < evolvedeck.length; i++) {
      tempCid = evolvedeck[i].cardid
      if (( i+1 ==  evolvedeck.length || tempCid !== evolvedeck[i+1].cardid )) {
        deckDetailObj = {
          card_id : tempCid,
          card_num : tempCardNum + 1,
          card_flag : 2
        }
        deckDetailObjArray.push(deckDetailObj)
        tempCardNum = 0
      } else {
        tempCardNum = tempCardNum + 1
      }
    }

    let tmpEditType = edittype
    // インポートの場合はデッキコードを新規に割り振り
    if (edittype === 'import') tmpEditType = 'new'

    const data = {
      // 送信するデータのキーと値を定義
      deck: deckObj,
      deck_details: deckDetailObjArray,
      edit_type : tmpEditType
    };

    const url =  process.env.NEXT_PUBLIC_API_ENDPOINT_URL +  "/deck/regist"
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        // console.log("dack saved")

        setDeckCode(data.data)
        // 新規の場合モードチェンジと deck_codeの保存
        if (edittype === 'new' || edittype === 'import'){
          setEditType('edit')        
        }

      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });

      notifications.show({
        title: 'デッキを保存完了',
        message: '',
      })

  };

  const returnMenu = () => {
    router.push({
        pathname : "menu", 
      })
  }

  // カードがクリックされたときの動作
  const handleInputKey = (val : string) => {
    setDirection(val)
  };

  // カードがクリックされたときの動作
  const handleClickCard = (val : CardInfo) => {
    setCard({
      cardid: val.cardid,
      imgpath: val.imgpath,
      cost : val.cost,
      hp : val.hp,
      atk : val.atk,
      collaboname : val.collaboname,
      kind : val.kind,
      cardlimit : val.cardlimit,
      relation_card_id_list : val.relation_card_id_list      
    })
  };

  // カードがクリックされたときの動作 検索する
  const handleClickCardWithCardId = (c_id : string) => {
    let cobj = cardlist.find((card) => card.card_id === c_id) as CardDto

    setCard({
      cardid: cobj.card_id,
      imgpath: "/img/svedm/cardlist/" + cobj.pack_id + "/" + cobj.card_id + ".png",
      cost : cobj.cost,
      hp : cobj.hp,
      atk : cobj.atk,
      collaboname : cobj.collabo_name,
      kind : cobj.kind_id_list,
      cardlimit : cobj.card_limit,
      relation_card_id_list : cobj.relation_card_id_list      
    })
  };

  // カードとデッキの操作を受け取る
  const handleDeckEdit = (val : CardInfo, ope : number) => {

    let tmpDeck : Array<CardInfo> = Array.from(deck);
    let tmpEvolveDeck : Array<CardInfo> = Array.from(evolvedeck);

    if(ope == 0 || ope == 1) {
      switch(ope) {
        // 追加  チェックは必要
        case 0:
          // デッキに上限枚数あったら追加しない
          if( tmpDeck.length < 50 && tmpDeck.reduce((total, card) => {
            if (card.cardid === val.cardid) {
              return total + 1;
            }
            return total;
          }, 0) < val.cardlimit ) {
            tmpDeck.push(val)
          }
        break;
        // 削除  チェックは必要
        case 1:
          let index = tmpDeck.findIndex(card => card.cardid === val.cardid);
          if (index !== -1) {
            tmpDeck = [...tmpDeck.slice(0, index), ...tmpDeck.slice(index + 1)];
          }

        break;
      }
    } else if (ope == 2 || ope == 3) {
      switch(ope) {
        // 追加  チェックは必要
        case 2:
          if( tmpEvolveDeck.length < 10 && tmpEvolveDeck.reduce((total, card) => {
            if (card.cardid === val.cardid) {
              return total + 1;
            }
            return total;
          }, 0) < val.cardlimit ) {
            tmpEvolveDeck.push(val)
          }
        break;
        // 削除  チェックは必要
        case 3:
          let index = tmpEvolveDeck.findIndex(card => card.cardid === val.cardid);
          if (index !== -1) {
            tmpEvolveDeck = [...tmpEvolveDeck.slice(0, index), ...tmpEvolveDeck.slice(index + 1)];
          }
        break;
      }
    }

    // フラグによって並び方を変える。基本はコスト昇順 ID順
    tmpDeck.sort((a, b) => a.cardid.localeCompare(b.cardid));
    tmpDeck.sort((a, b) => a.cost - b.cost);    
    tmpEvolveDeck.sort((a, b) => a.cardid.localeCompare(b.cardid));

    setDeck( tmpDeck )
    setEvolveDeck( tmpEvolveDeck )
    
  };

  // card_idをキーに要素を返却する
  const searchCard = (cList : CardDto[], card_id : string) : CardDto | undefined  => {
    return cList.find((item) => item.card_id === card_id)
  }

  return (
    <div>
      <Flex>
        <Button onClick={() => saveDeck()}>デッキ保存</Button>        
        <Space w="lg" />
        <DeckEditStatModal deck={deck} eDeck={evolvedeck} deckname={deckname}/>
        
        <Space w="lg" />
        <Space w="lg" />
        <Button onClick={() => returnMenu()} color="red">戻る</Button>
    </Flex>

    <Container size={"20%"}>
      <TextInput  onChange={ (event)  => setDeckName(event.target.value)} defaultValue={deckname} maxLength={16}/>      
    </Container>
    
    <Grid columns={24} gutter={0}>
      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Grid.Col span={6}>          
          <CardDetail {...selectCardObj} onDeckEditFunc={handleDeckEdit} onRelCardFunc={handleClickCardWithCardId}></CardDetail>
        </Grid.Col>
      </MediaQuery>  
        <Grid.Col span={12}>
          <CardDeckArea deck={deck} evolveDeck={evolvedeck} onCardFunc={handleClickCard} >            
          </CardDeckArea>
        </Grid.Col>  
      <Grid.Col span={6}>
        {/* タブ */}
        <Tabs defaultValue="cardlist">
          <Tabs.List>
            <Tabs.Tab value="cardlist" icon={<CircleStackIcon />}>カードリスト</Tabs.Tab>
            <Tabs.Tab value="favorite" icon={<StarIcon />}>お気に入り</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="cardlist" pt="xs">
            <CardList onCardFunc={handleClickCard} onDeckEditFunc={handleDeckEdit} onKeyInput={handleInputKey} cardList={cardlist}></CardList>
          </Tabs.Panel>
          <Tabs.Panel value="favorite" pt="xs">
            開発中
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
    </div>
    );
}

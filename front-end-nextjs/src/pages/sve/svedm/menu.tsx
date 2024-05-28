import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import AccessDenied from "components/access-denied"
import { useRouter } from 'next/router';
import { Grid, Button,rem, Center, Text, Container  } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid'
import { useDisclosure } from '@mantine/hooks';
import MenuDeckCreateModal from "./menu-deck-create-modal";
import MenuDeckImportModal from "./menu-deck-import-modal";
import MenuDeckOptionModal from "./menu-deck-option-modal";
import { DeckDto, UserDto } from "./deck-edit-types";
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid'
import { classTitleMap, classColorMap } from "./svedm-map";



export default function Menu() {
  const router = useRouter()
  const [select, setSelect] = useState("class");
  const { data: session } = useSession()
  const [myDeckList, setDeckList] = useState<DeckDto[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  // 画面再描写用
  const [data, setData] = useState(0);


  useEffect(() => {
    // sessionが存在するなら、デッキリストを取得する
    if (session) {
    let userData : UserDto = {
      name : session?.user?.name as string,
      email : session?.user?.email as string,
    }

    const url =  process.env.NEXT_PUBLIC_API_ENDPOINT_URL +  "/decks/get"
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        // レスポンスのJSONをパースして配列に取得
        const parsedData = data.data;
        setDeckList(parsedData);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
    }
  }, []);

  // If no session exists, display access denied message
  if (!session) {
    return (
        <AccessDenied />
    )
  }

  const selectDeckKind = (value : string) => {
    setSelect(value);
  };

  // デッキ作成画面へ飛びたい
  const defineDeckKind = (value : string) => {
    console.log(value);
  };

  // デッキ作成画面へ飛びたい
  const editDeck = (d_code : string, d_name : string, d_kind : number) => {
    router.push({
        pathname : "deck-edit", 
        query : { 
            deckcode : d_code,
            deckname : d_name,
            deckkind : d_kind,
            edittype : "edit"
         }
    })
  };


  // デッキを削除してメニューへ
  const deleteDeck = (d_code : string) => {
    console.log("delete")

    const deckObj : DeckDto = {
      deck_code : d_code
    }

    const url =  process.env.NEXT_PUBLIC_API_ENDPOINT_URL +  "/deck"
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deckObj),
    })
      .then(response => response.json())
      .then(data => {

        // モーダルクローズ
        close()
        // ブラウザ上からも削除して画面更新させる
        let tmpDeck : Array<DeckDto> = Array.from(myDeckList);
        tmpDeck = myDeckList.filter( DeckDto => DeckDto.deck_code !== d_code )
        setDeckList(tmpDeck)
        // 削除完了
        notifications.show({
          title: 'デッキを削除',
          message: "デッキコード:" + d_code,
        })
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  };

  // If session exists, display content
  return (
    <div>
        <div>
            <h1>デッキ新規作成</h1>
            <MenuDeckCreateModal/>
        </div>
            <br/>
            <MenuDeckImportModal/>

        <h1>デッキ一覧</h1>
          <Container size="100rem">
            {/* デッキ一覧を取得して表示 */}
            <Grid columns={10} gutterXs="md" gutterMd="sm" >
              {myDeckList.map((item, index) => (
                <Grid.Col span={1} style={{ minHeight: rem(100), border:"medium solid "}}>
                  <Button fullWidth={true} onClick={() => editDeck(item.deck_code as string, item.name as string, item.deck_kind as number) }
                     color={classColorMap.get(item.deck_kind as number)} >
                  {classTitleMap.get(item.deck_kind as number)} <br/>
                  </Button>
                  {item.name}

                  <MenuDeckOptionModal deck={item} deleteDeck={deleteDeck}/>
                </Grid.Col>

              ))}
            </Grid>
          </Container>

        {/* もし管理者なら表示 */}
        <br/>
        <br/>
        <br/>
        {/* <Link href="/sve/svedm/admin-edit">カード修正</Link> */}

    </div>
    
  )
}
import { useState } from "react"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';

export default function MenuDeckImportModal() {
    const [result, setResult] = useState(true);
    const [deckCode, setDeckCode] = useState('')
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter()

    // deck_codeから情報を読み取る。
    const getDeckFromDeckCode = (d_code : string) => {
      const url =  process.env.NEXT_PUBLIC_API_ENDPOINT_URL +  "/deck?" + "deck_code=" +  d_code
     
      fetch(url, {
        method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
          // もし dataが存在すれば
          console.log(data)
          if (d_code != "" && data.data.deck_code != "") {
            // レスポンスのJSONをパースして配列に取得
            // console.log(data.data)
            importDeck(data.data.deck_code, data.data.deck_name, data.data.deck_kind)
          } else {
            // console.log("error")
            setResult(false)
          }
        })
        .catch(error => {
          console.error('Error fetching items:', error);
        });        
    }

    // デッキ作成画面へ飛ぶ
    const importDeck = (d_code : string, d_name : string, d_kind : number) => {
      router.push({
          pathname : "deck-edit", 
          query : { 
            deckcode : d_code,
            deckname : "インポート",
            deckkind : d_kind,
            edittype : "import"
         }
      })
    };

  // If session exists, display content
  return (
    <div>
            {/* デッキ新規作成ページへのリンク */}
            <Modal opened={opened} onClose={close} title="デッキインポート">
                {/* ボタンを押したら押した値をバリューにリンク先へ遷移 */}
                <p>デッキコードを入力</p>
                <TextInput
                placeholder="デッキコード"
                value={deckCode} onChange={(event) => setDeckCode(event.currentTarget.value)} />
                <br/>
                <Button onClick={() => getDeckFromDeckCode(deckCode)}>インポート</Button>
                {result ?
                <>
                </>
                :
                <>
                  <br/>
                  指定したデッキコードは存在しません。
                </>
               }
            </Modal>

            <Group position="center">
                <Button onClick={open}>デッキインポート</Button>
            </Group>
        </div> 
  )
}
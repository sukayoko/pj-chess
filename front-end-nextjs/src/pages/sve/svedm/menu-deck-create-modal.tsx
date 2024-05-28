import { useState, useEffect } from "react"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, SegmentedControl, SimpleGrid  } from '@mantine/core';
import { useRouter } from 'next/router';
import { classTitleMap, classColorMap } from "./svedm-map";
import { create } from "domain";

export default function MenuDeckCreateModal() {
    const [select, setSelect] = useState("class");
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter()

    const selectDeckKind = (value : string) => {
        setSelect(value);
      };
    
      // デッキ作成画面へ飛びたい
      const defineDeckKind = (value : string) => {
        router.push({
            pathname : "deck-edit", 
            query : { 
                edittype : "new",
                deckkind : value,
             }
        })
      };

      const closeModal = () => {
        setSelect('class');
        close()
      }

  // If session exists, display content
  return (
    <div>
            {/* デッキ新規作成ページへのリンク */}
            <Modal opened={opened} onClose={closeModal} title="デッキ新規作成">
                {/* ボタンを押したら押した値をバリューにリンク先へ遷移 */}
                <p>デッキの種別</p>
                <SegmentedControl
                    onChange = {selectDeckKind}
                    data={[
                        { value: 'class', label: 'クラス' },
                        { value: 'title', label: 'タイトル' }
                ]}/>

                {select === 'class' ?
                <>
                <p>クラス選択</p>
                 
                <SimpleGrid cols={3}>
                    <div>
                        <Button onClick={() => defineDeckKind("1") } color={classColorMap.get(1)}>
                            エルフ
                        </Button>
                    </div>
                    <div>
                        <Button  onClick={() => defineDeckKind("2") } color={classColorMap.get(2)}>
                            ロイヤル
                        </Button>
                    </div>
                    <div>
                        <Button  onClick={() => defineDeckKind("3") } color={classColorMap.get(3)}>
                            ウィッチ
                        </Button>
                    </div>
                    <div>
                        <Button  onClick={() => defineDeckKind("4") } color={classColorMap.get(4)}>
                            ドラゴン
                        </Button>
                    </div>
                    <div>
                        <Button  onClick={() => defineDeckKind("5") } color={classColorMap.get(5)}>
                            ナイトメア
                        </Button>
                    </div>
                    <div>
                        <Button  onClick={() => defineDeckKind("6") } color={classColorMap.get(6)}>
                            ビショップ
                        </Button>
                    </div>
                    <div>
                        <Button  onClick={() => defineDeckKind("7") } color={classColorMap.get(7)}>
                            ニュートラル
                        </Button>
                    </div>                
                </SimpleGrid>
                </>
                :
                <>
                <p>タイトル選択</p>
                <SimpleGrid cols={4}>
                    <div>
                        <Button  onClick={() => defineDeckKind("101") } color={classColorMap.get(101)}>
                            ウマ娘
                        </Button>
                    </div>
                    <div>
                        <Button  onClick={() => defineDeckKind("102") } color={classColorMap.get(102)}>
                            デレステ
                        </Button>
                    </div>
                </SimpleGrid>
                </>
                }
            </Modal>

            <Group position="center">
                <Button onClick={open}>デッキ作成</Button>
            </Group>
        </div> 
  )
}
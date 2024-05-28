import { useState, useEffect } from "react"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Space, Flex, Grid } from '@mantine/core';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
import { CardInfo } from "./deck-edit-types";
import SveCard from './card'
import { saveAs } from "file-saver";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },    
  plugins: {
    // legend表示したくない
    legend: {
      position: 'right' as const,
    },
    //   title: {
    //     display: true,
    //     text: 'コスト一覧',
    //   },
  },
};

let labels = ['0','1','2','3','4','5','6','7','8','9','10+'];


// デッキ
let shuffleDeckObj: Array<CardInfo> = [];

export default function DeckEditStatModal( props : any ) {
    const [opened, { open, close }] = useDisclosure(false);
    const [cardCount, setCardCount] = useState(0)

    const containerStyle = {
        backgroundColor: 'gray',
        border: '1px solid',
    };

    const closeWraper = () => {
        setCardCount( 0 )
        close()
    }

    const deckShuffle = () => {
        let tmpDeck : Array<CardInfo> = Array.from(props.deck);
        for (let i = tmpDeck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tmpDeck[i], tmpDeck[j]] = [tmpDeck[j], tmpDeck[i]];
        }
        shuffleDeckObj = tmpDeck
    }

    const drawCard = (num : number) => {
        if(cardCount == 0) {
            deckShuffle()
        }

        setCardCount( cardCount + num )
    }

    const resetAndShuffle = () => {
        setCardCount( 0 )
    }

    let followerArrayNum : number[] = new Array(11).fill(0);
    let spellArrayNum : number[] = new Array(11).fill(0);
    let amuletArrayNum : number[] = new Array(11).fill(0);
    // ここだと何回も呼び出されてしまう？
    // console.log(arrayNum)
    for (let i = 0; i < props.deck.length; i++) {
        // arrayNum. arrayNum.at(props.deck.at(i).cost) + 1
        // 
        let index = props.deck.at(i).cost
        if (index > 10) index = 10

        if (props.deck.at(i).kind.includes(1)) {
          followerArrayNum[props.deck.at(i).cost] += 1
        } else if (props.deck.at(i).kind.includes(3)) {
          spellArrayNum[props.deck.at(i).cost] += 1
        } else if (props.deck.at(i).kind.includes(4)) {
          amuletArrayNum[props.deck.at(i).cost] += 1
        }
    }


    let data = {
        labels,
        datasets: [
          {
            label: 'フォロワー',
            data: followerArrayNum,
            backgroundColor: 'rgb(255, 99, 132)',
          },
          {
            label: 'スペル',
            data: spellArrayNum,
            backgroundColor: 'rgb(53, 162, 235)',
          },
          {
            label: 'アミュレット',
            data: amuletArrayNum,
            backgroundColor: 'rgb(75, 192, 192)',
          }
        ],
      };


  const handleDownload = () => {
    // CSVデータを生成する（ここではハードコード）
    let csvData = "カード名, 枚数";
    const cardCounter: Record<string, number> = {};
    const evolveCardCounter: Record<string, number> = {};

    // カード毎に枚数を出す
    props.deck.forEach((card : CardInfo)=> {
      cardCounter[card.collaboname] = (cardCounter[card.collaboname] || 0) + 1;
    });
    for ( const [key, value] of Object.entries(cardCounter)) {
      csvData = csvData + "\n" + key + "," +  value
    }

    props.eDeck.forEach((card : CardInfo)=> {
      evolveCardCounter[card.collaboname] = (evolveCardCounter[card.collaboname] || 0) + 1;
    });
    for ( const [key, value] of Object.entries(evolveCardCounter)) {
      csvData = csvData + "\n" + key + "," +  value
    }

    // Blobオブジェクトを作成
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

    // // ファイルを保存
    saveAs(blob, props.deckname + ".csv");
  };
      


  return (
    <div>
            <Modal opened={opened} onClose={closeWraper} title="デッキメニュー" size="80%">
                <Button onClick={() => handleDownload()}>CSVダウンロード</Button>
               
                <p>デッキ統計</p>
                <div >
                    <Bar options={options} data={data} height={200}/>
                </div>

                <p>お試しドロー</p>
                <Flex>
                    <Button onClick={() => drawCard(4)}>4枚ドロー</Button>
                    <Space w="lg" />
                    <Button onClick={() => drawCard(1)}>1枚ドロー</Button>
                    <Space w="lg" />
                    <Button onClick={() => resetAndShuffle()}>リセット</Button>
                </Flex>

                <Space h="lg" />

                <Grid columns={10} gutter={5} gutterXs="md" gutterMd="sm">
      
                    {shuffleDeckObj.map((cardinfo:CardInfo, index:number) => (    
                    (index < cardCount) &&
                    <Grid.Col span={1} style={containerStyle}>           
                        <SveCard key={cardinfo.cardid} imageUrl={cardinfo.imgpath} />
                    </Grid.Col>
                    ))}
                </Grid>
            </Modal>
            <Button onClick={open}>デッキメニュー</Button>
    </div> 
  )
}
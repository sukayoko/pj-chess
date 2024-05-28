import SveCard from './card'
import { TextInput, Input, Button, Center, Flex, Container,Textarea  } from '@mantine/core';
import { useForm } from '@mantine/form';
import { packMap } from "./svedm-map";
import { CardDto } from "./deck-edit-types";
import { useState } from "react"
import router, { useRouter } from 'next/router';

// let cardObj : CardDto
function isNumericString(input: string): boolean {
    return /^[0-9]+$/.test(input);
  }

export default function CardAdminEdit ( props : any ) {

    const [cardObj, setCardObj] = useState<CardDto>();
    const router = useRouter();

    const [id, setid] = useState("")
    const [card_id, setcard_id] = useState("")
    const [pack_id, setpack_id] = useState("")
    const [name, setname] = useState("")
    const [class_id, setclass_id] = useState("")
    const [title_id, settitle_id] = useState("")
    const [kind_id_list, setkind_id_list] = useState("")
    const [type_id_list, settype_id_list] = useState("")
    const [effect_id_list, seteffect_id_list] = useState("")
    const [cost, setcost] = useState("")
    const [text, settext] = useState("")
    const [atk, setatk] = useState("")
    const [hp, sethp] = useState("")
    const [rarity_id, setrarity_id] = useState("")
    const [collabo_name, setcollabo_name] = useState("")
    const [relation_card_id_list, setrelation_card_id_list] = useState("")
    const [card_limit, setcard_limit] = useState("")

    const form = useForm({
        initialValues: {
          id_tmp: '',
        },
      });

  // カードを一枚取得
  // id もしくは card_id
  const getCard = (param : string) => {
    // 文字列から id か cardid か判別
    // アルファベットが含まれたら cardid

    let url =  process.env.NEXT_PUBLIC_API_ENDPOINT_URL +  "/card?"

    if ( isNumericString(param) ) {
        url = url + "id=" + param
        //url = url + "id=" + "1"
    } else {
        url = url + "card_id=" + param
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // レスポンスのJSONをパースして配列に取得
        let cobj : CardDto = {
            id : data.data.id as number,
            card_id : data.data.card_id as string,
            pack_id : data.data.pack_id as number,
            name : data.data.name as string,
            class_id : data.data.class_id  as number,
            title_id : data.data.title_id as number,
            kind_id_list : data.data.kind_id_list as number[],
            type_id_list : data.data.type_id_list as number[],
            effect_id_list : data.data.effect_id_list as number[],
            cost : data.data.cost as number,
            text : data.data.text as string,
            atk : data.data.atk as number,
            hp : data.data.hp as number,
            rarity_id: data.data.rarity_id as number,
            collabo_name : data.data.collabo_name as string,
            relation_card_id_list : data.data.relation_card_id_list as string[],
            card_limit : data.data.card_limit as number
        }

        setCardObj(cobj)
        setid(cobj.id.toString())
        setcard_id(cobj.card_id)
        setpack_id(cobj.pack_id.toString())
        setname(cobj.name)
        setclass_id(cobj.class_id.toString())
        settitle_id(cobj.title_id.toString())
        setcost(cobj.cost.toString())
        settext(cobj.text)
        setatk(cobj.atk.toString())
        sethp(cobj.hp.toString())
        setrarity_id(cobj.rarity_id.toString())
        setcollabo_name(cobj.collabo_name)
        setcard_limit(cobj.card_limit.toString())
        setkind_id_list(cobj.kind_id_list?.toString())
        settype_id_list(cobj.type_id_list?.toString())
        seteffect_id_list(cobj.effect_id_list?.toString())
        // setrelation_card_id_list(cobj.relation_card_id_list?.toString())
        setrelation_card_id_list(cobj.relation_card_id_list ? cobj.relation_card_id_list?.toString() : "")
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }

  const getNextCard  = (num: number) => {

    let nextNum = (cardObj?.id as number) + num
    form.setFieldValue('id', nextNum.toString())
    getCard( nextNum.toString())
  }

  const updateCard = () => {
    // 文字列から id か cardid か判別
    // アルファベットが含まれたら cardid
    let url =  process.env.NEXT_PUBLIC_API_ENDPOINT_URL +  "/card?"
    
    let cobj : CardDto = {
        id : parseInt(id),
        card_id : card_id,
        pack_id :  parseInt(pack_id),
        name :  name,
        class_id :  parseInt(class_id),
        title_id :  parseInt(title_id),
        kind_id_list :  convertCommaSeparatedStringToArray(kind_id_list),
        type_id_list :  convertCommaSeparatedStringToArray(type_id_list),
        effect_id_list :  convertCommaSeparatedStringToArray(effect_id_list),
        cost :  parseInt(cost),
        text :  text,
        atk :  parseInt(atk),
        hp :  parseInt(hp),
        rarity_id: parseInt(rarity_id),
        collabo_name :  collabo_name,
        relation_card_id_list :  convertCommaSeparatedStringToStrArray(relation_card_id_list),
        card_limit : parseInt(card_limit),
    }

    fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cobj),
        })
      .then(response => response.json())
      .then(data => {

      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }

  // カンマ区切りの文字列を文字列の配列に変換する関数
  function convertCommaSeparatedStringToStrArray(str: string): string[] {
    const stringArray = str.split(","); // カンマで文字列を分割
  
    return stringArray;
  }

  // カンマ区切りの文字列を数値の配列に変換する関数
  function convertCommaSeparatedStringToArray(str: string): number[] {
    const stringArray = str.split(","); // カンマで文字列を分割
    const numberArray = stringArray?.map((s) => parseFloat(s.trim())); // 各文字列を数値に変換
  
    return numberArray;
  }

  

  const returnMenu = () => {
    router.push({
        pathname : "menu", 
      })
  }

  const divStyle = {
    width : "22%",
    cssFloat: 'left',
  };


  return (
    <>
    <Button onClick={() => returnMenu()}>戻る</Button>
     <Center maw={400} h={100} mx="auto">
        <TextInput placeholder="CardID or ID" {...form.getInputProps('id_tmp')}/>
        <Button onClick={() => getCard( form.getInputProps('id_tmp').value.toString() )} >表示</Button>
     </Center>

     

     { cardObj === undefined  ? (
        <p>カード未選択</p>
      ) : ( 
     <>

    <div style={divStyle}>
        <SveCard key="1" imageUrl={"/img/svedm/cardlist/" + cardObj.pack_id + "/" + cardObj.card_id + ".png"} />
     </div>

     <Flex
      bg="rgba(0, 0, 0, .1)"
      gap="md"
      justify="flex-start"
      align="flex-start"
      direction="row"
      wrap="wrap"
    >
      <Container>
        id : 
        <TextInput disabled onChange={ (event)  => setid(event.target.value)} value={id} />
      </Container>
      <Container>
        card_id :
        <TextInput disabled onChange={ (event)  => setcard_id(event.target.value)} value={card_id}/>
      </Container>
      <Container>
        pack_id : 
        <TextInput onChange={ (event)  => setpack_id(event.target.value)} value={pack_id} />
      </Container>
      
      <Container>
        class_id :
        <TextInput onChange={ (event)  => setclass_id(event.target.value)} value={class_id}/>
      </Container>
      
      <Container>
        title_id :
        <TextInput onChange={ (event)  => settitle_id(event.target.value)} value={title_id}/>
      </Container>

      <Container>
        card_limit :
        <TextInput onChange={ (event)  => setcard_limit(event.target.value)} value={card_limit}/>
      </Container>
      
      
      <Container>
        <TextInput onChange={ (event)  => setcost(event.target.value)} value={cost} label="cost" withAsterisk/>
      </Container>
      <Container>
        <TextInput onChange={ (event)  => setatk(event.target.value)} value={atk} label="atk" withAsterisk/>
      </Container>
      <Container>
        <TextInput onChange={ (event)  => sethp(event.target.value)} value={hp} label="hp" withAsterisk/>
      </Container>
      <Container>
        <TextInput onChange={ (event)  => setrelation_card_id_list(event.target.value)} value={relation_card_id_list} label="relation_card_id_list" withAsterisk/>
      </Container>
      <Container>
        <TextInput onChange={ (event)  => settype_id_list(event.target.value)} value={type_id_list} label="type_id_list" withAsterisk/>
      </Container>
      <Container>
        kind_id_list : 
        <TextInput onChange={ (event)  => setkind_id_list(event.target.value)} value={kind_id_list}/>
      </Container>
      <Container>
        <TextInput onChange={ (event)  => seteffect_id_list(event.target.value)} value={effect_id_list} label="effect_id_list" withAsterisk/>
      </Container>
      
      <Container>
        <TextInput onChange={ (event)  => setrarity_id(event.target.value)} value={rarity_id} label="rarity_id"/>
      </Container>

    </Flex>
    <Container>
      <TextInput onChange={ (event)  => setname(event.target.value)} value={name} label="name" withAsterisk/>
    </Container>
    <Container>
      <TextInput onChange={ (event)  => setcollabo_name(event.target.value)} value={collabo_name} label="collabo_name" withAsterisk/>
    </Container>
    <Container>
        <Textarea minRows={10} onChange={ (event)  => settext(event.target.value)} value={text} label="text" withAsterisk/>
    </Container>
    <Button onClick={() => updateCard()}>更新</Button>
          　　
    <Button onClick={() => getNextCard(-1) } >ID 前へ</Button>
          　
    <Button onClick={() => getNextCard(1) } >ID 次へ</Button>

    </>
    
    )}

    
    </>
  )
}
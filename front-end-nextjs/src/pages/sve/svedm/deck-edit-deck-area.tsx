import Image from 'next/image';
import { Grid, Indicator, Flex, ActionIcon } from '@mantine/core';
import SveCard from './card'
import { CardDto, CardInfo } from "./deck-edit-types";

export default function CardDeckArea( props : any) {
  const containerStyle = {
    backgroundColor: 'gray',
    border: '1px solid',
  };

  const changeCard = (e : React.MouseEvent<HTMLDivElement, MouseEvent>, cardinfo : CardInfo) => {
    let obj : CardInfo = {
      cardid : cardinfo.cardid,
      imgpath : cardinfo.imgpath,
      cost : cardinfo.cost,
      hp : cardinfo.hp,
      atk : cardinfo.atk,
      collaboname : cardinfo.collaboname,
      kind : cardinfo.kind,
      cardlimit : cardinfo.cardlimit,
      relation_card_id_list : cardinfo.relation_card_id_list
    }
    props.onCardFunc( obj )
    return 
  };

  // style
  const divStyle = {
    padding: '3%',
  };

  // If session exists, display content
  return (
    <div>
      {/* // 上から50くらい */}
      <div style={divStyle}>
      deck : {props.deck.length}
      <br/>
      <Grid columns={10} gutter={5} gutterXs="md" gutterMd="sm">
      
      {props.deck.map((cardinfo:CardInfo) => (    
          <Grid.Col span={1} style={containerStyle}>
            {/* お気に入り情報を記録するにはカードの種類ごとに情報が必要 */}
            {/* <Flex  justify="flex-end" >
              {cardinfo?.favorite_flag == true ? 
                <ActionIcon color="yellow" size="xs" variant="filled"><StarIcon/></ActionIcon>
              :
                <ActionIcon color="yellow" size="xs" variant="outline"><StarIcon/></ActionIcon>
              }
            </Flex> */}
            {/* <Switch size="xs"  checked={true}/> */}
            <Indicator position="top-start"  color="dark" label={cardinfo.cost} size={24} offset={4}>
            <Indicator position="bottom-start"  color="blue" label={ (cardinfo.atk != 9999) ? cardinfo.atk : '-'} size={24} offset={4}>            
            <Indicator position="bottom-end"  color="red" label={ (cardinfo.hp != 9999) ? cardinfo.hp : '-' } size={24} offset={4}>            
            <div onClick={(e) => changeCard(e, cardinfo)}>              
              <SveCard key={cardinfo.cardid} imageUrl={cardinfo.imgpath} />
            </div>
            </Indicator>
            </Indicator>
            </Indicator>
          </Grid.Col>
      ))}

      </Grid>



      {/* // エクストラ */}
      evolve : {props.evolveDeck.length}
      <Grid columns={10} gutter={5} gutterXs="md" gutterMd="sm">

      {props.evolveDeck.map((cardinfo:CardInfo) => (    
          <Grid.Col span={1} style={containerStyle}>
            <div onClick={(e) => changeCard(e, cardinfo)}>
              <SveCard key={cardinfo.cardid} imageUrl={cardinfo.imgpath} />
            </div>
          </Grid.Col>
      ))}

      </Grid>

      {/* // マナカーブ */}
      </div>
    </div>
  )
}
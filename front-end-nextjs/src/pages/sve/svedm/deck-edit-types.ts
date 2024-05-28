// 構造体の定義
// ユーザ
export interface UserDto {
  name : string;
  email : string;
}

// 画面上で表示するためのカード情報
export interface CardInfo {
  cardid: string;
  imgpath: string;
  cost: number;
  hp: number;
  atk: number;
  collaboname: string;
  kind: number[];
  cardlimit : number;
  relation_card_id_list : string[];
  // 追加
  favorite_flag? : boolean;
}

// 構造体の定義
// DBから取得するカード DTO
export interface CardDto {
  id: number;
  card_id: string;
  pack_id: number;
  name: string;
  class_id : number;
  title_id : number;
  kind_id_list : number[];
  type_id_list : number[];
  effect_id_list : number[];
  cost : number;
  text : string;
  atk : number;
  hp : number;
  rarity_id : number;
  collabo_name : string;
  relation_card_id_list : string[];
  card_limit : number;
}

// DBから取得するデッキ DTO
export interface DeckDto {
  id?: number;
  deck_code?: string;
  owner?: string;
  name?: string;
  outline?: string;
  created_at? : string;
  update_at? : string;
  deck_kind? : number;
}

// DBから取得するデッキ詳細 DTO
export interface DeckDetailDto {
  id?: number;
  deck_id?: string;
  card_id : string;
  card_num : number;
  card_flag : number;
}


// 検索条件の構造体
export interface SearchConf {
  evolveFlag?: boolean,
  costRange? : [number,number],
  hpRange? : [number,number], 
  atkRange? : [number,number],
  cardName? : string,
  cardType? : number[],
  cardEffect? : number[],
  packId? : number,
  cardKind? : number[],
  cardPack? : number,
  canEvolve ? : boolean,
  class ? : string,
  searchText ? : string,
}

// searchConfのデフォルト
export const SearchConfDefault : SearchConf = {
  evolveFlag : false,
  costRange : [0,10],
  hpRange : [0,10],
  atkRange : [0,10],
  cardKind : [],
  cardType : [],
  cardName : "",
  packId : 0,
  cardPack : 0,
  class : "both",
  searchText : "",
}
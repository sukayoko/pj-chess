
export const classTitleMap = new Map([
  [1 , "エルフ"],
  [2, "ロイヤル"],
  [3, "ウィッチ"],
  [4, "ドラゴン"],
  [5, "ナイトメア"],
  [6, "ビショップ"],
  [7, "ニュートラル"],
  [101, "ウマ娘"],
  [102, "デレステ"]
]);

export const classColorMap = new Map([
  [1 , "green"],
  [2, "yellow.6"],
  [3, "blue.9"],
  [4, "orange"],
  [5, "pink.8"],
  [6, "pink.3"],
  [7, "gray.6"],
  [101, "dark.6"],
  [102, "blue.5"]
]);


export const packMap = new Map([
    ["" , "0"],
    ["sd01", "1"],
    ["sd02", "2"],
    ["sd03", "3"],
    ["sd04", "4"],
    ["sd05", "5"],
    ["sd06", "6"],
    ["bp01", "7"],
    ["bp02", "8"],
    ["cp01", "9"],
    ["csd01", "10"],
    ["etd01", "11"],
    ["etd02", "12"],
    ["etd03", "13"],
    ["bp03", "14"],
    ["bp04", "15"],
    ["bp05", "16"],
    ["bp06", "17"],
    ["csd02a", "18"],
    ["csd02b", "19"],
    ["csd02c", "20"],
    ["cp02", "21"],
    ["bp07", "22"],
  ]);


  export const packData = [
    { value: '1' , label: 'スターターデッキ 麗しの妖精姫'},
    { value: '2' , label: 'スターターデッキ 怨讐刀鬼'},
    { value: '3' , label: 'スターターデッキ 神秘錬成'},
    { value: '4' , label: 'スターターデッキ 蛇竜の爪牙'},
    { value: '5' , label: 'スターターデッキ 永久なる定め'},
    { value: '6' , label: 'スターターデッキ 穢れし洗礼'},
    { value: '7' , label: '創世の夜明け'},
    { value: '8' , label: '黒銀のバハムート'},
    { value: '9' , label: 'ウマ娘 プリティーダービー'},
    { value: '10' , label: '出走！ウマ娘！'},
    { value: '11' , label: 'シャドウバースＦ 天竜ライト'},
    { value: '12' , label: 'シャドウバースＦ 真壁スバル'},
    { value: '13' , label: 'シャドウバースＦ 蜜田川イツキ'},
    { value: '14' , label: 'フレイム・オブ・レーヴァテイン'},
    { value: '15' , label: '天星神話'},
    { value: '16' , label: '永劫なる絶傑'},
    { value: '17' , label: '絶対なる覇者'},
    { value: '18' , label: 'コラボスターターデッキ「Cute」'},
    { value: '19' , label: 'コラボスターターデッキ「Cool」'},
    { value: '20' , label: 'コラボスターターデッキ「Passion」'},
    { value: '21' , label: 'コラボパック「アイドルマスター シンデレラガールズ」'},
    { value: '22' , label: '森羅鋼鉄'},
  ];


  export const kindData = [
    { value: '1', label: 'follower' },
    { value: '2', label: 'evolve' },
    { value: '3', label: 'spell' },
    { value: '4', label: 'amulet' },
    { value: '5', label: 'token' },
    { value: '6', label: 'leader' },
    { value: '7', label: 'ep' },
  ];

  export function MapConvert (labelList : string[], tgtMap : Array<{ value: string; label: string; }>) : number[] {
    return labelList.map((label) => {
      const matchingItem = tgtMap.find((item) => item.label === label);
      return matchingItem ? parseInt(matchingItem.value, 10) : 0;
    });
  }


  export function StrConvert (labelList : string[]) : number[] {
    let numberList: number[] = labelList.map((label) => Number(label));
    return numberList
  }

  export const typeData = [
    {label: 'BNW', value: '1' },
    {label: 'アイドル', value: '2' },
    {label: 'ウマ娘', value: '3' },
    {label: 'エルフ族', value: '4' },
    {label: 'キラー', value: '5' },
    {label: 'クリスタリア', value: '6' },
    {label: 'ゴーレム', value: '7' },
    {label: 'コック', value: '8' },
    {label: 'ゴブリン', value: '9' },
    {label: 'ゴルゴーン', value: '10' },
    {label: 'シンガー', value: '11' },
    {label: 'ダンサー', value: '12' },
    {label: 'チェス', value: '13' },
    {label: 'ドラゴニュート', value: '14' },
    {label: 'トレセン学園', value: '15' },
    {label: 'ヒーロー', value: '16' },
    {label: 'プリンス', value: '17' },
    {label: 'プリンセス', value: '18' },
    {label: 'マグナ', value: '19' },
    {label: 'メイド', value: '20' },
    {label: 'メジロ家', value: '21' },
    {label: 'レヴィオン', value: '22' },
    {label: '悪魔', value: '23' },
    {label: '暗殺者', value: '24' },
    {label: '陰陽師', value: '25' },
    {label: '円卓', value: '26' },
    {label: '海洋', value: '27' },
    {label: '学院', value: '28' },
    {label: '貴族', value: '29' },
    {label: '吸血鬼', value: '30' },
    {label: '巨人', value: '31' },
    {label: '狂信', value: '32' },
    {label: '禁忌', value: '33' },
    {label: '偶像', value: '34' },
    {label: '光輝', value: '35' },
    {label: '指揮官', value: '36' },
    {label: '死者', value: '37' },
    {label: '死霊術師', value: '38' },
    {label: '式神', value: '39' },
    {label: '狩人', value: '40' },
    {label: '獣', value: '41' },
    {label: '植物族', value: '42' },
    {label: '信仰', value: '43' },
    {label: '人形', value: '44' },
    {label: '星神', value: '45' },
    {label: '精霊', value: '46' },
    {label: '絶傑', value: '47' },
    {label: '先導', value: '48' },
    {label: '堕天使', value: '49' },
    {label: '大神', value: '50' },
    {label: '探偵', value: '51' },
    {label: '虫族', value: '52' },
    {label: '挑戦者', value: '53' },
    {label: '超克', value: '54' },
    {label: '鳥族', value: '55' },
    {label: '天使', value: '56' },
    {label: '土の印', value: '57' },
    {label: '盗賊', value: '58' },
    {label: '童話', value: '59' },
    {label: '忍者', value: '60' },
    {label: '不死鳥', value: '61' },
    {label: '武装', value: '62' },
    {label: '兵士', value: '63' },
    {label: '魔王', value: '64' },
    {label: '魔界', value: '65' },
    {label: '魔法使い', value: '66' },
    {label: '魔法生物', value: '67' },
    {label: '傭兵', value: '68' },
    {label: '妖怪', value: '69' },
    {label: '妖精', value: '70' },
    {label: '竜使い', value: '71' },
    {label: '竜族', value: '72' },
    {label: '錬金術師', value: '73' },
    {label: 'デレステ', value: '74' },
    {label: 'キュート', value: '75' },
    {label: 'クール', value: '76' },
    {label: 'パッション', value: '77' },
    {label: '機械', value: '78' },
    {label: '自然', value: '79' },
  ];

  export const effectData = [
    { label: 'クイック', value: '1' },
    { label: '威圧', value: '2' },
    { label: 'オーラ', value: '3' },
    { label: '指定攻撃', value: '4' },
    { label: '守護', value: '5' },
    { label: '疾走', value: '6' },
    { label: '突進', value: '7' },
    { label: 'ドレイン', value: '8' },
    { label: '必殺', value: '9' },
    { label: 'コンボ', value: '10' },
    { label: 'スペルチェイン', value: '11' },
    { label: '土の秘術', value: '12' },
    { label: 'スタック', value: '13' },
    { label: '覚醒', value: '14' },
    { label: 'ネクロチャージ', value: '15' },
    { label: '真紅', value: '16' },
  ];


  export const MARKS = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10+' },
  ];
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Switch, Select,MultiSelect, TextInput, Checkbox, Radio,Group, RangeSlider, Tabs, Button, Center } from '@mantine/core';
import { packData, typeData, MARKS, MapConvert, StrConvert, effectData, kindData } from "./svedm-map";
import { SearchConf  } from "./deck-edit-types";

export default function CardListSearchDetailModal( props: any) {

    const [searchName, setSearchName] = useState('')
    const [searchText, setSearchText] = useState('')
    const [checkedCanEvolve, setCheckedCanEvolve] = useState(false);
    const [selectPack, setSelectPack] = useState<string | null>(null);
    const [kindList, setKindList] = useState<string[]>(['follower', 'spell', 'amulet']);
    const [typeList, setTypeList] = useState<string[]>([]);
    const [effectList, setEffectList] = useState<string[]>([]);
    const [endCostValue, setEndCostValue] = useState<[number, number]>([0,10]);
    const [barHpValue, setBarHpValue] = useState<[number, number]>([0,10]);
    const [barAtkValue, setBarAtkValue] = useState<[number, number]>([0,10]);
    const [radioClassValue, setRadioClassValue] = useState('both');

    const handleSearchButton = () => {

      let searchDetailConf : SearchConf = {
        evolveFlag : props.sconf.evolveFlag,
        costRange : endCostValue,
        hpRange : barHpValue,
        atkRange : barAtkValue,
        cardName : searchName,
        packId : 0,
        cardKind : MapConvert(kindList, kindData),
        cardEffect : StrConvert(effectList),
        cardType : StrConvert(typeList),
        cardPack : convertToNumber(selectPack),
        canEvolve : checkedCanEvolve,
        class : radioClassValue,
        searchText : searchText,
      }

      props.onSearch(searchDetailConf)
      props.onModalClose()
  }

  const handleCostBar = (value : [number, number]) => {
    setEndCostValue(value)
  }

  const handleHpBar = (value : [number, number]) => {
    setBarHpValue(value)
  }

  const handleAtkBar = (value : [number, number]) => {
    setBarAtkValue(value)
  }

  function convertToNumber(value: string | null): number {
    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? 0 : parsedValue;
  }
    
    // If session exists, display content
    return (
        <div>
            {/* <Tabs defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
        <Tabs.Tab value="messages">Messages</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery" pt="xs">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel value="messages" pt="xs">
        Messages tab content
      </Tabs.Panel>

      <Tabs.Panel value="settings" pt="xs">
        Settings tab content
      </Tabs.Panel>
    </Tabs> */}


    <TextInput
      placeholder="カード名で絞り込み"
      label="カード名"
      value={searchName} onChange={(event) => setSearchName(event.currentTarget.value)} />

            
    <Checkbox.Group
      defaultValue={['follower',"spell", "amulet"]}
      label="カードタイプ"
      onChange={setKindList}
    >
      <Group mt="xs">
        <Checkbox label="フォロワー" value="follower" />
        <Checkbox label="スペル" value="spell" />
        <Checkbox label="アミュレット" value="amulet" />
      </Group>
    </Checkbox.Group>

    <br/>
      <Switch
        label="evolve可能"
        checked={checkedCanEvolve} onChange={(event) => setCheckedCanEvolve(event.currentTarget.checked)} />

    {/* もしタイトルの場合は意味なし */}
            <Radio.Group
            name="favoriteFramework"
            label="クラス絞り込み"
            onChange={setRadioClassValue}
            >
                <Group mt="xs">
                    <Radio checked label="両方" value="both" />
                    <Radio label="選択クラスのみ" value="class" />
                    <Radio label="ニュートラルのみ" value="neutral" />
                </Group>
            </Radio.Group>
    <br/>
            <Select
                    label="パック選択"
                    placeholder="パックを選択"
                    data={packData}
                    value={selectPack}
                    onChange={setSelectPack}
            />

<MultiSelect
      data={typeData}
      label="種族"
      placeholder="種族を選択"
      searchable
      onChange={setTypeList}
      value={typeList}
    />

<MultiSelect
      data={effectData}
      label="効果"
      placeholder="効果を選択"
      searchable
      onChange={setEffectList}
      value={effectList}
    />            

<br/>
コスト
        <RangeSlider
          defaultValue={[0, 10]}
          step={1}
          marks={MARKS}
          max={10}
          minRange={0}
          onChangeEnd={handleCostBar}
          showLabelOnHover={false}
          label={null}
        />
<br/>
HP
        <RangeSlider
                defaultValue={[0, 10]}
                step={1}
                marks={MARKS}
                max={10}
                minRange={0}
                onChangeEnd={handleHpBar}
                showLabelOnHover={false}
                label={null}
            />
<br/>
ATK
        <RangeSlider
                defaultValue={[0, 10]}
                step={1}
                marks={MARKS}
                max={10}
                minRange={0}
                onChangeEnd={handleAtkBar}
                showLabelOnHover={false}
                label={null}
            />

<br/>
<br/>
    <TextInput
      placeholder="任意のカードテキストで検索"
      label="テキスト検索"
      value={searchText} onChange={(event) => setSearchText(event.currentTarget.value)} />

      <Center>
        <Button onClick={handleSearchButton}>詳細検索</Button>
      </Center>
          

        </div>
    )
}
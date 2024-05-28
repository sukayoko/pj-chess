import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useDisclosure } from '@mantine/hooks';
import { MagnifyingGlassIcon, NoSymbolIcon } from '@heroicons/react/24/solid'
import { Switch, Stack, RangeSlider,Container, Modal, ActionIcon, Space , Flex } from '@mantine/core';
import CardListSearchDetailModal  from "./deck-edit-card-search-detail"; 
import { packData, typeData, MARKS } from "./svedm-map";
import { SearchConfDefault } from "./deck-edit-types";

export default function CardListSearch( props:any) {
    const [checkedEvolve, setCheckedEvolve] = useState(false);
    // const [endValue, setEndValue] = useState<[number, number]>([0,10]);
    const [endValue, setEndValue] = useState<[number, number]>([0,10]);
    const [opened, { open, close }] = useDisclosure(false);

    
    const handleCheck = (checked : boolean) => {
        setCheckedEvolve(checked)
        props.sconf.evolveFlag = checked

        props.onSearchFunc(props.sconf)
    }

    const handleCostBar = (value : [number, number]) => {
        setEndValue(value)
        props.sconf.costRange = value

        // console.log(props.sconf)

        props.onSearchFunc(props.sconf)
    }

    const searchClear = () => {
        // setEndValue([0,10])
        props.onSearchFunc(SearchConfDefault)
    }

    // If session exists, display content
    return (
        <>
        <Modal opened={opened} onClose={close} title="詳細検索" centered size="40%">
            <CardListSearchDetailModal onModalClose={close} onSearch={props.onSearchFunc} sconf={props.sconf}></CardListSearchDetailModal>
        </Modal>
        <Flex>
            <ActionIcon>
                <MagnifyingGlassIcon onClick={open} />
            </ActionIcon>
            詳細検索
            <Space w="xl" />
            <ActionIcon>
                <NoSymbolIcon onClick={searchClear} />
            </ActionIcon>
            検索条件初期化

        </Flex>
        <Stack align="flex-end">
            <Switch checked={checkedEvolve} onChange={(event) => handleCheck(event.currentTarget.checked)} label="Evolve" labelPosition="left"/>            
        </Stack>
        <Container size="90%" >
            コスト
            <RangeSlider
                defaultValue={[0, 10]}
                step={1}
                marks={MARKS}
                max={10}
                minRange={0}
                // styles={{ markLabel: { display: 'none' } }}
                // value={endValue} 
                onChangeEnd={handleCostBar}
                showLabelOnHover={false}
                label={null}
            />
            <br/>
        </Container>

            
        </>
    )
}
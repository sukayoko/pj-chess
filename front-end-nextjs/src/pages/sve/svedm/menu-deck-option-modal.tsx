import { useState, useEffect } from "react"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ActionIcon  } from '@mantine/core';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid'


export default function MenuDeckOptionModal(props : any) {
    const [opened, { open, close }] = useDisclosure(false);
    
  // If session exists, display content
  return (
    <>
    <Modal opened={opened} onClose={close} title="デッキオプション" centered>
        デッキコード : {props.deck.deck_code} <br/><br/>
        <Button>デッキコピー(未実装)</Button>
        <br/>※デッキインポートをすれば実質コピーできます
        <br/><br/>
        <Button color="red" onClick={() => props.deleteDeck(props.deck.deck_code as string)}>デッキ削除</Button><br/><br/>
    </Modal>
        <ActionIcon>
            <EllipsisHorizontalCircleIcon onClick={open} />
        </ActionIcon>
    </>  
  )
}
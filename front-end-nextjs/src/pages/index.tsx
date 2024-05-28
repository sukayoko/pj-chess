import { Inter } from 'next/font/google'

import { Button, Group } from "@mantine/core";
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <Group mt={50} position="center">
      <Link href="/sve/svedm/menu">SVE Deck Maker</Link>
      <Button size="xl">Welcome to Mantine!</Button>
      <Link href="/testpage">testpage1</Link>
      <Link href="/protected">protected</Link>
      a
    </Group>

  )
}

import Link from 'next/link';
import { Button, Group } from "@mantine/core";

const Header = () => {
  return (
    <header className="border-b flex items-center h-14 px-4">
      <h1>
        <Link href="/">
          i am
        </Link>
        <Group mt={50} position="right">
          <Button size="xl">login</Button>
        </Group>
      </h1>
    </header>
  );
};

export default Header;
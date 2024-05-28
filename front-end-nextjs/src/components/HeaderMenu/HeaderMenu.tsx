// mantaine ui なぜか使えない..?

import { createStyles, Header, Menu, Group, Center, Burger, Container, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { IconChevronDown } from '@tabler/icons-react';
// import { MantineLogo } from '@mantine/ds';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"

export interface HeaderSearchProps {
    links: { link: string; label: string; links: { link: string; label: string }[] }[];
  }

export const MyHeaderSearchProps: HeaderSearchProps = {
    links: [
      {
        link: "",
        label: "testpage",
        links: [
          {
            link: "/testpage",
            label: "testpage"
          },
          {
            link: "/",
            label: "home"
          }          ,
          {
            link: "/testpage/testdbcrud",
            label: "testdbcrud"
          }
        ]
      },
      {
        link: "",
        label: "sve",
        links: [
          {
            link: "/sve/svedm/menu",
            label: "svedm"
          } ,
          {
            link: "/sve/evolve-counter",
            label: "counter"
          },
        ]
      },
      {
        link: "/todo/todo-list",
        label: "todo App",
        links : []
      },
      {
        link: "",
        label: "quiz",
        links: [
          {
            link: "/quiz/uma-quiz",
            label: "uma quiz"
          }
        ]
      },
    ]
  };

const useStyles = createStyles((theme) => ({
  inner: {
    height: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));



export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();
  const router = useRouter()
  const { data: session } = useSession()

  const items = MyHeaderSearchProps.links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link} onClick={() => router.push(item.link)}>{item.label}</Menu.Item>
    ));

    if (menuItems !== undefined && menuItems.length !== 0) {
      return (
        <Menu key={link.label} trigger="click" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a
              href="#!"
              className={classes.link}
            >
            {/* こっちが親 */}
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                {/* <IconChevronDown size="0.9rem" stroke={1.5} /> */}
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    // 子がない場合
    return (
      <a
        key={link.label}
        href="#!"
        className={classes.link}
        onClick={() => router.push(link.link)}
      >
        {link.label}
      </a>
    );
  });

  return (
    <Header height={56}>
      <Container>
        <div className={classes.inner}>
          {/* <MantineLogo size={28} /> */}
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
          {/* 画面が小さくなった時 */}
          <div>
            {session ? 
                      <>
                        Signed in as {session.user?.name}<br />
                        <button onClick={() => signOut()}>Sign out</button>
                      </>
                      : 
                      <>
                        サインアウト状態<br />
                        <button onClick={() => signIn()}>Sign in</button>
                      </>
            }
          </div>
          <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
        </div>
      </Container>
    </Header>
  );
}
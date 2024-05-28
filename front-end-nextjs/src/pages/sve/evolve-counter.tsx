import Link from "next/link";
import { ActionIcon, Group, Button, Text, Grid } from '@mantine/core';
import { PlusIcon, MinusIcon, ArrowPathIcon, ArrowUturnRightIcon } from '@heroicons/react/24/solid'
import { useCounter } from '@mantine/hooks';


const EvolveCounter = () => {
    let flag : boolean = true

    // usestate系を使わないと再描写されない
    const [count, handlers] = useCounter(20, { min: 0, max: 999 });
    const [count2, handlers2] = useCounter(20, { min: 0, max: 999 });

    const handleClick = () => {
        handlers.reset()
        handlers2.reset()
        console.log("clicked")
    }

    // 押された要素の状態を変えたい
    const handleClick3 = () => {
        flag = false
        console.log("clicked 3")
    }

    return (
        <div>
            <h1>Evolve Counter</h1>
            自分
            <ActionIcon color="red" size="xl" variant="filled" radius="md" onClick={handlers.increment}>
                <PlusIcon />
            </ActionIcon>
            <ActionIcon color="blue" size="xl" variant="filled" radius="md" onClick={handlers.decrement}>
                <MinusIcon />
            </ActionIcon>
            <ActionIcon size="xl" variant="filled" radius="md" onClick={handleClick}>
                <ArrowPathIcon />
            </ActionIcon>

            <h1>{count}</h1>

            相手
            <ActionIcon color="red" size="xl" variant="filled" radius="md" onClick={handlers2.increment}>
                <PlusIcon />
            </ActionIcon>
            <ActionIcon color="blue" size="xl" variant="filled" radius="md" onClick={handlers2.decrement}>
                <MinusIcon />
            </ActionIcon>
            <ActionIcon size="xl" variant="filled" radius="md" onClick={handleClick}>
                <ArrowPathIcon />
            </ActionIcon>

            <h1>{count2}</h1>

            <h1>PP</h1>

            <div>
                <Text fz="xl" onClick={handleClick3}>①</Text>
                <Text fz="xl">②</Text>
            </div>

            <ActionIcon size="xl" variant="filled" radius="md" onClick={handleClick}>
                <ArrowUturnRightIcon />
            </ActionIcon>

            <div>
                {flag 
                    ? <p>true</p>
                    : <p>false</p>
                }
            </div>
        </div>

    );
};

export default EvolveCounter;
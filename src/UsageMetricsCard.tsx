import { Card, Center, Group, RingProgress, Stack, Text } from '@mantine/core';
import { Numbers } from 'cafe-utility';
import classes from './UsageMetricsCard.module.css';

interface UsageMetricsCardProps {
  title: string;
  description: string;
  value: number;
  limit: number;
  valueType: 'BYTES' | 'COUNT';
}

export function UsageMetricsCard({ title, description, value, limit, valueType }: UsageMetricsCardProps) {
  function getPercent() {
    if (limit === 0) {
      return '100%';
    }
    const progress = (value / limit) * 100;
    return progress.toFixed(1) + '%';
  }

  function getProgress() {
    if (limit === 0) {
      return 100;
    }
    return (value / limit) * 100;
  }

  return (
    <Card bg={'gray.9'} className={classes.wrapper} withBorder radius="md" p="xs">
      <Group>
        <RingProgress
          size={120}
          thickness={8}
          sections={[{ value: getProgress(), color: 'green.2' }]}
          label={
            <Center>
              <b>{getPercent()}</b>
            </Center>
          }
        />

        <Stack>
          <Stack gap="0">
            <Text size="md" tt="uppercase" fw={700}>
              {title}
            </Text>
            <Text c="dimmed" fw={500} size="xs">
              {description}
            </Text>
          </Stack>

          <Stack gap="0">
            <Text size="xs" fw={700}>
              {valueType === 'BYTES' ? Numbers.convertBytes(value, 1000) : value}
            </Text>
            <Text c="dimmed" fw={500} size="xs">
              of {valueType === 'BYTES' ? Numbers.convertBytes(limit, 1000) : limit}
            </Text>
          </Stack>
        </Stack>
      </Group>
    </Card>
  );
}

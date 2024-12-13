import { Button, Card, Group, Skeleton, Space, Text, Title } from '@mantine/core';
import { api } from '../../api/Api.ts';
import { Plan } from './Plan.tsx';

interface ActivePlanCardProps {
  isLoading: boolean;
  plan: Plan;
}

export function ActivePlanCard({ plan, isLoading }: ActivePlanCardProps) {
  function getStorageCapacity() {
    const gbs = plan.uploadSizeLimit / 1024 / 1024 / 1024;
    return `${gbs.toFixed(0)} GB`;
  }

  function getBandwidth() {
    const gbs = plan.downloadSizeLimit / 1024 / 1024 / 1024;
    return `${gbs.toFixed(0)} GB`;
  }

  async function manageSubscription(): Promise<void> {
    const url = await api.manageSubscription();
    window.location.replace(url);
  }

  function isFreePlan() {
    return plan.type === 'FREE_PLAN';
  }

  function priceLabel() {
    if (isFreePlan()) {
      return '0 EUR / month';
    }
    return `${plan.currency} ${(plan.amount / 100).toFixed(2)} / ${plan.frequency.toLowerCase()}`;
  }

  return (
    <Card withBorder bg={'gray.8'} shadow="md" radius="md" padding="xl">
      {isLoading ? (
        <>
          <Title order={2} mb={'md'}>
            Current plan
          </Title>
          <Skeleton height={8} width="70%" radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
        </>
      ) : (
        <>
          <Group align={'center'} gap={'xs'} mb={'md'}>
            <Title order={2}>Current plan</Title>
          </Group>

          <Group gap={'xs'}>
            <Text fw={600}>Storage capacity: </Text> {getStorageCapacity()}
          </Group>
          <Group gap={'xs'}>
            <Text fw={600}>Bandwidth: </Text>
            {getBandwidth()}
          </Group>
          <Group gap={'xs'}>
            <Text fw={600}>Price: </Text>
            {priceLabel()}
          </Group>
          <Space h="lg" />
          <Text size={'sm'} c={'dimmed'}>
            View past invoices, update payment method, or cancel subscription.
          </Text>
          <Text size={'sm'} c={'dimmed'}>
            If you cancel your subscription, you will be able to use the current plan until the end of the billing
            period.
          </Text>
          <Space h="xs" />
          <Button onClick={() => manageSubscription()}>Manage</Button>
        </>
      )}
    </Card>
  );
}

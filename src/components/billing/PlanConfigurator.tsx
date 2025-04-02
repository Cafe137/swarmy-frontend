import { Button, Card, Container, Group, rem, ScrollArea, Space, Stack, Text, Title } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { api } from '../../api/Api.ts';
import { ActivePlanCard } from './ActivePlanCard.tsx';
import { BillingConfiguratorSkeleton } from './BillingConfiguratorSkeleton.tsx';
import {
  getBandwidthByExp,
  getBandwidthBySize,
  getStorageCapacityByExp,
  getStorageCapacityBySize,
  SubscriptionConfig,
} from './SubscriptionConfig.ts';
import { SubscriptionSlider } from './SubscriptionSlider.tsx';
import { SubscriptionSummary } from './SubscriptionSummary.tsx';

export function PlanConfigurator() {
  const [capacity, setCapacity] = useState(NaN);
  const [bandwidth, setBandwidth] = useState(NaN);
  const [isLoaded, setLoaded] = useState(false);

  const [subscriptionConfigQuery, activePlanQuery, profileQuery] = useQueries({
    queries: [
      {
        queryKey: ['subscription-config'],
        queryFn: api.getSubscriptionConfig,
      },
      {
        queryKey: ['active-plan'],
        queryFn: api.getActivePlan,
      },
      {
        queryKey: ['profile'],
        queryFn: api.getProfile,
      },
    ],
  });
  const config = subscriptionConfigQuery.data as SubscriptionConfig;

  useEffect(() => {
    if (subscriptionConfigQuery.isSuccess && activePlanQuery.isSuccess) {
      const config = subscriptionConfigQuery.data;

      const defaultBandwidth = getSubscribedBandwidth() || config.bandwidth.defaultOption;
      setBandwidth(defaultBandwidth);

      const defaultStorageCapacity = getSubscribedStorageCapacity() || config.storageCapacity.defaultOption;
      setCapacity(defaultStorageCapacity);

      setLoaded(true);
    }
  }, [subscriptionConfigQuery.isSuccess, activePlanQuery.isSuccess]);

  async function payWithStripe(redirectUrl: string) {
    window.location.href = redirectUrl;
  }

  async function payWithCrypto(planId: number) {
    const { redirectUrl } = await api.payWithCrypto(planId);
    window.location.href = redirectUrl;
  }

  async function startSubscription() {
    // todo try catch
    const requestedCapacity = getStorageCapacityByExp(config, capacity)?.size;
    const requestedBandwidth = getBandwidthByExp(config, bandwidth)?.size;
    try {
      const result = await api.startSubscription(requestedCapacity!, requestedBandwidth!);
      openModal({
        withCloseButton: true,
        title: 'Subscription',
        children: (
          <Stack>
            <Text>Choose payment method:</Text>
            <Group>
              <Button onClick={() => payWithStripe(result.redirectUrl)}>Stripe</Button>
              <Button onClick={() => payWithCrypto(result.planId)}>Crypto</Button>
            </Group>
          </Stack>
        ),
      });
    } catch (e) {
      console.log(e);
      notifications.show({
        title: 'Operation failed',
        message: 'Please try again later, or please contact support.',
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        color: 'red',
      });
    }
  }

  function isFreePlan() {
    return activePlanQuery.data.type === 'FREE_PLAN';
  }

  function isUpgrade() {
    return !isFreePlan() && (capacity > getSubscribedStorageCapacity()! || bandwidth > getSubscribedBandwidth()!);
  }

  function getSubscribedStorageCapacity() {
    const subscribedValue = activePlanQuery.data.uploadSizeLimit / 1024 / 1024 / 1024;
    if (subscribedValue === 0) {
      return 0;
    }
    return getStorageCapacityBySize(config, subscribedValue)?.exp;
  }

  function getSubscribedBandwidth() {
    const subscribedValue = activePlanQuery.data.downloadSizeLimit / 1024 / 1024 / 1024;
    if (subscribedValue === 0) {
      return 0;
    }
    return getBandwidthBySize(config, subscribedValue)?.exp;
  }

  return (
    <Container px={0} py="xl">
      <ActivePlanCard
        plan={activePlanQuery.data}
        isLoading={activePlanQuery.isLoading}
        postageBatchId={profileQuery.data?.postageBatchId}
        paidUntil={activePlanQuery.data.paidUntil ? new Date(activePlanQuery.data.paidUntil) : undefined}
      />
      <Space h="xl" />
      <ScrollArea miw={700}>
        <Card withBorder bg={'gray.8'} shadow="md" radius="md" padding="xl">
          <Title order={2}>Plan configurator</Title>
          <Space h="xl" />

          {!isLoaded ? (
            <BillingConfiguratorSkeleton />
          ) : (
            <>
              <Title order={4} mb={6}>
                Storage capacity
              </Title>

              <Text size={'sm'} c={'dimmed'}>
                Total size of data that can be stored by Swarmy. Can be upgraded later.
              </Text>
              <Text size={'sm'} c={'dimmed'}>
                {config.currency} {config.storageCapacity.pricePerGb.toFixed(2)} per GB
              </Text>

              <Space h="md" />

              <SubscriptionSlider
                options={config.storageCapacity.options}
                default={config.storageCapacity.defaultOption}
                value={capacity}
                minSelection={getSubscribedStorageCapacity()}
                onChange={setCapacity}
              />

              <Title order={4} mb={6} mt={48}>
                Bandwidth
              </Title>

              <Text size={'sm'} c={'dimmed'}>
                Size of data that can be downloaded in a month. Can be upgraded later.
              </Text>
              <Text size={'sm'} c={'dimmed'}>
                {config.currency} {config.bandwidth.pricePerGb.toFixed(2)} per GB
              </Text>
              <Space h="md" />
              <SubscriptionSlider
                options={config.bandwidth.options}
                default={config.bandwidth.defaultOption}
                value={bandwidth}
                minSelection={getSubscribedBandwidth()}
                onChange={setBandwidth}
              />

              <Title order={4} mb={6} mt={64}>
                Price
              </Title>

              <SubscriptionSummary config={config} storageCapacity={capacity} bandwidth={bandwidth} />
              <Space h="xl" />

              <Text size={'sm'} c={'dimmed'}>
                After clicking the Purchase button, you will be prompted to select a payment method to complete your
                order. By selecting Stripe, you will be redirected to Stripe's payment form to create a monthly
                subscription. The Crypto option will create a one-time payment using the Coinbase Commerce service.
                <br />
                You can cancel the subscription anytime, you will be able to access the paid services until the end of
                the billing period.
              </Text>
              <Space h="lg" />

              <Button disabled={!isLoaded || (!isUpgrade() && !isFreePlan())} onClick={() => startSubscription()}>
                {isFreePlan() ? 'Purchase' : 'Upgrade Subscription'}
              </Button>
            </>
          )}
        </Card>
      </ScrollArea>
    </Container>
  );
}

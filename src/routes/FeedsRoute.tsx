import { ActionIcon, Button, Flex, Group, Input, Modal, rem, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconEdit, IconInfoHexagon, IconPlus, IconX } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/Api.ts';
import { FilePicker } from '../components/picker/FilePicker.tsx';

export default function FeedsRoute() {
  const [loading, setLoading] = useState(false);
  const [feedName, setFeedName] = useState('');
  const queryClient = useQueryClient();
  const [feedId, setFeedId] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);

  const { isSuccess, data } = useQuery({
    queryKey: ['feeds'],
    queryFn: api.getFeeds,
  });

  async function generateFeed() {
    setLoading(true);
    try {
      await api.createFeed(feedName);
      await queryClient.invalidateQueries({ queryKey: ['feeds'] });
    } catch (e) {
      console.error(e);
    } finally {
      setFeedName('');
      setLoading(false);
    }
  }

  async function updateFeed(feedId: number, fileId: number) {
    notifications.show({
      title: 'Started',
      message: 'Feed update started',
      icon: <IconInfoHexagon style={{ width: rem(20), height: rem(20) }} />,
      color: 'blue',
    });
    try {
      await api.updateFeed(feedId, fileId);
      notifications.show({
        title: 'Success',
        message: 'Feed updated successfully',
        icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Feed update failed',
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        color: 'red',
      });
    }
    await queryClient.invalidateQueries({ queryKey: ['feeds'] });
  }

  return (
    <>
      <Modal fullScreen opened={opened} onClose={close} title="Select destination for feed">
        <FilePicker
          onValue={(fileId) => {
            close();
            updateFeed(feedId, fileId);
          }}
        />
      </Modal>
      <h1>Feeds</h1>
      <div>
        <Flex justify="flex-end" px={'lg'} py={'xl'}>
          <Group>
            <Input
              value={feedName}
              onChange={(event) => setFeedName(event.currentTarget.value)}
              placeholder="Feed name"
            />
            <Button onClick={generateFeed} rightSection={<IconPlus size={'1.1rem'} />} disabled={loading || !feedName}>
              Create Feed
            </Button>
          </Group>
        </Flex>
        {isSuccess && (
          <Table.ScrollContainer minWidth={500} px={'lg'}>
            <Table verticalSpacing={'md'}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Feed Address</Table.Th>
                  <Table.Th>Destination</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((feed) => (
                  <Table.Tr key={feed.id}>
                    <Table.Td>{feed.name}</Table.Td>
                    <Table.Td>{feed.manifestAddress || 'N/A'}</Table.Td>
                    <Table.Td>{feed.lastBzzAddress || 'N/A'}</Table.Td>
                    <Table.Td align={'center'} width={'80px'}>
                      <ActionIcon
                        disabled={loading}
                        variant={'subtle'}
                        onClick={() => {
                          setFeedId(feed.id);
                          open();
                        }}
                      >
                        <IconEdit />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </div>
    </>
  );
}

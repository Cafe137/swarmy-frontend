import { ActionIcon, Button, Flex, Group, Modal, rem, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/Api.ts';
import { Date } from '../components/Date.tsx';
import { EditableApiKey } from '../components/EditableApiKey.tsx';

export default function ApiKeysRoute() {
  const queryClient = useQueryClient();
  const [idToRevoke, setIdToRevoke] = useState(null);
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const { isSuccess, data } = useQuery({
    queryKey: ['api-keys'],
    queryFn: api.getApiKeys,
  });

  async function generateKey() {
    try {
      await api.createApiKey('new key');
      await queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      notifications.show({
        title: 'Success!',
        message: 'Key successfully generated',
        icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        color: 'green',
      });
    } catch (e) {
      notifications.show({
        title: 'Failed to generate key',
        message: e.message,
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        color: 'red',
      });
    }
  }

  async function revokeKey() {
    if (!idToRevoke) {
      return;
    }
    try {
      await api.revokeApiKey(idToRevoke);
      await queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      notifications.show({
        title: 'Success!',
        message: 'Key successfully revoked',
        icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        color: 'green',
      });
    } catch (e) {
      notifications.show({
        title: 'Failed to revoke key',
        message: e.message,
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        color: 'red',
      });
    }
    closeModal();
  }

  return (
    <>
      <h1>API keys</h1>
      <div>
        <Flex justify="flex-end" px={'lg'} py={'xl'}>
          <Button onClick={generateKey} rightSection={<IconPlus size={'1.1rem'} />}>
            Generate Key
          </Button>
        </Flex>

        <Modal centered opened={opened} onClose={closeModal} title={'Confirmation'}>
          <Group mb={'xl'}>Are you sure you want to revoke the key?</Group>
          <Group justify="space-between">
            <Button onClick={closeModal}>No, cancel</Button>
            <Button bg={'red'} onClick={revokeKey}>
              Yes, revoke
            </Button>
          </Group>
        </Modal>

        {isSuccess && (
          <Table.ScrollContainer minWidth={500} px={'lg'}>
            <Table verticalSpacing={'md'}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Key</Table.Th>
                  <Table.Th>Date Issued</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Revoke</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((key) => (
                  <Table.Tr key={key.id}>
                    <Table.Td>
                      <EditableApiKey id={key.id} name={key.label} />
                    </Table.Td>
                    <Table.Td>{key.apiKey}</Table.Td>
                    <Table.Td>
                      <Date value={key.createdAt} />
                    </Table.Td>
                    <Table.Td>{key.status === 'ACTIVE' ? 'Active' : 'Revoked'}</Table.Td>
                    <Table.Td align={'center'}>
                      <ActionIcon
                        disabled={key.status !== 'ACTIVE'}
                        variant={'subtle'}
                        onClick={() => {
                          setIdToRevoke(key.id);
                          openModal();
                        }}
                      >
                        <IconTrash />
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

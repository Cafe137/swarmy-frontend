import { Reference } from '@ethersphere/bee-js';
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  CopyButton,
  Divider,
  Flex,
  Image,
  Modal,
  Pagination,
  rem,
  Skeleton,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconFileDigit,
  IconFileTypeHtml,
  IconTrash,
  IconUpload,
  IconWorldShare,
} from '@tabler/icons-react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { Numbers } from 'cafe-utility';
import { useState } from 'react';
import { api } from '../api/Api.ts';
import { Date } from '../components/Date.tsx';
import { config } from '../config.tsx';
import { FileUploader } from '../FileUploader.tsx';
import { useProfileStore } from '../store/ProfileStore.ts';

export default function FilesRoute() {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const { postageBatchId } = useProfileStore();
  const [allowDeletion, setAllowDeletion] = useState(false);

  const [fileReferencesQuery, apiKeysQuery] = useQueries({
    queries: [
      {
        queryKey: ['files'],
        queryFn: api.getFileReferences,
      },
      {
        queryKey: ['api-keys'],
        queryFn: api.getApiKeys,
      },
    ],
  });

  const isLoading = apiKeysQuery.isLoading || fileReferencesQuery.isLoading;
  const canUpload = !!postageBatchId;

  async function onUploaded() {
    await queryClient.invalidateQueries({ queryKey: ['files'] });
    close();
  }

  function openFile(hash: string) {
    const url = `${config.apiUrl}/bzz/${hash}/`;
    window.open(url, '_blank');
  }

  function openOnGateway(hash: string) {
    const cid = new Reference(hash).toCid('manifest');
    const url = `https://${cid}.bzz.limo`;
    window.open(url, '_blank');
  }

  function UploadDisabledAlert() {
    if (postageBatchId) {
      return;
    }
    return (
      <Alert py={'sm'} mb={'xl'} icon={<IconAlertTriangle />} variant={'filled'} color={'yellow.8'} fw={600}>
        {!postageBatchId && <Text>Subscription needed to upload files.</Text>}
      </Alert>
    );
  }

  function getThumbnail(file) {
    if (file.thumbnailBase64) {
      return <Image height={'50px'} fit="contain" src={`data:image/webp;base64,${file.thumbnailBase64}`} />;
    }
    if (file.isWebsite) {
      return <IconFileTypeHtml size={'32px'} />;
    }
    return <IconFileDigit size={'32px'} />;
  }

  async function promptForDeletion(id: number, name: string) {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await api.deleteFileById(id);
      await queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  }

  return (
    <>
      <div>
        <h1>Files</h1>

        <Flex justify="flex-end" px={'lg'} py={'xl'} gap={'xs'}>
          <Button
            onClick={() => setAllowDeletion((x) => !x)}
            rightSection={<IconTrash size={'1rem'} />}
            color="#FF4136"
          >
            {allowDeletion ? 'Disable deletion' : 'Enable deletion'}
          </Button>
          <Button disabled={!canUpload} onClick={open} rightSection={<IconUpload size={'1rem'} />}>
            Upload files
          </Button>
        </Flex>

        {UploadDisabledAlert()}

        <Modal opened={opened} onClose={close} transitionProps={{ transition: 'fade', duration: 200 }}>
          <FileUploader onUploaded={onUploaded} />
        </Modal>

        {isLoading ? (
          <>
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
          </>
        ) : (
          <>
            <Table.ScrollContainer minWidth={500} px={'lg'}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Icon</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Reference</Table.Th>
                    <Table.Th>Actions</Table.Th>
                    <Table.Th>Size</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Date</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {fileReferencesQuery.data.map((file) => (
                    <Table.Tr key={file.id}>
                      <Table.Td>
                        <Center>{getThumbnail(file)}</Center>
                      </Table.Td>
                      <Table.Td>{file.name}</Table.Td>
                      <Table.Td>{file.hash.slice(0, 8) + '…' + file.hash.slice(-8)}</Table.Td>
                      <Table.Td>
                        <CopyButton value={file.hash}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy Swarm reference'} withArrow position="right">
                              <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                {copied ? (
                                  <IconCheck style={{ width: rem(16) }} />
                                ) : (
                                  <IconCopy style={{ width: rem(16) }} />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                        <Tooltip label={'View on Swarmy'} withArrow position="right">
                          <ActionIcon variant={'subtle'} color={'gray'} onClick={() => openFile(file.hash)}>
                            <IconExternalLink style={{ width: rem(16) }} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label={'View on bzz.limo gateway'} withArrow position="right">
                          <ActionIcon variant={'subtle'} color={'gray'} onClick={() => openOnGateway(file.hash)}>
                            <IconWorldShare style={{ width: rem(16) }} />
                          </ActionIcon>
                        </Tooltip>
                        {allowDeletion && (
                          <Tooltip label={'Remove from Swarmy (stays on Swarm)'} withArrow position="right">
                            <ActionIcon
                              variant={'subtle'}
                              color={'gray'}
                              onClick={() => promptForDeletion(file.id, file.name)}
                            >
                              <IconTrash style={{ width: rem(16) }} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Table.Td>
                      <Table.Td>{Numbers.convertBytes(file.size, 1000)}</Table.Td>
                      <Table.Td>{file.contentType}</Table.Td>
                      <Table.Td>
                        <Date value={file.createdAt} />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Divider />
            </Table.ScrollContainer>
            <Flex justify={'flex-end'} px={'lg'}>
              <Pagination total={1} mt={'md'} />
            </Flex>
          </>
        )}
      </div>
    </>
  );
}

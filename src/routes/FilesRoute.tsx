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
  IconUpload,
} from '@tabler/icons-react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/Api.ts';
import { Date } from '../components/Date.tsx';
import { config } from '../config.tsx';
import { formatBytes } from '../FileSizeFormatter.ts';
import { FileUploader } from '../FileUploader.tsx';
import { useProfileStore } from '../store/ProfileStore.ts';
import classes from './FilesRoute.module.css';

export default function FilesRoute() {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const { postageBatchStatus } = useProfileStore();
  console.log('rendering files route');

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
  const canUpload = postageBatchStatus === 'CREATED';

  async function onUploaded() {
    await queryClient.invalidateQueries({ queryKey: ['files'] });
    close();
  }

  function hasKey() {
    return !isLoading && apiKeysQuery.data.length > 0;
  }

  function openFile(hash: string, isWebsite: boolean) {
    const firstKey = apiKeysQuery.data.find((k) => k.status === 'ACTIVE');
    let url = `${config.apiUrl}/files/${hash}`;
    if (isWebsite) {
      url = `${url}/`;
    }
    url = `${url}?k=${firstKey.apiKey}`;
    window.open(url, '_blank');
  }

  function getFileLink(hash: string) {
    const firstKey = apiKeysQuery.data[0];
    return `${config.apiUrl}/files/${hash}?k=${firstKey.apiKey}`;
  }

  function UploadDisabledAlert() {
    if (postageBatchStatus === 'CREATED') {
      return;
    }
    return (
      <Alert py={'sm'} mb={'xl'} icon={<IconAlertTriangle />} variant={'filled'} color={'yellow.8'} fw={600}>
        {(postageBatchStatus === null || postageBatchStatus === 'REMOVED') && (
          <Text>Subscription needed to upload files.</Text>
        )}
        {postageBatchStatus === 'CREATING' && (
          <Text>Connecting your account with Swarm. This can take up to a few minutes.</Text>
        )}
        {(postageBatchStatus === 'FAILED_TO_TOP_UP' ||
          postageBatchStatus === 'FAILED_TO_DILUTE' ||
          postageBatchStatus === 'FAILED_TO_CREATE') && (
          <Text>Account issue detected. Uploading is suspended. Please contact support.</Text>
        )}
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

  return (
    <>
      <div>
        <h1>Files</h1>

        <Flex justify="flex-end" px={'lg'} py={'xl'}>
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
                    <Table.Th>Thumbnail</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Hash</Table.Th>
                    <Table.Th>Size</Table.Th>
                    <Table.Th>Content-Type</Table.Th>
                    <Table.Th>Date Uploaded</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {fileReferencesQuery.data.map((file) => (
                    <Table.Tr key={file.id}>
                      <Table.Td>
                        <Center>{getThumbnail(file)}</Center>
                      </Table.Td>
                      <Table.Td>{file.name}</Table.Td>
                      <Table.Td>
                        <Flex align={'center'}>
                          <span className={classes.hash}>{file.hash}</span>
                          <Tooltip label={hasKey() ? 'Open' : 'Create API key to Open'} withArrow position="right">
                            <ActionIcon
                              disabled={!hasKey()}
                              variant={'subtle'}
                              color={'gray'}
                              onClick={() => openFile(file.hash, file.isWebsite)}
                            >
                              <IconExternalLink style={{ width: rem(16) }} />
                            </ActionIcon>
                          </Tooltip>
                          {hasKey() ? (
                            <CopyButton value={getFileLink(file.hash)}>
                              {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
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
                          ) : (
                            <></>
                          )}
                        </Flex>
                      </Table.Td>
                      <Table.Td>{formatBytes(file.size)}</Table.Td>
                      <Table.Td>{file.contentType}</Table.Td>
                      <Table.Td width={'80px'}>
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

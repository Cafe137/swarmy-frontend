import { Button, Card, Checkbox, Group, Loader, Stack, Text } from '@mantine/core';
import { Numbers } from 'cafe-utility';
import { useEffect, useState } from 'react';
import { api } from '../../api/Api';

interface SwarmyFile {
  id: number;
  name: string;
  contentType: string;
  size: number;
  isWebsite: boolean;
}

interface Props {
  onValue: (value: number) => void;
}

export function FilePicker({ onValue }: Props) {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<SwarmyFile[]>([]);
  const [websitesOnly, setWebsitesOnly] = useState(false);

  useEffect(() => {
    async function fetchFiles() {
      const files = await api.getFileReferences();
      setFiles(files);
      setWebsitesOnly(files.some((x) => x.isWebsite));
      setLoading(false);
    }

    fetchFiles();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const filteredFiles = websitesOnly ? files.filter((x) => x.isWebsite) : files;

  return (
    <Stack>
      <Checkbox
        checked={websitesOnly}
        onChange={(event) => setWebsitesOnly(event.currentTarget.checked)}
        label="Only show websites"
      />
      <Group>
        {filteredFiles.map((value) => (
          <Card shadow="sm" padding="lg" radius="md" withBorder miw={200}>
            <Text>{value.name}</Text>
            <Stack mt="lg" gap="xs">
              <Text size="sm" c="dimmed">
                {value.contentType}
              </Text>
              <Text size="sm" c="dimmed">
                {Numbers.convertBytes(value.size, 1000)}
              </Text>
            </Stack>
            <Button mt="lg" onClick={() => onValue(value.id)}>
              Select
            </Button>
          </Card>
        ))}
      </Group>
    </Stack>
  );
}

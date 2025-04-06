import { ActionIcon, Group, rem, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import { api } from '../api/Api';

interface Props {
  id: number;
  name: string;
}

export function EditableApiKey({ id, name }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  async function onSave() {
    await api.renameApiKey(id, editedName);
    setIsEditing(false);
    notifications.show({
      title: 'Success!',
      message: 'Key successfully renamed',
      icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
      color: 'green',
    });
  }

  function onBeginEdit() {
    setEditedName(name);
    setIsEditing(true);
  }

  return (
    <Group gap="xs">
      <TextInput value={editedName} onChange={(e) => setEditedName(e.currentTarget.value)} readOnly={!isEditing} />
      {isEditing ? (
        <ActionIcon variant={'subtle'} onClick={onSave}>
          <IconCheck />
        </ActionIcon>
      ) : (
        <ActionIcon variant={'subtle'} onClick={onBeginEdit}>
          <IconEdit />
        </ActionIcon>
      )}
    </Group>
  );
}

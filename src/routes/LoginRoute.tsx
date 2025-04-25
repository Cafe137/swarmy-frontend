import { Anchor, Button, Group, PasswordInput, rem, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/Api';
import PublicLayout from '../PublicLayout';
import { useAuthStore } from '../store/AuthStore.ts';
import { Vertical } from '../utility/Vertical.tsx';

export default function LoginRoute() {
  const navigate = useNavigate();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value ? null : 'Invalid password'),
    },
  });

  const { setAccessToken } = useAuthStore();

  async function onLoginPressed({ email, password }: { email: string; password: string }) {
    try {
      const token = await api.login(email, password);
      setAccessToken(token);
      navigate('/app');
    } catch (e) {
      console.error(e);
      notifications.show({
        title: 'Login failed',
        message: e.response.status === 401 ? 'Invalid email or password' : e.message,
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        color: 'red',
      });
    }
  }

  return (
    <PublicLayout>
      <Vertical center gap={20} p={20}>
        <h2>Welcome!</h2>
        <Text c="dimmed" size="sm" ta="center">
          Do not have an account yet?{' '}
          <Anchor size="sm" component={Link} to={'/signup'}>
            Create account
          </Anchor>
        </Text>

        <Vertical
          width={640}
          p={40}
          border="1px solid rgb(249, 115, 22)"
          borderRadius={12}
          background="rgb(21, 26, 33)"
        >
          <form onSubmit={form.onSubmit((values) => onLoginPressed(values))}>
            <TextInput
              label="Email"
              placeholder="Your email"
              required
              key={form.key('email')}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <Group justify="end" mt="lg">
              <Anchor component={Link} to={'/forgot-password'} size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" type="submit">
              Sign in
            </Button>
          </form>
        </Vertical>
      </Vertical>
    </PublicLayout>
  );
}

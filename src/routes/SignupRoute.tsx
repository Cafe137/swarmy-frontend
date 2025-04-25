import { Anchor, Button, PasswordInput, rem, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { api } from '../api/Api';
import PublicLayout from '../PublicLayout';
import { useAuthStore } from '../store/AuthStore.ts';
import { Vertical } from '../utility/Vertical.tsx';

export default function SignupRoute() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password should be at least 8 characters'),
      passwordConfirmation: (value, values) => (value === values.password ? null : 'Passwords do not match'),
    },
  });

  async function onSubmit({ email, password }) {
    try {
      setSubmitting(true);
      await api.signup({ email, password });
    } catch (e) {
      console.error(e);
      notifications.show({
        title: 'Signup failed',
        message: 'Please try again later',
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        color: 'red',
      });
      return;
    } finally {
      setSubmitting(false);
    }
    try {
      const token = await api.login(email, password);
      setAccessToken(token);
      navigate('/verify');
    } catch (e) {
      console.error('Auto login failed', e);
      navigate('/login');
    }
  }

  return (
    <PublicLayout>
      <Vertical center gap={20} p={20}>
        <h2>Create Account</h2>
        <Text c="dimmed" size="sm" ta="center">
          Already have an account?{' '}
          <Anchor size="sm" component={Link} to={'/login'}>
            Sign in
          </Anchor>
        </Text>
        <Vertical
          width={640}
          p={40}
          border="1px solid rgb(249, 115, 22)"
          borderRadius={12}
          background="rgb(21, 26, 33)"
        >
          <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
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
            <PasswordInput
              label="Confirm password"
              placeholder="Your password again"
              required
              mt="md"
              key={form.key('passwordConfirmation')}
              {...form.getInputProps('passwordConfirmation')}
            />

            <Text mt={'md'} c={'gray.5'} size={'xs'}>
              By signing up you agree to the
              <Anchor c={'orange'} mx={'4'} component={RouterNavLink} to={'/terms-of-service'}>
                Terms of Service
              </Anchor>
              and
              <Anchor c={'orange'} ml={4} component={RouterNavLink} to={'/privacy'}>
                Privacy Policy
              </Anchor>
              .
            </Text>

            <Button disabled={submitting} fullWidth mt="lg" type="submit">
              Sign up
            </Button>
          </form>
        </Vertical>
      </Vertical>
    </PublicLayout>
  );
}

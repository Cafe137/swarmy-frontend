import { Button, PasswordInput, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/Api.ts';
import PublicLayout from '../PublicLayout.tsx';
import { Vertical } from '../utility/Vertical.tsx';

export function ResetPasswordRoute() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
    validate: {
      password: (value) => (value.length >= 8 ? null : 'Password should be at least 8 characters'),
      passwordConfirmation: (value, values) => (value === values.password ? null : 'Passwords do not match'),
    },
  });

  async function onSubmit({ password }) {
    const token = searchParams.get('token');
    if (!token) {
      notifications.show({
        title: `Can't reset password`,
        message: 'Please request a new password reset email',
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        color: 'red',
      });
      return;
    }
    try {
      setSubmitting(true);
      await api.resetPassword(password, token);
      notifications.show({
        title: 'Password reset successful!',
        message: 'Now you can log in',
        icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        color: 'green',
      });
      navigate('/login');
    } catch (e) {
      console.error(e);
      notifications.show({
        title: 'Password reset failed!',
        message: 'Please try again later',
        icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
        color: 'red',
      });
      return;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicLayout>
      <Vertical center gap={20} p={20}>
        <h2>Reset password</h2>

        <Vertical
          width={640}
          p={40}
          border="1px solid rgb(249, 115, 22)"
          borderRadius={12}
          background="rgb(21, 26, 33)"
        >
          <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
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

            <Button disabled={submitting} fullWidth mt="xl" type="submit">
              Submit
            </Button>
          </form>
        </Vertical>
      </Vertical>
    </PublicLayout>
  );
}

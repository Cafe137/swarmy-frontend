import { Center, Loader } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { api } from '../api/Api.ts';
import PublicLayout from '../PublicLayout.tsx';
import { useAuthStore } from '../store/AuthStore.ts';
import { useProfileStore } from '../store/ProfileStore.ts';

export default function RootRoute() {
  const { setProfile } = useProfileStore();
  const { accessToken } = useAuthStore();
  const {
    data: profileData,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
    enabled: !!accessToken,
  });

  React.useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [isFetching]);

  return (
    <>
      <Notifications />
      {isLoading ? (
        <PublicLayout>
          <Center p={'xl'}>
            <Loader mt={'xl'} />
          </Center>
        </PublicLayout>
      ) : (
        <Outlet />
      )}

      {/*<Outlet />*/}
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </>
  );
}

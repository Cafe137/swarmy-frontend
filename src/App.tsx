import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/notifications/styles.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AnalyticsRoute from './routes/AnalyticsRoute.tsx';
import ApiGuideRoute from './routes/ApiGuideRoute.tsx';
import ApiKeysRoute from './routes/ApiKeysRoute.tsx';
import BillingRoute from './routes/BillingRoute.tsx';
import ContactRoute from './routes/ContactRoute.tsx';
import FAQRoute from './routes/FAQRoute.tsx';
import FeedsRoute from './routes/FeedsRoute.tsx';
import FilesRoute from './routes/FilesRoute.tsx';
import { ForgotPasswordRoute } from './routes/ForgotPasswordRoute.tsx';
import HomeRoute from './routes/HomeRoute.tsx';
import LoginRoute from './routes/LoginRoute.tsx';
import { NotFoundRoute } from './routes/NotFoundRoute.tsx';
import PrivacyRoute from './routes/PrivacyRoute.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { ResetPasswordRoute } from './routes/ResetPasswordRoute.tsx';
import RootRoute from './routes/RootRoute.tsx';
import SignupRoute from './routes/SignupRoute.tsx';
import TermsOfServiceRoute from './routes/TermsOfServiceRoute.tsx';
import VerifyEmailRoute from './routes/VerifyEmailRoute.tsx';

function App() {
  const greenColors: MantineColorsTuple = [
    '#B6FEDA',
    '#66F6AE',
    '#1ee783',
    '#19D678',
    '#14C46D',
    '#10B261',
    '#0C9F56',
    '#098C4B',
    '#067940',
    '#046434',
  ];

  const redColors: MantineColorsTuple = [
    '#FEE1E2',
    '#FDD1D2',
    '#FCC1C3',
    '#FAB1B3',
    '#F8A2A4',
    '#F59396',
    '#F28488',
    '#EF767A',
    '#C45A5D',
    '#974042',
  ];

  const darkColors: MantineColorsTuple = [
    '#e1e3e1',
    '#D2D5D3',
    '#B3B9B6',
    '#959D9B',
    '#778180', //border
    '#596465',
    '#3B4548', //paper
    '#1d252c', //background
    '#191E27',
    '#151721',
  ];

  const theme = createTheme({
    colors: {
      green: greenColors,
      red: redColors,
      dark: darkColors,
    },
    primaryColor: 'orange',
    primaryShade: 6,
  });

  return (
    <MantineProvider defaultColorScheme={'dark'} forceColorScheme={'dark'} theme={theme}>
      <ModalsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRoute />}>
              <Route index element={<HomeRoute />} />
              <Route path="login" element={<LoginRoute />} />
              <Route path="privacy" element={<PrivacyRoute />} />
              <Route path="terms-of-service" element={<TermsOfServiceRoute />} />
              <Route path="contact" element={<ContactRoute />} />
              <Route path="faq" element={<FAQRoute />} />
              <Route path="forgot-password" element={<ForgotPasswordRoute />} />
              <Route path="reset-password" element={<ResetPasswordRoute />} />
              <Route path="signup" element={<SignupRoute />} />
              <Route path="verify" element={<VerifyEmailRoute />} />

              <Route path="app" element={<ProtectedRoute />}>
                <Route index element={<Navigate to="files" />} />
                <Route path="files" element={<FilesRoute />} />
                <Route path="feeds" element={<FeedsRoute />} />
                <Route path="analytics" element={<AnalyticsRoute />} />
                <Route path="api-keys" element={<ApiKeysRoute />} />
                <Route path="api-guide" element={<ApiGuideRoute />} />
                <Route path="billing" element={<BillingRoute />} />
              </Route>
              <Route path="*" element={<NotFoundRoute />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;

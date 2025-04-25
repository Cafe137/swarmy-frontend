import { BatchId, Reference } from '@ethersphere/bee-js';
import { Anchor, Button, Text, TextInput } from '@mantine/core';
import axios from 'axios';
import { Numbers } from 'cafe-utility';
import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { AppIcon } from './AppIcon.tsx';
import { HexagonText } from './HexagonText.tsx';
import { Logo } from './Logo.tsx';
import { StyledH2 } from './StyledH2.tsx';
import { SwarmLogo } from './SwarmLogo.tsx';
import { useAuthStore } from './store/AuthStore.ts';
import { Horizontal } from './utility/Horizontal.tsx';
import { Vertical } from './utility/Vertical.tsx';

interface Stats {
  uploadedFiles: number;
  downloaded: string;
  latency: string;
  storagePrice: number;
  postageBatches: number;
  population: number;
}

export function HeroSection() {
  const [stats, setStats] = useState<Stats>({
    uploadedFiles: 21746,
    downloaded: '348413998',
    latency: '110.2396',
    storagePrice: 29943,
    postageBatches: 1714,
    population: 13804,
  });
  const [reference, setReference] = useState<string>('');
  const [batchId, setBatchId] = useState<string>('');

  const signedIn = useAuthStore((state) => state.signedIn());

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    axios.get('/stats').then((response) => {
      setStats(response.data);
    });
  }, []);

  async function onCheck() {
    const cid = new Reference(reference).toCid('manifest');
    window.open(`https://${cid}.bzz.limo`, '_blank');
  }

  async function onBatch() {
    const id = new BatchId(batchId);
    window.open(`https://bzz.limo/batch/${id.toHex()}`, '_blank');
  }

  return (
    <Vertical p={20} gap={80} center>
      <Vertical
        width={640}
        gap={20}
        p={40}
        border="1px solid rgb(249, 115, 22)"
        borderRadius={12}
        background="rgb(21, 26, 33)"
      >
        <Horizontal gap={10} center>
          <AppIcon s={90} />
          <Logo w={256} />
        </Horizontal>
        <Horizontal>
          <Text fz={18} fw={600} mr={10} c={'white'}>
            A
          </Text>
          <SwarmLogo height={28} />
          <Text fz={20} fw={600} c={'white'}>
            &nbsp; as a service solution
          </Text>
        </Horizontal>

        <Text fz={18} fw={400}>
          A service that makes it simple to store and retrieve media on{' '}
          <Anchor fz={18} target={'_blank'} href={'https://www.ethswarm.org/'}>
            Swarm
          </Anchor>
          .
        </Text>

        <Button radius="sm" size="md" component={RouterNavLink} to={signedIn ? '/app' : '/signup'}>
          {signedIn ? 'Go to dashboard' : 'Sign up'}
        </Button>
      </Vertical>
      <Vertical gap={20} width={640}>
        <StyledH2>Features</StyledH2>
        <HexagonText>Pay with credit card or crypto</HexagonText>
        <HexagonText>Upload and download files and folders</HexagonText>
        <HexagonText>Use with the Swarmy UI or via API</HexagonText>
        <HexagonText>Host websites and set up ENS</HexagonText>
        <HexagonText>Create and manage Swarm feeds</HexagonText>
      </Vertical>
      <Vertical
        width={640}
        gap={20}
        p={40}
        border="1px solid rgb(249, 115, 22)"
        borderRadius={12}
        background="rgb(21, 26, 33)"
      >
        <h2>Quick Access</h2>
        <TextInput
          placeholder="Swarm reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onCheck();
            }
          }}
        />
        <Button radius="sm" onClick={onCheck}>
          Check
        </Button>
      </Vertical>
      <Vertical gap={20} width={640}>
        <StyledH2>Statistics</StyledH2>
        <Horizontal>
          <Text fz={24} fw={600} c="orange">
            {stats.uploadedFiles.toLocaleString()}
          </Text>
          <Text fz={18} fw={400}>
            &nbsp; uploaded files
          </Text>
        </Horizontal>
        <Horizontal>
          <Text fz={24} fw={600} c="orange">
            {Numbers.convertBytes(Number(stats.downloaded))}
          </Text>
          <Text fz={18} fw={400}>
            &nbsp; downloaded
          </Text>
        </Horizontal>
        <Horizontal>
          <Text fz={24} fw={600} c="orange">
            {stats.latency} ms
          </Text>
          <Text fz={18} fw={400}>
            &nbsp; average download latency
          </Text>
        </Horizontal>
      </Vertical>
      <Vertical
        width={640}
        gap={20}
        p={40}
        border="1px solid rgb(249, 115, 22)"
        borderRadius={12}
        background="rgb(21, 26, 33)"
      >
        <h2>Lookup Batch</h2>
        <TextInput
          placeholder="Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onBatch();
            }
          }}
        />
        <Button radius="sm" onClick={onBatch}>
          Check
        </Button>
      </Vertical>
      <Vertical gap={20} width={640}>
        <StyledH2>Network</StyledH2>
        <Horizontal>
          <Text fz={24} fw={600} c="orange">
            {stats.population.toLocaleString()}
          </Text>
          <Text fz={18} fw={400}>
            &nbsp; population
          </Text>
        </Horizontal>
        <Horizontal>
          <Text fz={24} fw={600} c="orange">
            {stats.storagePrice.toLocaleString()}
          </Text>
          <Text fz={18} fw={400}>
            &nbsp; storage price
          </Text>
        </Horizontal>
        <Horizontal>
          <Text fz={24} fw={600} c="orange">
            {stats.postageBatches.toLocaleString()}
          </Text>
          <Text fz={18} fw={400}>
            &nbsp; postage batches
          </Text>
        </Horizontal>
      </Vertical>
    </Vertical>
  );
}

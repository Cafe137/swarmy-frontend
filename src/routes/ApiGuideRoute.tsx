import { Alert, Flex, Select, Space, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { stackoverflowDark as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { api } from '../api/Api.ts';
import { config } from '../config.tsx';

const downloadEndpoint = `${config.apiUrl}/files`;
const uploadEndpoint = `${config.apiUrl}/api/files`;
const binaryUploadEndpoint = `${config.apiUrl}/api/data/bin`;
const utf8UploadEndpoint = `${config.apiUrl}/api/data/utf8`;

export default function ApiGuideRoute() {
  const [apiKey, setApiKey] = useState<string | null>('YOUR_API_KEY');
  const [uploadType, setUploadType] = useState<string | null>('Binary');
  const [httpClient, setHttpClient] = useState<string | null>('Axios');

  const { isSuccess, data } = useQuery({
    queryKey: ['api-keys'],
    queryFn: api.getApiKeys,
  });

  function getBashFileUpload() {
    return `curl -X POST -F file=@file.jpg -H "Authorization: Bearer ${apiKey}" "${uploadEndpoint}"`;
  }

  function getBashWebsiteUpload() {
    return `curl -X POST -F file=@site.tar -H "Authorization: Bearer ${apiKey}" "${uploadEndpoint}?website=true"`;
  }

  function getBashFileDownload() {
    return `curl "${downloadEndpoint}/hash_of_file?k=${apiKey}" --output filename`;
  }

  function getBashListFiles() {
    return `curl -H "Authorization: Bearer ${apiKey}" "${uploadEndpoint}"`;
  }

  function getJavaScriptUpload() {
    if (httpClient === 'Fetch') {
      if (uploadType === 'Binary') {
        return `const API_KEY = '${apiKey}';

const response = await fetch(\`${binaryUploadEndpoint}?k=\${API_KEY}\`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'filename.bin',
        contentType: 'application/octet-stream',
        base64: buffer.toString('base64')
    })
});
const json = await response.json();
console.log(json);`;
      } else {
        return `const API_KEY = '${apiKey}';

const response = await fetch(\`${utf8UploadEndpoint}?k=\${API_KEY}\`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: ${uploadType === 'Utf8' ? `'filename.txt'` : `'filename.json'`},
        contentType: ${uploadType === 'Utf8' ? `'text/plain'` : `'application/json'`},
        utf8: ${uploadType === 'Utf8' ? `'Hello, world!'` : 'JSON.stringify({ key: "value" })'}
    })
});
const json = await response.json();
console.log(json);`;
      }
    } else {
      if (uploadType === 'Binary') {
        return `const API_KEY = '${apiKey}';

const response = await axios.post(\`${binaryUploadEndpoint}?k=\${API_KEY}\`, {
    name: 'filename.bin',
    contentType: 'application/octet-stream',
    base64: buffer.toString('base64'),
})
console.log(response.json())`;
      } else {
        return `const API_KEY = '${apiKey}';

const response = await axios.post(\`${utf8UploadEndpoint}?k=\${API_KEY}\`, {
    name: '${uploadType === 'Utf8' ? 'filename.txt' : 'filename.json'}',
    contentType: '${uploadType === 'Utf8' ? 'text/plain' : 'application/json'}',
    utf8: ${uploadType === 'Utf8' ? "'Hello, world!'" : 'JSON.stringify({ key: "value" })'},
})
console.log(response.json())`;
      }
    }
  }

  function getJavaScriptDownload() {
    if (httpClient === 'Fetch') {
      return `const API_KEY = '${apiKey}';

const response = await fetch(\`https://api.swarmy.cloud/files/\${reference}?k=\${API_KEY}\`)
if (!response.ok) {
    throw Error(\`Failed to fetch reference \${reference}: \${response.statusText}\`)
}
// use response.json(), response.blob(), or response.text() to get the data you expect`;
    } else {
      return `const API_KEY = '\${apiKey}';

const response = await axios.get(\`https://api.swarmy.cloud/files/\${reference}?k=\${API_KEY}\`)
// response.data holds the file data
`;
    }
  }

  return (
    <>
      <h1>API guide</h1>
      <Flex justify={'flex-end'} mr={'lg'}>
        <Stack gap={'xs'}>
          <Text>Key to use:</Text>
          <Select
            w={250}
            data={isSuccess ? data.filter((x) => x.status === 'ACTIVE').map((d) => d.apiKey) : []}
            value={apiKey}
            onChange={setApiKey}
          />
        </Stack>
      </Flex>

      <h2>Upload data with JavaScript</h2>

      <Stack gap={'xs'} mb={24}>
        <Text>Data type</Text>
        <Select w={250} data={['Binary', 'Utf8', 'JSON']} value={uploadType} onChange={setUploadType} />
      </Stack>

      <Stack gap={'xs'} mb={24}>
        <Text>HTTP client</Text>
        <Select w={250} data={['Axios', 'Fetch']} value={httpClient} onChange={setHttpClient} />
      </Stack>

      <SyntaxHighlighter language="javascript" style={theme}>
        {getJavaScriptUpload()}
      </SyntaxHighlighter>

      <Text>Response:</Text>
      <SyntaxHighlighter language="json" style={theme}>
        {'{ "id": 1, "swarmReference": "10a73599366736e2b7a9b3a2bf2ef61f45a74486cf9153ed294bd87ae5b20883" }'}
      </SyntaxHighlighter>

      <h2>Download data with JavaScript</h2>

      <SyntaxHighlighter language="javascript" style={theme}>
        {getJavaScriptDownload()}
      </SyntaxHighlighter>

      <Space h={'lg'} />

      <h2>Upload a file with curl</h2>
      <SyntaxHighlighter language="bash" style={theme}>
        {getBashFileUpload()}
      </SyntaxHighlighter>

      <Space h={'lg'} />

      <h2>Fetch uploaded files</h2>
      <SyntaxHighlighter language="bash" style={theme}>
        {getBashListFiles()}
      </SyntaxHighlighter>

      <Space h={'lg'} />

      <h2>Download file</h2>
      <SyntaxHighlighter language="bash" style={theme}>
        {getBashFileDownload()}
      </SyntaxHighlighter>

      <Space h={'lg'} />

      <h2>Host a website</h2>
      <div>
        First, we need to prepare a directory containing our website. Make sure that the <i>index.html</i> file is at
        the root of the directory tree.
      </div>
      <SyntaxHighlighter language="bash" style={theme}>
        {`tree my_website
>
my_website
├── assets
│   └── style.css
├── index.html
└── error.html`}
      </SyntaxHighlighter>
      <div>Use the following command to ensure that the tar package maintains the correct directory structure:</div>

      <SyntaxHighlighter language="bash" style={theme}>
        {`cd my_website
tar -cf ../my_website.tar .
cd ..`}
      </SyntaxHighlighter>

      <Alert variant={'filled'} color="orange.6">
        <b>GZIP compression is not supported, so make sure not to use the -z flag when using the tar command!</b>
      </Alert>

      <Space h={'lg'} />
      <div>Next, simply POST the tar file to the upload endpoint.</div>

      <SyntaxHighlighter language="bash" style={theme}>
        {getBashWebsiteUpload()}
      </SyntaxHighlighter>

      <Space h={'lg'} />
    </>
  );
}

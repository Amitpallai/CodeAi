'use client';
import { ActionContext } from '../../../context/ActionContext';
import { SandpackPreview, useSandpack, SandpackPreviewRef } from '@codesandbox/sandpack-react';
import React, { useContext, useEffect, useRef, useCallback } from 'react';

interface SandpackClient {
  getCodeSandboxURL: () => Promise<{
    sandboxId: string;
    editorUrl: string;
  }>;
}

function SandpackPreviewClient() {
  const previewRef = useRef<SandpackPreviewRef>(null);
  const { sandpack } = useSandpack();
  const { action } = useContext(ActionContext);

  const GetSandpackClient = useCallback(async () => {
    if (!previewRef.current) return;
    const client = await previewRef.current.getClient();
    if (!client) return;

    const downloadFiles = async () => {
      try {
        const files = sandpack?.files || {};
        
        // Create a zip file structure
        const zipContent = Object.entries(files)
          .map(([path, file]) => {
            if (file.code) {
              // Remove leading slash from path
              const cleanPath = path.startsWith('/') ? path.slice(1) : path;
              return `File: ${cleanPath}\n\n${file.code}\n\n---\n\n`;
            }
            return '';
          })
          .join('');

        // Create a blob with the content
        const blob = new Blob([zipContent], { type: 'text/plain' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'project-files.txt';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error creating download:', error);
      }
    };

    if (action?.actionType === 'deploy') {
      const result = await (client as unknown as SandpackClient).getCodeSandboxURL();
      window.open('https://' + result?.sandboxId + ".csb.app/");
    } else if (action?.actionType === 'export') {
      await downloadFiles();
    }
  }, [action, sandpack]);

  useEffect(() => {
    GetSandpackClient();
  }, [GetSandpackClient]);

  return (
    <SandpackPreview
      ref={previewRef}
      showNavigator={true}
      style={{ height: '80vh' }}
    />
  );
}

export default SandpackPreviewClient;
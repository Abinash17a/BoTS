// src/pages/bots/BotBuilder.tsx
import Flow from '../../components/Flow'  // adjust path as per your folder structure
import { ReactFlowProvider } from '@xyflow/react';

export default function BotBuilder() {
  return (
    <>
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
    </>
  );
}

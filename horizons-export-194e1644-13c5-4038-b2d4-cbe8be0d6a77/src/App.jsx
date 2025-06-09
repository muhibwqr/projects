
import React from 'react';
import PhishingDetector from '@/components/PhishingDetector';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <PhishingDetector />
      <Toaster />
    </>
  );
}

export default App;

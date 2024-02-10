import { useContext } from 'react';
import { SystemContext } from './systemprovider';

// Custom hook to access the context
const useFeatureFlag = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a SystemProvider');
  }
  return context.featureFlags;
};

export { useFeatureFlag }
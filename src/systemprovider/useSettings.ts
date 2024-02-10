import { useContext } from 'react';
import { SystemContext } from './systemprovider';

const useSettings = () => {
    const context = useContext(SystemContext);
    if (!context) {
      throw new Error('useFeatureFlags must be used within a SystemProvider');
    }
    return context.settings;
  };

export { useSettings}  
  
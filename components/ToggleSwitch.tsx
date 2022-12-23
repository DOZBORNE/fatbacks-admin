import { useEffect, useState } from 'react';
import { Alert, Switch } from 'react-native';
import apiUrl from '../constants/constants';

export default function ToggleSwitch({
  modifier,
  initStatus,
}: {
  modifier: string;
  initStatus: boolean;
}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [status, setStatus] = useState('idle');

  async function toggleModifier(modifierName: string) {
    setStatus('loading');
    return await fetch(
      `${apiUrl}/catalog/update/${modifierName}/${!isEnabled}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
  }

  useEffect(() => {
    setIsEnabled(initStatus);
  }, [initStatus]);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    toggleModifier(modifier)
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
        setStatus('idle');

        if (!response.ok) {
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
      })
      .catch((err) => {
        console.error('There was an error!', err);
        Alert.alert('There was an error updating the modifier!', err);
      });
  };
  return (
    <Switch
      trackColor={{ false: '#76757f7', true: '#E02929' }}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}
      disabled={status === 'loading'}
    />
  );
}

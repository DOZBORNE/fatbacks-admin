import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import { useEffect, useState } from 'react';
import { SIDES } from './Home.constants';
import ToggleSwitch from '../../components/ToggleSwitch';

export default function Home({ navigation }: RootTabScreenProps<'Home'>) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modifierStatus, setModifierStatus] = useState<any>({});
  const [error, setError] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState('idle');

  function fetchData() {
    fetch('http://localhost:3000/api/v1/catalog/status')
      .then(async (res) => {
        const data = await res.json();
        setModifierStatus(data.data);

        if (!res.ok) {
          const error = (data && data.message) || res.statusText;
          return Promise.reject(error) && Alert.alert(error);
        }
      })
      .catch((err) => setError('we have a problem'))
      .finally(() => {
        setRefreshing(false);
        setStatus('idle');
      });
  }

  useEffect(() => {
    setStatus('loading');
    fetchData();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    fetchData();
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
      {error ? Alert.alert('There was an error', error.toString()) : null}
      {status === 'loading' ? (
        <View
          style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        </View>
      ) : (
        Object.keys(SIDES).map((key) => (
          <View style={styles.itemToggle} key={key}>
            <Text>{SIDES[key]}</Text>
            <ToggleSwitch modifier={key} initStatus={modifierStatus[key]} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemToggle: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

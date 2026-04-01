import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import { AddEntryScreen } from '../../features/entries/screens/AddEntryScreen';
import { EntryDetailScreen } from '../../features/entries/screens/EntryDetailScreen';
import { EntryListScreen } from '../../features/entries/screens/EntryListScreen';
import { MapScreen } from '../../features/map/screens/MapScreen';

const RootStack = createNativeStackNavigator();
const HomeTabs = createBottomTabNavigator();

function useFocusRefreshKey(navigation) {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRefreshKey((current) => current + 1);
    });

    return unsubscribe;
  }, [navigation]);

  return refreshKey;
}

function TimelineTabRoute({ navigation, rootNavigation }) {
  const refreshKey = useFocusRefreshKey(navigation);

  return (
    <EntryListScreen
      onCreateEntry={() => rootNavigation.navigate('AddEntry', { mode: 'create' })}
      onOpenEntry={(entryId) => rootNavigation.navigate('EntryDetail', { entryId })}
      refreshKey={refreshKey}
    />
  );
}

function MapTabRoute({ navigation, rootNavigation }) {
  const refreshKey = useFocusRefreshKey(navigation);

  return (
    <MapScreen
      onOpenEntry={(entryId) => rootNavigation.navigate('EntryDetail', { entryId })}
      refreshKey={refreshKey}
    />
  );
}

function HomeTabsRoute({ navigation }) {
  return (
    <HomeTabs.Navigator
      initialRouteName="Timeline"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f6efe5',
        },
        headerTintColor: '#2d231f',
        tabBarActiveTintColor: '#2f6f91',
        tabBarInactiveTintColor: '#8d6b4f',
        tabBarStyle: {
          backgroundColor: '#fff9f1',
        },
      }}
    >
      <HomeTabs.Screen
        name="Timeline"
        options={{ title: 'Timeline' }}
      >
        {(props) => <TimelineTabRoute {...props} rootNavigation={navigation} />}
      </HomeTabs.Screen>
      <HomeTabs.Screen
        name="Map"
        options={{ title: 'Map' }}
      >
        {(props) => <MapTabRoute {...props} rootNavigation={navigation} />}
      </HomeTabs.Screen>
    </HomeTabs.Navigator>
  );
}

function EntryDetailRoute({ navigation, route }) {
  const refreshKey = useFocusRefreshKey(navigation);

  return (
    <EntryDetailScreen
      entryId={route.params.entryId}
      onEditEntry={(entryId) => navigation.navigate('AddEntry', { mode: 'edit', entryId })}
      refreshKey={refreshKey}
    />
  );
}

function AddEntryRoute({ navigation, route }) {
  return (
    <AddEntryScreen
      onCancel={() => navigation.goBack()}
      onSaved={(savedEntry) => {
        navigation.replace('EntryDetail', {
          entryId: savedEntry.id,
        });
      }}
      routeParams={route.params}
    />
  );
}

export function AppNavigator({ navigationRef }) {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName="HomeTabs"
        screenOptions={{
          headerTintColor: '#2d231f',
          headerStyle: {
            backgroundColor: '#f6efe5',
          },
        }}
      >
        <RootStack.Screen
          component={HomeTabsRoute}
          name="HomeTabs"
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          component={EntryDetailRoute}
          name="EntryDetail"
          options={{ title: 'イベント詳細' }}
        />
        <RootStack.Screen
          component={AddEntryRoute}
          name="AddEntry"
          options={({ route }) => ({
            title: route.params.mode === 'edit' ? 'イベントを編集' : '新規イベント',
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

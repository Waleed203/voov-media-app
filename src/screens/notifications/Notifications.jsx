import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAPIService from '../../services/APIService'
import useGlobalFunctions from '../../services/GlobalService';
import { useNavigation } from '@react-navigation/native';
import { APP_CONSTANTS } from '../../config/constants';
import { FlatList } from 'react-native';
import NotificationItem from './components/NotificationItem';
import { useTheme } from '../../context/ThemeContext';
import AppHeader from '../../components/AppHeader';

const Notifications = () => {
  const navigation = useNavigation();
  const { showToast, get } = useGlobalFunctions();
  const { sendRequest } = useAPIService();


  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    console.log('noti arr = ', notifications)
  }, [notifications])

  const refreshNotifications = async () => {
    console.log('refresh')
    setRefreshing(true);
    setPage(1);
    setNotifications([]);
    setHasMore(true);
    await fetchNoti();
    setRefreshing(false);
  };

  const fetchNoti = async () => {
    console.log('running fetch noti');
    if (loading || !hasMore) return;

    const id = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
    if (!id) return;

    try {
      setLoading(true);

      const params = {
        page: page,
        uid: id,
      };

      const response = await sendRequest('notifications', params, 'POST', true);
      const notiRes = response.data;

      if (notiRes.status) {
        const newData = notiRes.data.notifications.filter((item) => (item.notification_type !== 'unfollow' && item.notification_type !== ''));
        setNotifications((prev) => [...prev, ...newData]);

        const currentPage = notiRes.data.current_page;
        const totalPages = notiRes.data.total_pages;

        setPage(currentPage + 1);
        setHasMore(currentPage < totalPages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = (notification, type) => {
    Alert.alert(
      'Delete Notification',
      type === 'all' ? 'Are you sure you want to delete all notifications?' : 'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            console.log('notification removed = ', notification);
            let params = {};

            if (type === 'all') {
              params = {
                delete_all: true,
              };
            } else {
              params = { notification_id: notification.notification_id };
            }

            const response = await sendRequest('delete_notification', params, 'POST', true);
            console.log('notification removed response = ', response);
            if (response.data.status) {
              showToast(response.data.message);
              if(type == 'all') {
                setPage(1);
                setNotifications([]);
                fetchNoti();
              } else {
                setNotifications((prev) => prev.filter((item) => item.notification_id !== notification.notification_id));
              }
            }
            setLoading(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.mode == 'light' ? theme.background : '#000', paddingVertical: 10 }}>
      <AppHeader title="Notifications" showBack={true} />
      {
        notifications.length > 0 ? (
          <TouchableOpacity onPress={() => removeNotification(null, 'all')} style={styles.clearContainer}>
            <Text style={styles.clearText}>Clear Notifications</Text>
          </TouchableOpacity>
        ) : null
      }
      {
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.mode == 'light' ? theme.text : '#fff'} />
          </View>
        ) : null
      }
      <FlatList
        data={notifications}
        onEndReached={fetchNoti}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refreshNotifications}
        renderItem={({ item, index }) => (
          <NotificationItem notification={item} index={index} removeNotification={(notification) => removeNotification(notification, 'single')} />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emoji}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        )}
      />
    </View>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 20
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d3d3d3',
    marginHorizontal: 10,
    marginVertical: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20
  }
})
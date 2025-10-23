import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader';
import { APP_CONSTANTS } from '../../config/constants';
import moment from 'moment';
import useGlobalFunctions from '../../services/GlobalService';
import useAPIService from '../../services/APIService';
import VideoStatistics from './components/VideoStats';
import { useTheme } from '../../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const Studio = () => {
  const { get, showToast } = useGlobalFunctions();
  const { sendRequest } = useAPIService();
  const [statistics, setStatistics] = useState({});
  const [videoStatistics, setVideoStatistics] = useState(null);
  const { theme } = useTheme();

  const [withdraw, setWithdraw] = useState(false);

  const handleWithdraw = async () => {
    setWithdraw(true);
    console.log('withdrawing funds');
    try {
      const params = {
        "month": moment().format('YYYY-MM'),
        "note": `Please transfer my ${moment().format('MMMM YYYY')} earnings`,
      };
      const response = await sendRequest('withdraw_admob_funds', params, 'POST', true);
      const withdrawRes = response.data;
      console.log('withdraw Res = ', withdrawRes);
      if (withdrawRes.status) {
        console.log('withdraw success');
        showToast('Withdrawal request sent successfully');
      }
    } catch (error) {
      console.log('Error withdrawing funds:', error);
      showToast(error.error.message)
    } finally {
      setWithdraw(false);
    }
  }

  useEffect(() => {
    console.log('theme = ', theme)
    fetchStatisticsAndBalance();
    fetchVideoStatistics();
  }, [])

  useEffect(() => {
    console.log('videoStatistics = ', videoStatistics);
  }, [videoStatistics])

  const fetchVideoStatistics = async () => {
    const id = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
    console.log('uid = ', id);
    if (!id) {
      return;
    }
    try {
      const params = {};

      console.log('ad params ', params);
      const response = await sendRequest('video_revenue_summary', params, 'POST', true);
      console.log('video revenue summary = ', response);
      const videoSummary = response.data;
      if (videoSummary.status) {
        console.log('in = ', videoSummary.data);
        setVideoStatistics(videoSummary.data);
      }
    } catch (error) {
      console.error('Error fetching user videos:', error);
    }
  }

  const fetchStatisticsAndBalance = async () => {
    const id = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
    console.log('uid = ', id);
    if (!id) {
      return;
    }
    try {
      const params = {
        "creator_id": 504,
        "video_id": null,
        "start_date": "2025-04-01", // moment().format('YYYY-MM-DD'),
        "end_date": "2025-04-23", // moment().add(1, 'month').format('YYYY-MM-DD'),
        "eCPM": 2.0
      };

      console.log('ad params ', params);
      const response = await sendRequest('add_mob_revenue', params, 'POST', true);
      // console.log('user revenue = ', response);
      const userRevenue = response.data;
      if (userRevenue.status) {
        console.log('in = ', userRevenue.data[0]);
        setStatistics(userRevenue.data[0]);
      }
    } catch (error) {
      console.error('Error fetching user videos:', error);
    }
  }

  useEffect(() => {
    console.log('statistics = ', statistics);
  }, [statistics])

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader title="Voov Media Studio" showBack={true} />

      {
        videoStatistics == null ?
          <ActivityIndicator size="large" color={theme.primary} />
          :
          <FlatList showsVerticalScrollIndicator={false} ListHeaderComponent={() => {
            return (
              <>
                <View style={[styles.balanceBox, { backgroundColor: theme.mode == 'light' ? theme.cardbg : '#1e1e1e' }]}>
                  <View style={styles.balanceContainer}>
                    <Text style={[styles.balanceText, { color: theme.text }]}>Impressions</Text>
                    <Text style={[styles.balance, { color: theme.text }]}>{statistics.impressions || 0}</Text>
                  </View>

                  {/* <View style={{borderBottomColor: '#eee', borderBottomWidth: 0.5, height: 1, width: '100%'}}></View> */}

                  <View style={[styles.balanceContainer, { backgroundColor: theme.mode == 'light' ? theme.cardbg : '#1e1e1e' }]}>
                    <Text style={[styles.balanceText, { color: theme.text }]}>Balance</Text>
                    <Text style={[styles.balance, { color: theme.text }]}>${statistics.revenue_usd || 0}</Text>
                  </View>
                </View>



                <Text style={[styles.withdrawText, { color: theme.text }]}>Withdraw Funds for {moment().format('MMMM YYYY')}</Text>

                <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                  {
                    withdraw ?
                      <ActivityIndicator size="small" color={theme.text} />
                      :
                      <Text style={[styles.withdrawButtonText, { color: theme.text }]}>Withdraw Funds</Text>
                  }
                </TouchableOpacity>

                <View style={styles.analyticsRow}>
                  <View style={[styles.analyticsBox, { backgroundColor: theme.mode == 'light' ? theme.cardbg : '#1e1e1e' }]}>
                    <Text style={[styles.mainNumber, { color: theme.text }]}>{videoStatistics.stats?.total_views || 0}</Text>
                    <Text style={[styles.label, { color: theme.text }]}>Views</Text>
                    {/* <Text style={styles.changePositive}>▲ 3% 7d</Text> */}
                  </View>

                  <View style={[styles.analyticsBox, { backgroundColor: theme.mode == 'light' ? theme.cardbg : '#1e1e1e' }]}>
                    <Text style={[styles.mainNumber, { color: theme.text }]}>{videoStatistics.stats?.total_likes || 0}</Text>
                    <Text style={[styles.label, { color: theme.text }]}>Likes</Text>
                    {/* <Text style={styles.changePositive}>▲ 0.3% 7d</Text> */}
                  </View>

                  <View style={[styles.analyticsBox, { backgroundColor: theme.mode == 'light' ? theme.cardbg : '#1e1e1e' }]}>
                    <Text style={[styles.mainNumber, { color: theme.text }]}>{videoStatistics.stats?.total_comments || 0}</Text>
                    <Text style={[styles.label, { color: theme.text }]}>Comments</Text>
                    {/* <Text style={styles.changeNegative}>▼ 80% 7d</Text> */}
                  </View>
                </View>

                {/* Latest Post */}
                {/* <View style={[styles.latestPostBox, { backgroundColor: theme.cardbg }]}>
                <Text style={[styles.latestPostText, { color: theme.text }]}>Your latest Post</Text>
                <View style={[styles.postStats, { backgroundColor: theme.cardbg }]}>
                  <Text style={[styles.stat, { color: theme.text }]}>362</Text>
                  <Text style={[styles.stat, { color: theme.text }]}>23</Text>
                </View>
              </View> */}

                <VideoStatistics videoData={videoStatistics.videos} />
              </>
            );
          }}
          />
      }


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 16,
    flex: 1,
  },
  balanceBox: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20,
  },
  balanceContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  balance: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  withdrawButton: {
    backgroundColor: '#47c2f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  withdrawText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  analyticsBox: {
    backgroundColor: '#1e1e1e',
    width: (screenWidth - 48) / 3,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  mainNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    color: '#ccc',
    fontSize: 12,
    marginVertical: 4,
    textAlign: 'center',
  },
  changePositive: {
    color: '#00d084',
    fontSize: 12,
  },
  changeNegative: {
    color: '#ff4d4f',
    fontSize: 12,
  },
  latestPostBox: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  latestPostText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  postStats: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
});

export default Studio

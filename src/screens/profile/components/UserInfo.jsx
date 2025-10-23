import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TextInput, Pressable, Dimensions, ActivityIndicator } from "react-native";
import config from "../../../config/config";
import useAPIService from "../../../services/APIService";
import useGlobalFunctions from "../../../services/GlobalService";
import Stats from "./Stats";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons'
import FastImage from "@d11/react-native-fast-image";

const UserInfo = ({ onFollow, mode = "user", user }) => {
  const { sendRequest } = useAPIService();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const { showToast } = useGlobalFunctions();
  const [followed, setFollowed] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [bioModalVisible, setBioModalVisible] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [stats, setStats] = useState({
    following_list: [],
    follow_by_list: []
  });
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  const followUser = async () => {
    console.log('follow user', user);
    try {
      const params = { id: user.userId };
      const response = await sendRequest('add_followuser', params, 'POST', true);
      console.log('follow response = ', response);
      if (response.error == 'Token not found') {
        showToast("Please login first to follow user");
        return;
      }
      const followRes = response.data;
      if (followRes.status) {
        setFollowed(true)
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  }

  const fetchMyFollowing = async () => {
    try {
      const params = {};
      const response = await sendRequest('follow_following_list', params, 'POST', true);
      const followingRes = response.data;
      console.log('my following Res = ', followingRes);
      if (followingRes.status) {
        setStats(followingRes.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  useEffect(() => {
    console.log('inside stats = ', stats);
    if (mode != 'user') {
      stats.following_list.map((item) => {
        if (item.userId === user.userId) {
          setFollowed(true);
        }
      })
    }
  }, [stats])

  useFocusEffect(
    useCallback(() => {
      if (mode === "user") {
        fetchProfile();
        fetchMyFollowing();
      } else {
        fetchMyFollowing();
        console.log('user on user info = ', user);
        setProfile(user);
      }
    }, []),
  );

  const onEditProfile = () => {
    navigation.navigate('EditProfile', { profile: profile.user_basic_info });
  }

  const handleSaveBio = async () => {
    setLoading(true)
    const response = await sendRequest('save_bio', { bio: newBio }, 'POST', true);
    if (response.data.status) {
      showToast('Bio updated successfully');
      setProfile(prev => ({
        ...prev,
        user_basic_info: {
          ...prev.user_basic_info,
          bio: newBio
        }
      }));
      setBioModalVisible(false);
      setLoading(false)
    }
  };

  const fetchProfile = async () => {
    try {
      const params = {};
      const response = await sendRequest('profile', params, 'POST', true);


      if (response.error == 'Token not found') {
        setNotLoggedIn(true);
        return;
      }

      const profileRes = response.data;
      if (profileRes.status) {
        setProfile(profileRes.data);
        console.log('profile response = ', profileRes.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const openImageViewer = () => {
    navigation.navigate('ImageViewer', {
      imageUrl: profile?.user_basic_info?.profileImage,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Pressable onPress={openImageViewer} style={styles.avatarContainer}>

          <FastImage
            style={styles.avatar}
            source={
              profile?.user_basic_info?.profileImage && (profile?.user_basic_info?.profileImage.includes('googleusercontent') || profile?.user_basic_info?.profileImage.includes('fbsbx'))
                ? { uri: profile?.user_basic_info?.profileImage }
                :
                profile?.user_basic_info?.profileImage && !profile?.user_basic_info?.profileImage.includes('googleusercontent')
                  ? { uri: config.profileImage + profile?.user_basic_info?.profileImage }
                  : require('../../../assets/images/grey.jpg')
            }
          />

          {/* <Image source={
            profile?.user_basic_info?.profileImage ? { uri: config.profileImage + profile?.user_basic_info?.profileImage } : require('../../../assets/images/grey.jpg')
          } style={styles.avatar} /> */}
        </Pressable>


        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {
                mode === 'guest' ? profile?.video_pagination?.total_videos || 0
                  :
                  profile?.total_videos || 0
              }
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]} >Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('UserStats', { data: stats?.follow_by_list, type: 'followers' })}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{stats?.follow_by_list?.length || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.text }]} >Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('UserStats', { data: stats?.following_list, type: 'following' })}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{stats?.following_list?.length || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.text }]} >Following</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 5 }}>
        <Text style={[styles.name, { color: theme.text }]}>{profile?.user_basic_info?.name || ''}</Text>
      </View>


      {
        profile?.user_basic_info?.bio && <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 10 }}>
          <Text style={[styles.bio, { color: theme.text }]} numberOfLines={3}>{profile?.user_basic_info?.bio || ''}</Text>
        </View>
      }


      {
        mode != 'user' && <TouchableOpacity style={[styles.editProfileButton, { width: '100%', alignItems: 'center', backgroundColor: theme.primary }]} onPress={mode === "user" ? onEditProfile : followUser}>
          <Text style={[styles.editProfileText, { color: '#fff' }]}>
            {
              mode === "user" ? "Edit Profile" : (followed ? "Following" : "Follow")
            }
          </Text>
        </TouchableOpacity>
      }


      <View style={{ flexDirection: 'row', gap: 10 }}>
        {mode === "user" && !notLoggedIn && <TouchableOpacity style={styles.editBioButton} onPress={() => setBioModalVisible(true)}>
          <Ionicons name="pencil-outline" size={16} color="#3880ff" />
          <Text style={styles.editBioText}>Edit Bio</Text>
        </TouchableOpacity>}

        {mode === "user" && !notLoggedIn && <TouchableOpacity style={[styles.editBioButton, { borderColor: 'transparent', backgroundColor: theme.primary }]} onPress={() => onEditProfile()}>
          <Ionicons name="pencil-outline" size={16} color='#fff' />
          <Text style={[styles.editBioText, { color: '#fff' }]}>Edit Profile</Text>
        </TouchableOpacity>}

        {mode === "user" && !notLoggedIn && <TouchableOpacity style={[styles.editBioButton, { borderColor: 'transparent', backgroundColor: theme.primary }]} onPress={() => navigation.navigate('studio')}>
          <Ionicons name="business-outline" size={16} color='#fff' />
          <Text style={[styles.editBioText, { color: '#fff' }]}>Voov Studio</Text>
        </TouchableOpacity>}
      </View>
















      {/* <Pressable onPress={openImageViewer}>
        <Image source={
          profile.profileImage ? { uri: config.profileImage + profile.profileImage } : require('../../../assets/images/grey.jpg')
        } style={styles.profileImage} />
      </Pressable>


      <Text style={[styles.userName, { color: theme.text }]}>{profile.name}</Text>

      {!notLoggedIn && <Stats handleStats={(type) => {
        console.log('stats data = ', stats);
        if (type == 'following') {
          navigation.navigate('UserStats', { data: stats?.following_list, type: 'following' })
        } else {
          navigation.navigate('UserStats', { data: stats?.follow_by_list, type: 'followers' })
        }

      }} />}

      {notLoggedIn && <View>
        <Text style={{ color: theme.text, fontSize: 16, marginVertical: 10 }}>Login to view your profile</Text>
      </View>}

      {notLoggedIn ?
        <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.editProfileText, { color: '#fff' }]}>Login</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: theme.primary }]} onPress={mode === "user" ? onEditProfile : followUser}>
          <Text style={[styles.editProfileText, { color: '#fff' }]}>
            {
              mode === "user" ? "Edit Profile" : (followed ? "Following" : "Follow")
            }
          </Text>
        </TouchableOpacity>
      }

      <Text style={[styles.bio, { color: theme.text }]}>{profile.bio}</Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {mode === "user" && !notLoggedIn && <TouchableOpacity style={styles.editBioButton} onPress={() => setBioModalVisible(true)}>
          <Ionicons name="pencil-outline" size={16} color="#3880ff" />
          <Text style={styles.editBioText}>Edit Bio</Text>
        </TouchableOpacity>}

        {mode === "user" && !notLoggedIn && <TouchableOpacity style={[styles.editBioButton, { borderColor: 'transparent', backgroundColor: theme.primary }]} onPress={() => navigation.navigate('studio')}>
          <Ionicons name="business-outline" size={16} color='#fff' />
          <Text style={[styles.editBioText, { color: '#fff' }]}>Voov Studio</Text>
        </TouchableOpacity>}
      </View> */}




      <Modal
        animationType="slide"
        transparent={true}
        visible={bioModalVisible}
        onRequestClose={() => setBioModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Bio</Text>
            <TextInput
              style={[styles.bioInput, { backgroundColor: theme.mode == 'dark' ? '#1E1E1E' : theme.background, borderColor: theme.mode == 'dark' ? 'none' : theme.borderColor, borderWidth: theme.mode == 'dark' ? 0 : 0.4, color: theme.text }]}
              multiline
              numberOfLines={4}
              value={newBio}
              onChangeText={setNewBio}
              placeholder="Write something about yourself..."
              placeholderTextColor={theme.text}
            />
            <View style={[styles.modalButtons, { borderColor: theme.borderColor }]}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.mode == 'dark' ? '#1E1E1E' : theme.background, borderColor: theme.mode == 'dark' ? 'none' : theme.borderColor, borderWidth: 0.4, color: theme.text }]}
                onPress={() => setBioModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              {
                !loading ? (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}
                    onPress={handleSaveBio}
                  >
                    <Text style={[styles.buttonText, { color: theme.background }]}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}>
                    <ActivityIndicator size="small" color={theme.text} />
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        </View>
      </Modal>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  topSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: '30%',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#fff',
  },
  statsContainer: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
  },
  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#ccc',
    fontSize: 12,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  settingsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  settingsIcon: {
    fontSize: 14,
    color: '#fff',
  },
  bio: {
    color: "#fff",
    fontSize: 14,
  },









  // container: {
  //   alignItems: "center",
  //   paddingVertical: 20,
  // },
  // profileImage: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 100,
  //   backgroundColor: "#333",
  // },
  // userName: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "700",
  //   marginTop: 10,
  // },
  // statsContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   marginVertical: 10,
  // },
  // statItem: {
  //   alignItems: "center",
  //   marginHorizontal: 40,
  // },
  // statNumber: {
  //   color: "#fff",
  //   fontSize: 16,
  // },
  // statLabel: {
  //   color: "#eee",
  //   fontSize: 12,
  // },
  editProfileButton: {
    backgroundColor: "#47c2f0",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 10,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  editBioButton: {
    width: '33%',
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3880ff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  },
  editBioText: {
    color: "#3880ff",
    fontSize: 14,
  },
  studioBtn: {
    marginTop: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  studio: {
    color: "#3880ff",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  bioInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserInfo;

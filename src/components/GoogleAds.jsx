import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { NativeAdView, NativeAd, NativeAdChoicesPlacement, NativeMediaView, NativeAdEventType, TestIds } from 'react-native-google-mobile-ads';
import useAPIService from "../services/APIService";
import { APP_CONSTANTS } from "../config/constants";
import useGlobalFunctions from "../services/GlobalService";

// const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-4501691522666745/2350458097';
// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-4501691522666745/1099146051';
// const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const adUnitId = 'ca-app-pub-6304907491626047/5760814321';

const GoogleAds = ({video}) => {
	const [nativeAd, setNativeAd] = useState();
	const { sendRequest } = useAPIService();
	const { get } = useGlobalFunctions();

	console.log('video received in google ads = ', video);

	useEffect(() => {
		NativeAd.createForAdRequest(adUnitId, {
			adChoicesPlacement: NativeAdChoicesPlacement.TOP_LEFT
		})
			.then(setNativeAd).then(() => console.log('ad loaded'))
			.catch(console.error);
	}, [])

	const addImpression = async () => {
		console.log('adding impression');
		try {
			const userId = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
			const params = { user_id: userId, user_type: 'login', video_id: video.id, ad_video_id:  nativeAd.responseId, state_type: 'impression',creator_id: video.user_details.userId };
			const response = await sendRequest('stats', params, 'POST', true);
		} catch (error) {
			console.error('Error adding impression:', error);
		}
	}

	useEffect(() => {
		console.log('native ad = ', nativeAd)
		if (!nativeAd) return;
		const listener = nativeAd.addAdEventListener(NativeAdEventType.CLICKED, () => {
			console.log('Native ad clicked');
		});

		const listener1 = nativeAd.addAdEventListener(NativeAdEventType.IMPRESSION, () => {
			console.log('Native ad impression');
			addImpression();
		});

		return () => {
			listener.remove();
			listener1.remove();
		}

	}, [nativeAd])

	if (!nativeAd) {
		return null;
	}

	return (
		<View style={{ width: '100%', backgroundColor: '#121212', height: Dimensions.get('window').height }}>
			<NativeAdView nativeAd={nativeAd}
				onAdLoaded={(ad) => console.log('ad loaded native view')}
				onAdFailedToLoad={(error) => console.error('ad failed to load native view', error)}
				onAdImpression={() => console.log('Impression tracked')}
				onAdClicked={() => console.log('Ad clicked')}
				onAdClosed={() => console.log('Ad closed')}
			>
				<NativeMediaView resizeMode={'contain'} style={{ width: '100%', height: '100%', aspectRatio: 0.5 }} />
			</NativeAdView>

			{/* <NativeAdView
				style={{ height: 100 }}
				adUnitId={adUnitId}
				onAdImpression={() => console.log('Impression tracked')}
			>
			</NativeAdView> */}

			{/* <BannerAd
				unitId={adUnitId}
				size={BannerAdSize.FULL_BANNER}
				onAdFailedToLoad={(error) => console.error('Ad failed to load', error)}
			/> */}
		</View>
	);
};

export default GoogleAds;
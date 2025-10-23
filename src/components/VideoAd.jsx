import React from 'react';
import { View } from 'react-native';
// import {
//     Banner,
//     Interstitial,
//     PublisherBanner,
//     NativeAdsManager,
//   } from 'react-native-ad-manager'

const VideoAd = () => {
  const adUnitId = 'ca-app-pub-6304907491626047/1099146051';



    // Interstitial.setAdUnitID(adUnitId);
    // Interstitial.setTestDevices([Interstitial.simulatorId]);
    // Interstitial.requestAd().then(() => Interstitial.showAd());

		// Interstitial.addEventListener('onAdRecordImpression', () => {
		// 	console.log('Interstitial => onAdRecordImpression');
		// })

		// Interstitial.addEventListener('adLoaded', () =>
		// 	console.log('Interstitial adLoaded')
		// );
		// Interstitial.addEventListener('adFailedToLoad', (error) =>
		// 	console.warn(error)
		// );
		// Interstitial.addEventListener('adOpened', () =>
		// 	console.log('Interstitial => adOpened')
		// );
		// Interstitial.addEventListener('adClosed', () => {
		// 	console.log('Interstitial => adClosed');
		// 	Interstitial.requestAd().catch((error) => console.warn(error));
		// });

//   interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//     console.log("Ad Loaded");
//     interstitialAd.show();
//   });

//   interstitialAd.addAdEventListener(AdEventType.IMPRESSION, () => {
//     console.log("📢 Ad Impression Recorded");
//   });

//   interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {
//     console.log("👆 Ad Clicked");
//   });

//   interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
//     console.log("❌ Ad Closed");
//   });

//   interstitialAd.load();

  return <View />;
};

export default VideoAd;

import React, { createContext, useContext, useEffect, useState } from 'react';

const VideoContext = createContext(null);

export const VideoProvider = ({ children }) => {
  const [adShownVideoIds, setAdShownVideoIds] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0 | null);

  useEffect(()=>{
    console.log('active video id changed in context = ', activeVideoId);
    console.log('adShownVideoIds in context = ', adShownVideoIds);
  }, [activeVideoId, adShownVideoIds])

  const markAdAsShown = (videoId) => {
    setAdShownVideoIds((prev) => [...prev, videoId]);
  };

  return (
    <VideoContext.Provider value={{ activeVideoId, setActiveVideoId, activeIndex, setActiveIndex, markAdAsShown, adShownVideoIds }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);

import React, { createContext, useContext, useEffect, useState } from 'react';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
  const [sheetState, setSheetState] = useState('');
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    console.log('sheet reference in context = ', sheetState);
    setSheetState(sheetState)
  }, [sheetState]);

  useEffect(() => {
    console.log('video id in context = ', videoId);
    setVideoId(videoId);
  }, [videoId]);

  
  // if(sheetRef !== undefined && sheetRef !== null) {
    // if(sheetRef == 'open') {
    //   setSheetRef('open');
    // }
  // }
  
  return (
    <SheetContext.Provider value={{ sheetState, setSheetState, videoId, setVideoId }}>
      {children}
    </SheetContext.Provider>
  );
};

export const useSheetContext = () => useContext(SheetContext);

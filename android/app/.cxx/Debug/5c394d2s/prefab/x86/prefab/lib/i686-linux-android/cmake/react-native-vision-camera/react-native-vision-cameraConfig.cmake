if(NOT TARGET react-native-vision-camera::VisionCamera)
add_library(react-native-vision-camera::VisionCamera SHARED IMPORTED)
set_target_properties(react-native-vision-camera::VisionCamera PROPERTIES
    IMPORTED_LOCATION "/Users/rapplestore/Desktop/ReactNative/VoovMediaFinal/node_modules/react-native-vision-camera/android/build/intermediates/cxx/Debug/g2l1t1t2/obj/x86/libVisionCamera.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/rapplestore/Desktop/ReactNative/VoovMediaFinal/node_modules/react-native-vision-camera/android/build/headers/visioncamera"
    INTERFACE_LINK_LIBRARIES ""
)
endif()


if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/rapplestore/.gradle/caches/8.10.2/transforms/28fdd80d120c55da201da8fb20aa84b2/transformed/hermes-android-0.78.1-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/rapplestore/.gradle/caches/8.10.2/transforms/28fdd80d120c55da201da8fb20aa84b2/transformed/hermes-android-0.78.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()


import React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, Image } from "react-native";
import styles from "../styles/homeScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Camera } from "expo-camera";
import { Dimensions } from "react-native";

function HomeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const dimensions = useRef(Dimensions.get("window"));
  const screenWidth = dimensions.current.width;
  const camHeight = Math.round((screenWidth * 4) / 3);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  return (

    <View style={styles.container}> 

<Camera style={{height: camHeight,
        width: "100%",}} ratio="4:3" flashMode={flashMode} type={type} />

<View style={styles.addBar}>

<TouchableOpacity>
    <Image
      source={require("../assets/images/camera-purple.png")}
      fadeDuration={0}
      style={styles.trayIcon}
    />
  </TouchableOpacity>



</View>


      <View style={styles.footer}>
        <TouchableOpacity>
          <Image
            source={require("../assets/images/panel-white.png")}
            fadeDuration={0}
            style={styles.addIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require("../assets/images/add-white.png")}
            fadeDuration={0}
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen;

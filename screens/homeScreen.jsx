import React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, Image } from "react-native";
import styles from "../styles/homeScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Camera } from "expo-camera";
import { Dimensions } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

function HomeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const dimensions = useRef(Dimensions.get("window"));
  const screenWidth = dimensions.current.width;
  const camHeight = Math.round((screenWidth * 4) / 3);
  const [camStyle, setCamStyle] = useState(0);
  const [isText, setIsText] = useState(false);
  const [showData, setShowData] = useState(false);
  const [resultImg, setResultImg] = useState("");
  const [resultText, setResultText] = useState("")
  let camera;

  var camStyles = [
    { height: camHeight, width: "100%" },
    { height: camHeight, width: "100%", opacity: 0.7 },
  ];

  const extractText = async () => {
    if (!camera) return;
    setCamStyle(1);
    setIsText(true);

    const photo = await camera.takePictureAsync();
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 1200, height: 1600 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPG }
    );

    var data = new FormData();
    data.append("photo", {
      uri: manipResult.uri,
      name: "photo",
      type: "image/jpeg",
    });

    return fetch("https://e6721e636491.ngrok.io/api/extract_text", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (response.status === 200) {
          alert("done");
          console.log(responseJson.url)
        } else {
          alert("Server Error");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Server Error");
        setCamStyle(0);
      });
  };

  const extractObject = async () => {
    if (!camera) return;
    setCamStyle(1);
    setIsText(false);

    const photo = await camera.takePictureAsync();

    var data = new FormData();
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 600, height: 800 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPG }
    );

    var data = new FormData();
    data.append("photo", {
      uri: manipResult.uri,
      name: "photo",
      type: "image/jpeg",
    });

    return fetch("https://e6721e636491.ngrok.io/api/extract_object", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: data,
    })
    .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          alert("done");
          console.log(responseJson.url);
          setResultImg(responseJson.url);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Server Error");
        setCamStyle(0);
      });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Camera
        style={camStyles[camStyle]}
        ratio="4:3"
        flashMode={flashMode}
        type={type}
        ref={(r) => {
          camera = r;
        }}
      />

      <View style={styles.addBar}>
        <TouchableOpacity onPress={extractText}>
          <Image
            source={require("../assets/images/text-orange.png")}
            fadeDuration={0}
            style={styles.trayIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={extractObject}>
          <Image
            source={require("../assets/images/object-purple.png")}
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

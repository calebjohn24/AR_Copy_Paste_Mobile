import React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, Image, ActivityIndicator, ScrollView } from "react-native";
import styles from "../styles/homeScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Camera } from "expo-camera";
import { Dimensions } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import Clipboard from "expo-clipboard";
import { useIsFocused } from '@react-navigation/native';

function HomeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const dimensions = useRef(Dimensions.get("window"));
  const screenWidth = dimensions.current.width;
  const camHeight = Math.round((screenWidth * 4) / 3);
  const [spinner, setSpinner] = useState(false);
  const [camStyle, setCamStyle] = useState(0);
  const [isText, setIsText] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showText, setShowText] = useState(false);
  const [resultImg, setResultImg] = useState("");
  const [resultText, setResultText] = useState("");
  const isFocused = useIsFocused();

  let camera;

  var camStyles = [
    { height: camHeight, width: "100%" },
    { height: camHeight, width: "100%", opacity: 0.7 },
  ];

  const extractText = async () => {
    if (!camera) return;
    setCamStyle(1);
    setIsText(true);
    setSpinner(true);

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
        if (responseJson.success) {
          setResultText(responseJson.img_text);
          Clipboard.setString(responseJson.img_text);
          setSpinner(false);
          setCamStyle(0);
          setShowText(true);
        } else {
          alert("Server Error");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Server Error");
        setCamStyle(0);
        setSpinner(false);
      });
  };

  const resetPage = () => {
    setShowData(false);
    setShowText(false);
    setResultImg("");
    setResultText("");
  };

  const extractObject = async () => {
    if (!camera) return;
    setCamStyle(1);
    setSpinner(true);
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
      .then((response) => {
        if (!response.ok) {
          console.log(response.status);
          alert("Server Error");
        }
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.success) {
          setResultImg(responseJson.url);
          setSpinner(false);
          setCamStyle(0);
          setShowData(true);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Server Error");
        setCamStyle(0);
        setSpinner(false);
      });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
      let camera;
    })();
  }, []);

  return (
    <View style={styles.container}>
       { isFocused && 
      <Camera
        style={camStyles[camStyle]}
        ratio="4:3"
        flashMode={flashMode}
        type={Camera.Constants.Type.back}
        ref={(r) => {
          camera = r;
        }}
      />
    }
      {spinner ? (
        <View
          style={{
            height: camHeight,
            width: "100%",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={100} color="#F9FAFB" />
        </View>
      ) : (
        <View></View>
      )}
      {showData ? (
        <Image
          source={{ uri: resultImg }}
          style={{
            height: camHeight,
            width: "100%",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
          }}
        />
      ) : (
        <View></View>
      )}

      {showText ? (
        <ScrollView
          style={{
            height: camHeight,
            width: "100%",
            position: "absolute",
            opacity: 0.7,
            backgroundColor: "#F9FAFB",
            left: 0,
            right: 0,
            top: 0,
            textAlign: "center",
            overflow: "scroll",
          }}
        >
          <Text
            style={{ fontSize: 26, paddingHorizontal: 16, paddingVertical: 20 }}
          >
            {resultText}
          </Text>
        </ScrollView>
      ) : (
        <View></View>
      )}

      {!showData & !showText ? (
        <>
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
        </>
      ) : (
        <>
          {showText ? (
            <Text
              style={{
                fontSize: 20,
              }}
            >
              Text Copied To Clipboard
              <Image
                style={{
                  width: 25,
                  height: 25,
                }}
                // Please. use the correct source =))
                source={require("../assets/images/check-green.png")}
              />
            </Text>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                Object Clipped
                <Image
                  style={{
                    width: 25,
                    height: 25,
                  }}
                  // Please. use the correct source =))
                  source={require("../assets/images/check-green.png")}
                />
              </Text>
            </>
          )}

          <View style={styles.addBar}>
            <TouchableOpacity onPress={resetPage}>
              <Image
                source={require("../assets/images/next-purple.png")}
                fadeDuration={0}
                style={styles.trayIcon}
              />
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("ViewObjects")}>
          <Image
            source={require("../assets/images/panel-white.png")}
            fadeDuration={0}
            style={styles.addIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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

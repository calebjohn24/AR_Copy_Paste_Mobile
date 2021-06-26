import React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, Image, ActivityIndicator, FlatList } from "react-native";
import styles from "../styles/viewObjects";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ViewObjects({ navigation }) {
  const [imageList, setImageList] = useState([]);
  const [textList, setTextList] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [showImgs, setShowImgs] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (shouldFetch) {
        fetch("https://e6721e636491.ngrok.io/api/view_data", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              console.log(response.status);
            }
            return response.json();
          })
          .then((responseJson) => {
            if (responseJson.success) {
              setImageList(responseJson.images);
              setTextList(responseJson.text);
              setSpinner(false);
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {});
      }
    }
    fetchData();
  }, [shouldFetch]);

  const _renderItem = (item, index) => {
    return (
      <View key={item['index']}>
          <Image
            source={{
              // uri:
              //   "https://source.unsplash.com/random/500x" +
              //   Math.floor(Math.random() * 800 + 500)

              uri: item['item']
            }}
            style={{resizeMode: "contain", height:200 }}
          />
      </View>
    )
  }

  const _renderItemText = (item, index) => {
      console.log(item);
    return (
      <View key={item['index']} style={{borderColor:'#F59E0B',borderBottomWidth:1,borderTopWidth:1, paddingHorizontal:20, paddingVertical:8}}>
          <Text>{item['item']["data"]}</Text>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      {spinner ? (
        <View
          style={{
            height: 500,
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
          <ActivityIndicator size={100} color="#F59E0B" />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowImgs(false)}>
              <Image
                source={require("../assets/images/text-orange.png")}
                fadeDuration={0}
                style={styles.trayIcon}
              />
            </TouchableOpacity >

            <TouchableOpacity onPress={() => setShowImgs(true)}>
              <Image
                source={require("../assets/images/object-purple.png")}
                fadeDuration={0}
                style={styles.trayIcon}
              />
            </TouchableOpacity>
          </View>

          {showImgs?

          <FlatList
          data={imageList}
          keyExtractor={(item, index) => "" + index}
          style={{position: "absolute",
          left: 0,
          right: 0,
          bottom: 108,
          width: "100%",
          height: "70%",}}
          renderItem={_renderItem}
        />:

        <FlatList
        data={textList}
        keyExtractor={(item, index) => "" + index}
        style={{position: "absolute",
        left: 0,
        right: 0,
        bottom: 108,
        width: "100%",
        height: "70%",}}
        renderItem={_renderItemText}
      />}




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

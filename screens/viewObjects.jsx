import React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, Image, ActivityIndicator, ScrollView } from "react-native";
import styles from "../styles/viewObjects";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ViewObjects({ navigation }) {

    const [imageList, setImageList] = useState([]);
    const [textList, setTextList] = useState([]);
    const [spinner, setSpinner] = useState(true);
    const [shouldFetch, setShouldFetch] = useState(true);


    useEffect(() => {
        async function fetchData() {
        if(shouldFetch){
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
    }, [shouldFetch])
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

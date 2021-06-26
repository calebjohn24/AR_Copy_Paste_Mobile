import React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, Image, ActivityIndicator, ScrollView } from "react-native";
import styles from "../styles/viewObjects";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ViewObjects({ navigation }) {
  return (
    <View style={styles.container}>
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

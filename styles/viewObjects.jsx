import { StyleSheet } from "react-native";
import React from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },


  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#4F46E5",
    height: 100,
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "flex-end",
  },

  addBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 156,
    flexDirection: "row",
    width: "100%",
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },

  trayIcon: { resizeMode: "contain", height: "90%" },
  addIcon: {
    resizeMode: "contain",
    height: "75%",
  },
});

export default styles;

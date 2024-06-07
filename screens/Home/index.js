import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

function HomeScreen() {
  const [environmentInformation, setEnvironmentInformation] = useState({
    id: 19,
    tempereture: 25,
    humidity: 60,
    light: 300,
    su_nemi: 400,
    motor_run: 0,
    createdAt: "2024-06-06T11:16:49.651Z",
    updatedAt: "2024-06-06T11:16:49.651Z",
  });
  const [nextWateringTime, setNextWateringTime] = useState(null);

  const calculateNextWateringTime = () => {
    const M0 = environmentInformation.su_nemi;
    const T = environmentInformation.tempereture;
    const moistureThreshold = 300;
    const k0 = 0.1;
    if (isNaN(M0) || isNaN(T)) {
      alert("Wrong moisture and temperature values");
      return;
    }

    const k = k0 * T;
    const timeToWater = Math.log(moistureThreshold / M0) / -k;

    return (timeToWater * 24 * 60).toFixed(0);
  };

  const getenvironmentData = () => {
    axios
      .get("http://localhost:3000/api/sensordata/closest")
      .then((response) => {
        console.log("Data fetched from localhost: ", response.data);
        setEnvironmentInformation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sensor data: ");
      });
  };

  useEffect(() => {
    getenvironmentData();
    convertMinutesToReadableFormat(calculateNextWateringTime());

    console.log(nextWateringTime);
  }, []);

  const convertMinutesToReadableFormat = (totalMinutes) => {
    const days = Math.floor(totalMinutes / 1440); // 1 day = 1440 minutes
    const hours = Math.floor((totalMinutes % 1440) / 60); // remaining minutes divided by 60 to get hours
    const minutes = totalMinutes % 60; // remaining minutes

    console.log(days, hours, minutes);
    setNextWateringTime({ days, hours, minutes });

    return;
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.topContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.potInfo}>
            <Text style={styles.infoText}>
              {environmentInformation.su_nemi <= 300 ? "Dry" : "Humid"}
            </Text>
            <Text style={styles.infoTitle}>Soil state</Text>
          </View>
          <View style={styles.potInfo}>
            <Text
              style={styles.infoText}
            >{`${environmentInformation.humidity} %`}</Text>
            <Text style={styles.infoTitle}>Air humidity</Text>
          </View>
          <View style={styles.potInfo}>
            <Text style={styles.timeInfoText}>
              { nextWateringTime ? nextWateringTime.days : "0"} days
            </Text>
            <Text style={styles.timeInfoText}>
              {nextWateringTime ? nextWateringTime.hours : "0"} hours
            </Text>
            <Text style={styles.timeInfoText}>
              {nextWateringTime ? nextWateringTime.minutes : "0"} minutes
            </Text>
            <Text style={styles.infoTitle}>Next watering</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Image
          style={styles.plantImage}
          source={require("../../assets/images/plant.png")}
          resizeMode="cover"
        />
        <View style={styles.bottomContainerInfoWrapper}>
          <View>
            <Text style={[styles.infoText, { color: "black" }]}>10 %</Text>
            <Text style={[styles.infoTitle, { color: "#b5b5b5" }]}>
              Water Tank
            </Text>
          </View>
          <View>
            <Text style={[styles.infoText, { color: "black" }]}>
              {environmentInformation.light <= 200 ? "Dark" : "Bright"}
            </Text>
            <Text style={[styles.infoTitle, { color: "#b5b5b5" }]}>
              Outside
            </Text>
          </View>
          <View>
            <Text
              style={[styles.infoText, { color: "black" }]}
            >{`${environmentInformation.tempereture} C`}</Text>
            <Text style={[styles.infoTitle, { color: "#b5b5b5" }]}>
              Temperature
            </Text>
          </View>
        </View>
        <Text style={styles.warningText}> Fill the water Tank</Text>
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#299640",
  },
  topContainer: { flex: 3, paddingTop: 50 },
  bottomContainer: {
    flex: 2,
    backgroundColor: "white",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    gap: 30,
    marginLeft: 40,
    justifyContent: "flex-end",
    marginVertical: "auto",
    alignItems: "flex-end",
  },
  potInfo: { width: "50%" },
  infoText: { color: "white", fontSize: 30, fontWeight: "bold" },
  timeInfoText: { color: "white", fontSize: 24, fontWeight: "bold" },
  infoTitle: { color: "white", fontSize: 16, color: "#d1d1d1" },
  plantImage: {
    position: "absolute",
    width: 150,
    height: 500,
    top: -400,
    left: 30,
  },
  bottomContainerInfoWrapper: { marginTop: 70, flexDirection: "row", gap: 40 },
  warningText: {
    fontSize: 20,
    color: "orange",
    position: "absolute",
    right: 30,
    top: 45,
    borderLeftColor: "orange",
    borderLeftWidth: 2,
    paddingLeft: 5,
  },
});

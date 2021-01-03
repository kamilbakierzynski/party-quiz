import mqtt from "mqtt";
const mqttClient = mqtt.connect(process.env.MQTT_BROKER);

mqttClient.on("connect", () => {
  console.log("MQTT connected");
  import("../routes/current-game").then(() =>
    console.log("Listening for messages")
  );
});

export default mqttClient;

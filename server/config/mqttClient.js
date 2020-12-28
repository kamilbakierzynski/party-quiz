import mqtt from "mqtt";
const mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on("connect", () => {
  console.log("MQTT connected");
  import("../routes/current-game").then(() =>
    console.log("Listening for messages")
  );
});

export default mqttClient;

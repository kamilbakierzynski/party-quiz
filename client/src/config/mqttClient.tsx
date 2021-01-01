import mqtt from "mqtt";

const client = mqtt.connect(process.env.REACT_APP_MQTT_ADDRESS);

export default client;

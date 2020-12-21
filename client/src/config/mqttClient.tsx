import mqtt from "mqtt";

const client = mqtt.connect("ws://localhost:8000/mqtt");

export default client;

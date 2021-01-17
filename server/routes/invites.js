import express from "express";
import mqttClient from "../config/mqttClient";

const router = express.Router({ mergeParams: true });

router.post("/send-invite", async (req, res) => {
  const { receiver } = req.body;
  mqttClient.publish(`invites/${receiver.id}`, JSON.stringify(req.body));
  return res.send({});
});

export default router;

import { logger } from "./core/logger.js";

logger.info("RR Robot starter", {
  version: "0.1.0",
  modules: ["football"]
});

logger.info("Neste milepæl: koble Fotballroboten til en ekte datakilde og registrere kampstatus som RR-hendelser.");

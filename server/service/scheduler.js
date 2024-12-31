const cron = require("node-cron");
const { handlePriceTracker } = require("./tracker"); // Adjust the path

cron.schedule("*/1 * * * *", async () => {
  console.log("Running price tracker...");
  try {
    await handlePriceTracker();
  } catch (error) {
    console.error("Error running price tracker:", error);
  }
});

console.log("Scheduler is set up and running.");
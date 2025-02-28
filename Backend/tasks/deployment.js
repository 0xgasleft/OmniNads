const { deploy } = require("../scripts/utils.js");

task("deploy-omninad", "Deploy OmniNads")
  .addParam("mint", "Mint chain")
  .addVariadicPositionalParam("consumers", "Consumer chains")
  .setAction(async (taskArgs, hre) => {
    try {
      await deploy(hre, taskArgs.mint, "OmniNadsMinter", "OmniNads", "ONAD", true);
    } catch (e) {
      console.error("❌ Error deploying OmniNadsMinter:", e);
    }

    /*for (const consumer of taskArgs.consumers) { // 🔹 Fixed typo: taskArgs.consumer → taskArgs.consumers
      try {
        await deploy(hre, consumer, "OmniNadsConsumer", "OmniNads", "ONAD");
      } catch (e) {
        console.error("❌ Error deploying OmniNadsConsumer:", e);
      }
    }*/
  });

  // npx hardhat deploy-omninad --mint monadtestnet opsepolia sepolia flowtestnet

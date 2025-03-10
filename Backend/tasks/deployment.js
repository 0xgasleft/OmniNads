const { deploy, deployMessager } = require("../scripts/utils.js");

task("deploy-omninad", "Deploy OmniNads")
  .addParam("mint", "Mint chain")
  .addVariadicPositionalParam("consumers", "Consumer chains")
  .setAction(async (taskArgs, hre) => {
    try {
      await deploy(hre, taskArgs.mint, "contracts/merged/MergedOmniNadsMinter.sol:OmniNadsMinter", "OmniNads", "ONAD", true);
    } catch (e) {
      console.error("❌ Error deploying OmniNadsMinter:", e);
    }
    
    for (const consumer of taskArgs.consumers) { // 🔹 Fixed typo: taskArgs.consumer → taskArgs.consumers
      try {
        await deploy(hre, consumer, "contracts/merged/MergedOmniNadsConsumer.sol:OmniNadsConsumer", "OmniNads", "ONAD");
      } catch (e) {
        console.error("❌ Error deploying OmniNadsConsumer:", e);
      }
    }
  });

  task("deploy-messager", "Deploy Messager")
  .addParam("mint", "Mint chain")
  .addVariadicPositionalParam("consumers", "Consumer chains")
  .setAction(async (taskArgs, hre) => {
    try {
      await deployMessager(hre, taskArgs.mint, "contracts/merged/MergedOmniNadsMessager.sol:OmniNadsMessager", true);
    } catch (e) {
      console.error("❌ Error deploying OmniNadsMessager:", e);
    }

    for (const consumer of taskArgs.consumers) { 
      try {
        await deployMessager(hre, consumer, "contracts/merged/MergedOmniNadsMessager.sol:OmniNadsMessager");
      } catch (e) {
        console.error("❌ Error deploying OmniNadsMessager:", e);
      }
    }
  });

  
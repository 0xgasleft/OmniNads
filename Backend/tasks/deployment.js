const {deploy} = require("../scripts/utils.js");


task("deploy-omninad", "Deploy OmniNads")
  .addParam("mint", "Mint chain")
  .addVariadicPositionalParam("consumers", "Consumer chains")
  .setAction(async (taskArgs, hre) => {
    
    try
    {
      await deploy(taskArgs.mint, "OmniNadsMinter", "OmniNads", "ONAD", true);
    }
    catch(e)
    {
      console.log("Error deploying OmniNadsMinter");
      console.error(e);
    }

    for(const consumer of taskArgs.consumer)
    {
      try
      {
        await deploy(consumer, "OmniNadsConsumer", "OmniNads", "ONAD");
      }
      catch(e)
      {
        console.log("Error deploying OmniNadsConsumer");
        console.error(e);
      }
    }
    
    
  });
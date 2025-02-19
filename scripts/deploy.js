const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // Deploy BooToken
    // const BooToken = await ethers.getContractFactory("BooToken");
    // const booToken = await BooToken.deploy();
    // await booToken.deployed(); // Wait for deployment to complete
    // console.log(`BooToken deployed to: ${booToken.address}`);

    // // Deploy LifeToken
    // const LifeToken = await ethers.getContractFactory("LifeToken");
    // const lifeToken = await LifeToken.deploy();
    // await lifeToken.deployed(); // Wait for deployment to complete
    // console.log(`LifeToken deployed to: ${lifeToken.address}`);

    // Deploy SwapMultiHop
    // const SwapMultiHop = await ethers.getContractFactory("SwapMultiHop");
    // const swapMultiHop = await SwapMultiHop.deploy();
    // await swapMultiHop.deployed(); // Wait for deployment to complete
    // console.log(`SwapMultiHop deployed to: ${swapMultiHop.address}`);

    // // Deploy SingleSwapToken
    // const SingleSwapToken = await ethers.getContractFactory("SingleSwapToken");
    // const singleSwapToken = await SingleSwapToken.deploy();
    // await singleSwapToken.deployed(); // Wait for deployment to complete
    // console.log(`SingleSwapToken deployed to: ${singleSwapToken.address}`);


    // USER DATA CONTRACT
    const UserStorageData = await ethers.getContractFactory("UserStorageData");
    const userStorageData = await UserStorageData.deploy();
    await userStorageData.deployed(); // Wait for deployment to complete
    console.log(`UserStorageData deployed to: ${userStorageData.address}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
//^2.17.2
//ethers": "^5.7.2"
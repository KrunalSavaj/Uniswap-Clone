// Token Addresses

// Token Addresses

const wethAddress =  '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1'
const factoryAddress =  '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
const swapRouterAddress =  '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f'
const nftDescriptorAddress =  '0x4A679253410272dd5232B3Ff7cF5dbB88f295319'
const positionDescriptorAddress= '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F'
const positionManagerAddress =  '0x09635F643e140090A9A8Dcd712eD6285858ceBef'


const  shoaibAddress = '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'
const  rayyanAddress = '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE'
const  popUpAddress = '0x68B1D87F95878fE05B998F19b66F4baba5De1aed'

const SHO_RAY =  '0xBcBB99c83961947f934e0305B34EeD70f07A66E4'

const artifacts = {
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    Rayyan: require("../artifacts/contracts/Rayyan.sol/Rayyan.json"),
    Shoaib: require("../artifacts/contracts/Shoaib.sol/Shoaib.json"),
    UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");

async function getPoolDate(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
        poolContract.tickSpacing(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);

    return {
        tickSpacing: tickSpacing,
        fee: fee,
        liquidity: liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    };
}

async function main() {
    const [owner, signer2] = await ethers.getSigners();

    const provider = waffle.provider;

    const ShoaibContract = new Contract(
        shoaibAddress,
        artifacts.Shoaib.abi,
        provider
    );
    const RayyanContract = new Contract(
        rayyanAddress,
        artifacts.Rayyan.abi,
        provider
    );
    //console.log(ShoaibContract)

     await ShoaibContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    );

    await RayyanContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    );

    const poolContract = new Contract(
        SHO_RAY,
        artifacts.UniswapV3Pool.abi,
        provider
    );

    const poolData = await getPoolDate(poolContract);

    const ShoaibToken = new Token(
        31337,
        shoaibAddress,
        18,
        "Shoaib",
        "Tenther"
    );
    const RayyanToken = new Token(
        31337,
        rayyanAddress,
        18,
        "Rayyan",
        "Rayyanoin"
    );

    const pool = new Pool(
        ShoaibToken,
        RayyanToken,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
    );
    // console.log(pool)

    const position = new Position({
        pool: pool,
        liquidity: ethers.utils.parseEther("1"),
        tickLower:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) -
            poolData.tickSpacing * 2,
        tickUpper:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) +
            poolData.tickSpacing * 2,
    });

    const { amount0: amount0Desired, amount1: amount1Desired } =
        position.mintAmounts;

    const params = {
        token0: shoaibAddress,
        token1: rayyanAddress,
        fee: poolData.fee,
        tickLower:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) -
            poolData.tickSpacing * 2,
        tickUpper:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) +
            poolData.tickSpacing * 2,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: 0,
        amount1Min: 0,
        recipient: signer2.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    };

    const nonfungiblePositionManager = new Contract(
        positionManagerAddress,
        artifacts.NonfungiblePositionManager.abi,
        provider
    );

     //console.log(nonfungiblePositionManager);

     const tx = await nonfungiblePositionManager.connect(signer2).mint(
        params, { gasLimit: "1000000" });
     const receipt = await tx.wait();
   console.log(receipt);
 }

/*
npx hardhat run --network localhost scripts/addLiquidity.js
*/

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })

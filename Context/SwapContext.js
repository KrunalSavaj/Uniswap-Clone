import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";

//  INTERNAL IMPORT
import {
    checkIfWalletConnected,
    connectWallet,
    connectingWithBooToken,
    connectingWithLifeToken,
    connectingWithSingleSwapToken,
    connectingWithIWETHToken,
    connectingWithDAIToken,
    connectingWithUserStorageContract,
} from "../Utils/appFeatures";

import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";
import { addLiquidityExternal } from "../Utils/addLiquidity";
import { getLiqudityData } from "../Utils/checkLiquidity";
import { connectingWithPoolContract } from "../Utils/deployPool";

import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
    ///  USESTATE
    const [account, setAccount] = useState("");
    const [ether, setEther] = useState("");
    const [networkConnect, setNetworkConnect] = useState("");
    const [weth9, setWeth9] = useState("");
    const [dai, setDai] = useState("");

    const [tokenData, setTokenData] = useState([]);
    const [getAllLiquidity, setGetAllLiquidity] = useState([]);

    const addToken = [
        "0x0165878A594ca255338adfa4d48449f69242Eb8F",
        "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    ];

    // FETCH DATA
    const fetchingData = async () => {
        try {
            //GET USER ACCOUNT
            const userAccount = await checkIfWalletConnected();
            setAccount(userAccount);
            //CREATE PROVIDER
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            // CHECK Balance
            const balance = await provider.getBalance(userAccount);
            const convertBal = BigNumber.from(balance).toString();
            const ethValue = ethers.utils.formatEther(convertBal);
            setEther(ethValue);
            // GET NETWORK
            const network = await provider.getNetwork();
            //console.log(network);
            setNetworkConnect(network.name);
            //All TOKEN BALANCE AND DATA
            addToken.map(async (el, i) => {
                //GETTING CONTRACT
                const contract = new ethers.Contract(el, ERC20, provider);
                //GETTING BALANCE OF TOKEN
                const userBalance = await contract.balanceOf(userAccount);
                const tokenLeft = BigNumber.from(userBalance).toString();
                const convertTokenBal = ethers.utils.formatEther(tokenLeft);
                // GET NAME AND SYMBOL
                const symbol = await contract.symbol();
                const name = await contract.name();
               // console.log(name)
                tokenData.push({
                    name: name,
                    symbol: symbol,
                    tokenBalance: convertTokenBal,
                    tokenAddress: el,
                });
            });



            const r ="0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
            const d ="0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
            const k ="0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";


            // GET LIQUIDITY
            const userStorageData = await connectingWithUserStorageContract();


             const userLiquidity = await userStorageData.getAllTransactions();
             console.log(userLiquidity);
            userLiquidity.map(async (el, i) => {
                const liquidityData = await getLiqudityData(
                    el.poolAddress,
                    el.tokenAddress0,
                    el.tokenAddress1
                );
                getAllLiquidity.push(liquidityData);
                console.log(liquidityData);
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchingData();
    }, []);

    // CREATE AND ADD LIQUIDITY
    const createLiquidityAndPool = async ({
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        slippage,
        deadline,
        tokenAmountOne,
        tokenAmountTwo,
    }) => {
        try {

            console.log( tokenAddress0,
                tokenAddress1,
                fee,
                tokenPrice1,
                tokenPrice2,
                slippage,
                deadline,
                tokenAmountOne,
                tokenAmountTwo,)


            //CREATE POOL

            const createPool = await connectingWithPoolContract(
                tokenAddress0,
                tokenAddress1,
                fee,
                tokenPrice1,
                tokenPrice2,
                {
                    gasLimit: 500000,
                }
            );

            const poolAddress = createPool;

            // CREATE LIQUIDITY
            const info = await addLiquidityExternal(
                tokenAddress0,
                tokenAddress1,
                poolAddress,
                fee,
                tokenAmountOne,
                tokenAmountTwo
            );

            console.log(info);

            /// ADD DATA
            const userStorageData = await connectingWithUserStorageContract();

            const userLiquidity = await userStorageData.addToBlockchain(
                poolAddress,
                tokenAddress0,
                tokenAddress1
            );

            console.log(userLiquidity)
        } catch (error) {
            console.error(error);
        }
    };

    // Single Swap Token
    const singleSwapToken = async ({ token1, token2, swapAmount }) => {
        console.log(
            token1.tokenAddress.tokenAddress,
            token2.tokenAddress.tokenAddress,
            swapAmount
        );

        try {
            let singleSwapToken;
            let weth;
            let dai;

            singleSwapToken = await connectingWithSingleSwapToken();
            weth = await connectingWithIWETHToken();
            dai = await connectingWithDAIToken();

            const decimals0 = 18;
            const inputAmount = swapAmount;
            const amountIn = ethers.utils.parseUnits(
                inputAmount.toString(),
                decimals0
            );

            console.log(amountIn);

            await weth.deposit({ value: amountIn });
            await weth.approve(singleSwapToken.address, amountIn);

            // SWAP
            const transaction = await singleSwapToken.swapExactInputSingle(
                token1.tokenAddress.tokenAddress,
                token2.tokenAddress.tokenAddress,
                swapAmount,
                {
                    gasLimit: 300000,
                }
            );

            await transaction.wait();
            console.log(transaction);

            const balance = await dai.balanceOf(account);
            const transferAmount = BigNumber.from(balance).toString();
            const ethValue = ethers.utils.formatEther(transferAmount);
            setDai(ethValue);
            console.log(" DAI balance :  ", ethValue);
        } catch (error) {
            console.log(error);
        }
    };

    ///
    return (
        <SwapTokenContext.Provider
            value={{
                singleSwapToken,
                tokenData,
                connectWallet,
                account,
                weth9,
                dai,
                networkConnect,
                ether,
                getPrice,
                getAllLiquidity,
                swapUpdatePrice,
                createLiquidityAndPool,
            }}
        >
            {children}
        </SwapTokenContext.Provider>
    );
};

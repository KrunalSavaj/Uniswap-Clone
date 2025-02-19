import React, { useContext , useState } from "react";
import Image from "next/image";

// INTERNAL IMPORT
import images from "../assets";
import Style from "../styles/Pools.module.css";

import { PoolAdd, PoolConnect } from "../Components/index";
import { SwapTokenContext } from "../Context/SwapContext";

const Pool = () => {
    const { account, createLiquidityAndPool, tokenData, getAllLiquidity , connectWallet } =
        useContext(SwapTokenContext);

    const [closePool, setClosePool] = useState(false);

    return (
        <div className={Style.Pool}>
            {closePool ? (
                <PoolAdd
                    account={account}
                    setClosePool={setClosePool}
                    tokenData={tokenData}
                    createLiquidityAndPool={createLiquidityAndPool}
                />
            ) : (
                <PoolConnect
                    setClosePool={setClosePool}
                    getAllLiquidity={getAllLiquidity}
                    account={account}
                    connectWallet={connectWallet}
                />
            )}
        </div>
    );
};

export default Pool;

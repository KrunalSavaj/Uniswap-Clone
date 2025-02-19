import React from "react";
import Image from "next/image";

import Style from "./TokenList.module.css";
import images from "../../assets";

const TokenList = ({ tokenData, setOpenTokenBox }) => {
    const tokenList = [];
    const seenMap = new Map();
    for (const item of tokenData) {
        const key = `${item.name}-${item.symbol}`;
        if (!seenMap.has(key)) {
            tokenList.push(item);
            seenMap.set(key, true);
        }
    }

    return (
        <div className={Style.TokenList}>
            <p
                className={Style.TokenList_close}
                onClick={() => setOpenTokenBox(false)}
            >
                <Image src={images.close} alt="close" width={50} height={50} />
            </p>
            <div className={Style.TokenList_title}>
                <h2>Your Token List</h2>
            </div>

            {tokenList.map((el, i) => (
                <div className={Style.TokenList_box} key={i}>
                    <div className={Style.TokenList_box_info}>
                        <p className={Style.TokenList_box_info_symbol}>
                            {el.symbol}
                        </p>
                        <p>
                            <span>{el.tokenBalance}</span> {el.name}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TokenList;

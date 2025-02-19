import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";

// INTERNAL IMPORT
import Style from "./SearchToken.module.css";
import images from "../../assets";

const SearchToken = ({ openToken, tokens, tokenData }) => {
    //USESTATE
    const [active, setActive] = useState(1);

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
        <div className={Style.SearchToken}>
            <div className={Style.SearchToken_box}>
                <div className={Style.SearchToken_box_heading}>
                    <h4>Select a token</h4>
                    <Image
                        src={images.close}
                        alt="close"
                        width={50}
                        height={50}
                        onClick={() => openToken(false)}
                    />
                </div>

                <div className={Style.SearchToken_box_search}>
                    <div className={Style.SearchToken_box_heading_img}>
                        <Image
                            src={images.search}
                            alt="img"
                            width={20}
                            height={20}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name and past the address"
                    />
                </div>

                <div className={Style.SearchToken_box_tokens}>
                    {tokenList.map((el, i) => (
                        <span
                            key={i + 1}
                            className={active == i + 1 ? `${Style.active}` : ""}
                            onClick={() => (
                                setActive(i + 1),
                                tokens({
                                    name: el.name,
                                    image: el.img,
                                    symbol: el.symbol,
                                    tokenBalance: el.tokenBalance,
                                    tokenAddress: el,
                                })
                            )}
                        >
                            <Image
                                src={el.img || images.ether}
                                alt="image"
                                width={30}
                                height={30}
                            />
                            {el.symbol}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchToken;

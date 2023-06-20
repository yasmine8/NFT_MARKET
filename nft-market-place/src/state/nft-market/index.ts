import { TransactionResponse } from "@ethersproject/abstract-provider";
import { CreationValues } from 'modules/CreationPage/CreationForm'
import { CONTRACT_ABI } from "constant";
import useSigner from 'state/signer';
import {BigNumber, Contract, Transaction, ethers} from 'ethers';
import useOwnedNFTs from "./useOwnedNFTs";
import useOwnedListedNFTs from "./useOwnedListedNFTs";
import useListedNFTs from "./useListedNFTs";
import { NFT } from "./interfaces";
const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string;

const useNFTMarket = () => {
  const {signer} = useSigner();
    const nftMarket = new Contract(NFT_MARKET_ADDRESS,CONTRACT_ABI,signer);

    const ownedNFTs = useOwnedNFTs();
    const ownedListedNFTs = useOwnedListedNFTs();
    const listedNFTs = useListedNFTs();
    const createNFT = async (values: CreationValues) =>{
        try{const data = new FormData();
        data.append("name", values.name);
        data.append("description", values.description);
        data.append("image", values.image!);
        const response = await fetch("/api/nft-storage", {
            method: "POST",
            body: data,
          });
        if (response.status ==201) {
            const json = await response.json();
            console.log("tokenURI: ", json.uri);
            const transaction : TransactionResponse = await nftMarket.createNFT(json.uri);
            await transaction.wait();
        }} catch(e){
            console.log(e);
        }
    }

  const listNFT = async (tokenID: string, price: BigNumber) => {
    const transaction: TransactionResponse = await nftMarket.listNFT(
      tokenID,
      price
    );
    await transaction.wait();
  };
  const cancelListing = async (tokenID: string) => {
    const transaction: TransactionResponse = await nftMarket.cancelListing(
      tokenID
    );
    await transaction.wait();
  };

   const buyNFT = async (nft: NFT) => {
     const transaction: TransactionResponse = await nftMarket.buyNFT(nft.id, {
       value: ethers.utils.parseEther(nft.price),
     });
     await transaction.wait();
   };
  return {
   createNFT,listNFT, cancelListing,buyNFT, ...ownedNFTs, ...ownedListedNFTs,...listedNFTs
  }
}

export default useNFTMarket
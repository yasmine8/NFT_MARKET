import { gql, useQuery } from "@apollo/client";
import useSigner from "state/signer";
import { NFT } from "./interfaces";
//import { parseRawNFT } from "./helpers";
import {
  GetOwnedNFTs,
  GetOwnedNFTsVariables,
  GetOwnedNFTs_nfts,
} from "./__generated__/GetOwnedNFTs";
import { ethers } from "ethers";

const useOwnedNFTs = () => {
  const { address } = useSigner();

  const { data } = useQuery<GetOwnedNFTs, GetOwnedNFTsVariables>(
    GET_OWNED_NFTS,
    { variables: { owner: address ?? "" }, skip: !address }
  );
  const ownedNFTs = data?.nfts.map(parseRawnNFT);

  return { ownedNFTs };
};

const parseRawnNFT = (raw : GetOwnedNFTs_nfts) : NFT =>{
    return{
        id: raw.id,
        owner: raw.price =="0" ? raw.to : raw.from,
        price : raw.price =="0" ? "0" : ethers.utils.formatEther(raw.price),
        tokenURI : raw.tokenURI,
    }
}

const GET_OWNED_NFTS = gql`
  query GetOwnedNFTs($owner: String!) {
    nfts(where: { to: $owner }) {
      id
      from
      to
      tokenURI
      price
    }
  }
`;

export default useOwnedNFTs;

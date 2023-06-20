import classNames from "classnames";
import CreationForm, { CreationValues } from "./CreationForm";
import useSigner from "state/signer";
import useNFTMarket from "state/nft-market";

const CreationPage = () => {
  const {signer} = useSigner();
  const {createNFT} =useNFTMarket();
  
  const onSubmit = async (values: CreationValues) => {
    // TODO: create NFT
  };

  return (
    <div
      className={classNames("flex h-full w-full flex-col", {
        "items-center justify-center": !signer,
      })}
    >
      {signer ? <CreationForm onSubmit={createNFT} /> : "Connect your wallet"}
    </div>
  );
};

export default CreationPage;

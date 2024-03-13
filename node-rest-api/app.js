const express = require("express");
const Moralis = require("moralis").default;
require("dotenv").config();
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
app.use(express.json());

const PORT = 3000;

const MY_MORALIS_API_KEY = process.env.MORALIS_API_KEY;
console.log("Moralis API Key Fetched");

const ARBITRUM = 0xa4b1;
const ETH = EvmChain.ETHEREUM;

async function getAllBalance(walletAddress) {
  // Fetch Wallet Native Balance
  const walletNativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    chain: ARBITRUM,
    address: walletAddress,
  });
  console.log("Native Balance Fetched in JSON", walletNativeBalance.raw);

  const native = walletNativeBalance.result.balance.ether;
  console.log("Native Balance Fetched Formatted", native);

  // Fetch Available Token Balance
  const tokenBalance = await Moralis.EvmApi.token.getWalletTokenBalances({
    chain: ARBITRUM,
    address: walletAddress,
  });
  console.log("Token Balance Fetched in JSON", tokenBalance.raw);

  const tokens = tokenBalance.result.map((token) => token.display());
  console.log("Tokens", tokens);

  return { native, tokens };
}

async function getNFTs(walletAddress) {
  // Fetch Wallet NFTs
  const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
    chain: ARBITRUM,
    format: "decimal",
    mediaItems: false,
    address: walletAddress,
  });

  // List NFTs
  const nfts = nftsBalances.result.map((nft) => ({
    name: nft.result.name,
    amount: nft.result.amount,
    metadata: nft.result.metadata,
  }));
  console.log(nfts.length,"NFTs Fetched");

  return nfts;
}

app.get("/balance/:walletAddress", async (request, response) => {
  try {
    // Fetch Wallet Address
    const userWalletAddress = request.params.walletAddress;
    console.log("Wallet Address:", userWalletAddress);

    data = await getAllBalance(userWalletAddress);

    response.send(data);
  } catch (e) {
    console.log("Balance Fetch Failed");
    response.send(e);
  }
});

app.get("/nft/:walletAddress", async (request, response) => {
  try {
    // Fetch Wallet Address
    const userWalletAddress = request.params.walletAddress;
    console.log("Wallet Address:", userWalletAddress);

    data = await getNFTs(userWalletAddress);

    response.send(data);
  } catch (e) {
    console.log("Balance Fetch Failed");
    response.send(e);
  }
});

const startServer = async () => {
  // Start Moralis
  await Moralis.start({
    apiKey: MY_MORALIS_API_KEY,
  });
  console.log("Moralis Started");

  app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });
};

startServer();

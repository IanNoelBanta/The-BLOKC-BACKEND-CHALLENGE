const express = require("express");
const Moralis = require("moralis").default;
require("dotenv").config();
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
app.use(express.json());

const PORT = 3000;

const MY_MORALIS_API_KEY = process.env.MORALIS_API_KEY;
console.log("Moralis API Key Fetched");

const ETH = EvmChain.ETHEREUM;

app.get("/status", (request, response) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

app.get("/hoy", (request, response) => {
  const status = {
    IDK: "Ge",
  };

  response.send(status);
});

async function getAllBalance(walletAddress) {
  // Fetch Wallet Native Balance
  const walletNativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    chain: ETH,
    address: walletAddress,
  });
  console.log("Native Balance Fetched in JSON", walletNativeBalance.raw);

  const native = walletNativeBalance.result.balance.ether;
  console.log("Native Balance Fetched Formatted", native);

//   const tokenBalance = await Moralis.EvmApi.token.getWalletTokenBalances({
//     address,
//     chain,
//   });
//   console.log("Token Balance Fetched in JSON", tokenBalance.raw);

//   const tokens = tokenBalance.result.map((token) => token.display());
//   console.log("Tokens", tokens);

  //   return { native, tokens };
  return native;
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

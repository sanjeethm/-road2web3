const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address){
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main(){
    // Get the contract that has been deployed to Goerli.
const contractAddress="0x21b4EE9CF3eC2472bbf73aD79876c2F947B8ACd8";
const contractABI = abi.abi;
const withdrawToAddress = "0x8F57A82145Ca952193290df881A4C3541aBe8977"; //available 0.4342
  // Get the node connection and wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const signer2 = new hre.ethers.Wallet(process.env.PRIVATE_KEY_2, provider);

  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    // Check starting balances.
console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
console.log("current balance of owner2: ", await getBalance(provider, signer2.address), "ETH");
const contractBalance = await getBalance(provider, buyMeACoffee.address);
console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "ETH");


  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("set address...",withdrawToAddress);
    await buyMeACoffee.setWithdrawAddress(withdrawToAddress);
    console.log("withdrawing funds..")
    const withdrawTxn =  await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("current balance of owner2 after withdrawal: ", await getBalance(provider, signer2.address), "ETH");

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
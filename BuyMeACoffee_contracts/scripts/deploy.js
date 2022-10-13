// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

//Retruns the ether balance of the given address.
async function getBalance(address){
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
//  console.log("balanceBigInt>>>>"+  balanceBigInt._isBigNumber);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// prints the ether balances of a list of addresses.
async function printBalances(addresses){
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance : `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos){
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper}, ${tipperAddress}, Said ${message}`);
  }

}


async function main() {
  /*const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = hre.ethers.utils.parseEther("1");

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();

  console.log(
    `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  ); */
 //Get example accounts.

 const [owner, tipper, tipper2, tipper3 ] = await hre.ethers.getSigners();

 //Get the contract and deploy.

 const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
 const buyMeACoffee = await BuyMeACoffee.deploy();
 await buyMeACoffee.deployed();
 console.log("BuyMeACoffee deployed to ::", buyMeACoffee.address);


 // Check balances before the coffee purchase.

 const addresses = [owner.address, tipper.address, buyMeACoffee.address];
 console.log("======starting=========")
 await printBalances(addresses);

 // Buy the owner a few coffees
 const tip = {value: hre.ethers.utils.parseEther("1")};
 const tip2 = {value: hre.ethers.utils.parseEther("2")};
 await buyMeACoffee.connect(tipper).buyCofee("sam","wonderful teacher!", tip);
 await buyMeACoffee.connect(tipper2).buyCofee("vitto","awsome content", tip2);
 await buyMeACoffee.connect(tipper3).buyCofee("caroline","love my POK nft!", tip);


 // Check balances after coffee purchases
 console.log("=====bought coffee=======");
 await printBalances(addresses);

 // Withdraw funds.

 await buyMeACoffee.connect(owner).withdrawTips();


 // Check balances after withdraw funds.
 console.log("=====after withdraw tips =======");
 await printBalances(addresses);

 //Read all the memos left for the owner.
 console.log("=====print memos =======");
 const memos = await buyMeACoffee.getMemos();
 printMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

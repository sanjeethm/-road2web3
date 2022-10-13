// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//Contract deployed to address 0x9A9b043080E2F1735126a09Aa750231Fe04A6442, 
//0xa370ca89065f7dC43FBa0089312D2b0fDb70073e, 0x21b4EE9CF3eC2472bbf73aD79876c2F947B8ACd8

// Uncomment this line to use console.log
 //import "hardhat/console.sol";

contract BuyMeACoffee {

    // Address of the contract deployer.
    address payable private owner;
    constructor() {
        owner = payable(msg.sender);
    }

    //Event to emit when a memo is created.
    event NewMemo( 
        address indexed from, 
        uint256 timestamp, 
        string name, 
        string message
    );


    // struct type Memo
    struct Memo  {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    //Memo array to store all the memo's received from friends.
    Memo[] memos;

    /**
    * @dev buy a coffee for the contract owner.
    * @param _name name of the coffee buyer.
    * @param _message a nice message from the coffee buyer.
     */
    function buyCofee(string memory _name, string memory _message) public payable {
        //console.log("buyCoffee msg value>>>", msg.value);

        require(msg.value > 0, "Cannot buy coffee with 0 ETH!");

        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message

        ));

        emit NewMemo(
            msg.sender, 
            block.timestamp, 
            _name, 
            _message
        );

    }

    /**
    * @dev send the entire money stored in this contract to the contract owner.
    *
     */
    function withdrawTips() public {

        require(owner.send(address(this).balance));

    }

    /**
    * @dev retrieve all the memos received and stored on the blockchain.
    *
     */
    function getMemos() public view returns(Memo[] memory){

        return memos;

    }

        /**
    * @dev send the entire money stored in this contract to the address .
    * @param _to to address to send the tips.
     */
    function withdrawTipsToAddress(address payable _to) public {
        require(msg.sender == owner, "Only owner can send the funds!");
        require(address(this).balance > 0 ,"No funds to transfer...");

        _to.transfer(address(this).balance);

    }

   /**
    * @dev send the entire money stored in this contract to the new address .
    * @param newAddress send tips to new.
     */
    function setWithdrawAddress(address newAddress) public {
        owner = payable(newAddress);
        
    }

}

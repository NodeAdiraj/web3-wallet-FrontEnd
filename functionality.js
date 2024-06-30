import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constarnts.js";

const connectButton = document.getElementById("connectid");
const sendButton = document.getElementById("sendid");
const withdrawButton = document.getElementById("withdrawid");
const balanceButton = document.getElementById("balanceid");

connectButton.onclick = connect;
sendButton.onclick = send;
withdrawButton.onclick = withdraw;
balanceButton.onclick = checkBalance;

function mine(response, provider) {
  return new Promise((resolve, reject) => {
    try {
      provider.once(response.hash, (receipt) => {
        console.log(`we have ${response.confirmations} confirmations.`);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function connect() {
  try {
    if (typeof window.ethereum !== "undefined") {
      await ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Connected";
    } else {
      console.log("Please install MetaMask!");
    }
  } catch (error) {
    console.log("Error connecting to MetaMask", error);
  }
}

async function send() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const value = document.getElementById("sendinputid").value;
    try {
      const response = await contract.send({
        value: ethers.utils.parseEther(value),
      });
      await mine(response, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const value = document.getElementById("withdrawinputid").value;

    try {
      const parsedValue = ethers.utils.parseEther(value);
      const response = await contract.withdraw(parsedValue);

      console.log("Transaction hash:", response.hash);
      await mine(response, provider);
    } catch (error) {
      console.error("Withdraw error:", error);
    }
  } else {
    console.error("MetaMask is not installed");
  }
}

async function checkBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const balance = await provider.getBalance(contractAddress);
      balanceButton.innerHTML = `${ethers.utils.formatEther(balance)}`;
    } catch (error) {
      console.log(error);
    }
  }
}

const Block = require("./block");

const Transaction = require("./transaction");

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransaction = [];
    this.difficulty = 3;
  }

  createGenesisBlock() {
    const tx = new Transaction(
      "Genesis",
      "system",
      "system",
      0,
      "Genesis block"
    );

    return new Block(0, Date.now(), tx, 0);
  }

  minePendingTransaction(miner) {
    const block = new Block(
      this.getLatestBlock().index + 1,
      Date.now(),
      this.pendingTransaction,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);

    this.pendingTransaction = [];

    this.createTransaction(
      "Mining reward",
      "system",
      miner,
      1000,
      "Mining reward"
    );

    this.chain.push(block);
  }

  createTransaction(type, from, to, amount, message) {
    const tx = new Transaction(type, from, to, amount, message);

    this.pendingTransaction.push(tx);

    console.log("Transaction added to pending transaction." + tx);

    return tx;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}

module.exports = Blockchain;

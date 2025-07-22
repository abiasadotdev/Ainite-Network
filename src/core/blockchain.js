const Block = require("./block");

const Transaction = require("./transaction");

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransaction = [];
    this.mining = false;
    this.difficulty = 5;
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
    if (this.mining) return;

    this.mining = true;

    const block = new Block(
      this.getLatestBlock().index + 1,
      Date.now(),
      this.pendingTransaction,
      this.getLatestBlock().hash
    );

    const mining = block.mineBlock(this.difficulty, () => this.mining);

    if (mining !== false) {
      this.pendingTransaction = [];

      this.createTransaction(
        "Mining reward",
        "system",
        miner,
        1000,
        "Mining reward"
      );

      this.chain.push(block);

      return block;
    }

    this.mining = false;

    return false;
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

  endMining() {
    this.mining = false;
  }
}

module.exports = Blockchain;

const crypto = require("crypto");

class Block {
  constructor(index, timestamp, transactions, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this.previousHash = previousHash;
    this.hash = this.createHash();
  }

  createHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.nonce +
          this.previousHash +
          this.hash
      )
      .digest("hex");
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;

      //this.hash = this.calculateHash();

      this.hash = this.createHash();

      console.log(`Block is being mined. Current nonce : ${this.nonce}`);
    }

    console.log(`Block successfully mined. ${this.hash}`);
  }
}

module.exports = Block;

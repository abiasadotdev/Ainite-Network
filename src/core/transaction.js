class Transaction {
  constructor(type, from, to, amount, message) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.message = message;
  }
}

module.exports = Transaction;

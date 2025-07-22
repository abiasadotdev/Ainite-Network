const net = require("net");

const ME = require("./core/node/config");

const Nodes = require("./core/node");

const broadcast = require("./core/net/broadcast");

const Ainite = require("./core/ainite");

const network = net.createServer((socket) => {
  socket.on("data", (buffer) => {
    const data = JSON.parse(buffer);

    if (data.event == "registerNode") {
      const address = data.data.address.split(":");

      if (!Nodes.some((node) => node.host == address[0])) {
        Nodes.push({ host: address[0], port: address[1], genesis: false });

        broadcast(Nodes, {
          event: "registerNode",
          data: { address: address[0] + ":" + address[1] },
        });

        console.log(`New node registered.`);

        console.log(address);
      }
    }

    if (data.event == "chain") {
      socket.write(JSON.stringify(Ainite.chain));
    }

    if (data.event == "pendingTransaction") {
      socket.write(JSON.stringify(Ainite.pendingTransaction));
    }

    if (data.event == "createTransaction") {
      const { type, from, to, amount, message } = data.data;

      Ainite.createTransaction(type, from, to, amount, message);

      broadcast(Nodes, { event: "receiveTransaction", data: data.data });

      socket.write("Transaction created and added to pending transaction");
    }

    if (data.event == "receiveTransaction") {
      const { type, from, to, amount, message } = data.data.tx;

      Ainite.createTransaction(type, from, to, amount, message);

      console.log("Transaction received and added to pending transaction.");

      if (Ainite.pendingTransaction.length > 10) {
        const block = Ainite.minePendingTransaction(ME.host);

        broadcast(Nodes, { event: "receiveBlock", data: { block: block } });
      }

      console.log("Mining");

      console.log(Ainite.chain);

      console.log(Ainite.pendingTransaction);
    }

    if (data.event == "receiveBlock") {
      Ainite.chain.push(data.data.block);

      console.log("Block received and successfully added to chain.");

      console.log(data.data.block);
    }
  });
});

if (!ME.genesis) {
  const client = net.createConnection(
    { host: Nodes[0].host, port: Nodes[0].port },
    () => {
      console.log(`Connected to genesis node. Genesis :`);

      console.log(Nodes[0]);

      client.write(
        JSON.stringify({
          event: "registerNode",
          data: { address: ME.host + ":" + ME.port },
        })
      );

      console.log("Your node register successfully.");
    }
  );
}

network.listen(ME.port, () => {
  console.log(`Network running. Address : ${ME.host}:${ME.port}`);
});

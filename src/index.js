const net = require("net");

const ME = require("./core/node/config");

const Nodes = require("./core/node");

const broadcast = require("./core/net/broadcast");

const Ainite = require("./core/ainite");

const network = net.createServer((socket) => {
  console.log(`New node connected.`);

  socket.on("data", (buffer) => {
    const data = JSON.parse(buffer);

    if (data.event == "registerNode") {
      console.log(data);
      const address = data.data.address.split(":");

      if (!Nodes.some((node) => node.host == address[0])) {
        Nodes.push({ host: address[0], port: address[1], genesis: false });

        broadcast(Nodes, {
          event: "registerNode",
          data: { address: address[0] + ":" + address[1] },
        });

        console.log(`New node registered.`);

        console.log(Nodes);
      }
    }

    if (data.event == "chain") {
      socket.write(JSON.stringify(Ainite.chain));
    }

    if (data.event == "pendingTransaction") {
      socket.write(JSON.stringify(Ainite.pendingTransaction));
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

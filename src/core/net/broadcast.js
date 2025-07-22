const net = require("net");

const ME = require("../node/config");

const broadcast = (nodes, data) => {
  nodes.forEach((node) => {
    const broad = net.createConnection(
      { host: node.host, port: node.port },
      () => {
        if (node.host !== ME.host) {
          broad.write(JSON.stringify(data));
        }
      }
    );
  });
};

module.exports = broadcast;

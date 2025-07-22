const net = require("net");

const broadcast = (nodes, data) => {
  nodes.forEach((node) => {
    const broad = net.createConnection(
      { host: node.host, port: node.port },
      () => {
        broad.write(JSON.stringify(data));
      }
    );
  });
};

module.exports = broadcast;

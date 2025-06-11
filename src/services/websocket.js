const clients = new Set();

const broadcastPollingData = (data) => {
  clients.forEach((client) => {
    if (client.readyState === 1) {
      // WebSocket.OPEN
      const formattedData = transformData(data);

      client.send(JSON.stringify(formattedData));
    }
  });
};

const wsHandler = (ws) => {
  clients.add(ws);

  ws.on("message", (msg) => {
    console.log("📩 Message received:", msg);
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("❌ WebSocket disconnected");
  });
};

function transformData(data) {
  const result = {};

  for (const line in data) {
    result[line] = {};

    for (const category in data[line]) {
      result[line][category] = {};
      data[line][category].forEach((item) => {
        result[line][category][item.name] = item.value;
      });
    }
  }

  return result;
}

module.exports = {
  wsHandler,
  broadcastPollingData,
};

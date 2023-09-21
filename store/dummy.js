let db = {
  user: [{ id: "1", name: "Henry" }],
};

async function list(table) {
  return db[table];
}

async function get(table, id) {
  return db[table].filter((item) => item.id === id);
}

async function upsert(table, data) {
  let index = db[table].findIndex((item) => item.id === data.id);
  if (index !== -1) {
    db[table][index] = { ...data };
  } else {
    db[table].push(data);
  }
}

async function remove(table, id) {
  let index = list(table).findIndex((item) => item.id === id);
  db[table].splice(index, 1);
}

module.exports = {
  list,
  get,
  upsert,
  remove,
};

function getTableEntries(object, prefix) {
  let fields = Object.entries(object).map((item) => {
    return [`${prefix}.${item[0]}`, item[1]];
  });

  return fields.reduce((acc, field) => ({ ...acc, [field[0]]: field[1] }), {});
}

module.exports = {
  getTableEntries,
};

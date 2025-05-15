function generateWhereConditions(obj, needWhereStatement, isHaving) {
  let whereString = "";

  Object?.entries(obj).forEach((condition, index) => {
    if (index === 0 && needWhereStatement === true) {
      if (condition[0] != "first_name" || condition[0] != "last_name") {
        if (condition[0].includes("id") && condition[1].length > 0) {
          whereString = `${isHaving ? "HAVING" : "WHERE"} lower(${
            condition[0]
          }) like '${condition[1]}'`;
        } else {
          whereString = `${isHaving ? "HAVING" : "WHERE"} lower(${
            condition[0]
          }) like '%${condition[1]}%'`;
        }
      }
    } else {
      if (condition[0] != "first_name" && condition[0] != "last_name") {
        if (condition[0].toLowerCase().includes("_at")) {
          whereString +=
            condition[1]?.length > 0
              ? `AND ${condition[0]} = '${condition[1]}' `
              : "";
        } else if (condition[0].includes("_id")) {
          whereString +=
            condition[1]?.length > 0
              ? `AND lower(${
                  condition[0]
                }) LIKE '${condition[1].toLowerCase()}' `
              : "";
        } else {
          whereString +=
            condition[1]?.length > 0
              ? `AND lower(${condition[0]}) LIKE '%${
                  condition[1].toLowerCase() + "%"
                }' `
              : "";
        }
      }
    }
  });

  if (obj.first_name || obj.last_name) {
    whereString += `AND lower(first_name || ' ' || last_name ) LIKE '%${obj.first_name}%'`;
  }
  return whereString;
}

module.exports = {
  generateWhereConditions,
};

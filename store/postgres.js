// const { Sequelize } = require("sequelize");
// const { db: config } = require("../config");

// const sequelize = new Sequelize(config.db, config.user, config.password, {
//   host: config.host,
//   dialect: config.dialect,
//   operatorsAliases: false,
//   timezone: config.timezone,
//   dialectOptions: config.dialectOptions,
//   pool: {
//     max: config.pool.max,
//     min: config.pool.min,
//     acquire: config.pool.acquire,
//     idle: config.pool.idle,
//   },
// });

// const db = sequelize;

// async function list(table, query, options) {
//   if (options) {
//     var { joinTable, joinBy, joinConditions } = options;
//   }

//   let res = await db.query(`SELECT ${Object.keys(query).map((i) => `${i}`)} ${
//     joinConditions
//       ? "," +
//         Object.keys(joinConditions).map(
//           (i) => `${joinTable}.${i} as customer_${i}`
//         )
//       : ""
//   }
//     FROM ${table}
//     ${
//       joinTable
//         ? `JOIN ${joinTable} ON (${table}.${joinBy} = ${joinTable}.${joinBy})`
//         : ""
//     }
//     WHERE ${table}.status not like 'DELETED';`);

//   return res[0];
// }

// async function get(table, whereConditions, options) {
//   if (options) {
//     var { joinTables } = options;
//   }

//   try {
//     let whereString = generateWhereConditions(whereConditions, true);

//     if (table !== "auth") {
//       whereString += `AND ${table}.status not like 'DELETED'`;
//     }
//     let query = `SELECT  ${Object.keys(whereConditions).map((i) => `${i}`)}

//     ${
//       joinTables?.map((jt) =>
//         jt.joinConditions
//           ? Object.keys(jt.joinConditions).map(
//               (i) => `${jt.name}.${i} as ${jt.name}_${i}`
//             )
//           : ""
//       ) || ""
//     }
//     FROM ${table}
//     ${
//       joinTables
//         ?.map(
//           (jt) =>
//             `JOIN ${jt.name} ON (${table}.${jt.joinBy} = ${jt.name}.${jt.joinBy})`
//         )
//         .join("\n") || ""
//     }
//       ${whereString}
//     `;

//     console.log("QUERY...........", query);
//     let res = await db.query(query);

//     return res[0];
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function insert(table, data) {
//   // console.log(table, data);

//   try {
//     let queryString = `INSERT INTO ${table} (${Object.keys(data).join()})
//                        VALUES(${Object.values(data)
//                          .map((data) => typeof data != "boolean" && `'${data}'`)
//                          .join(",")})`;

//     let res = await db.query(queryString);
//     console.log("INSERT RESPONSE", res);
//     return data;
//   } catch (error) {
//     console.log(error);
//     throw new Error(error.errors[0].message);
//   }
// }

// async function update(table, id, data) {
//   try {
//     let updateFields = "";
//     let fieldHistory = [];
//     Object.entries(data).forEach((item, index) => {
//       updateFields +=
//         item[1]?.toString().length > 0 && item[0] != `${table}_id`
//           ? `${index != 0 && fieldHistory.length > 0 ? ", " : ""}${item[0]} = ${
//               typeof item[1] == "boolean" ? item[1] : `'${item[1]}'`
//             } `
//           : "";

//       if (item[1]?.toString().length > 0 && item[0] != `${table}_id`) {
//         fieldHistory.push(item);
//       }

//       return updateFields;
//     });

//     let queryString = `UPDATE ${table} SET ${updateFields} WHERE ${table}_id = '${id}'`;

//     console.log(queryString);
//     await db.query(queryString);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

// async function remove(table, id) {}

// async function getCustomQuery(queryString) {
//   try {
//     const response = await db.query(queryString);

//     return response[0];
//   } catch (error) {
//     throw error;
//   }
// }

// function getQueryDefaultString(table) {
//   return table != "auth"
//     ? `,to_char(created_at, 'dd TMMonth FMYYYYThh24:mi') as created_at, to_char(modified_at, 'dd TMMonth FMYYYYThh24:mi') as modified_at`
//     : "";
// }

// function generateWhereConditions(obj, needWhereStatement) {
//   console.log("GENERATE", obj);

//   let whereString = "";

//   Object?.entries(obj).forEach((condition, index) => {
//     if (index === 0 && needWhereStatement === true) {
//       if (condition[0] != "first_name" || condition[0] != "last_name") {
//         if (condition[0].includes("id") && condition[1].length > 0) {
//           whereString = `WHERE lower(${condition[0]}) like '${condition[1]}'`;
//         } else {
//           whereString = `WHERE lower(${condition[0]}) like '%${condition[1]}%'`;
//         }
//       }
//     } else {
//       if (condition[0] != "first_name" && condition[0] != "last_name") {
//         if (condition[0].toLowerCase().includes("_at")) {
//           whereString +=
//             condition[1]?.length > 0
//               ? `AND ${condition[0]} = '${condition[1]}' `
//               : "";
//         } else if (condition[0].includes("_id")) {
//           whereString +=
//             condition[1]?.length > 0
//               ? `AND lower(${
//                   condition[0]
//                 }) LIKE '${condition[1].toLowerCase()}' `
//               : "";
//         } else {
//           whereString +=
//             condition[1]?.length > 0
//               ? `AND lower(${condition[0]}) LIKE '%${
//                   condition[1].toLowerCase() + "%"
//                 }' `
//               : "";
//         }
//       }
//     }
//   });

//   if (obj.first_name || obj.last_name) {
//     whereString += `AND lower(first_name || ' ' || last_name ) LIKE '%${obj.first_name}%'`;
//   }
//   return whereString;
// }

// module.exports = {
//   list,
//   get,
//   insert,
//   update,
//   remove,
//   getCustomQuery,
//   db,
// };

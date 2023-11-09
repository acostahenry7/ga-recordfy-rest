const { generateWhereConditions } = require("../../utils/store");

const queries = {};

queries.listDetailedRecordFiles = (data) => {
  console.log("DATA", data);

  return `SELECT record_file_id, rf.name, record_id, ft.name as file_type, ft.prefix, expiration_date, rf.status, rf.created_by, 
  rf.created_at, rf.modified_at, rf.modified_by, rf.file_location, rf.partner
  FROM record_file rf
  JOIN file_type ft ON (rf.file_type_id = ft.file_type_id) 
	${generateWhereConditions(data, true, false)}`;
};

module.exports = queries;

const { generateWhereConditions } = require("../../utils/store");

const queries = {};

queries.listDetailedRecords = (data) => {
  console.log("DATA", data);

  return `SELECT r.record_id, record_code, r.customer_id, r.status, r.created_by, r.created_at, r.modified_at, r.modified_by,
	COUNT(record_file_id) as file_amount, c.customer_name, c.identification_number, c.phone_number, ct.name as customer_type,
	r.number_of_partners
	FROM record r
	LEFT JOIN record_file rf ON (r.record_id = rf.record_id)
	JOIN customer c ON (r.customer_id = c.customer_id)
	JOIN customer_type ct ON (c.customer_type_id = ct.customer_type_id)
	GROUP BY r.record_id, record_code, r.customer_id, r.status, r.created_by, r.created_at, r.modified_at, r.modified_by,
	c.customer_name, c.identification_number, c.phone_number, ct.name, r.number_of_partners
	${generateWhereConditions(data, true, true)}`;
};

module.exports = queries;

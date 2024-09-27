const db = require("../store/models");
const cron = require("node-cron");
const { generateReport } = require("../reports");
const { getCronByEnv } = require("../utils/cron-config");

let productionCron = "30 9 * * 1-6";
let devCron = "*/20 * * * * *";

let cronSet = getCronByEnv();
console.log(cronSet);

function expiringDocsCron() {
  cron.schedule(cronSet, async () => {
    try {
      const [recordFiles] = await db.sequelize.query(`
      select  r.record_id, 
      r.record_code "No. Record", 
      b.name "Beneficiario", 
      /*case 
          when b.identification_type = 'PERSONAL_ID' then 'CÉDULA'
          when b.identification_type = 'PASSPORT' then 'PASAPORTE' 
          when b.identification_type = 'RNC' then 'RNC'
          else b.identification_type
      end "Tipo Ident.", 
      b.identification_number "No. Identificacion", 
      b.is_pep "PEP", */
      to_char(rf.expiration_date::date, 'DD Mon YYYY') "Fecha Expiracion", 
      ft.name "Tipo Archivo" 
      from record_file rf
      join beneficiary b on (rf.beneficiary_id = b.beneficiary_id)
      join file_type ft on (rf.file_type_id = ft.file_type_id)
      join record r on (b.record_id = r.record_id)
      where rf.status_type = 'CREATED'
      and expiration_date BETWEEN current_date and current_date + 15
      order by expiration_date desc`);
      // console.log(recordFiles);

      recordFiles.length > 0 &&
        generateReport(recordFiles, {
          filename: "expiring-documents",
          description:
            "Reporte de documentos por vencer en los próximos 15 días",
          mailFilename: "Reporte-documentos-por-vencer",
        });
    } catch (error) {
      console.log(error);
    }
  });
}

function expiredDocsCron() {
  cron.schedule(cronSet, async () => {
    try {
      const [recordFiles] = await db.sequelize.query(`
      select  r.record_id, 
      r.record_code "No. Record", 
      b.name "Beneficiario", 
      /*case 
          when b.identification_type = 'PERSONAL_ID' then 'CÉDULA'
          when b.identification_type = 'PASSPORT' then 'PASAPORTE' 
          when b.identification_type = 'RNC' then 'RNC'
          else b.identification_type
      end "Tipo Ident.", 
      b.identification_number "No. Identificacion", 
      b.is_pep "PEP", */
      to_char(rf.expiration_date::date, 'DD Mon YYYY') "Fecha Expiracion", 
      ft.name "Tipo Archivo" 
      from record_file rf
      join beneficiary b on (rf.beneficiary_id = b.beneficiary_id)
      join file_type ft on (rf.file_type_id = ft.file_type_id)
      join record r on (b.record_id = r.record_id)
      where rf.status_type = 'CREATED'
      and expiration_date < current_date
      order by r.record_code asc, b.name asc, expiration_date asc`);

      recordFiles.length > 0 &&
        generateReport(recordFiles, {
          filename: "expired-documents",
          description: "Reporte de documentos vencidos",
          mailFilename: "Reporte-documentos-vencidos",
        });
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = {
  expiringDocsCron,
  expiredDocsCron,
};

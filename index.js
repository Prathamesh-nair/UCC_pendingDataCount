require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const logger = require("./logger");
const postError = require("./sendError");

const { sequelize } = require("./sequelize");
const { query_NSEBSE_Count, quert_VSPCount } = require("./query");

//Declaring Variable
let totalCount = ``;
let slackMessage = ``;
let vspPendingCount = ``;
let vspCount = ``;

//Function to getReport

async function getReport() {
  let [results1, metadata1] = await sequelize.query(query_NSEBSE_Count);
  let [results2, metadata2] = await sequelize.query(quert_VSPCount);
  if (results1.length && results2.length) {
    logger.info("Received Data from the Database");
    totalCount = results1;
    vspPendingCount = results2;

    if (totalCount.length) {
      totalCount.forEach((v) => {
        const { exchange, status, count } = v;
        slackMessage += `${exchange}\t\t\t${status}\t\t\t${count}\n`;
      });

      if (vspPendingCount.length) {
        for (let i = 0; i < vspPendingCount.length; i++) {
          vspPendingCount = vspPendingCount[i];
          vspCount = vspPendingCount.count;
        }
      }
      postError(
        `<@kyc_oncalll> <@U02B99SLTTL> <@ankush.kochar>\n\nPlease find the count for UCC pending\nExchange\t\tStatus\t\tCount\n${slackMessage}\nPlease find the pending Count for VSP: ${vspCount}\ncc: <@U02B6B1HGER> <@U02JM7TGY2Y> <@nitin.kumar> <@sapna.ahuja> <@prathamesh.nair>`
      );
    }
  }
}

try {
  getReport()
    .then(() => {
      sequelize.close();
      logger.info("Application closed politely");
    })
    .catch((err) => {
      postError("UCC Count Data", `Job terminated with following error ${err}`);
      logger.error(err);
      sequelize.close();
    });
} catch (error) {
  postError("UCC Count Data", `Job terminated with following error ${error}`);
  logger.error("From Outermost Catch Block");
  logger.error(err);
  sequelize.close();
}

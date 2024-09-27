function getCronByEnv() {
  console.log("################", process.env.NODE_ENV);

  let env = process.env.NODE_ENV || "development";
  if (env === "production") {
    return "*/20 * * * * *";
  }

  if (env === "development") {
    return "30 9 * * 1";
  }
}

module.exports = {
  getCronByEnv,
};

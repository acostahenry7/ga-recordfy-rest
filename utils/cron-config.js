function getCronByEnv() {
  let env = process.env.NODE_ENV || "development";
  if (env === "development") {
    return "*/20 * * * * *";
  }

  if (env === "production") {
    return "30 9 * * 1";
  }
}

module.exports = {
  getCronByEnv,
};

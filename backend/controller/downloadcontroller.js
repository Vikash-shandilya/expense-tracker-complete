const aws = require("aws-sdk");
const expense = require("../model/expense");
const downloadfile = require("../model/downloadmodel");

const s3 = new aws.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});

async function uploadToS3(data, filename) {
  const params = {
    Bucket: "expensemanagementapp123",
    Key: filename,
    Body: data,
  };
  try {
    const stored = await s3.upload(params).promise();
    return stored.Location;
  } catch (error) {
    console.log(error);
  }
}

async function getfile(req, res, next) {
  try {
    const data = await expense.findAll({ where: { userId: req.user.id } });
    console.log(data, "data");
    const stringifydata = JSON.stringify(data);
    const filename = `expense${req.user.id}/${new Date().toISOString()}.txt`;
    const fileurl = await uploadToS3(stringifydata, filename);

    if (fileurl) {
      await downloadfile.create({
        filename: filename,
        fileurl: fileurl,
        userId: req.user.id,
      });
      console.log("filegotcreated");
    }

    console.log(fileurl);
    res
      .status(200)
      .json({ message: "File Uploaded Successfully", fileurl: fileurl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getpreviousdownloads(req, res, next) {
  const data = await downloadfile.findAll({
    where: { userId: req.user.id },
    attributes: ["createdAt", "fileurl"],
  });
  res.status(200).json({ message: "success", data: data });
}

module.exports = { getfile, getpreviousdownloads };

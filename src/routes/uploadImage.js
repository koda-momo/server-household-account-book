const express = require("express");
const router = express.Router();

//ランダムに命名してくれるやつ
const crypto = require("crypto");
const util = require("util");
const randomBytes = util.promisify(crypto.randomBytes);

//AWS
const AWS = require("aws-sdk");

// envファイルから変数取得用
const dotenv = require("dotenv");
dotenv.config();

//envファイルから取得
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

//  s3の情報記載
const s3 = new AWS.S3({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  signatureVersion: "v4",
});

/**
 * S3登録用URLの取得.
 *
 */
router.get("/", async function (req, res) {
  //ファイル名生成:文字を組み合わせた16桁ランダムに生成
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");
  const fileName = imageName + ".jpg";

  //設定データの作成
  const params = {
    Bucket: bucketName, // バケット名
    Key: fileName, //ファイル名
    ContentType: "multipart/form-data", //画像形式
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);

  //返すデータ
  const response = {
    message: "URLを取得しました。",
    status: "成功",
    uploadURL: uploadURL,
  };

  res.send(response);
});

/**
 * 削除メソッド.
 * @remarks 必要データ:画像パス
 */
router.post("/", async function (req, res) {
  console.log("発動");
  const url = req.body.url;

  const params = {
    Bucket: bucketName,
    Delete: { Objects: [{ Key: url }] },
  };

  await s3.deleteObjects(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    }
  });

  //返すデータ
  const response = {
    message: "画像を削除しました。",
    status: "成功",
  };

  res.send(response);
});

module.exports = router;

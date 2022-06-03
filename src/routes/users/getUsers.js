const express = require("express");
const router = express.Router();
const User = require("../../models/users");

/**
 * 全件取得.
 */
router.get("/", async (req, res) => {
  const data = await User.find({});
  const response = {
    message: "情報を取得しました。",
    status: "成功",
    user: data,
  };
  res.send(response);
});

/**
 * IDで1件取得.
 */
router.get("/:userId", (req, res) => {
  try {
    User.findById(req.params.userId, (err, data) => {
      //404エラー
      if (err) {
        res.status(404).json("ユーザが存在しません");
        return;
      }

      //返すデータ
      const response = {
        message: "情報を取得しました。",
        status: "成功",
        user: data,
      };
      res.send(response);
    });
  } catch (err) {
    res.status(500).json({
      response: {
        status: "失敗",
        user: err.name,
        message: err.message,
      },
    });
  }
});

/**
 * 家族IDに当てはまる人全件取得.
 */
router.get("/family/:familyId", async (req, res) => {
  try {
    User.find({ familyId: req.params.familyId }, (err, data) => {
      //404エラー
      if (err) {
        res.status(404).json("ユーザが存在しません");
        return;
      }
      //返すデータ
      const response = {
        message: "情報を取得しました。",
        status: "成功",
        user: data,
      };
      res.send(response);
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      response: {
        status: "失敗",
        message: err.message,
        user: err,
      },
    });
  }
});

module.exports = router;

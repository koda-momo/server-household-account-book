const express = require("express");
const router = express.Router();
const User = require("../../models/users");

/**
 * ログイン.
 */
router.post("/", async (req, res) => {
  try {
    User.find(
      { mail: req.body.mail, password: req.body.password },
      (err, data) => {
        //404エラー
        if (err || data == "") {
          res.status(404).json({
            error: {
              status: "失敗",
              user: "",
              message: "ログイン出来ませんでした。",
            },
          });
          return;
        }

        //返すデータ
        const responseData = {
          status: "成功",
          message: "ログインしました。",
          user: data[0]._id,
        };
        res.send(responseData);
      }
    );
  } catch (err) {
    res.status(500).json({
      error: { status: "失敗", user: err.name, message: err.message },
    });
  }
});

module.exports = router;

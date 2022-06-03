const express = require("express");
const router = express.Router();
const User = require("../../models/users");

/**
 * 削除.
 */
router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.remove({ _id: req.params.userId });
    response = {
      status: "成功",
      message: "ユーザを削除しました。",
      user: user,
    };
    res.send(response);
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
 * 全件削除.
 */
router.delete("/dangerous/delete", async (req, res) => {
  try {
    const user = await User.remove();
    response = {
      status: "成功",
      message: "ユーザを削除しました。",
      user: user,
    };
    res.send(response);
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

module.exports = router;

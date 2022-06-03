const express = require("express");
const router = express.Router();
const Category = require("../models/categories");

/**
 * 全件取得.
 */
router.get("/", async (req, res, next) => {
  const data = await Category.find({});
  res.send(data);
});

/**
 * 新規追加.
 */
router.post("/add", async (req, res) => {
  //変数の整理
  const name = req.body.name;
  const color = req.body.color;
  const icon = req.body.icon;
  const genre = req.body.genre;

  try {
    //リクエストを受け取る
    const categoryItem = new Category({
      name: name,
      color: color,
      icon: icon,
      genre: genre,
    });

    //保存
    const saveCategory = await categoryItem.save();

    response = {
      status: "成功",
      message: "カテゴリを新規登録しました。",
      category: saveCategory,
    };

    res.send(response);
  } catch (err) {
    res.status(500).json({
      response: {
        status: "失敗",
        spItem: err.name,
        message: err.message,
      },
    });
  }
});

module.exports = router;

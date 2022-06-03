const express = require("express");
const router = express.Router();
const SpendingItem = require("../../models/spendingItems");
const Spending = require("../../models/spendings");

const makeDate = require("../../method/makeDate");
const make = require("../../method/makeNewSptable");

/**
 * 新規追加.
 * @remarks 必要なデータ:userId, 項目名, いくらだったか, カテゴリーの名前, 日付
 */
router.post("/", async (req, res) => {
  //変数の整理
  const categoryName = req.body.categoryName;
  const howmatch = req.body.howmatch;
  const userId = req.body.userId;
  const name = req.body.name;
  const date = req.body.date;

  const year = new Date(date).getFullYear();
  const month = Number(new Date(date).getMonth()) + 1;
  const startDate = makeDate.makeStartDate(year, month);
  const endDate = makeDate.makeEndDate(year, month);

  try {
    //リクエストを受け取る
    const spendItem = new SpendingItem({
      name: name,
      howmatch: howmatch,
      createdAt: new Date(date),
    });

    //支出情報アイテム保存
    const saveSpItem = await spendItem.save();
    //支出アイテムID
    const itemId = saveSpItem._id;

    //支出テーブルにも保存するために情報取得
    const spData = await Spending.findOne({
      userId: req.body.userId,
      categoryName: req.body.categoryName,
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    //もしテーブルを新規に作る必要があった場合(カテゴリー名が一致しない場合)
    if (spData == undefined) {
      make.Sptable(categoryName, howmatch, userId, itemId, date);
    } else {
      //既にテーブルがある場合
      spData.spendingId.push(itemId); //リストにID追加
      spData.total += req.body.howmatch; //金額追加
      await spData.save();
    }

    response = {
      status: "成功",
      message: "支出情報を新規登録しました。",
      spItem: saveSpItem,
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

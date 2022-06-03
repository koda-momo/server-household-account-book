const express = require("express");
const router = express.Router();
const IncomeItem = require("../../models/incomeItems");
const Income = require("../../models/incomes");

const makeDate = require("../../method/makeDate");
const make = require("../../method/makeNewIctable");

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
    const icItem = new IncomeItem({
      name: name,
      howmatch: howmatch,
      createdAt: new Date(date),
    });

    //支出情報アイテム保存
    const saveIcItem = await icItem.save();
    //支出アイテムID
    const itemId = saveIcItem._id;

    //支出テーブルにも保存するために情報取得
    const icData = await Income.findOne({
      userId: req.body.userId,
      categoryName: req.body.categoryName,
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    //もしテーブルを新規に作る必要があった場合(カテゴリー名が一致しない場合)
    if (icData == undefined) {
      make.Ictable(categoryName, howmatch, userId, itemId, date);
    } else {
      //既にテーブルがある場合
      icData.incomeId.push(itemId); //リストにID追加
      icData.total += req.body.howmatch; //金額追加
      await icData.save();
    }

    response = {
      status: "成功",
      message: "支出情報を新規登録しました。",
      icItem: saveIcItem,
    };

    res.send(response);
  } catch (err) {
    res.status(500).json({
      response: {
        status: "失敗",
        icItem: err.name,
        message: err.message,
      },
    });
  }
});

module.exports = router;

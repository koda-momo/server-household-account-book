const express = require("express");
const router = express.Router();
const IncomeItem = require("../../models/incomeItems");
const Income = require("../../models/incomes");

/**
 * 削除.
 */
router.delete("/:deleteId", async (req, res) => {
  try {
    //支出テーブルからデータ取得
    const deleteId = req.params.deleteId;
    const icItem = await IncomeItem.findById(deleteId);
    const howmatch = icItem.howmatch;

    const ic = await Income.findOne({
      incomeId: deleteId,
    });

    //支出テーブルの配列から対象のIDを削除
    newIcArray = await ic.incomeId.filter((id) => deleteId != id);
    ic.incomeId = [...newIcArray];
    //支出テーブルのトータル金額から削除するアイテムの金額を引く
    ic.total = ic.total - howmatch;
    await ic.save();

    //支出アイテムから削除
    const deleteItem = await IncomeItem.remove({ _id: req.params.deleteId });

    response = {
      status: "成功",
      message: "支出データを削除しました。",
      icItem: deleteItem,
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

/**
 * 全件削除.
 */
router.delete("/dangerous/delete", async (req, res) => {
  try {
    //削除
    await IncomeItem.remove();
    await Income.remove();

    response = {
      status: "成功",
      message: "支出データを全件削除しました。",
      spItem: "",
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

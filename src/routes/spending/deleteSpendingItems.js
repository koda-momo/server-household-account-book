const express = require("express");
const router = express.Router();
const SpendingItem = require("../../models/spendingItems");
const Spending = require("../../models/spendings");

/**
 * 削除.
 */
router.delete("/:deleteId", async (req, res) => {
  try {
    //支出テーブルからデータ取得
    const deleteId = req.params.deleteId;
    const spItem = await SpendingItem.findById(deleteId);
    const howmatch = spItem.howmatch;

    const sp = await Spending.findOne({
      spendingId: deleteId,
    });

    //支出テーブルの配列から対象のIDを削除
    newSpArray = await sp.spendingId.filter((id) => deleteId != id);
    sp.spendingId = [...newSpArray];
    //支出テーブルのトータル金額から削除するアイテムの金額を引く
    sp.total = sp.total - howmatch;
    await sp.save();

    //支出アイテムから削除
    const deleteItem = await SpendingItem.remove({ _id: req.params.deleteId });

    response = {
      status: "成功",
      message: "支出データを削除しました。",
      spItem: deleteItem,
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

/**
 * 全件削除.
 */
router.delete("/dangerous/delete", async (req, res) => {
  try {
    //削除
    await SpendingItem.remove();
    await Spending.remove();

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

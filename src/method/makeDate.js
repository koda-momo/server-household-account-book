/**
 * 日付の始まりを作成するメソッド.
 */
exports.makeStartDate = function (year, month) {
  //もし1桁月の場合は0を先頭に付ける
  let stringMonth = String(month);
  if (stringMonth.length == 1) {
    stringMonth = "0" + month;
  }

  const startDate = `${year}-${stringMonth}-01T00:00:00.000+00:00`;
  return startDate;
};

/**
 * 日付の終わりを作成するメソッド.
 */
exports.makeEndDate = function (year, month) {
  const nextNumMonth = Number(month) + 1;
  let nextStringMonth = String(nextNumMonth);
  let nextYear = Number(year);

  //もし1桁なら頭に0を付ける
  if (nextStringMonth.length == 1) {
    nextStringMonth = "0" + nextStringMonth;
  }

  //もし12月なら1月にする + 年も進める
  if (nextNumMonth > 12) {
    nextStringMonth = "01";
    nextYear = Number(year) + 1;
  }

  const endDate = `${nextYear}-${nextStringMonth}-01T00:00:00.000+00:00`;
  return endDate;
};

//express
const express = require("express");
const app = express();

//envファイル読み込みに使用
require("dotenv").config({ debug: true });

//DB
const mongoose = require("mongoose");

const path = require("path");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//Corsエラー防止用
const cors = require("cors");
app.use(cors());

//ルーティング
const updateUserRouter = require("./routes/users/updateUsers");
const getUserRouter = require("./routes/users/getUsers");
const newUserRouter = require("./routes/users/newUsers");
const deleteUserRouter = require("./routes/users/deleteUsers");
const loginUserRouter = require("./routes/users/loginUsers");

const addFamilyRouter = require("./routes/families/addFamilies");
const getFamilyRouter = require("./routes/families/getFamilies");
const updateFamilyRouter = require("./routes/families/updateFamilies");

const categoryRouter = require("./routes/categories");

const getSpendingRouter = require("./routes/spending/getSpendings");
const getSpendingItemRouter = require("./routes/spending/getSpendingItems");
const newSpendingItemRouter = require("./routes/spending/newSpendingItems");
const deleteSpendingItemRouter = require("./routes/spending/deleteSpendingItems");
const updateSpendingItemRouter = require("./routes/spending/updateSpendingItems");

const getIncomeRouter = require("./routes/incomes/getIncomes");
const getIncomeItemRouter = require("./routes/incomes/getIncomeItems");
const newIncomeItemRouter = require("./routes/incomes/newIncomeItems");
const deleteIncomeItemRouter = require("./routes/incomes/deleteIncomeItems");
const updateIncomeItemRouter = require("./routes/incomes/updateIncomeItems");
const imageRouter = require("./routes/uploadImage");

//JSONを使う設定(これが無いとリクエストが読めない)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//ルーティングを使う
app.use("/getuser", getUserRouter);
app.use("/newuser", newUserRouter);
app.use("/deleteuser", deleteUserRouter);
app.use("/updateuser", updateUserRouter);
app.use("/loginuser", loginUserRouter);

app.use("/addfamily", addFamilyRouter);
app.use("/getfamily", getFamilyRouter);
app.use("/updatefamily", updateFamilyRouter);

app.use("/category", categoryRouter);

app.use("/getsp", getSpendingRouter);
app.use("/getspitem", getSpendingItemRouter);
app.use("/newspitem", newSpendingItemRouter);
app.use("/deletespitem", deleteSpendingItemRouter);
app.use("/updatespitem", updateSpendingItemRouter);

app.use("/getic", getIncomeRouter);
app.use("/geticitem", getIncomeItemRouter);
app.use("/newicitem", newIncomeItemRouter);
app.use("/deleteicitem", deleteIncomeItemRouter);
app.use("/updateicitem", updateIncomeItemRouter);

app.use("/s3", imageRouter);

/**
 * サーバ接続.
 */
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`${port}番で立ち上がりました`);

/**
 * DB接続.
 */
mongoose.connect(process.env.DB_URL);
mongoose.connection.once("open", () => {
  console.log("DB接続");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

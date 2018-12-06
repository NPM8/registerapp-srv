module.exports = function (req, res) {
  consoe.log(req.body)
  res.json({
    msg: "OK"
  })
}
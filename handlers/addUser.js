module.exports = function (req, res) {
  console.log(req.body)
  res.json({
    msg: "OK"
  })
}
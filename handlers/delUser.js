module.exports = function ({app, params}, res) {
  // console.log(params.id)
  const col = app.get('col'),
    db = app.get('data');
  const obj = col.get(params.id)
  // console.log(obj)
  col.remove(obj)
  db.saveDatabase(err => {
    if (err) {
      res.json({
        msg: "Error while saveing"
      })
    } else {
      //  console.log("Db saved");
       res.json({
         msg: "OK"
       })
    }
  })
  // res.json({
  //   msg: "OK"
  // })
}
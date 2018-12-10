module.exports = function ({app, body}, res) {
  const { username, password } = body
  const col = app.get("col");
  const data = app.get("data");

  const maxId = col.mapReduce(obj => {
    return obj.id;
  }, arr => {
    let max = 1
      arr.forEach(value => max = (value > max) && value)
      return max;
  });

  const isExist = col.mapReduce(obj => obj.username, arr => {
    let bool = false;
    arr.forEach(value => {
      if (username == value)
        bool = true;
    })
    return bool
  });

  if (!isExist) {
      col.insert({id: maxId + 1, username, password });
      data.saveDatabase(err => {
          if (err) {
              console.log(err);
              res.json({
                  msg: "Error: cannot add user "
              })
          } else {
              console.log("Db saved");
              res.json({
                  msg: "OK"
              })
          }
      });
  } else {
    res.json({
        msg: "This user exists"
    })
  }

}

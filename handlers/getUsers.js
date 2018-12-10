module.exports = function (req, res) {
    const col = req.app.get('col');
    let arr = col.find({});
    // console.log(arr);
    res.json(arr);
}

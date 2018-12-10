module.exports = function (req, res) {
    const col = req.app.get('col');
    let arr = col.find({});
    res.json(arr);
}

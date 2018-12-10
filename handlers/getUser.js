module.exports = function (req, res) {
    const col = req.app.get('col')
    let data = col.get(req.params.id)
    console.log(data, req.params.id)
    res.json(data)
}

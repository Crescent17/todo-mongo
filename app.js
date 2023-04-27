const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const itemsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
const Item = mongoose.model("Item", itemsSchema);
const computer = new Item({
    name: 'Computer'
})
const mouse = new Item({
    name: 'Mouse'
})
const keyboard = new Item({
    name: 'Keyboard'
})
const defaultItems = [computer, mouse, keyboard];
app.get("/", function (req, res) {
        Item.find().then(result => {
            if (result.length === 0) {
                Item.insertMany(defaultItems).then(response => {
                    if (response) {
                        console.log('Items were successfully added into db')
                    } else {
                        res.render("list", {listTitle: "Today", newListItems: result})
                    }
                    res.redirect("/")
                })
            } else {
                res.render("list", {listTitle: "Today", newListItems: result})
            }
        })
    }
);

app.post("/", function (req, res) {

    const item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function (req, res) {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

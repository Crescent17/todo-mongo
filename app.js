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

const listSchema = {
    name: {
        type: String,
        required: true
    },
    items: [itemsSchema]
}
const List = mongoose.model("List", listSchema)
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
                res.render("list", {listTitle: "All Items", newListItems: result})
            }
        })
    }
);

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list
    const newItem = new Item({
        name: itemName
    })
    newItem.save()
    List.findOne({name: listName}).then(list => {
        list.items.push(newItem)
        list.save()
    })
    res.redirect(`/${listName}`)
});

app.post("/delete", function (req, res) {
    Item.findByIdAndDelete(req.body.checkbox).then(result => {
        if (result) {
            console.log('The item was deleted successfully')
        } else {
            console.log('There was a problem deleting this item')
        }
        res.redirect("/")
    })
})

app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName.toLowerCase();
    List.findOne({name: customListName}).then(result => {
        if (!result) {
            const list = new List({
                name: customListName,
                items: defaultItems
            })
            list.save()
            res.redirect(`/${customListName}`)
        } else {
            res.render("list", {listTitle: customListName, newListItems: result.items})
        }
    })
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

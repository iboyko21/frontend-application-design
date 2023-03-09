const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

class TodoList {
    constructor(name, id) {
        this.name = name;
        this.items = [];
        this.id = id;
    }

    addItem(text) {
        const item = {text, status: "INCOMPLETE", id: (this.items.length + 1)};
        this.items.push(item);
        return item;
    }
    
    updateItem(id, text, status) {
        const index = this.items.findIndex(x => x.id == id);
        if (index >= 0) {
            const item = {text, status, id};
            this.items[index] = item;
            return item;
        }
        return false;
    }

    toJson() {
        return JSON.stringify({name: this.name,id: this.id, items: this.items});
    }
}

const error = (message) => {error: message};
const notFound = error("Requested item not found");

// List of Todo Lists
const lists = [new TodoList("Grocery List", 0),
                new TodoList("Weekend Chores", 1)];

lists[0].addItem("Apples");
lists[0].addItem("Eggs");
lists[1].addItem("Laundry");
lists[1].addItem("Water Plants");
lists[0].updateItem(1, "Apples", "COMPLETE");
// const lists = [];

app.use(express.json());
app.use(cors());

app.get('/lists', (req, res) => {
    res.send(lists.map((l, i) =>  {return {id: i, name: l.name}}) );
})

app.post('/lists', (req, res) => {
    const data = req.body;
    if (data.name) {
        const newList = new TodoList(data.name, lists.length);
        lists.push(newList);
        res.send(newList);
    } else {
        res.status(400);
        res.send(error("'name' is required"))
    }
})

app.get('/lists/:id', (req, res) => {
    const listId = req.params.id;
    if (listId < 0 || listId > lists.length-1) {
        res.status(404).send(notFound);
    } else {
        res.send(lists[listId].toJson());
    }
})

app.post('/lists/:id/items', (req, res) => {
    const listId = req.params.id;
    if (listId < 0 || listId > lists.length-1) {
        res.status(404).send(notFound);
    } else {
        const data = req.body;
        if (! data.text) {
            res.status(400).send(error( "text is required"));
        } else {
            const item = lists[listId].addItem(data.text);
            res.send(item);
        }
    }
})

app.post('/lists/:id/items/:itemId', (req, res) => {
    const listId = Number(req.params.id);
    const itemId = Number(req.params.itemId);

    if (listId < 0 || listId > lists.length-1) {
        res.status(404).send(notFound);
    } else if (itemId < 0 || itemId > lists[listId].items.length) {
        res.status(404).send(notFound);
    } else {
        const data = req.body;
        if (! (data.text) ) {
            res.status(400).send(error( "'text' is required"))
        } else if (! data.status.match(/INOMPLETE|INPROGRESS|COMPLETE/)) {
            res.status(400).send(error("'status' must be INCOMPLETE, INPROGRESS, or COMPLETE"))
        } else {
            const item = lists[listId].updateItem(itemId, data.text, data.status);
            if (item) {
                res.send(item);
            } else {
                res.status(500);
                res.send(error("Unable to update item"));
            }
        }

    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
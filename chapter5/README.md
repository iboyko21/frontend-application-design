# Chapter 5: Interafcing with the Backend

Nearly every front end application interfaces with one or more remote servers, often referred to 
as a backend.  The frontend and the backend traditionally are two completely separate applications, and share no common code.  They may be developed by different teams, or entirely different organizations.  A system engineer would refer to the interface between the frontend and the backend as an *external interface*.  

External Interfaces require attention and active management, and generally should not be trusted.  An external interface can express unexpected or unpredictable behaviors and may change 
without warning.  

While not strictly necessary, it is a safe practice to engineer an adapter or bridge at the external interface that performs data validation, error handling, and has a comprehensive unit test suite.  The adapter translates data arriving over the external interface into a trusted internal data model that may be utilized throughout the application without fear of unexpected changes.  If the external interface does change unexpectedly, the adapter prevents those changes from infecting the frontend and causing unintended side effects.

For this tutorial, we will include such an adapter so the student understands how these adapters are built.  Whether or not any individual project chooses to include an adapter layer depends on the priorities and concerns of the project management. 

This chapter will flesh out the code in the `api` and `models` directories, and  will use a test driven development approach.  

Run `git checkout chapter5` now and we will get started.

## Pre-Reading
* [Typescript Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
* [Typescript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
* [nock](https://github.com/nock/nock)
* [axios](https://axios-http.com/)
* [`static` methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)

## Instructions

### Study the Backend Service

The `chapter5` branch includes a project named `todo-server`.  This is a simple server written in express that our frontend will communicate with via a REST api.  

The `todo-server` has two types of data, a list and an item.  
A *List* has the following properties:

| property | type | description |
| -------- | ---- | ----------- |
| id   | number | Unique id of list |
| name | string | The list name |
| items | array | Array of items |

An *Item* has the following properties:

| property | type | description |
| -------- | ---- | ----------- |
| id   | number | Unique id of item |
| text | string | the text to display | 
| status | string | One of COMPLETE, INPROGRESS, INCOMPLETE |

Any errors will be returned as an Error object

| property | type | description |
| -------- | ---- | ----------- |
| error | string | the error message |

The server defines the following endpoints. 

#### Get Lists
Retrieve all todo lists managed by the server

* **Method**: GET
* **Path**: `/lists`
* **Example Response** 
```json
[{"name": "list1", "id": 1}, {"name": "list2", "id": 2}]
```

#### Retrieve a List
Retrieve a specific todo list and its items

* **Method**: GET
* **Path**: `/lists/:listId`
* **Example Response**
```json
{"name": "list1", "id": 1, "items": [
    {"text": "Item number 1", "id": 1, "status": "INCOMPLETE"}, 
    {"text": "Item number 2", "id": 2, "status": "COMPLETE"}
]}
```

#### Create a list
Add a new list to the server

* **Method**: POST
* **Path**; `/lists`
* **Example Request**: 
```json
{"name": "Grocery List"}
```
* **Example Response**:
```json
{"name": "Grocery List", "id": 4, "items": []}
```

#### Add an item
Add a new item to a list 

* **Method**: POST
* **Path**: `/lists/:listId/items`
* **Example Request**:
```json
{"text": "Fruit"}
```
* **Example Response**:
```json
{"text": "Fruit", "id": 5, "status": "INCOMPLETE"}
```

#### Update an item

* **Method**: POST
* **Path**: `/lists/:listId/items/:itemId
* **Example Request**:
```json
{"text": "Fruit", "status": "COMPLETE"}
```
* **Example Response**:
```json
{"text": "Fruit", "id": 5, "status": "COMPLETE"}
```

Install the the node dependencies by running `npm install`, then
start the server by running `node index.js` and try out a few of the endpoints using your browser.

* http://127.0.0.1:3000/lists 
* http://127.0.0.1:3000/lists/0

The todo-server backend is preloaded with a grocery list with two items.

### Create the Data Models


This project will utilize a Model-View design pattern.  The *Models* are containers for data 
and have no dependencies on the DOM or any visual representation.  Separating the code 
that is concerned with visual representation from the code that is concerned with data 
management makes the application simpler to read and more adaptable to change.

We will use Typscript for the data models because it is critically important to make 
sure each element of data is precisely what we expect it to be.  Unexpected `undefined` 
values or `nulls`, or using a `string` instead of `Date` can have a disastrous impact
on the application.

Create two files in the `react-todo` application: `src/models/TodoList.ts` and `src/models/TodoItem.ts`

Begin by defining a class `TodoItem`  as below.

```ts
class TodoItem {

    id : number | undefined;
    complete : boolean = false; 
    text : string = ""; 

    constructor({id, complete, text} : {id? : number, complete? : boolean, text? : string} = {}) {
        if (id) this.id = id;
        if (complete) this.complete = complete;
        if (text) this.text = text;
    }

    toggleComplete() {
        this.complete = !this.complete;
    }
}

export default TodoItem;
```

The `TodoItem` class has three instance properties: `id`, `complete`, and `text`. 
`id` can potentially be undefined because this value is assigned by the backend.  When the frontend creates an item prior to sending it to the backend, then the `id` is undefined. The other two properties also have default *falsy* values.  

The signature of the constructor appears a bit intimidating, but it makes sense when it breaks down into three parts - (*argument* : *type declaration* = *default value*).

The argument uses destructuring assignment to assign values to three variables: `id`, `complete`, and `text`.  The type declaration specifies the type of each property, and any property with a question mark is permitted to be undefined.  Finally the default value is 
an empty object, so each property will assume the default value declared above the constructor.  

This pattern for defining a `TodoItem` allows the object to be initialized with no arguments, resulting in default values, a 
generic object, or with another instance of a `TodoItem`.  

We need to prove that the object can be initialized by writing some unit tests.  

Write unit tests for the following scenarios: 
* A TodoItem should initialize with default values
  * expect `item.complete` to be `false`
  * expect `item.text` to be equal to `""`
* A TodoItem should initialize with specified values
  * expect `item.complete` to be `true`
  * expect `item.text` to be equal to `Do Laundry`
  * expect `item.id` to be 5
* A TodoItem should initialize with another TodoItem
  * expect `item.complete` to equal `otherItem.complete`
  * expect `item.text` to equal `otherItem.text`
  * expect `item.id` to equal `otherItem.id`
  
The unit tests will look something like the following: 

```js
import {describe, it, expect} from 'vitest';
import TodoItem from './TodoItem';

describe("A TodoItem", () => {
    it("should initialize with default values", () => {
        const item = new TodoItem();
        expect(item.complete).toBe(false);
        expect(item.text).toEqual("");
    })

    it("should initialize with specified values", () => {
        const complete = true; 
        const text = "Eat dinner";
        const id = 5;
        const item = new TodoItem({id, complete, text});
        expect(item.complete).toBe(complete);
        expect(item.text).toEqual(text);
        expect(item.id).toEqual(id);
    })

    it("should initialize with another TodoItem", () => {
        const complete = true; 
        const text = "Eat dinner";
        const id = 2;
        const item = new TodoItem({id, complete, text});
        const item1 = new TodoItem(item);

        expect(item1.complete).toEqual(item.complete);
        expect(item1.text).toEqual(item.text);
        expect(item1.id).toEqual(item.id);
    })

})
```

Now create a data model for `TodoList` using the same pattern.  `TodoList` also has three properties: a `id` of type `number`, a `name` of type `string`, and `items` of type `TodoItem[]`.  

Write a similar unit test for `TodoList`.  


### Define the Todo API

Once the models are defined, it is time to define the object that will fetch data from the 
backend and return the data models. 

It is convenient to localize all the code that communicates with a backend in a single object.

Create a new file `api/TodoApi.ts` that exports an object named `TodoApi`. It will need to import `TodoItem` and `TodoList`.
Also, define a constant `BASE_API_URL` equal to `http://127.0.0.1:3000` which is the server and port where the backend server is running.

```ts
import TodoItem from '../models/TodoItem';
import TodoList from '../models/TodoList';

export const BASE_API_URL = "http://127.0.0.1:3000";

const TodoApi = {}

export default TodoApi
```

### Write a Test for TodoApi.getItem()

The first endpoint we will tackle is the endpoint to fetch a single list with items.

The `TodoApi` object will define a method `getList` that take  `listId` as an argument
and return a `TodoList` object.  

Setup a unit test `api/TodoApi.test.ts` file with a test *"The TodoApi getList function should return a TodoList"*.  The second argument to `it` (the test function) will need to be declared as `async` because `TodoApi` is going to use asynchronous functions when fetching data from the server.  

There is a useful library named `nock` which we will use to emulate the server.  Install nock with the command `npm add -D nock` 

Import and configure `nock` in `TodoApi.test.ts` with the following code: 

```js
import TodoApi, {API_BASE_URL} from './TodoApi';
import nock from 'nock';

const scope = nock(API_BASE_URL).defaultReplyHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true' 
  });
```
The variable `scope` is an instance of nock that is configured to capture requests to `API_BASE_URL`.  The default reply headers are required because the server is emulating an API server which includes specific headers to permit cross origin resource sharing[^1].

Now, in the body of the test, mock the server response as follows:

```js
const reply = {id: 1, name: "Test List 1", items: []};
scope.get("/lists/1").reply(200, reply);
```
This command instructs nocks to send the `reply` with a http status code of 200 when it receives a request at `http://127.0.0.1:3000/lists/1`

Finally create an assertion that the return value from `TodoApi.getList(1)` has the expected id and the name, and that it is an instance of a `TodoList` as follows:

```js
const list : TodoList = await TodoApi.getList(1);
expect(list).toBeInstanceOf(TodoList);
expect(list.name).toEqual(reply.name);
expect(list.id).toEqual(reply.id);
expect(list.items).toEqual(reply.items);
```

Run `npm run test` and the unit test will fail.  This is because we did not define `TodoApi.getList`.  This is how **Test Driven Development** works.  Write the test first, and then write the code to pass the test.   

### Install Axios

Unfortunately, `fetch` is not defined in all but the most recent **node** versions.  Instead of upgrading node, install axios using `npm add axios`.   

Now create an axios instance in `TodoApi.ts` with the base url defined. 

```ts
const axiosInstance = axios.create({baseURL: API_BASE_URL})
```

### Write TodoApi.getList()

Create a property in the `TodoApi` object named `getList` that is a function that takes a number representing the list id and returns a `Promise` which resolves to a `TodoList`. In Typescript this is done by using the format `Promise<TodoApi>`, where `<T>` is called a *generic* and the `T` is replaced by the type of object the promise returns.    

```js
    getList: async (listId : number) : Promise<TodoList> => {
       const response = await axiosInstance.get(`/lists/${listId}`);
       return response.data;
    }
```

Start the vitest runner with `npm run test`.  The test should fail with the following error:
> `AssertionError: expected { name: 'list 1', id: 1, items: [] } to be an instance of TodoList`

While the data are correct, the object is not an instance of a TodoList.  

Change `TodoApi.getList` to return a new instance of a TodoList using the `data` from the axios response.  

```js
    getList: async (listId : number) : Promise<TodoList> => {
       const response = await axiosInstance.get(`/lists/${listId}`);
       return new TodoList(response.data);
    }
```

The test should pass now.  


### Add additional unit tests for TodoApi.getList() 

The existing unit test successfully exercises the conversion of data into a TodoList, 
but the test does not exercise the ability to create a list with items.  

Create another test for *"The TodoApi getList function should return a TodoList with TodoItem objects"*

This test will be very similar, but the reply should include TodoItem data as [defined above](#study-the-backend-service).  Use the following data for the reply: 

```js
const reply = {"name": "list1", "id": 0, "items": [
        {"text": "Item number 1", "id": 0, "status": "INCOMPLETE"}, 
        {"text": "Item number 2", "id": 1, "status": "COMPLETE"}
    ]}
```

Within the unit test call `TodoApi.getList(0)` and then assert:

```js
    /* Check that the converted items length is the same length as the reply */ 
    expect(list.items.length).toEqual(reply.items.length);
    
    /* Loop over items and validate each item */
    for (let i = 0; i < list.items.length; i++) {
        expect(list.items[i]).toBeInstanceOf(TodoItem);
        expect(list.items[i].id).toEqual(reply.items[i].id);
        expect(list.items[i].text).toEqual(reply.items[i].text);
        if (reply.items[i].status == "COMPLETE") {
            expect(list.items[i].complete).toBe(true);
        } else {
            expect(list.items[i].complete).toBe(false);
        }
    }
```

Not only does this assert that each item in the reply is a `TodoItem` object, it checks each property for equality.  

There are a few curve balls in here.  First, recall that '0' is a falsy value, so the constructor must explicitly check that the`id` property of TodoList and TodoItem is not `null`. Second, the server returns a `status` string, but the `TodoItem` defines a `complete` property that is a boolean.  It is not uncommon for the frontend application to perform small transformations on data from the *external interface* to meet the needs of the application. 

This test will fail because `items` is not an array of `TodoItem` objects.  In order for it to pass, there must be a method to convert data returned by the server into a `TodoItem`.  

### Add `static fromServerObject()` functions to `TodoList` and `TodoItem`.

Create a new file in the `api` directory called `TodoApi.d.ts`.  A file with the extension `.d.ts` is a typescript type declaration file.  It defines object interfaces, but not their implementations.  

Create declarations for the external data model provided by the server.  The declarations must match the data model described by the server documentation.  Make it clear these are external declarations by prefacing the names with `EXT`

Add the following interface declarations inside `TodoApi.d.ts`.

```ts
export interface EXT_TodoItem {
    id? : number;  // The payload to update item does not require an id
    text : string;    
    status : "INCOMPLETE" | "INPROGRESS" | "COMPLETE";
}

export interface EXT_TodoList {
    id : number; 
    name : string;
    items? : EXT_TodoItem[]; // The response to /lists only includes name
}
```

Import the `EXT_TodoItem` typescript interface declaration into `TodoItem`, and add the following static function that takes an object of type `EXT_TodoItem` and returns a new `TodoItem`.  This function will need to convert the `status` into a `complete` boolean.  

A static function is a function that is only available on the class object itself, not on an instance of the class.  Static functions are typically used sparingly and only when every instance of a class must be impacted, or to initialize instances in special situations as here. 

```js
static fromServerObject({id, text, status} : EXT_TodoItem ) {
    return new TodoItem ({id, text, complete: status == "COMPLETE"});
}
```

Even though this function is very simple, and the conversion seems obvious, it is best practice to add unit tests to verify the conversion.  Frequently small errors in these simple functions are overlooked, and a unit test is a perfect way to test the code prior to commiting it. The new `TodoItem` tests should read *"A TodoItem should convert a COMPLETE server object into a TodoItem"* and
another unit test for *"A TodoItem hould convert an INCOMPLETE server object into a TodoItem"*.  For example:

```js
it("should convert a COMPLETE server object into a TodoItem", () => {
    
    const serverObject = {
        id: 2,
        status: "COMPLETE",
        text: "Honey Badger"
    } as EXT_TodoItem;

    const item = TodoItem.fromServerObject(serverObject);
    expect(item.id).toEqual(serverObject.id)
    expect(item.text).toEqual(serverObject.text);
    expect(item.complete).toBe(true);

})
```

A `TodoList` likewise needs a `static fromServerObject()` method that converts an `EXT_TodoList` into a `TodoList`.  This is because a `TodoList` has an array of `TodoItem` objects.  

Import the `EXT_TodoList` typescript interface declaration into `TodoList` and add a static `fromServerObject` function that maps the `items` array into a list of `TodoItem` objects as follows:

```js
static fromServerObject({id, name, items} : EXT_TodoList) : TodoList {
    return new TodoList({id, name, items: items.map(i => TodoItem.fromServerObject(i))})
}
```

Finally, in `TodoApi.ts`, instead of returning a `TodoList` initialized with `new`, change `getList()` to return `TodoList.fromServerObject(response.data)`

At this point the tests will pass because the `TodoItem` has been properly converted from the data delivered by the server into a `TodoItem` that is tested and verified to work in our application.

### Adding Items

Adding new TodoItems requires a `post` to the `/lists/:listId/items` endpoint.  Create a new unit test *"The TodoApi addItem function should call the addItem endopint and return a TodoItem"*. 

This unit test will mock the server using the following code:

```js
const newItemRequest = {text: "New Item"}
const newItemResponse = {text: "New Item", id: 1,  status: "INCOMPLETE"}
        
scope.post("/lists/1/items", newItemRequest).reply(201, newItemResponse);
```

We assume `TodoApi.addItem` function exists, and that it takes a string with the id of the 
list and the text of the new item as an argument, and returns the new TodoItem.  

```js
const response = await TodoApi.addItem(1, "New Item");

expect(response).toBeInstanceOf(TodoItem);
expect(response.id).toEqual(newItemResponse.id);
expect(response.text).toEqual(newItemResponse.text);
expect(response.complete).toBe(false);
```

This test will not pass until the `addItem` function is defined.  So define it in `TodoApi` now. 

```js
    addItem: async (listId: number, itemText: string) : Promise<TodoItem> => {
        const response = await axiosInstance.post(`/lists/${listId}/items`, {text: itemText});
        return TodoItem.fromServerObject(response.data);
    }
```

At this point the test should pass, and we can fetch a list and add an item.  

### Updating an Item

Updating an item is similar to adding an item, however there is one important difference.  The `addItem` function crafted a payload that contained just the text of the item to create, because the default behavior is for the `status` of a new item to be INCOMPLETE.  

When the application wants to update the status of an item, it needs to convert the internal boolean `complete` into a string `status` when building the payload.  

Add an instance method to `TodoItem` called `toServerObject()`.  This method must pass the following unit tests:

* *The toServerObject() method should convert a complete item to a valid EXT_TodoItem.*
* *the toServerObject() method should convert an incomplete item to a valid EXT_TodoItem*


Now add a new function to `TodoApi` called `updateItem` that takes a `listId` and a `TodoItem` as an argument.  It converts the item by calling `toServerObject()` and then posts the payload to `/lists/${listId}/items/${item.id}`.  In this case, an `id` property is required, so it is wise to check for its existsence and raise an error if it does not exist.  Unit test expectations can also test for promise rejections and errors[^2]. A unit test suite may then read as follows:

* The TodoApi updateItem function should
    * raise an error if the TodoItem does not have an id
    * should call the updateItem endpoint and return a TodoItem

```js
describe("The TodoApi updateItem function", () => {
    
    it("should raise an error if the TodoItem does not have an id", async () => {
        const updateItem = async () => TodoApi.updateItem(1 , new TodoItem({text: "No Id"}))
        await expect(updateItem).rejects.toThrowError()
    })

    it("should call the updateItem endpoint and return a TodoItem", async () => {
        const id = 1;
        const text = "My Item";
        const status = "COMPLETE"
        const updateItemRequest = {id, text, status}
        const updateItemResponse = {id, text, status}

        scope.post("/lists/1/items/1", updateItemRequest).reply(200, updateItemResponse);

        const response = await TodoApi.updateItem(1, new TodoItem({id, text, complete: true}))
        expect(response).toBeInstanceOf(TodoItem);
    })
})
```

### On Your Own

Commit your code, then on your own create tests and implementations for 

* `TodoApi.getAllLists()`
* `TodoApi.addList()`

Compare your implementation with the  `chapter5-solution` branch.

## Summary

In this chapter we introduced:

* Unit Test Suites
* Mocking external APIs with nock
* Making API calls with Axios
* Writing Data Models to provide an adapter layer at the external interface
* Converting to and from external interface data representations

This was perhaps the most complex and difficult chapter in the course, but this chapter reflects true software engineering better than any other chapter.  

When writing code that sits at the interface of your system it is absolutely critical to examine every assumption and test every corner case.  Use all the tools at your disposal to ensure every piece of data and every method has a well defined behavior.  


## References

[^1]: [Cross Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

[^2]: https://vitest.dev/api/#rejects

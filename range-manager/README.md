# RangeManager

A `RangeManager` is a custom application designed for managing ranges within a *Google Sheets* spreadsheet. 
It allows you to perform various operations such as *updating*, *deleting*, *appending*, and *filtering* data within specified ranges. 


## Documentation

### constructor(options)
Creates a new instance of the RangeManager.
* `options (Object, optional)`: Initialization options.
  * `sheet (string, optional)`: The name of the sheet to be managed.
* Throws an Error if the specified sheet is not found.

```JavaScript
const manager = new RangeManager({ sheet: 'Sheet1' });
```

### where(options)

Filters data based on specified columns and values.

* `options (Object)`: Filtering options.
  * `column (string)`: The name of the column to filter.
  * `value (string|Object)`: The value to search for in the column.
* Returns the current instance of `RangeManager` to chain new methods like `update`, `fetch`, `deleteRows`, etc...
* Throws an Error if the specified columns are not found.

```JavaScript
const manager = new RangeManager({ sheet: 'People' }).where({name: 'John Doe'});
```

You can also use a different set of filters to use with `where()` method.
Here is alphabetically ordered list of `where` filters:

#### between
* Usage: `{ column: { between: [value1, value2] } }`
* Filters values in the column that are within the specified range (including value1 and value2).
* Returns: All rows with values in the column within the range.

```JavaScript
new RangeManager({sheet: 'Users'}).where({age: {between: [18, 65]}})
// Filter a list of Users with ages between 18 and 65
```






  


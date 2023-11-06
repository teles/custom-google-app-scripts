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

#### deepEqual
* Usage: `{ column: { deepEqual: value } }`
* Filters values in the column that are strictly equal to value (same type and value).
* Returns: All rows with values in the column that are strictly equal to value.

```JavaScript
new RangeManager({ sheet: 'Products' }).where({ category: { deepEqual: 'Electronics' } });
// Filter products in the 'Electronics' category
```

#### equal (Implicit vs. Explicit)
> Implicit Usage: `{ column: value }`
* Filters values in the column that are equal to `value`. This comparison checks if the values are the same, allowing for implicit type conversion, which means it may treat different data types as equal.
* Returns: All rows with values in the column that are equal to value.

```JavaScript
new RangeManager({ sheet: 'Inventory' }).where({ quantity: 0  });
// Filter items with zero quantity in the inventory
```

> Explicit Usage: `{ column: { equal: value } }`
* Filters values in the column that are equal to value. This comparison checks if the values are the same, considering both value and data type.
* Returns: All rows with values in the column that are equal to value.

```JavaScript
new RangeManager({ sheet: 'Inventory' }).where({ quantity: { equal: 0 } });
// Filter items with zero quantity in the inventory
```

#### excludes
* Usage: `{ column: { excludes: [value1, value2, valueN] } }`
* Filters values in the column that are not in the specified list.
* Returns: All rows with values in the column that are not in the list.

```JavaScript
new RangeManager({ sheet: 'Products' }).where({ status: { excludes: ['Out of stock', 'Discontinued'] } });
// Filter products not marked as 'Out of stock' or 'Discontinued'
```

#### gte
* Usage: `{ column: { gte: value } }`
* Filters values in the column that are greater than or equal to value.
* Returns: All rows with values in the column greater than or equal to value.

```JavaScript
new RangeManager({ sheet: 'Sales' }).where({ revenue: { gte: 1000 } });
// Filter sales with revenue greater than or equal to 1000
```

#### gt
* Usage: `{ column: { gt: value } }`
* Filters values in the column that are greater than value.
* Returns: All rows with values in the column greater than value.

```JavaScript
new RangeManager({ sheet: 'Orders' }).where({ orderTotal: { gt: 50 } });
// Filter orders with a total greater than 50
```

#### includes

* Usage: { column: { includes: [value1, value2, valueN] } }
* Filters values in the column that are in the specified list.
* Returns: All rows with values in the column that are in the list.

```JavaScript
new RangeManager({ sheet: 'Inventory' }).where({ productType: { includes: ['Laptop', 'Tablet'] } });
// Filter products with the type 'Laptop' or 'Tablet'
```

#### lt
* Usage: { column: { lt: value } }
* Filters values in the column that are less than value.
* Returns: All rows with values in the column less than value.

```JavaScript
new RangeManager({ sheet: 'Expenses' }).where({ amount: { lt: 100 } });
// Filter expenses with an amount less than 100
```

#### lte
* Usage: { column: { lte: value } }
* Filters values in the column that are less than or equal to value.
* Returns: All rows with values in the column less than or equal to value.


```JavaScript
new RangeManager({ sheet: 'Prices' }).where({ price: { lte: 20 } });
// Filter products with a price less than or equal to 20
```

#### match
* Usage: `{ column: { match: /pattern/ } }`
* Filters values in the column that match the specified regular expression.
* Returns: All rows with values in the column that match the regular expression.

```JavaScript
new RangeManager({ sheet: 'Texts' }).where({ content: { match: /important keyword/i } });
// Filter texts containing the 'important keyword' case-insensitively
```

#### matchAny

* Usage: `{ column: { matchAny: [/pattern1, /pattern2/] } }`
* Filters values in the column that match at least one of the specified regular expressions.
* Returns: All rows with values in the column that match at least one of the regular expressions.

```JavaScript
new RangeManager({ sheet: 'Messages' }).where({ text: { matchAny: [/hello/i, /goodbye/i] } });
// Filter messages containing either 'hello' or 'goodbye' case-insensitively
```

### Combining Filters using `where`

You can combine multiple filters to narrow down your data selection even further. When using the where method, you can provide multiple filter criteria within the same call.

Example:

```JavaScript
const manager = new RangeManager({ sheet: 'Sales' });

// Combine multiple filters using logical AND
manager.where({ product: 'Laptop', price: { between: [500, 1000] }});

// Combine filters to find products that are either in stock or have a high rating
manager.where({ stock: { gt: 0 }, rating: { gte: 4.5 } });
```

By combining filters, you can create complex queries to extract the specific data you need from your spreadsheet. The filters are applied in a logical AND fashion, meaning all filter criteria must be met for a row to be included in the result.

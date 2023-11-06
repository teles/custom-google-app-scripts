# RangeManager

A `RangeManager` is a custom application designed for managing ranges within a *Google Sheets* spreadsheet. 
It allows you to perform various operations such as *updating*, *deleting*, *appending*, and *filtering* data within specified ranges. 

## Table of contents
- [RangeManager](#rangemanager)
  * [Documentation](#documentation)
    + [constructor(options)](#constructor-options-)
    + [where(options)](#where-options-)
      - [between](#between)
      - [deepEqual](#deepequal)
      - [equal (Implicit vs. Explicit)](#equal--implicit-vs-explicit-)
      - [excludes](#excludes)
      - [gte](#gte)
      - [gt](#gt)
      - [includes](#includes)
      - [lt](#lt)
      - [lte](#lte)
      - [match](#match)
      - [matchAny](#matchany)
    + [Combining Filters using `where`](#combining-filters-using--where-)
  * [update(data)](#update-data-)
  * [fetch(colNames)](#fetch-colnames-)

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

// Combine filters to find products that are either in stock AND have a high rating
manager.where({ stock: { gt: 0 }, rating: { gte: 4.5 } });
```

By combining filters, you can create complex queries to extract the specific data you need from your spreadsheet. The filters are applied in a logical AND fashion, meaning all filter criteria must be met for a row to be included in the result.

## update(data)

Updates the data in the specified ranges with the provided data.

* data (Object, optional): The data to update the ranges.
* Returns the current instance of `RangeManager` to support chained calls.

Consider a sample spreadsheet representing inventory:

| Product    | Quantity | Price | Status    |
|------------|----------|-------|-----------|
| Laptop     | 5        | 800   | In Stock  |
| Smartphone | 10       | 600   | In Stock  |
| Tablet     | 0        | 300   | Out Stock |
| Camera     | 2        | 1200  | In Stock  |

Now, let's apply the where method to select all items with a quantity greater than 0 and then update them with a new status:

```JavaScript
const manager = new RangeManager({ sheet: 'Inventory' });

// Apply a filter to select items with quantity greater than 0
manager.where({
  Quantity: { gt: 0 }
});

// Define the data to update
const updateData = {
  Status: 'In Stock (Updated)'
};

// Update the selected records with the new data
manager.update(updateData);
```

After applying the where method, we have selected the following records:

| Product    | Quantity | Price | Status              |
|------------|----------|-------|---------------------|
| Laptop     | 5        | 800   | In Stock (Updated) |
| Smartphone | 10       | 600   | In Stock (Updated) |
| Tablet     | 0        | 300   | Out Stock           |
| Camera     | 2        | 1200  | In Stock (Updated) |


After applying the where method to select items with a quantity greater than 0, we can update the status of these records with the provided data. In this example, the status of selected items has been updated to "In Stock (Updated)" using the update method.

This demonstrates how to use the update method in conjunction with the where method to modify data within specific ranges, making it a powerful tool for managing and updating spreadsheet information.

## fetch(colNames)

Fetches the data from the specified ranges and returns it as an array of objects.

* `colNames (Array, optional)`: An array of column names to include in the fetched data. If not specified, it will include all columns.
* Returns an array of objects representing the fetched data.

Example:
Consider the following sample spreadsheet:

| Product    | Quantity | Price | Status    |
|------------|----------|-------|-----------|
| Laptop     | 5        | 800   | In Stock  |
| Smartphone | 10       | 600   | In Stock  |
| Tablet     | 0        | 300   | Out Stock |
| Camera     | 2        | 1200  | In Stock  |

```JavaScript
const manager = new RangeManager({ sheet: 'Inventory' });

// Apply a filter to select items with a quantity greater than 0
manager.where({
  Quantity: { gt: 0 }
});

// Fetch data for the selected items, including specific columns
const fetchedData = manager.fetch(['Product', 'Quantity', 'Status']);
```

The fetch method, in this example, selects items with a quantity greater than 0 using the where method. We then use fetch to retrieve data for the selected items, including only the columns 'Product', 'Quantity', and 'Status'. The fetched data is returned as an array of objects.

Output object:

```JavaScript
[
  { Product: 'Laptop', Quantity: 5, Status: 'In Stock' },
  { Product: 'Smartphone', Quantity: 10, Status: 'In Stock' },
  { Product: 'Camera', Quantity: 2, Status: 'In Stock' }
]
```

The `fetch` method allows you to extract specific data from your spreadsheet, and the output is an array of objects where each object represents a row of data. You can choose which columns to include in the output based on your requirements.


class RangeNotation {
    constructor(options = {}) {
      this.range = [
        parseInt(options.row) || 1,
        parseInt(options.column) || 1,
        parseInt(options.numRows) || 1,
        parseInt(options.numColumns) || 1
      ]
    }
    get row() {
      return this.range[0];
    }
  }
  /**
   * Class for managing ranges in a Google Sheets spreadsheet.
   * @class
   */
  class RangeManager {
    /**
     * Creates a new instance of RangeManager.
     * @constructor
     * @param {Object} [options] - Initialization options.
     * @param {string} [options.sheet] - The name of the sheet to be managed.
     * @throws {Error} Throws an error if the specified sheet is not found.
     */
    constructor(options = {}) {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      this.sheet = spreadsheet.getSheetByName(options.sheet);
      if (!this.sheet) {
        throw new Error(`Sheet ${options.sheet} not found`);
      }
      this.ranges = [];
      this.whereOptions = null;
      this.configs = {
        headerRowNumber: 1,
        firstRowNumber: 2,
        firstColumnNumber: 1,
        lastColumnNumber: this.sheet.getLastColumn(),
        offset: 1,      
      }
    }
  
    /**
     * Gets the headers from the spreadsheet's first row.
     * @type {Object}
     * @readonly
     */
    get headers() {
      const table = this.sheet.getRange(
        this.configs.headerRowNumber, 
        this.configs.firstColumnNumber,
        this.configs.offset,
        this.configs.lastColumnNumber
      ).getValues()[0]
  
      return table.reduce((headers, item, index) => {
        headers[index + 1] = item;
        return headers;
      }, {});
    }
  
    /**
     * Serializes a row of data using the provided headers and current values.
     * @param {Object} headers - The headers object.
     * @param {Object} data - The data to be serialized.
     * @param {Array} currentValues - The current values in the row.
     * @returns {Array} The serialized row.
     */
    static serializeRow(headers, data, currentValues = []) {
      return Object.entries(headers).map(([index, header]) => {
        return data[header] || currentValues[index - 1] || '';
      });
    }
  
    /**
     * Deserializes a row of data using the provided headers and current values.
     * @param {Object} headers - The headers object.
     * @param {Array} data - The data to be deserialized.
     * @param {Array} currentValues - The current values in the row.
     * @param {Array} colNames - The filtered list of column names.
     * @returns {Object} The deserialized data.
     */
    static deserializeRow(headers, data, currentValues = [], colNames = []) {
      const invalidCols = colNames.filter(colName => Object.values(headers).includes(colName) === false);    
  
      if (invalidCols.length > 0) {
        throw Error(`[ERROR] Invalid col name(s) found: ${invalidCols.join(',')}`);
      }
      colNames = colNames.length === 0 ? Object.values(headers) : colNames;
      return Object.entries(headers).reduce((total, entry) => {
        const [index, colName] = entry;
        if(colNames.includes(colName)) {
          total[colName] = data[colName] || currentValues[parseInt(index) - 1];
        }      
        return total;
      }, {})
    }
  
    /**
     * Updates the data in the specified ranges with the provided data.
     * @param {Object} data - The data to update the ranges.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    update(data = {}) {
      if(this.ranges.length > 0) {
        this.ranges.map(notation => notation.range).forEach(notation => {
          const range = this.sheet.getRange(...notation)
          const values = range.getValues()[0];
          const deserialized = RangeManager.deserializeRow(this.headers, data, values);
          const serialized = RangeManager.serializeRow(this.headers, deserialized);
          range.setValues([serialized]);
        })
      }
      return this;
    }
  
    /**
     * Deletes the rows corresponding to the specified ranges.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    deleteRows() {
      if(this.ranges.length > 0) {
        this.ranges.map(notation => notation.row).forEach((row, index) => {
          this.sheet.deleteRow(parseInt(row) - index)
        })
      }
      return this;
    }
  
    /**
     * Appends a new row of data to the spreadsheet.
     * @param {Object} data - The data to append to the spreadsheet.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    append(data = {}) {
      const range = this.sheet.getRange(this.sheet.getLastRow() + 1, 1, 1, this.sheet.getLastColumn());
      const values = RangeManager.serializeRow(this.headers, data);
      range.setValues([values]);
      return this;
    }
  
    /**
     * Prepends a new row of data to the beginning of the data in the sheet.
     * @param {Object} data - The data to prepend to the spreadsheet.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    prepend(data = {}) {
      const currentNumRows = this.sheet.getLastRow() - 1;
      const numColumns = this.sheet.getLastColumn();
      const currentData = this.sheet.getRange(2, 1, currentNumRows, numColumns).getValues();
      const newValues = RangeManager.serializeRow(this.headers, data);
      currentData.unshift(...[newValues]);
      this.sheet.getRange(this.configs.firstRowNumber, this.configs.firstColumnNumber, 1, numColumns).clearContent();
      this.sheet.getRange(this.configs.firstRowNumber, this.configs.firstColumnNumber, currentNumRows + 1, numColumns).setValues(currentData);
      return this;    
    }
  
    /**
     * Refreshes the ranges based on the current `whereOptions`.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    refresh() {
      this.where(this.whereOptions);
      return this;
    }
  
    /**
     * Clears the currently selected ranges and `whereOptions`.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    clear() {
      this.ranges = [];
      this.whereOptions = null;
      return this;
    }
  
    /**
     * Fetches the data from the specified ranges and returns it as an array of objects.
     * @returns {Array} An array of objects representing the fetched data.
     */
    fetch(colNames = []) {
      return this.ranges
        .map(notation => notation.range)
        .map(notation => this.sheet.getRange(...notation).getValues()[0])
        .map(values => RangeManager.deserializeRow(this.headers, {}, values, colNames))
    }
  
    /**
     * Filters data based on a specified column and value.
     * @param {Object} options - Filtering options.
     * @param {string} options.column - The name of the column to filter.
     * @param {string|Object} options.value - The value to search for in the column.
     * @throws {Error} Throws an error if the specified columns are not found.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    where(options = {}) {
      this.whereOptions = options;
      const colNames = Object.keys(options);
      const isLiteralObject = a => (!!a) && (a.constructor === Object);
      const invalidCols = colNames.filter(colName => Object.values(this.headers).includes(colName) === false);    
      Logger.log(this.headers)
      if (invalidCols.length > 0) {
        throw Error(`[ERROR] Invalid col name(s) found: ${invalidCols.join(',')}`);
      }
  
      const methods = {
        equal: (value, expected) => value == expected,
        deepEqual: (value, expected) => value === expected,
        gt: (value, expected) => value > expected,
        gte: (value, expected) => value >= expected,
        lt: (value, expected) => value < expected,
        lte: (value, expected) => value <= expected,
        includes: (value, expected) => expected.includes(value),
        excludes: (value, expected) => expected.includes(value) === false,
        between: (value, expected) => value >= Math.min(...expected) && value <= Math.max(...expected),      
        match: (value, expected) => expected.exec(value) !== null,
        matchAny: (value, expected) => expected.some(exp => exp.exec(value) !== null)
      }
  
      const cols = colNames.map((colName) => {
        const colId = Object.entries(this.headers).find(([_, header]) => header === colName)[0];
        const isObject = isLiteralObject(options[colName]);
        const methods = isObject ? Object.entries(options[colName]).reduce(function(total, item) {
          total.push({
            name: item[0],
            value: item[1]
          });
          return total;
        }, []) : [
          {
            name: 'equal',
            value: options[colName]
          }
        ]
        return {
          colId,
          methods
        }
      });
  
      const rows = cols.reduce((rows, column) => {
        return rows.filter(row => {
          const value = this.sheet.getRange(row, column.colId).getValue();
          return column.methods.every(method => {
            return methods[method.name](value, method.value);
          })        
        })
      }, Array.from({ length: this.sheet.getLastRow() }, (_, index) => index + this.configs.firstRowNumber))
      
      this.ranges = rows.map(row => {
        return new RangeNotation({
          row,
          numColumns: this.sheet.getLastColumn()
        })
      })
      
      return this;
    }
  
    /**
     * Inserts a specified number of rows at the beginning of the data in the sheet.
     * @param {Object} data - The data to be updated or prepended to the spreadsheet.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    updateOrPrepend(data = {}) {
      if(this.ranges.length > 0) {
        this.update(data);
      } else {
        this.prepend(data);
      }
      return this;
    }
  
    /**
     * Updates or appends data to the spreadsheet, depending on whether a range is already specified.
     * @param {Object} data - The data to be updated or appended to the spreadsheet.
     * @returns {RangeManager} The RangeManager instance itself to support chained calls.
     */
    updateOrAppend(data = {}) {
      if(this.ranges.length > 0) {
        this.update(data);
      } else {
        this.append(data);
      }
      return this;
    }
  }

  function WHERE(value, sheet, column, key) {
    return new RangeManager({sheet}).where({
      [column]: value
    }).fetch([key])[0][key]
  }

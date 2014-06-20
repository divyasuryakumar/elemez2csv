# elemez2csv

[![Build Status](https://secure.travis-ci.org/B2MSolutions/elemez2csv.png)](http://travis-ci.org/B2MSolutions/elemez2csv)
[![David Dependency Overview](https://david-dm.org/B2MSolutions/elemez2csv.png "David Dependency Overview")](https://david-dm.org/B2MSolutions/elemez2csv)

Use the elemez raw data endpoint to output data as CSV. The "data" field is not outputted to the CSV.

## Installation

Install this globally and you'll have access to the `elemez2csv` command anywhere on your system.

```shell
npm install -g elemez2csv
```

## Usage

```shell
elemez2csv --token <YOURTOKEN> [--types <TYPES>] [--data <ADDITIONALDATAFIELDS>]
```

Examples:
```shell
elemez2csv --token aaaabbbbcccc
elemez2csv --token aaaabbbbcccc --types battery-charging-on,battery-charging-off --data level
```

## Contributors
Pair programmed by [Roy Lines](http://roylines.co.uk) and [Ivan Bokii](https://github.com/ivanbokii).

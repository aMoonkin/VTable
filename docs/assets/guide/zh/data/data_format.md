# 数据源及格式
为了更好地展示和分析数据，我们需要了解 VTable 中表格数据的格式及其意义。接下我们将讨论 VTable 中两种表格类型的数据形式：基本表格(ListTable)数据源 和透视表格(PivotTable)数据源。

## 数据格式形式

在 VTable 中，我们需要处理的主要数据格式为 JSON 数组。例如，以下是以人的信息为例 JSON 数据：

```json
[
  {"name": "zhang_san","age": 20,"sex": "","phone": "123456789","address": "beijing haidian"},
  {"name": "li_si","age": 30,"sex": "female","phone": "23456789","address": "beijing chaoyang"},
  {"name": "wang_wu","age": 40,"sex": "male","phone": "3456789","address": "beijing fengtai"}
]
```

接下来我们将分别介绍如何将这种数据应用到基本表格和透视表中。

## 基本表格数据

在基本表格中，数据是以行为单位进行展示的，每一行含多个字段（列）。例如：姓名、年龄、性别、和地址。数据项中的每个对象将对应一行。

根据上述 JSON 数据创建一个基本表格应配置相应的 [`ListTableConstructorOptions`](../../option/ListTable#container) 配项，并将 `records` 配置为数据源。

 示例：

```javascript livedemo  template=vtable

 const option = {
    columns : [
        {
            "field": "name",
            "title": "name",
            "sort": true,
            "width":'auto',
        },
        {
            "field": "age",
            "title": "age"
        },
        {
            "field": "sex",
            "title": "sex"
        },
        {
            "field": "phone",
            "title": "phone"
        },
        {
            "field": "address",
            "title": "address"
        },
    ],
    "records":[
     {"name": "zhang_san","age": 20,"sex": "female","phone": "123456789","address": "beijing haidian"},
     {"name": "li_si","age": 30,"sex": "female","phone": "23456789","address": "beijing chaoyang"},
     {"name": "wang_wu","age": 40,"sex": "male","phone": "3456789","address": "beijing fengtai"}
    ]
}
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);

```

## 透视表数据

透视表格的主要目的是对数据进行多维度的展示和分析，在配置透视表格时，我们需要指定分组（行和列）维度以及指标维度。例如，我们可以将数据按照性别分组，并计算每个的人数和平均年龄。

其配置项为 [`PivotTableConstructorOptions`](https://visactor.io/vtable/option/PivotTable)。与基本表格类似，我们首先使用JSON 数据作为透视表格的数据源。注意：这份数据是聚合分析之后的结果数据集
```json
[
  {"age": 30,"sex": "male","city": "北京", "income": 430},
  {"age": 30,"sex": "female","city": "上海", "income": 440},
  {"age": 30,"sex ": "male","city": "深圳",  "income": 420},
  {"age": 25,"sex": "male","city": "北京", "income": 400},
  {"age": 25,"sex": "female","city": "上海", "income": 400},
  {"age": 25,"sex ": "male","city": "深圳",  "income": 380}
]
```
 示例：
``` javascript livedemo template=vtable
const option = {
  "rowTree": [
    {
      "dimensionKey": "city",
      "value": "beijing",
       "children": [
        {
          "indicatorKey": "income",
        },
       ]
    },
    {
      "dimensionKey": "city",
      "value": "shanghai",
       "children": [
        {
          "indicatorKey": "income",
        },
       ]
    },
    {
      "dimensionKey": "city",
      "value": "shenzhen",
       "children": [
        {
          "indicatorKey": "income",
        },
       ]
    }
  ],
  "columnTree": [
    {
      "dimensionKey": "sex",
      "value": "male",
      "children": [
        {
          "dimensionKey": "age",
          "value": "30"
        },
        {
          "dimensionKey": "age",
          "value": "25"
        }
      ]
    },
    {
      "dimensionKey": "sex",
      "value": "female",
      "children": [
        {
          "dimensionKey": "age",
          "value": "30"
        },
        {
          "dimensionKey": "age",
          "value": "25"
        }
      ]
    }
  ],
  "indicators": [{
    "indicatorKey": "income",
    "title": "income"
  }],
  "records": [
    { "age": 30, "sex": "male", "city": "beijing", "income": 400 },
    { "age": 30, "sex": "female", "city": "shanghai", "income": 410 },
    { "age": 30, "sex ": "female", "city": "shenzhen", "income": 420 },
    { "age": 25, "sex": "male", "city": "beijing", "income": 430 },
    { "age": 30, "sex ": "male", "city": "shenzhen", "income": 440 },
    { "age": 25, "sex": "male", "city": "shanghai", "income": 450 },
    { "age": 25, "sex": "female", "city": "shanghai", "income": 460 },
    { "age": 25, "sex ": "male", "city": "shenzhen", "income": 470 }
  ],
  defaultHeaderColWidth:100
}
const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);

```
同时records数据格式还支持按逐个单元格对应配置：
```
records:[
    [430,650,657,325,456,500],
    [300,550,557,425,406,510],
    [430,450,607,455,560,400]
]

```
使用二维数组设置records示例：

``` javascript livedemo template=vtable
const option = {
  "rowTree": [
    {
      "dimensionKey": "city",
      "value": "beijing",
       "children": [
        {
          "indicatorKey": "income",
        },
       ]
    },
    {
      "dimensionKey": "city",
      "value": "shanghai",
       "children": [
        {
          "indicatorKey": "income",
        },
       ]
    },
    {
      "dimensionKey": "city",
      "value": "shenzhen",
       "children": [
        {
          "indicatorKey": "income",
        },
       ]
    }
  ],
  "columnTree": [
    {
      "dimensionKey": "sex",
      "value": "male",
      "children": [
        {
          "dimensionKey": "age",
          "value": "30"
        },
        {
          "dimensionKey": "age",
          "value": "25"
        }
      ]
    },
    {
      "dimensionKey": "sex",
      "value": "female",
      "children": [
        {
          "dimensionKey": "age",
          "value": "30"
        },
        {
          "dimensionKey": "age",
          "value": "25"
        }
      ]
    }
  ],
  "indicators": [{
    "indicatorKey": "income",
    "title": "income"
  }],
  records:[
    [430,650,657,325],
    [300,550,557,425],
    [430,450,607,455]
  ],
  defaultHeaderColWidth:100
}
const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);

```
## 总结

在本教程中，我们学习了如何在 VTable使用表格数据。我们首先了解了数据在表格中的意义，以及 VTable 中两种表格（基本表格和透视表格）的数据格式形式。为了帮助家更好地理解数据格式与表格的对应关系，我们分别讨论了基本表格和透视表格的对应关系。
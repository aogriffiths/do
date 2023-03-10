---
title: test
description: Ta
date: 2018-07-04
tags:
---

<table class="responsive">
<tr class="header"><th>Markdown</th><th>Result</th></tr>

<tr><td title="Markdown:" markdown="1">

```markdown 
bb
```

</td><td title="Result:" markdown="1">

b

</td></tr>

<tr><td title="Markdown:" markdown="1">

```markdown 
bb
```

</td><td title="Result:" markdown="1">

b

</td></tr>

<tr><td title="Markdown:" markdown="1">

```markdown 
bb
```

</td><td title="Result:" markdown="1">

b

</td></tr>
</table>




<style>
/* If you are seeing this your markdown render does not support custom styles. Sorry. */

table.responsive {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

table.responsive tr.header {  
  font-weight: bold;
  text-align: left;
}

table.responsive td {
  padding: 10px;
  border: 0px solid black;
}

@media screen and (prefers-color-scheme: dark) {
   tr.header + tr {
      border-top: 1px solid DimGray;
   }
   tr:not(.header) {
      border-bottom: 1px solid DimGray;
   }
   tr.header {
      border-bottom: 1px solid LightGray;
   }
}

@media screen and (prefers-color-scheme: light) {
   tr.header + tr {
      border-top: 1px solid LightGray;
   }
   tr:not(.header) {
      border-bottom: 1px solid LightGray;
   }
   tr.header {
      border-bottom: 1px solid DimGray;
   }
}


@media screen and (max-width: 767px) {
  table.responsive {
    display: block;
  }
  table.responsive tr.header {
    display: none;
  }
  table.responsive tr {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  table.responsive td {
    flex-basis: 100%;
    padding: 5px;
  }
  td::before {
    content: attr(title);
    font-weight: bold;
  }
}
</style>

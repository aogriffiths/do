---
title: Opinionated Markdown Guide
description: A cheat sheet, collection of hacks and style guide for markdown.
date: 2023-01-25
tags: guides
---

Markdown is easy and effective way to document your stuff. From README's and project docs to making a blog, like this one, markdown can do the trick.

Here's a cheat sheet, collection of hacks and style guide. It is intended to work with github (github formatted markdown) and 11ty (a static site generator). although there is more than one way to do things with markdown, this guide doesn't get in to that, it describes just one way. This makes it quick to follow, consistent an opinionated markdown guide.

Headings
--------


<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>


<div class="row"><div class="cell">

```markdown
**Title**
=========
```

</div><div class="cell">

**Title**
=========

</div></div>

<div class="row"><div class="cell">

```markdown
Heading L1
==========
```

</div><div class="cell">

Heading L1
==========

</div></div>

<div class="row"><div class="cell">

```markdown
Heading L2
----------
```

</div><div class="cell">

Heading L2
----------

</div></div>

<div class="row"><div class="cell">

```markdown
### Heading L3
```

</div><div class="cell">

### Heading L3

</div></div>

<div class="row"><div class="cell">

```markdown
#### Heading L4
```

</div><div class="cell">

#### Heading L4

</div></div>

<div class="row"><div class="cell">

```markdown
##### Heading L5
```

</div><div class="cell">

##### Heading L5

</div></div>

<div class="row"><div class="cell">

```markdown
###### Heading L6
```

</div><div class="cell">

###### Heading L6

</div></div>
</div>

### Notes

1. Do not use the `Title` or `Heading 1` format anywhere.
2. Use underlines `---` for and L2 and `###` for L3 to L6. Make the underlines the same length as the heading.
3. Alwsy place a space after `#`.
3. Always have a blank line before and after above a heading.


> ⚠️ **Warning:**  `===` with jekyll minima results in a `h1` that is smaller than a `h2`. See [here](https://github.com/jekyll/minima/issues/113).

> ℹ️ **Info:** If you never plan to use jekyll you could adopt:
> 
> 1. Use underlines `===` and `---` for heading L1 and L2 and `###` for L3 to L6. Make the underlines the same length as the heading.
> 
> 2. If you want an overall title for the document, bold the first heading. (But you might not need this if you have `title:` in a front matter block)
> 
> 3. In a long markdown file don't use L1 just once, use it as many times a you need to split the content in to sections. 



Paragraph Text
--------------

<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>

<div class="row"><div class="cell">


```markdown
Use single spaces, 
and single newlines
to create a single paragraph.
```

</div><div class="cell">

Use single spaces, 
and single newlines
to create a single paragraph.


</div></div>

<div class="row"><div class="cell">

```markdown
Use a double newline to start...

A new paragraph.
```

</div><div class="cell">

Use a double newline to start...

A new paragraph.

</div></div>

<div class="row"><div class="cell">

```markdown
Double trailing  
space at the end  
of lines for  
line breaks

```

</div><div class="cell">

Double trailing  
space at the end  
of lines for  
line breaks


</div></div>

</div>



Lists
-----
<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>
<div class="row"><div class="cell"> 


```markdown
- Bulleted 
- List 
```

</div><div class="cell">

- Bulleted 
- List

</div></div>

<div class="row"><div class="cell">

```markdown
1. Ordered
2. List 
```

</div><div class="cell">

1. Ordered
2. List 

</div></div>

<div class="row"><div class="cell">

```markdown
- Parent
     - child (indented by 4)
```

</div><div class="cell">

- Parent
     - child (indented by 4)

</div></div>

<div class="row"><div class="cell">

````markdown
1. With...
     - a list
     - 1970\. escaped number + dot

2. With...
   
   a paragraph

3. With...
   ```javascript
   console.log('javascript');
   ```
````

</div><div class="cell">

1. With...
     - a list
     - 1970\. escaped number + dot

2. With...
   
   a paragraph

3. With...
   ```javascript
   console.log('javascript');
   ```

</div></div>

</div>



### Notes
 
1. Bullet using `-`

2. Number using `0.` and escape the `.` with `\.` if you need

3. Indent sublists with four spaces

4. Indent any other content with 2 spaces



Formatting
----------

<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>

<div class="row"><div class="cell">

`**bold**`                        

</div><div class="cell">

**bold**                    

</div></div>

<div class="row"><div class="cell">

`***italic***`                    

</div><div class="cell">

***italic***                

</div></div>

<div class="row"><div class="cell">

`***bold italic***`               

</div><div class="cell">

***bold italic***           

</div></div>

<div class="row"><div class="cell">

`**bold _italic_ inside**`        

</div><div class="cell">

**bold _italic_ inside**    

</div></div>

<div class="row"><div class="cell">

`~~strikethrough~~`                

</div><div class="cell">

~~strikethrough~~            

</div></div>

<div class="row"><div class="cell">

`Sub<sub>script</sub>`            

</div><div class="cell">

Sub<sub>script</sub>        

</div></div>

<div class="row"><div class="cell">

`Super<sup>script</sup>`          

</div><div class="cell">

Super<sup>script</sup>      

</div></div>


</div>


Links and Images
----------------

[A Link](#link1)

An image: ![An image](icon.png)

A linked image: [![Link 2](icon.png)](#link2)


Code
----


<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>
<div class="row"><div class="cell">

```markdown
`inline` 
``` 

</div><div>

 `inline`

</div></div>

<div class="row"><div class="cell">

```markdown
`` `inline escaped` ``
``` 


</div><div>

`` `inline escaped` ``

</div></div>

<div class="row"><div class="cell">

````markdown
```sh
# fenced
```
````

</div><div>

```sh
# fenced
```

</div></div>

<div class="row"><div class="cell">

`````markdown
````markdown
```sh
# fenced escaped
```
````
`````

</div><div>


````markdown
```sh
# fenced escaped
```
````

</div></div>

</div>



Tables
------

<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>

<div class="row"><div class="cell">

```markdown
|       |100%  |Markdown|Table  |
|-------|:-----|:------:|------:|
|Row1   |Left  |Center  |Right  |
|Row2   |A     |B       |C      |
```

</div><div class="cell">

|       |100%  |Markdown|Table  |
|-------|:-----|:------:|------:|
|Row1   |Left  |Center  |Right  |
|Row2   |A     |B       |C      |

</div></div>

<div class="row"><div class="cell">

```markdown
<table>
<tr><th> Multiline markdown </th><th> in cells </th></tr>
<tr><td markdown="1">

One Table Row

</td><td>

- Two 
- Lines

</td></tr>
</table>
```

</div><div class="cell">

<table>
<tr><th>  </th><th> Markdown in a table </th></tr>
<tr><td markdown="1">

Row1

</td><td>

- Two lines
- of markdown

</td></tr>
</table>

</div></div>
</div>

### Notes
 
1. For markdown to span multiple lines inside a cell use an html `<table>` with both `<td markdown="1">` and blank lines as shown.

> ℹ️ **Info:** `<td markdown="1">` is required by jekyll flavoured markdown, the blank line is required by github flavoured markdown and keeping both as a standard is helpful for compatibility even if you're using other flavours.


Comments
--------


<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>
<div class="row"><div class="cell"> 

```markdown
A

[nothing to see here]: # 

C
```

</div><div class="cell">

A

[B comment]: # 

C

</div></div>

</div>


Blockquotes
-----------

<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>
<div class="row"><div class="cell"> 

```
> qoute
```

</div><div class="cell">

> qoute

</div></div>

<div class="row"><div class="cell">

```
> multiline
>
> quote
```

</div><div class="cell">

> multiline
>
> quote

</div></div>

<div class="row"><div class="cell">

```
> quotes
>> inside
>>> quotes
```

</div><div class="cell">

> quotes
>> inside
>>> quotes

</div></div>

<div class="row"><div class="cell">

```
> Markdown
> --------
> - in a
> - ***quote***
```

</div><div class="cell">

> Markdown
> --------
> - in a
> - ***quote***

</div></div>

</div>



Alerts
------

Achieved using blockquotes and emojis.

<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>
<div class="row"><div class="cell"> 

```
> ℹ️ **Info:** just to let you know

> ⚠️ **Warning:** take care

> 🚩 **Error:** will fail

> 📝 **Note:** remember this

> 💡 **Tipx:** a useful trick
```

</div><div class="cell">

> ℹ️ **Info:** just to let you know

> ⚠️ **Warning:** take care

> 🚩 **Error:** will fail

> 📝 **Note:** remember this

> 💡 **Tipx:** a useful trick

</div></div>

</div>


Template used for this guide
----------------------------


<div class="table">
<div class="row header"><div class="cell">Markdown</div><div class="cell">Result</div></div>

<div class="row"><div class="cell">
    
```
a
```

</div><div class="cell">
    
a

</div></div>
</div>


<style>

.table {
  display: table;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.row {
  display: table-row;
}

.header {
  font-weight: bold;
}
.cell {
  display: table-cell;
  padding: 10px;
  border: 0px solid black;
}

@media screen and (prefers-color-scheme: dark) {
   .row + .row {
      border-top: 1px solid DimGray;
   }
   .header {
      border-bottom: 1px solid LightGray;
   }
}

@media screen and (prefers-color-scheme: light) {
   .row + .row {
      border-top: 1px solid LightGray;
   }
   .header {
      border-bottom: 1px solid DimGray
   }
}


@media screen and (max-width: 767px) {
  .table {
    display: block;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
   
    margin-bottom: 10px;
  }
  .cell {
    flex-basis: 100%;
    padding: 5px;
  }
  .header {
    display: none;
  }
}
</style>

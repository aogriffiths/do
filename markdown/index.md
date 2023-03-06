**Opinionated Markdown Guide**
==============================

Markdown is simple, effective way to document your suff. From README's and project docs to making a wiki or writing articles. markdown can do the trick.

Here's a cheat sheet, collection of hacks and style guide. It dosn't offer multiple ways of doing the same thing whichmakes it quick to follow and helps keep people using it consistent.

You can call it the OMG if you want.

Headings
========

```
**Title**
=========

Heading L1
==========

Heading L2
----------

### Heading L3

#### Heading L4

##### Heading L5

###### Heading L6

```

### Notes

1. Use underlines `===` and `---` for heading L1 and L2 and `###` for L3 to L6. Make the underlines the same length as the heading.

2. Bold the first heading, to make it an overall title for the document.   

3. In a long markdown file don't use L1 just once, use it to spint the content in to sections. 

4. Always have a space abov a heading

   > ℹ️ These points make both the raw markdown and the fomated verison easier to read.



Lists
=====
<table>
<tr>
<th>Markdown</th>
<th>Result</th> 
</tr>
<tr>
<td>

```
- Bulleted 
- List 
```

</td>
<td>

- Bulleted 
- List

</td> 
</tr>
<tr>
<td>

```
1. Ordered
2. List 
```

</td>
<td>

1. Ordered
2. List 

</td> 
</tr>
<tr>
<td>

```
- Parent
     - child (indented by 4)
```

</td>
<td>

- Parent
     - child (indented by 4)

</td> 
</tr>
<tr>
<td>

````
1. First
     - with child

2. Third
   
   with paragraph

3. Second
   ``` 
   # with code
   ```
````

</td>
<td>

1. First
     - with child

2. Third
   
   with paragraph

3. Second
   ``` 
   # with code
   ```

</td> 
</tr>
</table>



### Notes
 
1. Bullet using `-`

2. Number using `0.`

3. Indent sublists with four spaces

4. Indent any other contnet with 2 spaces


Formatting
==========

| Markdown                     |Result                       |
|------------------------------|-----------------------------|
|`**bold**`                    |**bold**                     |
|`***italic***`                |***italic***                 |
|`***bold italic***`           |***bold italic***            |
|`**bold _italic_ inside**`    |**bold _italic_ inside**     |
|`~~stricktrough~~`            |~~stricktrough~~             |
|`Sub<sub>script</sub>`        |Sub<sub>script</sub>         |
|`Super<sup>script</sup>`      |Super<sup>script</sup>       |   


Code
====


<table>
<tr>
<th>Markdown</th>
<th>Result</th> 
</tr>
<tr>
<td>

`` `inline` `` 

</td>
<td>

 `inline`

</td> 
</tr>
<tr>
<td>

``` `` `escaped` `` ```

</td>
<td>

`` `escaped` ``

</td> 
</tr>
<tr>
<td>

````
```
fenced
```
````

</td>
<td>

```
fenced
```

</td> 
</tr>
<tr>
<td>

`````
````
```
escaped
```
````
`````

</td>
<td>

````
```
escaped
```
````

</td> 
</tr>
</table>


Comments
========


<table>
<tr>
<th>Markdown</th>
<th>Result</th> 
</tr>
<tr>
<td>

```
A

[nothing to see here]: # 

C
```

</td>
<td>

A

[B comment]: # 

C

</td> 
</tr>
</table>


Allerts
-------

> ℹ️ **Info:** just to let you know

> ⚠️ **Warning:** take care

> 🚩 **Error:** will fail

> 📝 **Note:** remember this

> 💡 **Tipx:** a useful trick
---
title: YAML Ain’t Markup Language
description: A cheat sheet, and style guide for yaml.
date: 2023-01-30
tags: guides
---

In fact, it's "a data serialization language designed to be human-friendly and work well with modern programming languages for common everyday tasks". It is typically used for configuration files, data storage, and transmission.

Data has three basic primitive types:

1. Mappings (hashes/dictionaries)
2. Sequences (arrays/lists) 
3. Scalars (strings/numbers/etc)

And two styles of serialization, which can be used together:

1. Block - uses newlines and indentation
2. Flow - a more compact form

Borrowed Concepts
=================

YAML borrows concepts from many places including:

* **Python:** indentation to indicate nesting in the block style
* **JSON:** like `{a:1, b:[1,2]}` in the flow style
* **Perl:** data types (although these are common with many other programming languages) 
* **Email:** colon "`:`" for separating key-value pairs (RFC 822)
* **MIME:** hyphens like "`---`" for separating documents in the same file or feed (RFC 2046)
* **C:** backslash "`\`" escapes sequences
* **HTML/CSS:** collapsing whitespace

Basic primitive data types
==========================

Mappings
--------
Python has a dictionaries, javascript has objects with properties, other languages might have hashmaps or associative arrays, but they all have one thing in common; they map keys to values. Yaml does this using mappings.

The syntax is simply "`key: value`" but note the space after the colon.

### Examples

Scalars to scalars:

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
length: 200
width: 100
{% endquicktable %}


Most Json is also value yaml:

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
{length: 200, width: 100}
{% endquicktable %}


Sequences
---------
Sequences in yaml are just ordered lists of items. Each item must be precented by "`- `" (note the space after the colon) and idented to the same level.

### Examples

Array of scalars:

{% quicktable "YAML|yaml_code" "JSON|yaml_code_parsed_as_json" "Graph|yaml_graph" %}
- table
- chair
{% endquicktable %}

Array of mappings:

{% quicktable "YAML|yaml_code" "JSON|yaml_code_parsed_as_json" "Graph|yaml_graph" %}
- name: table
  place: kitchen
- name: chair
  place: bedroom
{% endquicktable %}


**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
- table:
    length: 200
    width: 100
- chair:
    length: 50
    width: 50
{% endquicktable %}





**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
- name: table
  length: 200
  width: 100
- name: chair
  length: 50
  width: 50
{% endquicktable %}





**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
table:
 length: 200
 width: 100
chair:
 length: 50
 width: 50
{% endquicktable %}


**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
table:
    - living
    - kitchen
chair:
    - living
    - kitchen
    - bedroom
{% endquicktable %}





**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
table:
    - &LR living
    - &KI kitchen
chair:
    - *LR
    - *KI
    - bedroom
{% endquicktable %}





**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
X
  - Y: hello
{% endquicktable %}





**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
X:
- Y: hello
{% endquicktable %}





**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
X:
  - Y: hello
{% endquicktable %}





**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
X:
Y: hello
{% endquicktable %}





**cool**

{% quicktable "YAML|yaml_code" "Graph|yaml_graph" %}
X:
 Y: hello
{% endquicktable %}
</table>



<style>
/* If you are seeing this your markdown render does not support custom styles. Sorry. */

table.responsive {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed ;
}

table.responsive th {  
  width: 1%;
  font-weight: bold;
  text-align: left;
}


table.responsive td {
  padding: 10px;
  border: 0px solid black;
  width: 10%;
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
    font-size: 8pt;
    font-variant-caps: all-small-caps;
    color: LightGray;
  }
}
</style>

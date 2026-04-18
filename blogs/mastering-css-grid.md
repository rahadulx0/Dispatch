---
title: "Mastering CSS Grid: A Complete Layout Guide"
description: "Dive deep into CSS Grid and learn how to create complex, responsive layouts with ease."
author: "ZeroMargin"
tags: ["CSS", "Frontend", "Tutorial", "Design"]
---

# Mastering CSS Grid

CSS Grid is a powerful two-dimensional layout system that has revolutionized how we create web layouts. In this guide, we'll explore everything from basic concepts to advanced techniques.

## What is CSS Grid?

CSS Grid Layout is a two-dimensional layout system designed for the web. It lets you layout items in rows and columns, making it perfect for creating complex, responsive layouts.

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

## Basic Grid Concepts

### Grid Container and Grid Items

When you set `display: grid` on an element, it becomes a **grid container**, and its direct children become **grid items**.

```css
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

### Grid Lines

Grid lines are the dividing lines that make up the structure of the grid. They can be referred to by number or by name.

```css
.item {
  grid-column: 1 / 3; /* Start at line 1, end at line 3 */
  grid-row: 1 / 2;
}
```

## Creating Layouts

### The Holy Grail Layout

One of the most common layouts is the "Holy Grail" - a header, footer, main content, and two sidebars:

```css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.nav    { grid-area: nav; }
.main   { grid-area: main; }
.aside  { grid-area: aside; }
.footer { grid-area: footer; }
```

## Responsive Grids

### Using auto-fill and auto-fit

Create responsive grids without media queries:

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
```

The difference between `auto-fill` and `auto-fit`:

| Property | Behavior |
|----------|----------|
| auto-fill | Creates as many tracks as will fit, even if empty |
| auto-fit | Collapses empty tracks to 0, expanding filled ones |

## Advanced Techniques

### Subgrid

Subgrid allows nested grids to inherit the parent's grid tracks:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

> **Note**: Subgrid is now supported in all major browsers!

## Conclusion

CSS Grid is an essential tool for modern web development. Combined with Flexbox, you have all the tools you need to create any layout imaginable.

Key takeaways:

- Use Grid for two-dimensional layouts
- Use Flexbox for one-dimensional layouts
- Combine both for complex UIs
- Use `auto-fill` and `auto-fit` for responsive designs

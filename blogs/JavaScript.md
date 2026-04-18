---
title: "General JavaScript Basics"
description: "A concise overview of fundamental JavaScript concepts, including its definition, data types, and differences between var, let, and const."
tags: ["JavaScript", "Interview"]
---

1. **What is JavaScript?**  

   JavaScript is a lightweight, interpreted programming language used to create dynamic web content. It differs from Java as it is primarily used for web applications, while Java is a general-purpose, OOP language.

  

2. **Data types in JavaScript?**  

   Primitive: `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`.  

   Non-primitive: `object`, `array`, `function`.

  

3. **Difference between `var`, `let`, and `const`?**  

   - `var`: Function-scoped, hoisted, allows redeclaration.  

   - `let`: Block-scoped, hoisted (uninitialized), no redeclaration.  

   - `const`: Block-scoped, hoisted (uninitialized), immutable references.

  

4. **What is hoisting?**  

   JavaScript moves variable and function declarations to the top of their scope before execution. Variables declared with `var` are initialized with `undefined`.

  

5. **`==` vs `===`?**  

   - `==`: Compares values, performs type coercion.  

   - `===`: Compares values and types, no coercion.

  

6. **`null` vs `undefined`?**  

   - `null`: Explicitly set to indicate "no value."  

   - `undefined`: Default for uninitialized variables.

  

7. **What are closures?**  

   Functions that remember their scope, even when executed outside it.  

   ```javascript

   function outer() {

       let count = 0;

       return function inner() {

           count++;

           return count;

       };

   }

   ```

  

8. **How does `this` work?**  

   - In global scope: Refers to `window` (browser) or `global` (Node.js).  

   - In objects: Refers to the object.  

   - In arrow functions: Inherits `this` from the enclosing scope.

  

9. **What are promises?**  

   Promises represent the eventual result of asynchronous operations.  

   ```javascript

   fetch(url).then(response => response.json()).catch(err => console.log(err));

   ```

  

10. **What is an IIFE?**  

   A function that executes immediately upon definition:  

   ```javascript

   (function() { console.log('IIFE'); })();

   ```

  

---

  

### **Functions and Objects**

11. **Functions vs Arrow functions?**  

   - Arrow functions: Shorter syntax, no `this` binding.  

   - Regular functions: Have their own `this`.

  

12. **Difference between `call()`, `apply()`, `bind()`?**  

   - `call()`: Invokes a function with arguments individually.  

   - `apply()`: Invokes with arguments as an array.  

   - `bind()`: Returns a new function with a specific `this`.

  

13. **How to create objects?**  

   - Using literals: `{ key: value }`  

   - Constructor function: `new Object()`  

   - Classes: `class MyObject {}`

  

14. **Prototype-based inheritance?**  

   Objects inherit properties and methods from `Object.prototype`.

  

15. **Check if a property exists?**  

   - `object.hasOwnProperty(key)`  

   - `'key' in object`

  

---

  

### **Arrays and Iteration**

16. **How to create an array?**  

   Using `[]` or `new Array()`.

  

17. **`for`, `for...in`, `for...of`?**  

   - `for`: Iterates by index.  

   - `for...in`: Iterates over keys.  

   - `for...of`: Iterates over values.

  

18. **Add/remove elements from arrays?**  

   - Add: `push()`, `unshift()`.  

   - Remove: `pop()`, `shift()`, `splice()`.

  

19. **Higher-order array functions?**  

   - `map()`: Transforms array elements.  

   - `filter()`: Filters based on condition.  

   - `reduce()`: Reduces to a single value.

  

20. **Find index of a value?**  

   Using `indexOf()` or `findIndex()`.

  

---

  

### **DOM Manipulation**

21. **What is the DOM?**  

   A tree-like structure representing HTML.

  

22. **Select elements in the DOM?**  

   Using `getElementById()`, `querySelector()`, etc.

  

23. **What are event listeners?**  

   Functions that respond to events. Example:  

   ```javascript

   element.addEventListener('click', () => console.log('Clicked'));

   ```

  

24. **What is event delegation?**  

   Using a parent element to handle events for its children. Useful for dynamic elements.

  

25. **Prevent default behavior?**  

   Use `event.preventDefault()`.

  

---

  

### **Asynchronous JavaScript**

26. **What is the Event Loop?**  

   A mechanism that handles asynchronous callbacks.

  

27. **Synchronous vs Asynchronous?**  

   - Synchronous: Code runs sequentially.  

   - Asynchronous: Non-blocking, runs in the background.

  

28. **What are `async/await`?**  

   Syntax for handling promises more cleanly:  

   ```javascript

   async function fetchData() {

       const data = await fetch(url);

       console.log(data);

   }

   ```

  

29. **`setTimeout` vs `setInterval`?**  

   - `setTimeout`: Delays execution once.  

   - `setInterval`: Repeats execution at intervals.

  

30. **Purpose of `fetch` API?**  

   To make HTTP requests. Returns a promise.

  

---

  

### **Error Handling**

31. **What are exceptions?**  

   Errors detected during execution. Use `try...catch` to handle.

  

32. **`try...catch` block?**  

   ```javascript

   try {

       throw new Error('Error!');

   } catch (err) {

       console.log(err.message);

   }

   ```

  

33. **Syntax error vs Runtime error?**  

   - Syntax error: At compile-time.  

   - Runtime error: During execution.

  

---

  

### **Advanced Concepts**

34. **`Object.freeze()` vs `Object.seal()`?**  

   - `freeze`: Prevents modifications and addition/removal of properties.  

   - `seal`: Prevents addition/removal but allows value modification.

  

35. **What is Strict Mode?**  

   Adds stricter parsing and error handling:  

   ```javascript

   'use strict';

   ```

  

36. **What are modules?**  

   Reusable pieces of code. Use `import/export`.

  

37. **Synchronous vs Asynchronous Iteration?**  

   Asynchronous iteration uses `for-await-of`.

  

38. **What are debouncing and throttling?**  

   - Debouncing: Delays execution until no more events.  

   - Throttling: Limits execution to fixed intervals.

  

39. **What are `Set` and `Map`?**  

   - `Set`: Stores unique values.  

   - `Map`: Stores key-value pairs.

  

40. **Important ES6 features?**  

   - Arrow functions, `let/const`, template literals, modules, promises, classes.

  

---

  

### **Miscellaneous**

41. **Deep copy vs Shallow copy?**  

   - Shallow: Copies references (e.g., `Object.assign()`).  

   - Deep: Copies all values (e.g., `JSON.parse(JSON.stringify())`).

  

42. **How does memory management work?**  

   Uses garbage collection to reclaim unused memory.

  

43. **Ways to handle async operations?**  

   - Callbacks, promises, `async/await`.

  

44. **What is a Polyfill?**  

   A code snippet that provides newer functionality in older browsers.

  

45. **Local storage vs Session storage vs Cookies?**  

   - Local: Persistent, larger storage.  

   - Session: Cleared after the session.  

   - Cookies: Smaller, sent with HTTP requests.
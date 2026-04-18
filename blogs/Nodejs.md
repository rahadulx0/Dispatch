---
title: "NodeJS Basics"
description: "A concise overview of fundamental Node.js concepts, including its definition, key features, event loop, and package management."
tags: ["nodeJS", "Interview"]
---

1. **What is Node.js?**
    
    - Node.js is a runtime environment that allows JavaScript to be run on the server side. It is built on Chrome's V8 JavaScript engine.
2. **What are the key features of Node.js?**
    
    - Non-blocking, asynchronous I/O; single-threaded event loop; scalability; cross-platform compatibility; NPM for package management.
3. **What is the difference between Node.js and traditional server-side scripting languages like PHP?**
    
    - Node.js is non-blocking and event-driven, while PHP is synchronous and blocking. Node.js uses a single-threaded event loop, while PHP spawns a new thread for each request.
4. **Explain the Node.js Event Loop.**
    
    - The event loop processes incoming requests asynchronously, executing callbacks when operations like I/O are completed.
5. **What is the purpose of the `package.json` file in a Node.js project?**
    
    - It contains metadata about the project, such as dependencies, scripts, and version information.
6. **How do you manage dependencies in Node.js?**
    
    - Using `npm` (Node Package Manager) or `yarn` to install, update, or remove dependencies listed in `package.json`.
7. **What is the difference between `npm` and `yarn`?**
    
    - Both are package managers. Yarn provides faster installations and has better offline support, while npm is widely used and comes with Node.js by default.
8. **What is the difference between `require()` and `import` in Node.js?**
    
    - `require()` is CommonJS syntax, while `import` is ES6 module syntax. `import` allows tree-shaking and is used with the `type: "module"` option in `package.json`.
9. **How do you create a simple server in Node.js?**
    
    ```javascript
    const http = require('http');
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!');
    });
    server.listen(3000, () => console.log('Server running on port 3000'));
    ```
    
10. **What are streams in Node.js, and how are they used?**
    
    - Streams are objects used to read or write data in chunks (e.g., file or network data). They are efficient for large data. Example: `fs.createReadStream()`.

---

### **Advanced Concepts**

11. **What is middleware in Node.js? How is it implemented?**
    
    - Middleware functions process requests before they reach the final route handler. In Express, they are implemented using `app.use()`.
    
    ```javascript
    app.use((req, res, next) => {
        console.log('Middleware executed');
        next();
    });
    ```
    
12. **Explain the concept of callbacks in Node.js and how they lead to callback hell.**
    
    - Callbacks are functions passed as arguments to handle asynchronous tasks. Callback hell occurs when multiple nested callbacks make the code unreadable.
13. **What is a Promise, and how does it improve asynchronous handling in Node.js?**
    
    - A Promise represents a value that may be available in the future. It avoids callback nesting by using `.then()` and `.catch()`.
    
    ```javascript
    fetchData().then(data => console.log(data)).catch(err => console.error(err));
    ```
    
14. **Explain `async/await` in Node.js.**
    
    - `async/await` is syntactic sugar over Promises, allowing asynchronous code to be written like synchronous code.
    
    ```javascript
    const fetchData = async () => {
        try {
            const data = await getData();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };
    ```
    
15. **What is the purpose of the `cluster` module in Node.js?**
    
    - It enables multi-threading by creating multiple worker processes to handle requests, improving scalability on multi-core systems.
16. **How does Node.js handle file I/O operations?**
    
    - Using the `fs` module with both synchronous (`readFileSync`) and asynchronous (`readFile`) methods.
17. **What are child processes in Node.js, and why are they used?**
    
    - Child processes allow running scripts or commands in parallel, useful for CPU-intensive tasks.
18. **What are the differences between `readFileSync` and `readFile` in the `fs` module?**
    
    - `readFileSync`: Synchronous, blocks execution.
    - `readFile`: Asynchronous, non-blocking, uses a callback.
19. **How can you handle uncaught exceptions in a Node.js application?**
    
    - Using the `process.on('uncaughtException')` event:
    
    ```javascript
    process.on('uncaughtException', (err) => {
        console.error('Unhandled Exception:', err);
    });
    ```
    
20. **What is the purpose of the `process` object in Node.js?**
    
    - It provides information about and control over the current Node.js process, such as environment variables and exit status.

---

### **Express.js**

21. **What is Express.js?**
    
    - A lightweight Node.js web application framework for building APIs and web applications.
22. **How do you create a simple Express.js application?**
    
    ```javascript
    const express = require('express');
    const app = express();
    app.get('/', (req, res) => res.send('Hello, Express!'));
    app.listen(3000, () => console.log('Server running on port 3000'));
    ```
    
23. **What is the difference between `app.use()` and `app.get()` in Express.js?**
    
    - `app.use()`: Attaches middleware functions.
    - `app.get()`: Handles GET requests for a specific route.
24. **How do you handle errors in Express.js?**
    
    - Use error-handling middleware:
    
    ```javascript
    app.use((err, req, res, next) => {
        res.status(500).send('Something broke!');
    });
    ```
    
25. **Explain the purpose of middleware in Express.js.**
    
    - Middleware processes requests before they reach the final route handler (e.g., authentication, logging).
26. **What is the difference between `res.send()`, `res.json()`, and `res.render()` in Express?**
    
    - `res.send()`: Sends plain text or HTML.
    - `res.json()`: Sends JSON data.
    - `res.render()`: Renders a view template.
27. **How can you serve static files in an Express.js application?**
    
    - Use `express.static()`:
    
    ```javascript
    app.use(express.static('public'));
    ```
    

---
### **APIs and HTTP**

28. **What is REST, and how do you implement a RESTful API in Node.js?**
- REST (Representational State Transfer) is an architectural style for designing APIs using HTTP methods. Implement it using Express:

```javascript
const express = require('express');
const app = express();
app.use(express.json());
app.get('/api/items', (req, res) => res.json({ items: [] }));
app.listen(3000, () => console.log('API running on port 3000'));
```

29. **How do you handle HTTP methods like GET, POST, PUT, DELETE in Node.js?**
- Use Express to define routes corresponding to HTTP methods:

```javascript
app.get('/item', (req, res) => { /* Handle GET */ });
app.post('/item', (req, res) => { /* Handle POST */ });
app.put('/item/:id', (req, res) => { /* Handle PUT */ });
app.delete('/item/:id', (req, res) => { /* Handle DELETE */ });
```

30. **What is the purpose of CORS in Node.js, and how do you enable it?**
- CORS (Cross-Origin Resource Sharing) allows requests from different origins. Enable it using the `cors` middleware:

```javascript
const cors = require('cors');
app.use(cors());
```

31. **How do you parse JSON and URL-encoded data in a Node.js application?**
- Use middleware provided by Express:

```javascript
app.use(express.json()); // For JSON  
app.use(express.urlencoded({ extended: true })); // For URL-encoded data
```

32. **What are the differences between `http` and `https` modules in Node.js?**
- `http`: Handles unencrypted connections.
- `https`: Handles encrypted connections using SSL/TLS certificates.

33. **How do you secure a Node.js application?**
- Use HTTPS, environment variables, sanitize inputs, handle errors gracefully, use Helmet.js for security headers, and implement proper authentication and authorization.

---

### **Database and ORMs**

34. **How do you connect to a database in Node.js?**
- Use libraries like `mongoose` for MongoDB or `pg` for PostgreSQL:

```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
```

35. **What is the purpose of ORMs like Sequelize or Mongoose?**
- ORMs map database tables to objects in your application, simplifying database interactions with object-oriented syntax.

36. **What is the difference between SQL and NoSQL databases?**
- SQL: Structured, relational databases (e.g., MySQL, PostgreSQL).
- NoSQL: Flexible, document-based or key-value stores (e.g., MongoDB).

37. **How do you handle database connections in a Node.js application?**
- Use connection pooling to reuse existing connections, minimizing overhead.

---

### **Error Handling**

38. **How do you handle errors in Node.js?**
- Use `try/catch` for synchronous and `Promise.catch()` or `async/await` with `try/catch` for asynchronous errors. In Express, use error-handling middleware.

39. **What is the difference between `try/catch` and `.catch()` in Promises?**
- `try/catch`: For synchronous or `async/await` code.
- `.catch()`: For handling errors in Promise chains.

```javascript
// Using .catch()
fetchData().then(data => console.log(data)).catch(err => console.error(err));

// Using try/catch
async function fetch() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

40. **How do you implement centralized error handling in an Express application?**
- Use an error-handling middleware:

```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
```

---

### **Real-World Applications**

41. **How would you build a simple authentication system in Node.js?**
- Use `bcrypt` for hashing passwords and `jsonwebtoken` (JWT) for generating authentication tokens:

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
```

42. **How do you integrate third-party services like email or payment gateways in Node.js?**
- Use libraries like `nodemailer` for emails and SDKs like `stripe` for payments:

```javascript
const nodemailer = require('nodemailer');
const stripe = require('stripe')('your-secret-key');
```

43. **How would you deploy a Node.js application?**
- Use cloud services like AWS, Heroku, or Vercel. Use process managers like PM2 and containerization with Docker.

---

### **Miscellaneous**

44. **What are the differences between CommonJS and ES Modules?**
- CommonJS (`require`): Default in Node.js.
- ES Modules (`import/export`): Modern standard with tree-shaking support.

45. **What is the purpose of the `buffer` module in Node.js?**
- `Buffer` handles binary data in Node.js, used for file and network operations.

```javascript
const buf = Buffer.from('Hello');
console.log(buf.toString());
```

46. **What is the role of the `eventEmitter` module in Node.js?**
- It allows creating and handling custom events.

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.on('event', () => console.log('Event triggered'));
emitter.emit('event');
```

47. **What are worker threads in Node.js?**
- Worker threads enable multi-threading for parallel tasks in a single Node.js process.

48. **How do you handle asynchronous operations in Node.js?**
- Use callbacks, Promises, or `async/await`. Prefer `async/await` for cleaner code.

49. **How can you debug a Node.js application?**
- Use `console.log`, Node.js's built-in debugger (`node inspect`), or tools like Chrome DevTools and VS Code's debugger.

50. **What are the best practices for optimizing Node.js applications?**
- Use asynchronous code, avoid blocking operations, use caching, compress responses, minimize middleware, and monitor the application.

---

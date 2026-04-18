---
title: "Obejct Oriented Programming"
description: "A concise overview of fundamental Object-Oriented Programming (OOP) concepts, including its definition, main pillars, and the difference between classes and objects."
tags: ["OOP", "Interview"]
---

**1. Question:** What is Object-Oriented Programming (OOP)?

**Answer:** Object-Oriented Programming (OOP) is a programming paradigm that organizes code around "objects," which are instances of classes. It emphasizes concepts like encapsulation, inheritance, and polymorphism to structure and reuse code. Instead of focusing on procedures, it focuses on data and how to interact with it.

**2. Question:** What are the four main pillars of OOP?

**Answer:** The four main pillars of OOP are:
_ **Encapsulation:** Bundling data (attributes/properties) and methods (functions) that operate on that data within a single unit (class), and controlling access to the data to prevent direct modification from outside.
_ **Abstraction:** Hiding the complex implementation details and exposing only the essential information. It allows us to work with objects at a high level of detail, focusing on what they do rather than how they do it.
_ **Inheritance:** Creating new classes (child/subclasses) based on existing ones (parent/superclasses), allowing them to inherit attributes and methods. This promotes code reusability and establishes a hierarchy between classes.
_ **Polymorphism:** The ability of different classes to respond to the same method call in their own specific way. "Poly" means many, and "morph" means form. It allows you to treat objects of different classes uniformly.

**3. Question:** What is a class and an object? What is the difference?

**Answer:**
_ **Class:** A class is a blueprint or template for creating objects. It defines the attributes (data) and methods (behavior) that objects of that class will have.
_ **Object:** An object is an instance of a class. It's a concrete entity that exists in memory and can store data and perform actions according to its class definition.

    **Difference:** A class is the definition, while an object is a specific realization of that definition. You can create multiple objects from the same class. Think of a class as a cookie cutter and objects as cookies.

**4. Question:** What is encapsulation and why is it important?

**Answer:** Encapsulation is the practice of bundling data (attributes) and methods (functions) that operate on that data within a single unit (a class). It also controls access to the data, often by making it private and providing public methods to interact with it.

**Importance:**
_ **Data Protection:** Prevents direct and unintentional modification of an object's internal data from outside the class, ensuring data integrity.
_ **Modularity:** Keeps an object's internal state and behavior separate from the rest of the program, promoting modular and maintainable code. \* **Flexibility:** Allows the internal implementation of a class to be changed without affecting other parts of the program, as long as the public interface remains the same.

**5. Question:** What is inheritance and provide a simple real world example?

**Answer:** Inheritance is a mechanism in OOP where a new class (subclass/child class) is derived from an existing class (superclass/parent class). The subclass inherits the attributes and methods of the superclass, and can add its own or override the inherited ones.

**Example:**

-   **Superclass:** `Animal` (with properties like `name`, `age` and methods like `eat()`, `sleep()`)
-   **Subclass:** `Dog` (inherits `name`, `age`, `eat()`, `sleep()` and can have its own property like `breed` and method like `bark()`)

**6. Question:** What is polymorphism, and how is it useful?

**Answer:** Polymorphism means "many forms." In OOP, it refers to the ability of different classes to respond to the same method call in their own specific way. This allows you to write code that works with objects of different classes in a uniform way.

**Usefulness:**
_ **Flexibility:** It allows you to write code that can work with multiple related classes without knowing their specific types.
_ **Extensibility:** It makes your code more adaptable to changes and adding new classes/functionality later on. \* **Code Reusability:** Reduces the need for writing repetitive code.

**7. Question:** What is the difference between public, private, and protected access modifiers? (or an equivalent concept for the languages used in the interview)

**Answer:** Access modifiers control the visibility of a class's members (attributes and methods):

-   **Public:** Accessible from anywhere (inside and outside the class).
-   **Private:** Accessible only within the class where they are declared.
-   **Protected:** Accessible within the class itself, its subclasses, and other classes in the same package (in some languages).

**8. Question:** What is an abstract class? What is an interface?

**Answer:**

-   **Abstract Class:**
    -   Cannot be instantiated directly, and are used as a base classes for other concrete class.
    -   Can contain concrete methods and abstract methods.
    -   Must be inherited to get a concrete object.
-   **Interface:**
    -   Cannot be instantiated directly.
    -   Specifies a contract that other classes must adhere to.
    -   Generally, only contains abstract methods and cannot have attributes.

**Key Differences:**

-   An abstract class can have some implementation, but interface is strictly a definition of methods.
-   A class can inherit one abstract class but can implement multiple interfaces.

**Tips for the Interview:**

-   **Explain with examples:** Whenever possible, try to illustrate concepts with simple examples from your experience.
-   **Don't be afraid to say "I don't know":** If you genuinely don't know an answer, it's better to be honest than to try and bluff.
-   **Ask clarifying questions:** If you don't fully understand the question, ask for clarification rather than assuming.
-   **Practice:** Reviewing these questions and answers multiple times will help you feel more confident and prepared.

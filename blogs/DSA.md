---
title: "Data Structure & Algorithms"
description: "A concise overview of fundamental data structure and algorithm concepts, including their definitions, importance, and common types."
tags: ["DSA", "Interview"]
---

## Data Structure Introduction

*   A **data structure** is a way to store and organize data so that it can be used efficiently.
*   It is a set of **algorithms** that can structure data in memory, usable in any programming language.
*   As applications become complex and data amounts increase, data structures help solve problems like processor speed and data search efficiency. Data is organized to allow instant searching.
*   **Advantages** of using data structures are efficiency (in terms of time and space) and reusability.
*   The **Abstract Data Type (ADT)** specifies the data structure, providing a level of abstraction.

### Data vs. Record vs. File vs. Attribute and Entity

*   **Data:** Elementary value or collection of values (e.g., student's name and ID).
*   **Record:** Collection of various data items (e.g., student entity: name, address, course, marks).
*   **File:** Collection of various records of one type of entity (e.g., 50 employees' records in a class).
*   **Attribute and Entity:** An entity represents a class of certain objects containing various attributes. Each attribute represents a particular property of that entity.

### Data Structure Classification

*   Data structures are classified as **primitive** and **non-primitive**.
    *   **Primitive:** Integer, character, float, double, pointer.
    *   **Non-Primitive:** Linear and non-linear.
        *   **Linear:** Arrays, linked lists, stacks, queues. Elements are arranged in a sequential manner, and one element is connected to only one other element in a linear form.
        *   **Non-Linear:** Trees and graphs. Elements are arranged in a random manner.

## Introduction to Algorithm

*   An **algorithm** is a process or set of rules to perform calculations or problem-solving operations, especially by a computer. It can be represented using a flowchart or pseudocode.
*   Algorithms and abstract data types work together to structure data in memory, with algorithms being proposed as Abstract Data Types.
*   An Abstract Data Type tells what is to be done, and a data structure tells how to do it.

### Characteristics of an Algorithm

*   **Input:** An algorithm has input values (can be zero or more).
*   **Output:** An algorithm produces at least one output.
*   **Unambiguity:** Instructions should be clear and simple.
*   **Finiteness:** An algorithm should have a limited number of instructions.
*   **Effectiveness:** Each instruction must affect the overall process.

### Approaches in Algorithm Design

*   **Brute Force Algorithm:** Applies general logic and searches all possibilities to provide the required solution.
    *   Optimizing: Finding all solutions and then taking the best.
    *   Sacrificing: Stopping as soon as the best solution is found.
*   **Divide and Conquer:** Breaks down a problem into different methods, producing valid output passed to another function.
*   **Greedy Algorithm:** Makes optimal choices at each iteration, easy to implement, and has faster execution time.

### Major Categories of Algorithms

*   **Sort:** Algorithms for sorting items in a certain order.
*   **Search:** Algorithms for searching items inside a data structure.
*   **Delete:** Algorithms for deleting existing elements from a data structure.
*   **Insert:** Algorithms for inserting items into a data structure.
*   **Update:** Algorithms for updating existing elements inside a data structure.

## Asymptotic Analysis

*   **Asymptotic analysis** defines the time required by an algorithm under different scenarios:
    *   **Worst Case:** The input for which the algorithm takes the longest time.
    *   **Average Case:** The algorithm takes an average time for program execution.
    *   **Best Case:** The input for which the algorithm takes the shortest time.

### Asymptotic Notations

*   **Big O Notation (O):** Measures the performance of an algorithm by providing the order of growth of the function. It provides an upper bound on a function.
*   **Omega Notation (Ω):** Describes the best-case scenario, representing the lower bound of an algorithm's running time.
*   **Theta Notation (Θ):** Describes average-case scenarios, representing realistic time complexity.

## Data Structure - Pointer

*   A **pointer** is used to point to the address of a value stored in computer memory. Obtaining the value stored at a location is known as dereferencing a pointer.
*   **Pointer Arithmetic:**  Operators that can be used in pointers: ++, --, +, -.
*   **Array of Pointers:** An array can hold a number of pointers.
*   **Pointer to Pointer:** C allows you to have a pointer to a pointer.

## Data Structure - Structure

*   A **structure** is a composite data type that defines a grouped list of variables in a block of memory.
*   **Advantages:** It can hold variables of different data types, create objects containing different types of attributes, and allows reuse of the data layout across programs. It can be used to implement other data structures like linked lists, queues, trees, and graphs.

## Data Structure - Array

*   **Arrays** are collections of similar data items stored at contiguous memory locations. Each data element can be randomly accessed using its index number.
*   **Indexing:**
    *   0 (Zero Based indexing): The first element of the array will be arr\.
    *   1 (One-based indexing): The first element of array will be arr\.
    *   n (n-based indexing): The first element of array can reside at any random index number.
*   **Accessing Elements:** To access any random element of an array, the base address of the array, the size of an element in bytes, and the type of indexing the array follows are needed.
*   **2D Array:** A 2D array can be defined as an array of arrays, organized as a collection of rows and columns. Elements of 2D arrays can be randomly accessed.
*   **Mapping 2D array to 1D array**:
    *   Row major ordering: all the rows of 2D array are stored into memory contiguously.
    *   Column major ordering: all the columns of 2D array are stored into the memory contiguously.

### Complexity of Array Operations

*   **Time Complexity**: Access O(1), Search O(n), Insertion O(n), Deletion O(n).
*   **Space Complexity**: O(n).

## Data Structure - Linked List

*   A **linked list** is a collection of elements where the elements are not stored in consecutive locations. It consists of nodes, where each node contains a data part and an address part.
*   **Drawbacks of using array**: Insertion of new elements is not possible if array is full. Wastage of memory may occur in arrays.

### Types of Linked Lists

*   **Singly Linked List:** Consists of a data part and an address part (pointer). The pointer that holds the address of the initial node is known as a head pointer.
*   **Doubly Linked List:** Contains two pointers: one to the next node and one to the previous node.
*   **Circular Linked List:** A variation of a singly linked list where the last node points back to the first node.
*   **Doubly Circular Linked List:** Has the features of both circular and doubly linked lists. The last node is attached to the first node, creating a circle. Does not contain NULL value in previous field of the node.

### Operations on Linked Lists

*   Node Creation
*   Insertion (at beginning, end, or after a specified node)
*   Deletion and Traversing
*   Searching

### Complexity

*   Access and Search: O(n)
*   Insertion and Deletion: O(1)
*   Space complexity: O(n)

## Data Structure - Skip List

*   A **skip list** is a probabilistic data structure used to store a linked list of elements. It skips several elements of the entire list. It is built in two layers: the lowest layer and the top layer.

### Complexity

*   Access, search, delete, and insert complexity: O(log n) average case, O(n) worst case.
*   Space complexity: O(n log n).

## Data Structure - Stack

*   A **stack** is a linear data structure that follows the **LIFO (Last-In-First-Out)** principle.
*   A stack has one end (top), where insertion and deletion occur.
*   A stack is an Abstract Data Type (ADT) with a pre-defined capacity.

### Operations on Stacks

*   **Push():** Inserts an element into the stack. If the stack is full, an overflow condition occurs.
*   **Pop():** Deletes an element from the stack. If the stack is empty, an underflow state occurs.
*   **Peek():** Returns the element at a given position.
*   **Count():** Returns the total number of elements in a stack.
*   **Change():** Changes the element at the given position.
*   **Display():** Prints all the elements available in the stack.

### Applications of Stack

*   Recursion
*   DFS (Depth First Search)
*   Backtracking
*   Memory management

### Time Complexity

*   Push and Pop operations: O(1)

## Data Structure - Queue

*   A **queue** is an ordered list that enables insert operations at one end (REAR) and delete operations at the other end (FRONT). It follows the **FIFO (First-In-First-Out)** principle.

### Operations on Queues

*   **Enqueue:** Inserts an element at the rear of the queue.
*   **Dequeue:** Deletes an element from the front of the queue.
*   **Peek:** Returns the element at the front of the queue without deleting it.
*   **Queue Overflow:** Occurs when the queue is completely full.
*   **Queue Underflow (isEmpty):** Occurs when there is no element in the queue.

### Types of Queues

*   **Linear Queue:** Insertion occurs at one end, and deletion occurs from another end.
*   **Circular Queue:** All nodes are treated as circular. The last element is connected to the first element.
*   **Priority Queue:** Each element has a priority associated with it. Elements are arranged in a priority queue. If elements occur with same priority, then they are served according to FIFO principle.

### Complexity of Queue

*   Access and Search: O(n)
*   Insertion and Deletion: O(1)
*   Space Complexity: O(n)

## Data Structure - Tree

*   A **tree** is a non-linear data structure that represents hierarchical data. Elements in a tree are arranged in multiple levels.
*   In a tree data structure, the topmost node is called the root node. Each node contains some data and links or references to other nodes (children).

### Basic Terms of Tree

*   **Link:** Each node is labeled with some number.
*   **Root:** The top-most node in the tree hierarchy.
*   **Child Node:** A descendant of any node.
*   **Parent:** A node containing any sub-node.
*   **Sibling:** Nodes that have the same parent.
*   **Leaf Node:** A bottom-most node of a tree, which doesn't have any child node.
*   **Ancestor Node:** Any predecessor node on a path from the root to that node.
*   **Descendant:** The immediate successor of a given node.
*   **Depth of node x:** Length of the path from the root to node x. The root node has depth 0.
*   **Height of node x:** Longest path from node x to a leaf node.

### Properties of Tree Data Structures

*   **Recursive data structure**.
*   If there are (n) nodes, then there will be (n-1) edges.
*   The root node has depth 0.

### Implementation of Tree

*   The tree data structure can be created dynamically with help of pointers.

### Applications of Trees

*   Storing naturally hierarchical data (file systems).
*   Organizing data for efficient insertion, deletion, and searching.
*   Special kinds of trees (used for dynamic spell checking).
*   Heap implementation.

## Types of Tree

*   **General Tree:** A node can have either 0 or a maximum of n number of nodes.
*   **Binary Tree:** A node can have a maximum of two children.
*   **Full/Proper/Strict Binary Tree:** Each node contains either 0 or 2 children.
*   **Complete Binary Tree:** All nodes are completely filled except possibly the last level and the last level has all keys as left as possible.
*   **Perfect Binary Tree:** All internal nodes have 2 children, and all leaf nodes are at the same level. All perfect binary trees are complete and full binary trees, but the reverse is not true.
*   **Balanced Binary Tree:** The left and right trees differ by almost 1.
*   **Binary Search Tree:** A class of binary trees in which nodes are arranged in a specific order. The similarity value of all nodes in the right sub-tree is greater than or equal to the value of the root.

### Tree Traversal

*   The process of visiting nodes.
    *   Inorder Traversal
    *   Preorder Traversal
    *   Postorder Traversal

### Operations on Binary Search Tree (BST)

*   Searching in BST
*   Insertion in BST
*   Deletion in BST

### AVL Tree

*   An AVL tree is a height-balanced binary search tree where each node is associated with a balance factor.
*   **Balance Factor:** The balance factor is calculated by subtracting the height of its right subtree from the height of its left subtree.
*   **AVL Rotations:** AVL tree rotations are performed only if the balance factor is other than -1, 0, and 1. There are four types of rotations: L-L, R-R, L-R, and R-L.
*   **Why AVL Tree?:** AVL trees control the height of the binary search tree.

### B-Tree

*   A B-tree is a specialized m-way tree that can be widely used for disk access. A B-tree of order m can have at most m-1 keys and m children.

### B+ Tree

*   B+ Tree is an extension of B Tree which allows efficient insertion, deletion and search operations.

## Data Structure - Graph

*   A **graph** is a group of vertices and edges that are used to connect these vertices.
*   A graph G can be defined as an ordered set G(V,E) where V(G) represents the set of vertices and E(G) represents the set of edges.
*   **Directed and Undirected Graph:** A graph can be directed or undirected.

### Graph Terminology

*   **Path:** Sequence of nodes followed in order to reach some terminal node V from initial node U.
*   **Closed Path:** Initial node is the same as the terminal node.
*   **Simple Path:** All nodes of the graph are distinct with an exception, V0 = VN.
*   **Cycle:** A path with no repeated edges or vertices except the first and last vertices.
*   **Connected Graph:** A graph in which some path exists between every two vertices (U,V).
*   **Complete Graph:** Every node is connected with all other nodes.
*   **Weighted Graph:** Each edge is assigned with some data (length/width).
*   **Diagraph:** A directed graph in which each edge has some direction and traversing can be done only in the specified direction.
*   **Loop:** An edge that is associated with the similar end points.
*   **Adjacent Nodes:** Two nodes u and v are connected via an edge e.
*   **Degree of a Node:** Number of edges that are connected with that node.

### Graph Representation

*   Techniques used to store a graph into the computer's memory.
    *   **Sequential Representation:** Uses an adjacency matrix to store mapping represented by vertices and edges.
    *   **Linked Representation:** An adjacency list is maintained for each node in the graph.

## Graph Traversal Algorithms

*   Techniques to traverse all vertices and edges of a graph.
    *   **Breadth-First Search (BFS):** Starts traversing the graph from the root node and explores all the neighboring nodes.
    *   **Depth-First Search (DFS):** Starts with the initial node of the graph and goes to the deeper and deeper until we find the goal node.

## Searching

*   **Searching** is the process of finding some particular element in the list. If the element is present, the process is successful.

### Types of Searching

*   **Linear Search:** The simplest sequential search method. Each element of the list is completely traversed and matched with the item whose location is to be found.
*   **Binary Search:** Works efficiently on sorted lists. It follows a divide and conquer approach.

## Sorting Algorithms

### Bubble Sort

*   Repeatedly swaps adjacent elements until they are in the correct order.
*   The average and worst case complexity of bubble sort is O(n^2).

### Bucket Sort

*   Distributes elements into multiple groups called buckets. Elements in buckets are first sorted and then gathered.

### Heap Sort

*   Processes the elements by creating min-heap or max-heap.

### Insertion Sort

*   Works similarly to sorting playing cards. It iterates through the sorted array.

### Merge Sort

*   A sorting technique that follows a divide and conquer approach.

## Data Structure Interview Questions with Answers

*   **What is a data structure?** A way of organizing data that considers not only items stored but also their relationship to each other.
*   **Areas where data structures are applied?** Compiler design, operating system, database system, statistical analysis, numerical analysis, artificial intelligence.
*   **Major data structures used in RDBMS, network data model, and hierarchical data model?** array & structures, graph, tree.
*   **Data structure to perform recursion?** Stack.
*   **Notations used in evaluation of arithmetic expressions?** Polish and Reverse Polish notations.
*   **Applications of tree data structure?** Manipulation of arithmetic expressions, symbol table construction & syntax analysis.
*   **Sequential is the simplest file structure**.

## Data Structure Coding Questions

*   Arrays using C
*   Linked list in C++
*   Stack implementation in C

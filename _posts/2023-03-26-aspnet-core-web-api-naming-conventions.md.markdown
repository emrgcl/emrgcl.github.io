---
layout: post
title: "ASP.NET Core Web API Naming Conventions: Best Practices for Code Organization"
date: 2023-03-26
categories: [aspnetcore, webapi, best-practices]
---

> In this post, we'll explore the essential naming conventions for building well-organized and maintainable ASP.NET Core Web APIs. Following these best practices will help you create consistent, easy-to-understand code that fosters collaboration and eases future development.

ASP.NET Core Web API follows certain naming conventions for better organization, readability, and maintainability. Here are some of the common naming conventions:

1.  **Namespace**:  
    Organize your code into namespaces that reflect the application structure and functionality. For example, use a `.Controllers` suffix for the namespace containing controllers and a `.Models` suffix for the namespace containing models.

        {% highlight csharp %}
        namespace YourApplicationName.Controllers
        {
            // Your controller code here
        }
        {%endhighlight%}

2.  **Controllers**:  
    Controller class names should be in PascalCase, end with the "Controller" suffix, and inherit from `ControllerBase` class. This convention helps ASP.NET Core to identify controller classes automatically.

        ```csharp
        public class BooksController : ControllerBase
        {
            // Your action methods here
        }
        ```

3.  **Action Methods**:  
    By convention, action method names should be descriptive and use a verb that matches the intent of the action (e.g., `Get`, `Post`, `Put`, `Delete`). Use PascalCase for action method names.

        ```csharp
        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetBooks()
        {
            // Your code here
        }

        [HttpGet("{id}")]
        public ActionResult<Book> GetBook(int id)
        {
            // Your code here
        }

        [HttpPost]
        public ActionResult<Book> CreateBook(Book book)
        {
            // Your code here
        }
        ```

4.  **Models**:  
    Model class names should be nouns that describe the resource or entity they represent, and should use PascalCase. For example:

        ```csharp
        public class Book
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Author { get; set; }
        }
        ```

5.  **Route Templates**:  
    Route templates should use lowercase, hyphen-separated (kebab-case) words. Use route tokens like `[controller]`, `[action]`, and `[area]` to make route templates dynamic.

        ```csharp
        [Route("api/[controller]")]
        public class BooksController : ControllerBase
        {
            // Your action methods here
        }
        ```

6.  **Route Parameters**:  
    Route parameters should be camelCase, as they are case-sensitive and must match the action method parameters.

        ```csharp
        [HttpGet("{bookId}")]
        public ActionResult<Book> GetBook(int bookId)
        {
            // Your code here
        }
        ```

These are some of the common naming conventions in ASP.NET Core Web API. It's important to follow these conventions for consistency and better organization of your code.



# windowsToo

This project is designed to enable users to **draw mathematical expressions** on a canvas, solve them using an AI-powered backend, and display the results dynamically. It combines **interactive drawing**, **real-time computation**, and **beautiful mathematical formatting** to create an engaging user experience. Below, we’ll go through why each technology, tool, and technique was used in the project.


# Demo 

[1w.png](https://drive.google.com/file/d/1u9SXeHG-7whiAqtuMKyySofwMUxIEvGJ/view?usp=sharing)


## **Frontend:**

#### **React.js** 💡
- **Why React?**
  - React is a powerful JavaScript library for building dynamic and interactive user interfaces (UI). Since the app needs to respond to user input (such as drawing and interaction with colors), React’s component-based architecture and efficient **virtual DOM** make it the perfect choice.
  - React allows us to create reusable components like buttons, the canvas, and color swatches, which simplifies the UI development and promotes code reusability.
  - Additionally, **React Hooks** (`useState`, `useEffect`, etc.) allow us to manage component states and lifecycle methods in a declarative manner, which leads to cleaner and more maintainable code.

#### **Vite** 🚀
- **Why Vite?**
  - Vite is a **next-generation build tool** that significantly improves the development experience. It provides **instant hot module replacement (HMR)**, so when changes are made to the code, they are reflected in the browser instantly. This makes development faster and more efficient, which is especially important in dynamic applications like this where the UI needs to update frequently based on user interactions.
  - Vite is optimized for **speed** and **bundling**, and it ensures that the app's build process is faster compared to traditional bundlers like Webpack.

#### **TypeScript** 🔧
- **Why TypeScript?**
  - TypeScript is a **superset of JavaScript** that introduces static typing, which helps catch errors at compile time rather than at runtime. In large applications like this, with multiple components and external dependencies, TypeScript provides an added layer of **safety**.
  - It enhances the development experience by offering autocompletion, better error messages, and a more structured codebase, which is particularly useful when dealing with complex logic like math parsing, image handling, and API responses.

#### **MathJax** ✍️
- **Why MathJax?**
  - MathJax is a JavaScript library designed to **render mathematical formulas** written in **LaTeX** or **MathML** into visually appealing HTML. It allows us to display mathematical equations with **precision and readability**, making them suitable for user-facing applications.
  - MathJax integrates seamlessly with the React app, and by using LaTeX, we can ensure that mathematical equations are displayed consistently, regardless of the complexity of the expression.

#### **Axios** 📡
- **Why Axios?**
  - Axios is a popular **HTTP client** that is widely used for making asynchronous requests. We needed to interact with a backend API to send the canvas image (base64) and receive the computed mathematical results.
  - It’s promise-based, which means it supports `async/await` syntax for better handling of asynchronous operations, like fetching data from an API. It’s lightweight and easy to use with React for API calls.

#### **Tailwind CSS** 🖍️
- **Why Tailwind CSS?**
  - Tailwind CSS is a **utility-first CSS framework** that allows for rapid prototyping and building highly customizable designs without writing custom CSS.
  - Since this app has dynamic elements like color swatches, buttons, and a flexible layout, Tailwind provides utility classes that allow for easy styling adjustments. It also promotes **responsive design** and ensures the app looks great on various screen sizes.
  - Tailwind CSS encourages a **modular** approach, which means that styles are applied directly within the JSX, keeping the code **clean and organized**.

---

## **Backend:**
 
 

### 🛠 **Tech Stack**

Here’s the tech stack that powers this awesomeness! ⚡

- **Python** 🐍: The backbone of our logic.
- **FastAPI** 🚀: For a blazing-fast backend and seamless API creation.
- **Google Gemini AI** 🤖: To analyze images and solve mathematical problems.
- **Pydantic** 🛡️: For robust data validation.
- **Pillow (PIL)** 🖼️: For image manipulation and processing.
- **Base64 Encoding** 🔐: To handle image data seamlessly.
- **dotenv** 📂: For secure environment variable management.

---

## 🔑 **Key Features**

✨ **Analyze Images Like a Pro**  
Upload an image containing mathematical expressions, equations, or graphical problems, and let the API do the hard work for you. 💪

✨ **Supports Variable Substitution**  
Pass custom variables via the API to see them in action in your equations! 🧮

✨ **Five Problem Types Supported**  
The API supports the following cases:  
1. Simple Math Expressions: Solve equations like `2 + 2` or `3 * 5`.  
2. System of Equations: Automatically find values for variables like `x` and `y`.  
3. Variable Assignment: Assign values like `x = 5` and use them in expressions.  
4. Graphical Problems: Analyze and solve problems depicted in graphical form.  
5. Abstract Concepts: Understand symbolic representations in images (e.g., love, patriotism). 🌈

✨ **Real-Time Processing**  
The API processes images in real time, providing quick and accurate results! ⏱️

✨ **CORS Enabled**  
Easily integrate this API into your frontend applications with full cross-origin support. 🌐

---

## 🚀 **How It Works**

1. **Step 1**: Upload an image encoded in **Base64** format. 🖼️  
2. **Step 2**: Pass any custom variables as a dictionary in the request payload. 🧮  
3. **Step 3**: The AI analyzes the image, solves problems, and returns results in JSON format. 📄  
4. **Step 4**: Use the response in your application or display it to the user. 🎉  

---

## 📂 **Project Structure**

```
├── main.py                # FastAPI entry point 🚀
├── constants.py           # Environment variables and constants 🔑
├── schema.py              # Pydantic schemas for request validation 📋
├── apps/
│   ├── calculator/
│       ├── route.py       # FastAPI routes for the calculator module 🛤️
│       ├── utils.py       # Logic to analyze images and solve equations 🔍
├── requirements.txt       # Python dependencies 📦
```

---

## 📝 **Endpoints**

### **1. Health Check**  
```http
GET /
```
- **Description**: Check if the server is running! 🩺  
- **Response**: `{ "message": "server is running andi" }`

### **2. Analyze Image**  
```http
POST /calculate
```
- **Description**: Upload an image and get the analysis results. 🧠  
- **Payload**:  
  ```json
  {
    "image": "data:image/png;base64,<BASE64_IMAGE_DATA>",
    "dict_of_vars": {"x": 5, "y": 3}
  }
  ```
- **Response**:  
  ```json
  {
    "message": "Image processed",
    "data": [
        {"expr": "2 + 2", "result": 4, "assign": false},
        {"expr": "x", "result": 5, "assign": true}
    ],
    "status": "success"
  }
  ```

---

## ⚡ **Why These Choices?**

### **FastAPI** 🚀
- Blazing-fast performance for backend development.  
- Auto-generated Swagger UI for API testing! 🔍  

### **Google Gemini AI** 🤖
- Super-smart model to solve mathematical problems and interpret images like a human.  

### **Pillow (PIL)** 🖼️
- Easy-to-use library for handling image data.  

### **Base64 Encoding** 🔐
- Safely send images as strings via API calls.  

### **dotenv** 📂
- Keep your sensitive keys secure and manageable.  

### **CORS Middleware** 🌐
- Ensures seamless integration with frontend apps.

---

## 💻 **Getting Started**

1. Clone this repository:  
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file for your API key:  
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. Run the server:  
   ```bash
   uvicorn main:app --reload
   ```

5. Visit the API docs at:  
   - **Swagger UI**: `http://localhost:8900/docs`  
   - **ReDoc**: `http://localhost:8900/redoc`

 
### **Drawing on Canvas:**
#### **Canvas API** 🖌️
- **Why Canvas API?**
  - The **HTML5 Canvas** API provides an easy and efficient way to **draw graphics** directly in the browser. In this project, the Canvas API is used to capture the user’s mathematical drawings as a **bitmap image**.
  - Using mouse events (`mousedown`, `mousemove`, `mouseup`, `mouseout`), we can track the user's movements and draw lines on the canvas, providing an interactive experience. The Canvas API is highly performant and allows us to easily manipulate pixel-based images, such as extracting a drawn expression and sending it to the backend.

---

### **Backend AI (Math Solving):**
#### **Gemini (or equivalent AI model)** 🤖
- **Why Gemini or AI Model?**
  - The idea is to **automatically interpret** and **solve** the mathematical expressions that users draw. While the math drawing is simple, interpreting the drawn content as a mathematical expression and then solving it requires more than basic parsing.
  - Gemini or an equivalent AI model can recognize mathematical symbols, equations, and variables in the image, convert them into a solvable format, and compute the results. This is crucial for turning the user’s drawing into meaningful math output.
  - We use an AI model that can understand **pattern recognition** and **natural language processing** to interpret both simple and complex mathematical problems that users draw.

---

### **Draggable Components** ✨
- **Why Draggable?**
  - The **Draggable** component is used to make the rendered mathematical expressions and their results movable around the screen. This adds an interactive and user-friendly aspect to the app, allowing users to move answers and equations into different positions on the canvas.
  - It enhances the **UX** by giving the user more control over how they view and organize the mathematical content.

---

### **User Interface & User Experience (UI/UX)** 💡
- **Why this UI Design?**
  - The design of the UI is focused on **simplicity** and **intuitiveness**, so users can focus on drawing and interacting with the math expressions. The **color swatches** let users customize their drawing experience, while the **reset button** ensures that they can quickly clear the canvas and start over if needed.
  - The **Run Button** sends the canvas drawing to the backend, allowing the user to immediately see the solved expression.
  - **Responsive Design** ensures that the app works seamlessly on both desktops and mobile devices, making it accessible to a wider audience.
  - Tailwind’s utility-first approach allows for fast styling adjustments without bloating the codebase.

---

### **Why Real-time Interaction and MathJax?**
- **Real-time Math Rendering**:
  - The app uses **MathJax** to render the math expression solutions in real-time. This is especially important because users need to see their mathematical solutions as **clean, readable** outputs without distractions or formatting issues.
  - **Latex Rendering**: We leverage LaTeX to ensure that even complex mathematical notation (like fractions, integrals, or matrices) is displayed in a neat and readable way.
  
- **Interactive Math Results**:
  - By allowing the user to **drag the answers** and equations, we make it easier for them to manipulate and view the results from different angles. This feature improves **user engagement** and allows for a more **dynamic interaction**.

---

### **Why TypeScript and Static Typing?**
- **Type Safety**:
  - TypeScript adds **static typing** to JavaScript, which helps us avoid common bugs and improves overall code quality. By specifying types for our variables, API responses, and props, we can catch errors early and have better documentation, making the code more maintainable.

---

## ⚙️ **Installation and Setup**



1. **Clone the repository**:
   ```bash
   git clone https://github.com/kamalkolisetty/kamal-windowsToo.git
   ```

2. **Install dependencies**:
   ```bash
   cd windowsToo
   npm install
   ```

### **Frontend Setup (React + Vite + TypeScript)**
 **Start the development server**:
   ```bash
   npm run dev
   ```

### **Backend Setup (FastAPI)**

 **Start the server**:
   ```bash
   pyton main.py
   ```

 

## 🌟 **Future Enhancements**  

### 1. **Undo/Redo Feature 🕰️**  
Introduce **Undo/Redo** functionality to make the system more user-friendly. Users will have the flexibility to revert changes or redo them effortlessly, especially while analyzing complex equations or graphical problems.  

---

### 2. **Model Selection 🤖**  
Provide an option for users to choose from a variety of AI models (e.g., **Google Gemini**, **OpenAI**, or **Hugging Face Transformers**) based on the problem type and their preferences. This will empower users to leverage the best-fit model for their tasks!  

---

### 3. **Interactive Graphical Analysis 📊**  
Enable real-time interaction with graphical solutions—such as zooming, hovering for details, or step-by-step annotations. For instance, solving quadratic equations could dynamically plot roots on a graph for better visualization!  

---

### 4. **OCR Integration for Handwritten Equations ✍️**  
Incorporate **Optical Character Recognition (OCR)** to process handwritten or scanned equations directly. This feature would broaden accessibility and cater to users who prefer to upload written notes instead of typing expressions.  

---

### 5. **Export Results in Multiple Formats 📤**  
Allow users to export analyzed results in formats like **PDF**, **Excel**, or **JSON**. This feature will help users save and share their work efficiently, catering to academic and professional use cases.  




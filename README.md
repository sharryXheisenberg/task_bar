# **TaskBar**

A modern React-based Task Board Application for efficient collaboration within organizations. Built with Vite, TypeScript and Tailwind CSS  this app allows users to organize tasks visually on boards.

## 🚀 Live Project
Check out the live version of the app here: [TaskBar](https://task-bar-sigma.vercel.app/)  
Explore the features and experience the seamless interface directly in your browser!

## **Features**
- **Vite**: Fast development and build tooling.
- **React with Hooks**: For building modern UI components.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **TypeScript**: Type safety and better developer experience.
- **Redux Toolkit**: State management with slices and reducers.
- **Drag-and-Drop**: For elegant notifications in your application.
- **React Router DOM**: Reorder tasks and move them between columns (bonus feature).

## **Functionalities**
1. **Board View**: Create new boards and display all boards in a table.
2. **Board Detail Page**: Create columns (e.g., "To Do", "In Progress", "Done"), add tasks (cards) with details like title, description, priority, due date, and assignee.
3. **Task Management**: Edit, delete, and reorder tasks and columns.
4. **Optimizations**: Local storage for data persistence and efficient data structure.

## **Installation**

### **Step 1: Create a Vite project**
 Install Vite globally (if not already installed):
```bash
npm create vite@latest
```
### **Step 2: Install Tailwind CSS**
1. Install Tailwind CSS and its dependencies:
 ``` bash
npm install -D tailwindcss postcss autoprefixer
 ```
2. Initialize Tailwind configuration:
 ``` bash
 npx tailwindcss init
 ```
3. Update the tailwind.config.js file with the following content to specify which files Tailwind should scan:
  ``` bash
  /** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
# **Scripts**
### **Step 4: Install Required Packages**
1. Install the project dependencies:
``` bash
npm install
```
2. Start the development server with the following command:
``` bash
npm run dev
```
  Open the app in your browser at http://localhost:5173.

3. Build the Project for Production
``` bash
npm run build
```
4. Preview Production Build
``` bash
npm run preview
```
5. Lint the Code
``` bash
npm run lint
```

# **Project structure**
Here is the basic structure of the project:
``` bash
task-bar/
│
├── node_modules/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
```
## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For any queries or suggestions, feel free to reach out via [GitHub Issues](https://github.com/sharryXheisenberg/task_bar/issues).

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux toolkit](https://redux-toolkit.js.org/)
    

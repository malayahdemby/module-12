const mysql = require('mysql');
const inquirer = require('inquirer');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the employee database.');

  // Start the application
  start();
});

// Function to prompt the user for action
function start() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View all departments',
        'View all roles',
        'Add employee',
        'Add department',
        'Add role',
        'Update employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          console.log('Connection closed.');
          break;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Function to view all employees
function viewAllEmployees() {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Function to view all departments
function viewAllDepartments() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Function to view all roles
function viewAllRoles() {
  const query = `
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    LEFT JOIN department ON role.department_id = department.id
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Function to add an employee
function addEmployee()
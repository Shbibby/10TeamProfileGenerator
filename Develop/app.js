const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
  
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

class AskInfo {
  constructor() {
    this.employeeQuestions = [
      // all employees use this template
        {
          type: "input",
          message: "What is the employee's name?",
          name: "name"
        },
        {
          type: "input",
          message: "What is the employee's id?",
          name: "id"
        },
        {
          type: "input",
          message: "What is the employee's email?",
          name: "email"
        }
      ];
    // all employees use this template

    // specific employee-type questions
      this.intern = this.employeeQuestions + {
        type: "input",
        message: "What is the intern's school name?",
        name: "school"
      }

      this.engineer = this.employeeQuestions + {
        type: "input",
        message: "What is the engineer's GitHub?",
        name: "github"
      }

      this.manager = this.employeeQuestions + {
        type: "input",
        message: "What is the manager's office number?",
        name: "officeNumber"
      }
    // specific employee-type questions

    // placeholder to set equal to specified employee type
      this.promptQuestions = {};
    // placeholder to set equal to specified employee type

    // array to save employees user wants to choose
      this.employeesArray = [];
    // array to save employees user wants to choose

    // contains data for if user wants to continue adding employees
      this.boolAddEmployee = true;
    // contains data for if user wants to continue adding employees
  }

  async whichEmployee() {
    return inquirer
      .prompt([{
        type: "list",
        message: "Which employee do you want to add?",
        name: "employee",
        choices: ["intern", "engineer", "manager", "exit"]
      }])
      .then(answers => {
        this.employeesArray += answers.employee;
      })
    //inquirer end
  }

  async askUser(title) {
    let questions = {};
    if (title.toLowerCase() === "intern") {
      questions = this.intern;
    } else if (title.toLowerCase() === "engineer") {
      questions = this.engineer;
    } else if (title.toLowerCase() === "manager") {
      questions = this.manager;
    } else if (title.toLowerCase() === "exit") {
      this.boolAddEmployee = false;
    } else {console.log(`something broke in askUser...`)}
    
    return inquirer
      .prompt(questions)
      .then(answers => {
        
      })
      .catch(error => {
        if(error.isTtyError) {throw error};
      });
    //inquirer end
  }

}


const gh = new AskInfo();
const yt = gh.whichEmployee();
console.log(yt);
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```

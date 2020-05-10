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
  // constructor start
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
        this.intern = this.employeeQuestions.concat([{
          type: "input",
          message: "What is the intern's school name?",
          name: "school"
        }])

        this.engineer = this.employeeQuestions.concat([{
          type: "input",
          message: "What is the engineer's GitHub?",
          name: "github"
        }])

        this.manager = this.employeeQuestions.concat([{
          type: "input",
          message: "What is the manager's office number?",
          name: "officeNumber"
        }])
      // specific employee-type questions

      // htmlTemplates -----------------------------------------------------
        this.internHtmlTemplate = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Intern Name</h5>
            <h6 class="card-subtitle mb-2 text-muted">ID :</h6>
            <h6 class="card-subtitle mb-2 text-muted">Email : </h6>
            <h6 class="card-subtitle mb-2 text-muted">School : </h6>
          </div>
        </div>
        `

        this.engineerHtmlTemplate = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Engineer Name</h5>
            <h6 class="card-subtitle mb-2 text-muted">ID :</h6>
            <h6 class="card-subtitle mb-2 text-muted">Email : </h6>
            <h6 class="card-subtitle mb-2 text-muted">GitHub URL : </h6>
          </div>
        </div>
        `

        this.managerHtmlTemplate = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Manager Name</h5>
            <h6 class="card-subtitle mb-2 text-muted">ID :</h6>
            <h6 class="card-subtitle mb-2 text-muted">Email : </h6>
            <h6 class="card-subtitle mb-2 text-muted">Office Number : </h6>
          </div>
        </div>
        `

        this.wholeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <!-- Bootstrap 4.4.x -->
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>  
  
  <title>test html</title>
</head>
<body>
  <div class="container">

    <div class="card text-center mt-4">
      <!-- Software team header -->
      <div class="card-body">
        <h5 class="card-title">Software Engineering Team</h5>
        <p class="card-text">below is the name, role, ID, and other information based off entered team</p>
      </div>
      <!-- Software team header -->

      <!-- Engineer employee template -->
      <div class="card-footer"><i>Engineers</i></div>


      <!-- Engineer employee template -->

      <!-- Interns employee template -->
      <div class="card-footer"><i>Interns</i></div>
      

      <!-- Interns employee template -->

      <!-- Manager employee template -->
      <div class="card-footer"><i>Managers</i></div>


      <!-- Manager employee template -->

    </div>

  </div>
</body>
</html>
        `
      // htmlTemplates -----------------------------------------------------
    }
  // constructor end

  // asks user which employee type to add
    async whichEmployee() {
      return inquirer
        .prompt([{
          type: "list",
          message: "Which employee do you want to add?",
          name: "employee",
          choices: ["intern", "engineer", "manager", "exit"]
        }])
    }
  // asks user which employee type to add


  // asks user and returns array of employees
    async makeEmployeeArray() {
      let boolContinue = true;
      let employeeArr = [];
      let ans;
      while (boolContinue) {
        ans = (await this.whichEmployee()).employee;
        console.log(ans);
        if (ans === "exit") {
          employeeArr.push(ans);
          boolContinue = false;
          return employeeArr;
        } else {
          employeeArr.push(ans);
        }
      }
    }
  // asks user and returns array of employees

  // intakes employee array and asks questions based on employee
    async askQuestions(employeeArrIndex) {
      let questions = {};
      if (employeeArrIndex === "intern") {
        questions = this.intern;
      } else if (employeeArrIndex === "engineer") {
        questions = this.engineer;
      } else if (employeeArrIndex === "manager") {
        questions = this.manager;
      } else if (employeeArrIndex === "exit") {
       return "exit";
      }
      
      return inquirer
        .prompt(questions)
      //inquirer end
    }
  // intakes employee array and asks questions based on employee

  // intakes employee array and asks and returns answers to questions
    async makeAnswerArray(employeeArr) {
      let answersArray = [];
      let ans;
      for (let i = 0; i < employeeArr.length; i++) {
        ans = await this.askQuestions(employeeArr[i]);
        if (ans === "exit") {
          return answersArray;
        } else {
          answersArray.push(ans)
        }
      }
    }
  // intakes employee array and asks and returns answers to questions

  // takes answer array and organizes for html processing
    organizeArray(answerArray) {
      let internArr = [];
      let engineerArr = [];
      let managerArr = [];
      
      for (let i = 0; i < answerArray.length; i++) {
        if (answerArray[i].school !== undefined) {
          internArr.push(answerArray[i])
        } else if (answerArray[i].github !== undefined) {
          engineerArr.push(answerArray[i])
        } else if (answerArray[i].officeNumber !== undefined) {
          managerArr.push(answerArray[i])
        }
      }
      const organizedArr = [internArr, engineerArr, managerArr];
      return organizedArr;
    }
  // takes answer array and organizes for html processing

  // creates html
    makeHtml() {

    }
  // creates html

}

async function doStuff() {
  const askUser = new AskInfo();
    const teamArr = await askUser.makeEmployeeArray();
    const answerTeamArrQuestion = await askUser.makeAnswerArray(teamArr);
    console.log(answerTeamArrQuestion);
}

doStuff();
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

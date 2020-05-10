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
            <h5 class="card-title"></h5>
            <h6 class="card-subtitle mb-2 text-muted">ID : </h6>
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

  // takes organzied array and employee type and returns html for all employees of that type
    makeHtmlText(array, type) {
      let typeText = ""; 
        let intern = `School : `;
        let engineer = `GitHub URL : `;
        let manager = `Office Number : `;
      let employeeText = "";
      let returnString = "";

      for (let i = 0; i < array.length; i++) {
        if (type === "intern") {
          typeText = intern;
          employeeText = array[i].school;
        } else if (type === "engineer") {
          typeText = engineer;
          employeeText = array[i].github;
        } else if (type === "manager") {
          typeText = manager;
          employeeText = array[i].officeNumber;
        }

        returnString += `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${array[i].name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">ID : ${array[i].id}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Email : ${array[i].email}</h6>
            <h6 class="card-subtitle mb-2 text-muted">${typeText}${employeeText}</h6>
          </div>
        </div>

        `
      }
      return returnString;
    }
  // takes organzied array and employee type and returns html for all employees of that type


  // creates html data
    makeHtml(organizedAnswersArr) {
      let internArr = organizedAnswersArr[0];
      let engineerArr = organizedAnswersArr[1];
      let managerArr = organizedAnswersArr[2];
      
      let engineerHtml = this.makeHtmlText(engineerArr, "engineer");
      let internHtml = this.makeHtmlText(internArr, "intern");
      let managerHtml = this.makeHtmlText(managerArr, "manager");


      const finishedHtml = `
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
              <p class="card-text">below are the names, roles, ID's, and other information based off entered team</p>
            </div>
            <!-- Software team header -->

            <!-- Engineer employee template -->
            <div class="card-footer"><i>Engineers</i></div>

            ${engineerHtml}
            <!-- Engineer employee template -->

            <!-- Interns employee template -->
            <div class="card-footer"><i>Interns</i></div>
            
            ${internHtml}
            <!-- Interns employee template -->

            <!-- Manager employee template -->
            <div class="card-footer"><i>Managers</i></div>

            ${managerHtml}
            <!-- Manager employee template -->

          </div>

        </div>
      </body>
      </html>
      `
      return finishedHtml;
    }
  // creates html data

  // makes html file
    writeHtmlFile(htmlData) {
      fs.writeFile("./output/team.html", htmlData, function(err) {if (err) throw err;});
      console.log("-----File [team.html] has been written to [output] folder-----")
    }
  // makes html file

}

async function doStuff() {
  let dummyArr = [
    {
      name: 'Josh',
      id: 'Josh ID',
      email: 'Josh Email',
      school: 'Josh School'
    },
    {
      name: 'Bill',
      id: 'Bill ID',
      email: 'Bill Email',
      officeNumber: 'Bill Office'
    },
    {
      name: 'Frank',
      id: 'Frank ID',
      email: 'Frank Email',
      github: 'Frank GitHub'
    },
    {
      name: 'Frank2',
      id: 'Frank ID2',
      email: 'Frank Email2',
      github: 'Frank GitHub2'
    },
    {
      name: 'Josh2',
      id: 'Josh ID2',
      email: 'Josh Email2',
      school: 'Josh School2'
    },
    {
      name: 'Bill2',
      id: 'Bill ID2',
      email: 'Bill Email2',
      officeNumber: 'Bill Office2'
    },
    {
      name: 'Frank3',
      id: 'Frank ID3',
      email: 'Frank Email3',
      github: 'Frank GitHub3'
    },
    {
      name: 'Bill3',
      id: 'Bill ID3',
      email: 'Bill Email3',
      officeNumber: 'Bill Office3'
    },
    {
      name: 'Josh3',
      id: 'Josh ID3',
      email: 'Josh Email3',
      school: 'Josh School3'
    }
  ]

  const askUser = new AskInfo();
    const teamArr = await askUser.makeEmployeeArray();//--------------------comment out for dummyArr
    const answerTeamArrQuestion = await askUser.makeAnswerArray(teamArr);// comment out for dummyArr
      // console.log(answerTeamArrQuestion);
      const organizeAnsArr = askUser.organizeArray(answerTeamArrQuestion); // pass dummyArr for quick testing
        // console.log(organizeAnsArr);

    const makeNewHtml = askUser.makeHtml(organizeAnsArr);
      // console.log(makeNewHtml);
      askUser.writeHtmlFile(makeNewHtml);
  console.log("--------All done!--------")
}

doStuff();

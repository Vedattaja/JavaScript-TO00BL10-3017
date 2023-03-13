//defining global variables
var errorMessage = document.getElementById("addTask-error");
var inputBorder = document.getElementById("addTask-input");
var tasks = []; //the list of tasks that contains task items that are a list with the task as a string and boolean for completedness
var tasksDiv = document.getElementById("tasks");
var toShow = ["finished","unfinished"];  //List for controlling the hide / show functions

loadTasksFromLocalStorage(); //Loads tasks and toShow from local storage

function addToTasks() {
  //function to add the input from the page to tasks list
  var textInput = document.getElementById("addTask-input"); //get the user input from the form
  
  
  if (textInput.value.length < 6){ //Control for content length, the else clears the style changes from the error
    redBorder();
  } else {
    errorMessage.style.display = "none";
    inputBorder.style.borderColor = "";
    var singleTask = [];

    singleTask.push(textInput.value);
    singleTask.push(false);
    tasks.push(singleTask);
    
  }
  textInput.value = ""; //clears the form after clicking the button
  
  updateInfo(); //update the page

  
}

function redBorder() {
  //function for displaying the error message for too short input
  errorMessage.textContent = "The input you gave is too short. Please add a task that is longer than 5 characters.";
  errorMessage.style.display = "inline-block";
  inputBorder.style.borderColor = "red";
}

function countTasks() {
  //return the length of tasks list
  return tasks.length;
}

function countCompleted() {
  //counts the amount of task completed from the tasks list, when the value is true task is completed, returns the amount of completed tasks
  var laskuri = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i][1] == true) {
      laskuri++;
    }
  }
  return laskuri;
}

function updateInfo() {
  //function that updates the task counters and controls what is shown on the page
  var taskCount = countTasks();  
  var infoHeader = document.getElementById("info-header");
  infoHeader.innerHTML = "You have "+taskCount+" tasks in our system.";

  var completedCount = countCompleted();
  var completedHeader = document.getElementById("completed-task");
  completedHeader.innerHTML = "Completed tasks: "+completedCount;

  var unfinished = taskCount - completedCount;
  var tasksLeft = document.getElementById("tasks-left");
  tasksLeft.innerHTML = "Task waiting to be completed: "+unfinished;

  clearRows();  //clears the rows before writing them again, this is for preventing the same tasks printing again

  //control for what is shown on the page using the toShow list.
  if (toShow.includes("finished") && toShow.includes("unfinished")) {
    showAll();
    } else if (toShow.includes("finished")) {
      showFinished();
    } else if (toShow.includes("unfinished")) {
      showUnfinished();
    }

  console.log(tasks);
  console.log(toShow);
  saveTasksToLocalStorage();

}

function writeRow(text_input, completed){
  //function that writes the tasks on the page, creates a <p> element that has an event listener that adds strike on the text when clicked to show the completion of the task
  var taskText = text_input;
  var tasksDiv = document.getElementById("tasks");
  var newRowDiv = document.createElement("div");
  newRowDiv.classList.add("row");
  var newTaskText = document.createElement("p");
  newTaskText.classList.add("col-md-12", "my-2");
  newTaskText.textContent = taskText;
  if (completed == true) {
    newTaskText.classList.add("strike")
  }
  newTaskText.addEventListener("click",function(){
    taskClicked()
  })
  // The delete button is added below the text 
  var newButtonDiv = document.createElement("div");
  newButtonDiv.classList.add("col-md-12", "py-2" ,"text-left");
  var newButton = document.createElement("button");
  newButton.classList.add("btn", "btn-dark");
  newButton.textContent = "Delete";
  newRowDiv.appendChild(newTaskText);
  newButtonDiv.appendChild(newButton);
  newRowDiv.appendChild(newButtonDiv);
  tasksDiv.appendChild(newRowDiv);

  newButton.addEventListener("click",deleteTask); //button gets assigned a function that deletes the text and the button when clicked


}

function clearRows() {
  //function for clearing the rows to avoid list getting the same tasks added multiple times
  var tasksDiv = document.getElementById("tasks");
  tasksDiv.innerHTML = ""; // set the content of the tasks div to an empty string to clear all the rows

}

function taskClicked() {
  //function controls the tasks completed part of the tasks list
  var newTaskText = event.target;  //returns the element that was clicked
  var index = Array.from(newTaskText.parentNode.parentNode.children).indexOf(newTaskText.parentNode); //gets index of the clicked text in the tasks list
  //conditional is used for the definition what needs to be done after the click. Is the tasks completed or uncompleted adter a click
  if (newTaskText.classList.contains("strike")) {
    newTaskText.classList.remove("strike");
    tasks[index][1] = false;
  } else {
    newTaskText.classList.add("strike");
    tasks[index][1] = true;

  }
  updateInfo();

  
}

function deleteTask() {
  //fucntion for deleting a task
  var newButton = event.target; //defines which button was clicked
  var newRowDiv = newButton.parentNode.parentNode;
  var index = Array.from(tasksDiv.children).indexOf(newRowDiv);
  tasks.splice(index, 1); //the index of clicked button gets deleted from the tasks list
  updateInfo();
}

function saveTasksToLocalStorage() {
  //function for saving the tasks and toShow in local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('toShow', JSON.stringify(toShow));
}

function loadTasksFromLocalStorage() {
  //function to load the tasks and toShow from the local storage
  var storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    
  }
  var storedToShow = localStorage.getItem('toShow');
  if (storedToShow) {
    toShow = JSON.parse(storedToShow);
  }
  updateInfo();
}

function showFinished(){
  //function that removes "unfinished" from the toShow list and shows only the completed tasks
  removeUnfinished()
  clearRows();

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i][1] === true){
      writeRow(tasks[i][0],tasks[i][1])
    }
    
  }
}

function showUnfinished(){
  //function that removes "finished" from the toShow list and shows only the uncompleted tasks
  removeFinished()
  clearRows();
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i][1] === false){
      writeRow(tasks[i][0],tasks[i][1])
    }
    
  }
}

function showAll(){
  //returns the both original values to the toShow list and shows all tasks on the list
  clearRows();
  toShow = ["finished","unfinished"];
  for (var i = 0; i < tasks.length; i++) {
    writeRow(tasks[i][0],tasks[i][1])    
    
  }

}

function removeFinished() {
  //function removes "finished" from toShow
 if (toShow.includes("finished")) {
    toShow.splice(toShow.indexOf("finished"), 1);
    updateInfo();
  }
}

function removeUnfinished() {
  //function removes "unfininshed" from toShow
  if (toShow.includes("unfinished")) {
    toShow.splice(toShow.indexOf("unfinished"), 1);
    updateInfo();
  }
}

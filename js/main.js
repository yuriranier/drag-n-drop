const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Sit back and relax'];
    progressListArray = ["Check Yuri's portfolio", 'Listen to music'];
    completeListArray = ['Be cool', 'Get stuff done'];
    onHoldListArray = ['Be uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// Filter arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];

  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
      updateDOM();
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// add to Column List, reset text box
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item input box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}
// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows arrays to reflect Drag & Drop items
function rebuildArrays() {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

// When Items Start Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// When a Item Enters The Column Area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// Column Allows for Item toDrop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  // Remove Barckground Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

// Function to update the site's title with user's name

function updateTitle() {
  const nameForm = document.getElementById('name-form');
  const nameInput = document.getElementById('name-input');
  const title = document.getElementById('title');
  const clearBtn = document.getElementById('clear-btn');

  // Retrieve the stored name from local storage
  const storedName = localStorage.getItem('userName');

  if (storedName) {
    // If the name exists in local storage, set it as the initial title
    title.innerHTML = storedName + "'s Kanban Board";
  } else {
    // If the name doesn't exist in local storage, set default
    title.innerHTML = 'Kanban Board';
  }

  // Handle form submission
  nameForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const inputValue = nameInput.value;

    if (inputValue) {
      // Update the title with the user's input
      const concatenatedString = inputValue + "'s Kanban Board";
      title.innerHTML = concatenatedString;

      // Store the user's input in local storage
      localStorage.setItem('userName', inputValue);

      // Empty the input value
      nameInput.value = '';
    }
  });

  // Handle clear button click
  clearBtn.addEventListener('click', function () {
    // Remove the stored name from local storage
    localStorage.removeItem('userName');
    // Reset the title to the default value
    title.innerHTML = 'Kanban Board';
  });
}

function changeTheme() {
  const themeInputs = document.querySelectorAll('input[name="theme"]');
  const rootElement = document.documentElement;

  // Retrieve the stored theme from local storage
  const storedTheme = localStorage.getItem('selectedTheme');

  // Set the initial theme based on the stored value or a default theme
  const initialTheme = storedTheme || 'theme-1';
  rootElement.setAttribute('data-theme', initialTheme);

  // Add event listeners to each theme input
  themeInputs.forEach(function (input) {
    input.addEventListener('click', function () {
      const selectedTheme = this.value;
      rootElement.setAttribute('data-theme', selectedTheme);
      // Store the selected theme in local storage
      localStorage.setItem('selectedTheme', selectedTheme);
    });
  });

  // Check the radio input corresponding to the stored theme
  const radioInput = document.getElementById(storedTheme);
  if (radioInput) {
    radioInput.checked = true;
  } else {
    // If the stored theme doesn't exist, check the default theme
    const defaultRadioInput = document.getElementById('theme-1');
    defaultRadioInput.checked = true;
  }
}

function settingsBtnToggle() {
  let btnClicked = false;
  const settingsBtn = document.querySelector('.settings_btn');
  const settingsBox = document.querySelector('.settings_fields');

  settingsBtn.addEventListener('click', function () {
    settingsBox.classList.toggle('settings_expanded');
  });
}

// On Load
updateDOM();
updateTitle();
changeTheme();
settingsBtnToggle();

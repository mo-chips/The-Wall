
//*****************************************************************************/
// Displays tasks
//******************************************************************************/
if (document.querySelector('.tasks')) {

    document.querySelector('.tasks').textContent = "";
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.sort((a, b) => {
        console.log("Comparing:", a, b);
        const aDate = a.completionDate ? new Date(a.completionDate) : null;
        const bDate = b.completionDate ? new Date(b.completionDate) : null;

        // If aDate is invalid or missing, move it after b
        if (!aDate || isNaN(aDate.getTime())) return 1;
        if (!bDate || isNaN(bDate.getTime())) return -1;

        return aDate - bDate;
    });

    if (tasks.length !== 0) {
        const taskForm = document.createElement('form');

        tasks.forEach((task) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('taskItem');

            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.checked = task.completed || false;

            const infoDiv = document.createElement('div');

            const taskContent = document.createElement('p');
            taskContent.textContent = task.content;

            if (task.completed) {
                taskContent.style.textDecoration = "line-through";
            }

            const dates = document.createElement('p');
            dates.classList.add('taskDates');
            dates.textContent = `Created: ${new Date(task.timestamp).toLocaleString()}    | Complete By: ${new Date(task.completionDate).toLocaleString()}`;

            const now = new Date();
            const completionDate = new Date(task.completionDate);

            if (task.completionDate && (completionDate < now) && !task.completed) {
                dates.style.color = 'red';
            }


            const btnDelete = document.createElement('button');
            btnDelete.setAttribute('type', 'button');
            btnDelete.textContent = "Delete";

            infoDiv.append(taskContent, dates);
            taskItem.append(checkbox, infoDiv, btnDelete);
            taskForm.append(taskItem);

            // --- Checkbox functionality ---
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                const index = tasks.findIndex(t => t.id === task.id);
                if (index !== -1) {
                    tasks[index].completed = task.completed;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                }
                if (task.completed) {
                    taskContent.style.textDecoration = 'line-through';
                } else {
                    taskContent.style.textDecoration = 'none';
                }
            });

            /***********************************************************************************************************
             * Handles task deletion
             **********************************************************************************************************/
            btnDelete.addEventListener('click', () => {
                const index = tasks.findIndex(t => t.id === task.id);
                if (index !== -1) {
                    tasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    taskItem.remove();
                }
            })
        })
        document.querySelector('.tasks').append(taskForm);
    }

}

//********************************************************************* 
// Handles task creation
// ********************************************************************/

//SRC: EXTERNAL
const taskDateInput = document.querySelector('.taskDate');

if (taskDateInput) {
    // Set min date immediately
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    taskDateInput.min = currentDateTime;
}

const btnCreateTask = document.querySelector('.btnCreateTask');
if (btnCreateTask) {
    btnCreateTask.addEventListener('click', () => {
        const content = document.querySelector('.newNote').value;
        const timestamp = new Date();
        const completionDate = document.querySelector('.taskDate').value;

        const newTask = {
            content: content,
            timestamp: timestamp,
            completionDate: completionDate,
            completed: false,
            id: timestamp.getTime().toString(),
        };
        if (newTask.content.trim().length === 0) {
            alert("Cannot save empty task.");
        } else {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            console.log(newTask);
            alert("Task Saved Successfully");
            document.querySelector('.newNote').value = "";
            document.querySelector('.taskDate').value = "";
            location.href = "tasks.html"
        }
    })
}

//******************************************************************************
// Displays notes 
// *****************************************************************************/

if (document.querySelector('.notes')) {


    document.querySelector('.notes').textContent = "";
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        let noteDiv = document.createElement('div');
        noteDiv.classList.add('note');

        let noteContent = document.createElement('p');
        noteContent.textContent = note.content;

        let noteDate = document.createElement('small');
        noteDate.textContent = new Date(note.timestamp).toLocaleString();

        let smallDiv = document.createElement('div');
        smallDiv.classList.add('date');

        smallDiv.append(noteDate);
        noteDiv.append(noteContent);

        let bottom = document.createElement('div');
        bottom.classList.add('bottom');
        bottom.append(smallDiv);

        let btnUpdate = document.createElement('button');
        btnUpdate.classList.add('updateNote');
        btnUpdate.textContent = "View and Update";

        //*****************************************************************************************
        // Handles Updating 
        // ****************************************************************************************/
        btnUpdate.addEventListener('click', function () {
            localStorage.setItem('noteToEdit', JSON.stringify(note));
            location.href = 'updatePage.html';
        });

        let btnDelete = document.createElement('button');
        btnDelete.classList.add('delete');
        btnDelete.textContent = "Delete";

        let btnDiv = document.createElement('div');

        btnDiv.append(btnUpdate, btnDelete);
        bottom.append(btnDiv);
        noteDiv.append(bottom);

        document.querySelector('.notes').append(noteDiv);

        //*******************************************************************
        // Handles note deletion 
        // *******************************************************************/
        btnDelete.addEventListener('click', function () {
            const index = notes.findIndex(n => n.id === note.id);
            if (index !== -1) {
                notes.splice(index, 1);
                localStorage.setItem('notes', JSON.stringify(notes));
                noteDiv.remove;
                location.href = 'index.html';
            }
        })
    })
}
//*****************************************************************************************
// Handles Updating
// ****************************************************************************************/

if (document.querySelector('.newNote')) {
    window.addEventListener('DOMContentLoaded', () => {
        const noteStr = localStorage.getItem('noteToEdit');
        if (noteStr) {
            const note = JSON.parse(noteStr);
            document.querySelector('.newNote').value = note.content;
            const saveChanges = document.querySelector('.btnUpdateNote');
            if (saveChanges) {
                saveChanges.addEventListener('click', function () {
                    let updatedNote = document.querySelector('.newNote').value;
                    const notes = JSON.parse(localStorage.getItem('notes')) || [];
                    const index = notes.findIndex(n => n.id === note.id);
                    if (index !== -1) {
                        notes[index].content = updatedNote;
                        localStorage.setItem('notes', JSON.stringify(notes));
                        alert("Note updated successfully!");
                    }
                    localStorage.removeItem('noteToEdit');
                    location.href = "index.html";
                })
            }
        }
    });
}

//********************************************************************* 
// Handles note creation
// ********************************************************************/
const btnCreate = document.querySelector('.btnCreateNote');
if (btnCreate) {
    btnCreate.addEventListener('click', function () {

        let timestamp = new Date();
        let content = document.querySelector('.newNote').value
        let newNote = {
            timestamp: timestamp,
            content: content,
            id: timestamp.getTime().toString()
        };

        if (newNote.content.trim().length === 0) {
            alert("Cannot save empty note.");
        } else {
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.push(newNote);
            localStorage.setItem('notes', JSON.stringify(notes));
            console.log(newNote);
            alert("Note Saved Successfully");
            document.querySelector('.newNote').value = "";
            location.href = "index.html"
        }
    })
}

const btnCancel = document.querySelector('.btnCancelCreate');

if (btnCancel) {
    btnCancel.addEventListener('click', function () {
        localStorage.removeItem('noteToEdit');
        if (document.querySelector(".btnCreateNote")) {
            location.href = "index.html";
        } else if (document.querySelector('.btnCreateTask')) {
            location.href = "tasks.html";
        } else if (document.querySelector('.btnUpdateNote')) {
            location.href = "index.html";
        }
    })
}

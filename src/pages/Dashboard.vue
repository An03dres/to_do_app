<script setup>
import { ref, onMounted, watch } from 'vue';
import { useTaskStore } from "../store/task";
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const taskStore = useTaskStore();

// Local state for editing task
const editingTask = ref(null); // Will store the selected task to edit
const updatedTaskName = ref(''); // Updated task name

// Function to select a task for editing
const selectTaskForEdit = (task) => {
    editingTask.value = { ...task };
    updatedTaskName.value = task.name;
};

// Function to save changes
const saveTaskChanges = () => {
    if (editingTask.value) {
        taskStore.editTask(editingTask.value.id, { name: updatedTaskName.value });
        editingTask.value = null;
        updatedTaskName.value = '';
    }
};

// Local state for new task form
const newTaskName = ref('');

// Function to add a new task
const addTask = () => {
    if (newTaskName.value.trim() !== '') {
        taskStore.addNewTask({ name: newTaskName.value, status: 'incomplete', user_id: userStore.user.id, due_date: new Date() });
        newTaskName.value = '';
    }
};

// Import the task store
onMounted(async () => {
    if (!userStore.user) {
        await userStore.fetchUser?.();
    }
    if (userStore.user && userStore.user.id) {
        await taskStore.getAllTasksByUser(userStore.user.id);
    }
});

// Watcher in case the user loads later
watch(
    () => userStore.user,
    (newUser) => {
        if (newUser && newUser.id) {
            taskStore.getAllTasksByUser(newUser.id);
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="dashboard">
        <section class="dashboard-content">
            <h2>Add New Task</h2>
            <form @submit.prevent="addTask">
                <input
                    v-model="newTaskName"
                    type="text"
                    placeholder="Task name"
                    required
                />
                <button type="submit">Add Task</button>
            </form>

            <h2>Task List</h2>
            <ul>
                <li v-for="task in taskStore.tasks" :key="task.id">
                    {{ task.name }} - {{ task.status }}
                    <div>
                        <button @click="selectTaskForEdit(task)">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button @click="taskStore.markTaskComplete(task.id)">
                            <i class="fas fa-check"></i> Mark Complete
                        </button>
                        <button @click="taskStore.markTaskIncomplete(task.id)">
                            <i class="fas fa-undo"></i> Mark Incomplete
                        </button>
                        <button @click="taskStore.deleteTask(task.id)">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </li>
            </ul>

            <!-- Edit task form -->
            <div v-if="editingTask" class="edit-form">
                <h3>Editing: {{ editingTask.name }}</h3>
                <input
                    v-model="updatedTaskName"
                    type="text"
                    placeholder="New task name"
                />
                <div class="edit-form-buttons">
                    <button @click="saveTaskChanges">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                    <button @click="editingTask = null" class="cancel">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.dashboard {
    min-height: 100vh;
    width: 100vw;
    background: url('../assets/signin.jpg') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dashboard-content {
    background: rgba(20, 30, 40, 0.75);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border-radius: 36px;
    padding: 3rem 2rem 2.5rem 2rem;
    max-width: 700px;
    width: 100%;
    color: #fff;
    text-align: center;
    backdrop-filter: blur(8px);
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.8s;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px);}
    to { opacity: 1; transform: translateY(0);}
}

h2 {
    color: #fff;
    font-size: 2.6rem;
    font-weight: 800;
    margin-bottom: 28px;
    letter-spacing: 1px;
    text-align: center;
}

form {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    margin-bottom: 36px;
}

input {
    flex: 1;
    padding: 13px 16px;
    border: none;
    border-radius: 12px;
    font-size: 1.1em;
    background: rgba(255,255,255,0.13);
    color: #fff;
    transition: background 0.2s;
    outline: none;
}

input::placeholder {
    color: #cfd8dc;
    opacity: 1;
}

input:focus {
    background: rgba(255,255,255,0.22);
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

li {
    background: rgba(255,255,255,0.13);
    margin-bottom: 18px;
    padding: 18px 14px 14px 14px;
    border-radius: 18px;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.07);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    animation: fadeIn 0.5s;
    transition: box-shadow 0.2s, border 0.2s;
    color: #fff;
    overflow: hidden;
    max-width: 100%;
}

li > div {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
}

button {
    min-width: 110px;
    max-width: 100%;
    padding: 12px 0;
    background: linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%);
    color: #fff;
    border: none;
    border-radius: 18px;
    font-size: 1.05em;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    outline: none;
    margin: 0;
    flex: 1 1 110px;
    word-break: break-word;
}

button:not(:first-child) {
    margin-left: 0;
}

button:hover {
    background: linear-gradient(90deg, #1976d2 0%, #4fc3f7 100%);
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 4px 16px rgba(25, 118, 210, 0.16);
}

button:active {
    transform: scale(0.97);
}

button.cancel {
    background: linear-gradient(90deg, #e57373 60%, #c62828 100%);
}

button.cancel:hover {
    background: linear-gradient(90deg, #c62828 60%, #e57373 100%);
}

.edit-form {
    margin-top: 22px;
    background: rgba(255,255,255,0.13);
    border-radius: 18px;
    padding: 20px 14px;
    animation: fadeIn 0.4s;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.07);
    border: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.edit-form input {
    margin-bottom: 0;
    background: rgba(255,255,255,0.13);
    color: #fff;
}

.edit-form-buttons {
    display: flex;
    gap: 16px;
    width: 100%;
    justify-content: center;
    margin-top: 16px;
}

.edit-form button {
    flex: 1 1 140px;
    margin-top: 0;
    min-width: 120px;
    max-width: 180px;
}

@media (max-width: 700px) {
    .dashboard-content {
        padding: 16px 4px;
        max-width: 98vw;
    }
    li {
        padding: 12px 4px 8px 4px;
    }
    h2 {
        font-size: 1.5rem;
    }
    button {
        min-width: 90px;
        font-size: 0.95em;
        padding: 10px 0;
    }
}
</style>
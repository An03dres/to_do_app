<script setup>
import { ref, onMounted, watch } from 'vue';
import { useTaskStore } from "../store/task";
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const taskStore = useTaskStore();

// Estado local para manejar la tarea que se está editando
const editingTask = ref(null); // Guardará la tarea seleccionada para editar
const updatedTaskName = ref(''); // Nombre actualizado de la tarea

// Función para seleccionar una tarea para editar
const selectTaskForEdit = (task) => {
    editingTask.value = { ...task }; // Copia la tarea seleccionada
    updatedTaskName.value = task.name; // Inicializa el nombre en el formulario
};

// Función para guardar los cambios
const saveTaskChanges = () => {
    if (editingTask.value) {
        taskStore.editTask(editingTask.value.id, { name: updatedTaskName.value });
        editingTask.value = null; // Limpia el estado de edición
        updatedTaskName.value = ''; // Limpia el formulario
    }
};

// Estado local para manejar el formulario de nueva tarea
const newTaskName = ref(''); // Nombre de la nueva tarea

// Función para agregar una nueva tarea
const addTask = () => {
    if (newTaskName.value.trim() !== '') {
        taskStore.addNewTask({ name: newTaskName.value, status: 'incomplete', user_id: userStore.user.id, due_date: new Date() });
        newTaskName.value = ''; // Limpiar el campo del formulario
    }
};

// Importar el store de tareas
onMounted(async () => {
    // Espera a que el usuario esté cargado
    if (!userStore.user) {
        await userStore.fetchUser?.();
    }
    if (userStore.user && userStore.user.id) {
        await taskStore.getAllTasksByUser(userStore.user.id);
    }
});

// Watcher por si el usuario se carga después
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
            <h2>Agregar Nueva Tarea</h2>
            <form @submit.prevent="addTask">
                <input
                    v-model="newTaskName"
                    type="text"
                    placeholder="Nombre de la nueva tarea"
                    required
                />
                <button type="submit">Agregar Tarea</button>
            </form>

            <h2>Lista de tareas</h2>
            <ul>
                <li v-for="task in taskStore.tasks" :key="task.id">
                    {{ task.name }} - {{ task.status }}
                    <div>
                        <button @click="selectTaskForEdit(task)">Editar</button>
                        <button @click="taskStore.markTaskComplete(task.id)">Marcar Completada</button>
                        <button @click="taskStore.markTaskIncomplete(task.id)">Marcar Incompleta</button>
                        <button @click="taskStore.deleteTask(task.id)">Eliminar Tarea</button>
                    </div>
                </li>
            </ul>

            <!-- Formulario para editar la tarea -->
            <div v-if="editingTask">
                <h3>Editando: {{ editingTask.name }}</h3>
                <input
                    v-model="updatedTaskName"
                    type="text"
                    placeholder="Nuevo nombre de la tarea"
                />
                <button @click="saveTaskChanges">Guardar Cambios</button>
                <button @click="editingTask = null">Cancelar</button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.dashboard {
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
}

.dashboard-header {
    background-color: #4CAF50;
    color: white;
    padding: 10px 0;
}

.dashboard-content {
    margin: 20px 0;
}

.dashboard-footer {
    font-size: 0.9em;
    color: #777;
}

form {
    margin-bottom: 20px;
}

input {
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 8px 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

button {
    margin-left: 10px;
}
</style>
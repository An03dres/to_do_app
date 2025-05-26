// stores/counter.js
import { defineStore } from 'pinia';
import { supabase } from '../supabase.js';

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [

        ],
    }),
    actions: {

        // Obtener todas las tareas
        async getAllTasksByUser(id) {
            try {
                let { data: tasks, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', id);
                if (error) {
                    console.log('Error al obtener las tareas:', error);
                }
                if (tasks) {
                    this.tasks = tasks;
                }
            
           } catch (error) {
                console.error('Error al obtener las tareas:', error);
            
           } 
        },
        
        // Agregar una nueva tarea
        async addNewTask(task) {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .insert([
                        { name: task.name, status: task.status, user_id: task.user_id, due_date: task.due_date },
                    ])
                    .select();

                if (error) {
                    console.error('Error al agregar la tarea:', error);
                    return;
                }
                // Recarga todas las tareas para mantener sincronizado el estado
                await this.getAllTasksByUser(task.user_id);
            } catch (error) {
                console.error('Error al agregar la tarea:', error);
            }
        },

        // Editar una tarea existente
        async editTask(taskId, updatedTask) {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .update(updatedTask)
                    .eq('id', taskId)
                    .select();
                if (error) {
                    console.error('Error al editar la tarea:', error);
                    return;
                }
                // Actualiza el estado local solo si la actualización fue exitosa
                if (data && data.length > 0) {
                    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...data[0] };
                    }
                }
            } catch (error) {
                console.error('Error al editar la tarea:', error);
            }
        },

        // Marcar una tarea como completada
        async markTaskComplete(taskId) {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .update({ status: 'complete' })
                    .eq('id', taskId)
                    .select();
                if (error) {
                    console.error('Error al marcar la tarea como completada:', error);
                    return;
                }
                // Actualiza el estado local solo si la actualización fue exitosa
                if (data && data.length > 0) {
                    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...data[0] };
                    }
                }
            } catch (error) {
                console.error('Error al marcar la tarea como completada:', error);
            }
        },

        // Marcar una tarea como incompleta
        async markTaskIncomplete(taskId) {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .update({ status: 'incomplete' })
                    .eq('id', taskId)
                    .select();
                if (error) {
                    console.error('Error al marcar la tarea como incompleta:', error);
                    return;
                }
                // Actualiza el estado local solo si la actualización fue exitosa
                if (data && data.length > 0) {
                    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...data[0] };
                    }
                }
            } catch (error) {
                console.error('Error al marcar la tarea como incompleta:', error);
            }
        },

        // Eliminar una tarea
        async deleteTask(taskId) {
            try {
                const { error } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', taskId);
                if (error) {
                    console.error('Error al eliminar la tarea:', error);
                    return;
                }
                // Si la eliminación fue exitosa, actualiza el estado local
                this.tasks = this.tasks.filter(task => task.id !== taskId);
            } catch (error) {
                console.error('Error al eliminar la tarea:', error);
            }
        },
    },
});


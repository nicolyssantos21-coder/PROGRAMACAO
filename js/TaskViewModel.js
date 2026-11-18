
// TaskViewModel.js - O cérebro do Front-end
class TaskViewModel {

    constructor() {
        this.tasks = [];
        this.init();
    }

    async init() {
        // Mapeia elementos da View
        this.listElement = document.getElementById('taskList');
        this.inputElement = document.getElementById('taskTitle');
        this.dateElement = document.getElementById('taskDate');
        this.addBtn = document.getElementById('addBtn');

        // Evento do botão adicionar
        this.addBtn.onclick = () => this.addTask();

        // Busca as tarefas iniciais
        await this.fetchTasks();
    }

    // Busca dados da API
    async fetchTasks() {
        try {
            const response = await fetch('api.php?action=list');

            if (!response.ok) {
                throw new Error('Erro ao buscar tarefas');
            }

            this.tasks = await response.json();
            this.render();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Adiciona uma tarefa
    async addTask() {
        const title = this.inputElement.value.trim();
        const dueDate = this.dateElement.value;

        if (!title) {
            return alert('Digite o título da tarefa!');
        }

        if (!dueDate) {
            return alert('Selecione uma data!');
        }

        try {
            const response = await fetch('api.php?action=create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    description: '',
                    due_date: dueDate
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao adicionar');
            }

            this.inputElement.value = '';
            this.dateElement.value = '';

            await this.fetchTasks();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Marca tarefa como concluída
    async completeTask(id) {
        try {
            const response = await fetch(
                `api.php?action=complete&id=${id}`
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao concluir tarefa');
            }

            await this.fetchTasks();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Exclui uma tarefa
    async deleteTask(id) {
        if (!confirm('Deseja realmente excluir esta tarefa?')) {
            return;
        }

        try {
            const response = await fetch(
                `api.php?action=delete&id=${id}`
            );

            if (!response.ok) {
                throw new Error('Erro ao excluir tarefa');
            }

            await this.fetchTasks();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Atualiza a View
    render() {
        this.listElement.innerHTML = '';

        if (this.tasks.length === 0) {
            const message = document.createElement('li');
            message.textContent = 'Nenhuma tarefa cadastrada.';
            message.className = 'empty-message';

            this.listElement.appendChild(message);
            return;
        }

        this.tasks.forEach(task => {

            const li = document.createElement('li');

            li.className = task.done ? 'done' : '';

            // Título
            const title = document.createElement('div');
            title.className = 'task-title';
            title.textContent = task.title;

            // Informações
            const info = document.createElement('div');
            info.className = 'task-info';
            info.textContent = `Vence em: ${task.due_date}`;

            // Botões
            const actions = document.createElement('div');
            actions.className = 'task-actions';

            // Botão concluir
            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn-complete';
            completeBtn.textContent = '✔';
            completeBtn.title = 'Concluir tarefa';

            if (task.done) {
                completeBtn.textContent = '✓';
                completeBtn.disabled = true;
                completeBtn.style.opacity = '0.5';
                completeBtn.style.cursor = 'default';
            } else {
                completeBtn.onclick = () => this.completeTask(task.id);
            }

            // Botão excluir
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = '✖';
            deleteBtn.title = 'Excluir tarefa';
            deleteBtn.onclick = () => this.deleteTask(task.id);

            actions.appendChild(completeBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(title);
            li.appendChild(info);
            li.appendChild(actions);

            this.listElement.appendChild(li);
        });
    }
}

// Instancia a ViewModel
const vm = new TaskViewModel();

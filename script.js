// Seleciona os elementos do DOM
const taskInput = document.getElementById('task-input');
const taskDateInput = document.getElementById('task-date');
const taskPriorityInput = document.getElementById('task-priority');
const addTaskButton = document.getElementById('add-task');
const tasksList = document.getElementById('tasks');
const calendarContainer = document.getElementById('calendar-container');
const currentMonthSpan = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const calendarDaysContainer = document.getElementById('calendar-days');
const yearSelect = document.getElementById('year-select');

let currentDate = new Date();
let selectedDate = null;

// Função para formatar a data no formato brasileiro DD/MM/AAAA
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Função para gerar os anos no select
function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50; // 50 anos antes
    const endYear = currentYear + 50;   // 50 anos depois

    for (let i = startYear; i <= endYear; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    yearSelect.value = currentYear; // Define o ano atual como selecionado
}

// Função para gerar os dias do calendário
function generateCalendarDays() {
    const year = parseInt(yearSelect.value, 10);
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    const startDay = firstDayOfMonth.getDay(); // 0 (Domingo) - 6 (Sábado)
    const days = [];

    // Adiciona dias "vazios" no início do mês para alinhar corretamente
    for (let i = 0; i < startDay; i++) {
        days.push('<span class="inactive"></span>');
    }

    // Adiciona os dias do mês
    for (let i = 1; i <= totalDays; i++) {
        days.push(`<span data-day="${i}">${i}</span>`);
    }

    calendarDaysContainer.innerHTML = days.join('');

    // Atualiza o mês atual no cabeçalho
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    currentMonthSpan.textContent = monthNames[month] + ' ' + year;

    // Adiciona evento de clique aos dias
    document.querySelectorAll('#calendar-days span:not(.inactive)').forEach(day => {
        day.addEventListener('click', function() {
            selectedDate = new Date(year, month, this.dataset.day);
            taskDateInput.value = formatDate(selectedDate);

            // Remove a classe "selected" de todos os dias
            document.querySelectorAll('#calendar-days span').forEach(d => d.classList.remove('selected'));

            // Adiciona a classe "selected" ao dia clicado
            this.classList.add('selected');
        });
    });
}

// Eventos para mudar de mês
prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendarDays();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendarDays();
});

// Evento para mudar de ano
yearSelect.addEventListener('change', () => {
    generateCalendarDays();
});

// Inicializa o calendário e os anos
generateYearOptions();
generateCalendarDays();

// Função para adicionar uma nova tarefa
function addTask() {
    const taskName = taskInput.value.trim();
    const taskDate = taskDateInput.value;
    const taskPriority = taskPriorityInput.value;

    if (!taskName || !taskDate) {
        alert('Por favor, preencha o nome e a data da tarefa.');
        return;
    }

    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <div class="task-content">
            <span class="task-name">${taskName}</span>
            <span class="task-date">Data: ${taskDate}</span>
            <span class="task-priority">Prioridade: ${taskPriority}</span>
        </div>
        <div class="task-buttons">
            <button class="complete">Concluir</button>
            <button class="delete">Deletar</button>
        </div>
    `;

    const completeButton = taskItem.querySelector('.complete');
    completeButton.addEventListener('click', completeTask);

    const deleteButton = taskItem.querySelector('.delete');
    deleteButton.addEventListener('click', deleteTask);

    tasksList.appendChild(taskItem);
    taskInput.value = '';
}

// Função para marcar a tarefa como concluída
function completeTask(event) {
    const taskItem = event.target.closest('li');
    taskItem.classList.toggle('completed');
}

// Função para deletar a tarefa
function deleteTask(event) {
    const taskItem = event.target.closest('li');
    taskItem.remove();
}

// Adiciona eventos
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});
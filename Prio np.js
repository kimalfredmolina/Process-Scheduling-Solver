let processCount = 0;

function addRow() {
    processCount++;
    const table = document.getElementById("inputTable");
    const newRow = table.insertRow(-1);
    const processCell = newRow.insertCell(0);
    const arrivalCell = newRow.insertCell(1);
    const burstCell = newRow.insertCell(2);
    const priorityCell = newRow.insertCell(3);
    processCell.textContent = "P" + processCount;
    arrivalCell.innerHTML = "<input type='number' min='0' id='arrivalTime" + processCount + "'>";
    burstCell.innerHTML = "<input type='number' min='1' id='burstTime" + processCount + "'>";
    priorityCell.innerHTML = "<input type='number' min='1' id='priority" + processCount + "'>";
}

function compute() {
    const table = document.getElementById("inputTable");
    let processes = [];
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let currentTime = 0;
    let timeSlots = [];

    for (let i = 1; i <= processCount; i++) {
        const row = table.rows[i];
        while (row.cells.length > 4) {
            row.deleteCell(4); 
        }
    }

    for (let i = 1; i <= processCount; i++) {
        const arrivalTime = parseInt(document.getElementById("arrivalTime" + i).value, 10);
        const burstTime = parseInt(document.getElementById("burstTime" + i).value, 10);
        const priority = parseInt(document.getElementById("priority" + i).value, 10);
        if (!isNaN(arrivalTime) && !isNaN(burstTime) && !isNaN(priority)) {
            processes.push({ process: "P" + i, arrivalTime, burstTime, priority, index: i });
        }
    }

    if (processes.length === 0) {
        document.getElementById('average').innerHTML = `<p>At least 1 process with valid data is required for computation.</p>`;
        return;
    }

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = '<div class="gantt-container"></div><div class="gantt-timeline"></div>';
    const ganttContainer = ganttChart.querySelector('.gantt-container');
    const ganttTimeline = ganttChart.querySelector('.gantt-timeline');

    while (processes.length > 0) {
        let availableProcesses = processes.filter(p => p.arrivalTime <= currentTime);
        if (availableProcesses.length === 0) {
            currentTime = processes[0].arrivalTime;
            availableProcesses = processes.filter(p => p.arrivalTime <= currentTime);
        }

        availableProcesses.sort((a, b) => a.priority - b.priority);

        const currentProcess = availableProcesses[0];
        const startTime = currentTime;
        const finishTime = startTime + currentProcess.burstTime;
        const turnaroundTime = finishTime - currentProcess.arrivalTime;
        const waitingTime = startTime - currentProcess.arrivalTime;

        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        timeSlots.push({startTime, finishTime});

        createGanttBlock(ganttContainer, currentProcess.process, startTime, finishTime);
        currentTime = finishTime;

        const currentRow = table.rows[currentProcess.index];
        currentRow.insertCell(4).textContent = finishTime;
        currentRow.insertCell(5).textContent = turnaroundTime;
        currentRow.insertCell(6).textContent = waitingTime;

        processes = processes.filter(p => p !== currentProcess);
    }

    addTimelineNumbers(ganttTimeline, timeSlots);

    if (processCount > 0) {
        const averageTurnaroundTime = totalTurnaroundTime / processCount;
        const averageWaitingTime = totalWaitingTime / processCount;
        document.getElementById('average').innerHTML = `<p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p><p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>`;
    }
}

function createGanttBlock(container, label, startTime, finishTime, additionalClass = '') {
    const duration = finishTime - startTime;
    const scaleFactor = 20; // Scale factor for the Gantt chart blocks
    const block = document.createElement('div');
    block.className = `gantt-block ${additionalClass}`;
    block.textContent = label;
    block.style.width = `${duration * scaleFactor}px`;
    container.appendChild(block);
}

function addTimelineNumbers(ganttTimeline, timeSlots) {
    const scaleFactor = 20; // Assuming this is the scale factor used in the rest of your code
    ganttTimeline.innerHTML = '';

    // Start with the first time label at zero
    let lastFinishTime = 0;
    const createLabel = (time) => {
        const timeLabel = document.createElement('span');
        timeLabel.textContent = time;
        timeLabel.className = 'gantt-time';
        timeLabel.style.left = `${time * scaleFactor}px`;
        ganttTimeline.appendChild(timeLabel);
    };

    createLabel(0); // Add the initial label for the start time

    timeSlots.forEach(slot => {
        // Check if there is a gap between last finish time and the current slot's start time
        if (lastFinishTime !== slot.startTime) {
            createLabel(slot.startTime);
        }

        createLabel(slot.finishTime);
        lastFinishTime = slot.finishTime;
    });
}


document.addEventListener('DOMContentLoaded', addRow);

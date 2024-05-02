let processCount = 0;

function addRow() {
    processCount++;
    const table = document.getElementById("inputTable");
    const newRow = table.insertRow(-1);
    const processCell = newRow.insertCell(0);
    const arrivalCell = newRow.insertCell(1);
    const burstCell = newRow.insertCell(2);
    const priorityCell = newRow.insertCell(3); 
    processCell.innerHTML = "P" + processCount;
    arrivalCell.innerHTML = "<input type='number' id='arrivalTime" + processCount + "'>";
    burstCell.innerHTML = "<input type='number' id='burstTime" + processCount + "'>";
}

function compute() {
    const table = document.getElementById("inputTable");
    const processes = [];
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let currentTime = 0;
    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = '<div class="gantt-container"></div><div class="gantt-timeline"></div>';

    const ganttContainer = ganttChart.querySelector('.gantt-container');
    const ganttTimeline = ganttChart.querySelector('.gantt-timeline');

    // Clear existing results from the table
    for (let i = 1; i <= processCount; i++) {
        const row = table.rows[i];
        while (row.cells.length > 4) {
            row.deleteCell(4); // Keep only the first four cells (Process, Arrival Time, Burst Time, Priorities)
        }
    }

    for (let i = 1; i <= processCount; i++) {
        const arrivalTime = parseInt(document.getElementById("arrivalTime" + i).value, 10);
        const burstTime = parseInt(document.getElementById("burstTime" + i).value, 10);
        const priority = parseInt(document.getElementById("priority" + i).value, 10);
        processes.push({ process: "P" + i, arrivalTime, burstTime, priority, remainingTime: burstTime, index: i });
    }
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime || a.priority - b.priority);

    let lastFinishTime = 0;
    let timeSlots = [];

    while (processes.length > 0) {
        let currentProcessIndex = processes.findIndex(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
        if (currentProcessIndex === -1) {
            if (processes.some(p => p.remainingTime > 0)) {
                currentTime++;
                continue;
            } else {
                break;
            }
        }

        let currentProcess = processes[currentProcessIndex];
        processes.sort((a, b) => (a.priority - b.priority) || (a.arrivalTime - b.arrivalTime));

        let nextProcessTime = Math.min(...processes.filter(p => p.arrivalTime > currentTime && p.remainingTime > 0).map(p => p.arrivalTime));
        let timeSlice = nextProcessTime ? Math.min(currentProcess.remainingTime, nextProcessTime - currentTime) : currentProcess.remainingTime;

        let startTime = currentTime;
        let finishTime = startTime + timeSlice;

        currentProcess.remainingTime -= timeSlice;
        currentTime += timeSlice;

        if (currentProcess.remainingTime === 0) {
            let turnaroundTime = currentTime - currentProcess.arrivalTime;
            let waitingTime = turnaroundTime - currentProcess.burstTime;
            totalTurnaroundTime += turnaroundTime;
            totalWaitingTime += waitingTime;
            const currentRow = table.rows[currentProcess.index];
            currentRow.insertCell(4).textContent = currentTime;
            currentRow.insertCell(5).textContent = turnaroundTime;
            currentRow.insertCell(6).textContent = waitingTime;
        }

        timeSlots.push({ startTime, finishTime });

        if (startTime > lastFinishTime) {
            createGanttBlock(ganttContainer, 'Idle', lastFinishTime, startTime, 'idle');
            timeSlots.push({ startTime: lastFinishTime, finishTime: startTime });
        }
        createGanttBlock(ganttContainer, currentProcess.process, startTime, finishTime);
        lastFinishTime = finishTime;
    }

    addTimelineNumbers(ganttTimeline, timeSlots);

    if (processCount === 0) {
        document.getElementById('average').innerHTML = `<p>At least 1 process is required for computation</p>`;
    } else {
        const averageTurnaroundTime = totalTurnaroundTime / processCount;
        const averageWaitingTime = totalWaitingTime / processCount;
        document.getElementById('average').innerHTML = `<p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p><p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>`;
    }
}

function createGanttBlock(container, label, startTime, finishTime, additionalClass = '') {
    const duration = finishTime - startTime;
    const scaleFactor = 20;
    const block = document.createElement('div');
    block.className = `gantt-block ${additionalClass}`;
    block.textContent = label;
    block.style.width = `${duration * scaleFactor}px`;
    container.appendChild(block);
}

function addTimelineNumbers(ganttTimeline, timeSlots) {
    const scaleFactor = 20;
    ganttTimeline.innerHTML = '';
    let cumulativeWidth = 0;

    const initialIdle = timeSlots[0].startTime > 0;
    if (initialIdle) {
        cumulativeWidth += timeSlots[0].startTime * scaleFactor;
    }

    const startingPointLabel = document.createElement('span');
    startingPointLabel.textContent = timeSlots[0].startTime;
    startingPointLabel.className = 'gantt-time';
    startingPointLabel.style.left = '0px';
    ganttTimeline.appendChild(startingPointLabel);

    timeSlots.forEach(slot => {
        const blockWidth = (slot.finishTime - slot.startTime) * scaleFactor;
        const timeLabelSpan = document.createElement('span');
        timeLabelSpan.textContent = slot.finishTime;
        timeLabelSpan.className = 'gantt-time';
        timeLabelSpan.style.left = `${cumulativeWidth + blockWidth}px`;
        ganttTimeline.appendChild(timeLabelSpan);
        cumulativeWidth += blockWidth;
    });

    if (!initialIdle) {
        const finalLabel = document.createElement('span');
        finalLabel.textContent = timeSlots[timeSlots.length - 1].finishTime;
        finalLabel.className = 'gantt-time';
        finalLabel.style.left = `${cumulativeWidth}px`;
        ganttTimeline.appendChild(finalLabel);
    }
}

document.addEventListener('DOMContentLoaded', addRow);


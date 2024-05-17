let processCount = 0;

function addRow() {
    processCount++;
    const table = document.getElementById("inputTable");
    const newRow = table.insertRow(-1);
    const processCell = newRow.insertCell(0);
    const arrivalCell = newRow.insertCell(1);
    const burstCell = newRow.insertCell(2);
    processCell.innerHTML = "P" + processCount;
    arrivalCell.innerHTML = "<input type='number' id='arrivalTime" + processCount + "'>";
    burstCell.innerHTML = "<input type='number' id='burstTime" + processCount + "'>";
}

function compute() {
    const quantum = parseInt(document.getElementById('timeQuantum').value, 10);
    const table = document.getElementById("inputTable");
    let processes = [];
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let currentTime = 0;
    let lastProcessEnd = 0;

    // Reset table
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        if (row.cells.length > 3) {
            row.deleteCell(5);
            row.deleteCell(4);
            row.deleteCell(3);
        }
    }

    // Read all processes
    for (let i = 1; i <= processCount; i++) {
        const arrivalTime = parseInt(document.getElementById("arrivalTime" + i).value, 10);
        const burstTime = parseInt(document.getElementById("burstTime" + i).value, 10);
        processes.push({ process: "P" + i, arrivalTime, burstTime, remainingTime: burstTime, startTime: -1, endTime: -1 });
    }
    
    // Sort by arrival time initially
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Setup initial queue
    let queue = processes.filter(p => p.arrivalTime <= currentTime);
    let ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = '<div class="gantt-container"></div><div class="gantt-timeline"></div>';
    const ganttContainer = ganttChart.querySelector('.gantt-container');
    const ganttTimeline = ganttChart.querySelector('.gantt-timeline');

    while (queue.length > 0 || processes.some(p => p.remainingTime > 0)) {
        if (queue.length === 0) {
            // Find the next process that will arrive and fast forward time
            let nextProcess = processes.find(p => p.remainingTime > 0);
            if (nextProcess) {
                currentTime = nextProcess.arrivalTime;
                queue.push(nextProcess);
            }
        }

        let process = queue.shift();
        let startTime = Math.max(currentTime, process.arrivalTime);
        if (process.startTime === -1) {
            process.startTime = startTime;  // Mark the start time for turnaround calculation
        }

        let runTime = Math.min(process.remainingTime, quantum);
        let finishTime = startTime + runTime;

        process.remainingTime -= runTime;
        currentTime = finishTime;

        createGanttBlock(ganttContainer, process.process, startTime, finishTime, process.remainingTime > 0 ? '' : 'completed');

        if (process.remainingTime > 0) {
            queue.push(process);  // Requeue if still has remaining time
        } else {
            process.endTime = finishTime;
            let turnaroundTime = process.endTime - process.arrivalTime;
            let waitingTime = turnaroundTime - process.burstTime;
            totalTurnaroundTime += turnaroundTime;
            totalWaitingTime += waitingTime;

            const currentRow = table.rows[processes.indexOf(process) + 1];
            currentRow.insertCell(3).textContent = process.endTime;
            currentRow.insertCell(4).textContent = turnaroundTime;
            currentRow.insertCell(5).textContent = waitingTime;
        }

        // Include new processes that arrive during the current process execution
        let newProcesses = processes.filter(p => p.arrivalTime > lastProcessEnd && p.arrivalTime <= currentTime && p.remainingTime > 0);
        queue.push(...newProcesses);
        lastProcessEnd = currentTime;
    }

    addTimelineNumbers(ganttTimeline, currentTime, quantum); // Pass the quantum value

    const averageTurnaroundTime = totalTurnaroundTime / processCount;
    const averageWaitingTime = totalWaitingTime / processCount;
    document.getElementById('average').innerHTML = `<p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p><p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>`;
}

function createGanttBlock(container, label, startTime, finishTime, additionalClass) {
    const duration = finishTime - startTime;
    const scaleFactor = 20; 
    const block = document.createElement('div');
    block.className = `gantt-block ${additionalClass}`;
    block.textContent = label;
    block.style.width = `${duration * scaleFactor}px`;
    container.appendChild(block);
}

function addTimelineNumbers(ganttTimeline, maxTime, quantum) {
    const scaleFactor = 20;
    ganttTimeline.innerHTML = '';
    for (let time = 0; time <= maxTime; time += quantum) { // Adjusting to use the quantum
        const timeLabelSpan = document.createElement('span');
        timeLabelSpan.textContent = time;
        timeLabelSpan.className = 'gantt-time';
        timeLabelSpan.style.left = `${time * scaleFactor}px`;
        ganttTimeline.appendChild(timeLabelSpan);
    }
}

document.addEventListener('DOMContentLoaded', addRow);

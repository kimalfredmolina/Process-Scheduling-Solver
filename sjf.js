let processCount = 0;

function addRow() { //Button to add a row 
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

function compute() { //compute button
    const table = document.getElementById("inputTable");
    const processes = [];
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let currentTime = 0;
    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = '<div class="gantt-container"></div><div class="gantt-timeline"></div>';

    const ganttContainer = ganttChart.querySelector('.gantt-container');
    const ganttTimeline = ganttChart.querySelector('.gantt-timeline');

    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        if (row.cells.length > 3) {
            row.deleteCell(5);
            row.deleteCell(4);
            row.deleteCell(3);
        }
    }

    for (let i = 1; i <= processCount; i++) {
        const arrivalTime = parseInt(document.getElementById("arrivalTime" + i).value, 10);
        const burstTime = parseInt(document.getElementById("burstTime" + i).value, 10);
        processes.push({ process: "P" + i, arrivalTime, burstTime, index: i });
    }

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let lastFinishTime = 0;
    let timeSlots = [];
    let readyQueue = [];
    let nextArrivalIndex = 0;

    while (processes.length > nextArrivalIndex || readyQueue.length > 0) {
        while (processes.length > nextArrivalIndex && processes[nextArrivalIndex].arrivalTime <= lastFinishTime) {
            readyQueue.push(processes[nextArrivalIndex]);
            nextArrivalIndex++;
        }

        if (readyQueue.length === 0 && processes.length > nextArrivalIndex) {
            const nextProcess = processes[nextArrivalIndex];
            createGanttBlock(ganttContainer, 'Idle', lastFinishTime, nextProcess.arrivalTime, 'idle');
            lastFinishTime = nextProcess.arrivalTime;
            continue;
        }

        readyQueue.sort((a, b) => a.burstTime - b.burstTime);
        const process = readyQueue.shift();

        let startTime = Math.max(lastFinishTime, process.arrivalTime);
        let finishTime = startTime + process.burstTime;
        let turnaroundTime = finishTime - process.arrivalTime;
        let waitingTime = startTime - process.arrivalTime;

        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;

        timeSlots.push({ startTime, finishTime });

        createGanttBlock(ganttContainer, process.process, startTime, finishTime);

        lastFinishTime = finishTime;

        const currentRow = table.rows[process.index];
        currentRow.insertCell(3).textContent = finishTime;
        currentRow.insertCell(4).textContent = turnaroundTime;
        currentRow.insertCell(5).textContent = waitingTime;
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

function createGanttBlock(container, label, startTime, finishTime, additionalClass = '') { //for gantt chart
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

//qiwebipqbwebqwbepqbwpebqpuwbepqbwpoe

document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration - replace with your actual config if needed
    const firebaseConfig = {
        apiKey: "AIzaSyB8ahFiUfy7f2LH8KAXrelKIrXkXse4NyQ",
        authDomain: "mut-directory-admin.firebaseapp.com",
        projectId: "mut-directory-admin",
        storageBucket: "mut-directory-admin.appspot.com",
        messagingSenderId: "526530912413",
        appId: "1:526530912413:web:555780ed7d632177693474",
        measurementId: "G-49F3X4J2C4"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    const programButtons = document.querySelectorAll('.program-btn');
    const levelButtons = document.querySelectorAll('.level-btn');
    const timetableInfo = document.getElementById('timetableInfo');
    const dynamicTimetableContent = document.getElementById('dynamicTimetableContent');

    // Initially load all timetables
    loadAndRenderTimetables('all', 'all');

    // Program selection
    programButtons.forEach(button => {
        button.addEventListener('click', function() {
            programButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const selectedProgram = this.dataset.program;
            const selectedLevel = getSelectedLevel();
            loadAndRenderTimetables(selectedProgram, selectedLevel);
        });
    });

    // Level selection
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            levelButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const selectedLevel = this.dataset.level;
            const selectedProgram = getSelectedProgram();
            loadAndRenderTimetables(selectedProgram, selectedLevel);
        });
    });

    function getSelectedProgram() {
        const activeProgramButton = document.querySelector('.program-btn.active');
        return activeProgramButton ? activeProgramButton.dataset.program : 'all';
    }

    function getSelectedLevel() {
        const activeLevelButton = document.querySelector('.level-btn.active');
        return activeLevelButton ? activeLevelButton.dataset.level : 'all';
    }

    // Load timetables from Firestore and render
    function loadAndRenderTimetables(program, level) {
        timetableInfo.textContent = 'Loading timetable data...';
        dynamicTimetableContent.innerHTML = '';

        let query = db.collection('timetables');

        if (program && program !== 'all') {
            query = query.where('program', '==', program);
        }
        if (level && level !== 'all') {
            query = query.where('level', '==', level);
        }

        query.get().then(snapshot => {
            if (snapshot.empty) {
                timetableInfo.textContent = 'No timetables found for the selected program and level.';
                return;
            }

            timetableInfo.textContent = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const timetableElement = createTimetableElement(data);
                dynamicTimetableContent.appendChild(timetableElement);
            });
        }).catch(error => {
            console.error('Error loading timetables:', error);
            timetableInfo.textContent = 'Failed to load timetable data. Please try again later.';
        });
    }

    // Create timetable HTML element from data
    function createTimetableElement(data) {
        const container = document.createElement('div');
        container.classList.add('level-timetable', 'mb-5');
        container.dataset.program = data.program || '';
        container.dataset.level = data.level || '';

        const title = document.createElement('h4');
        title.textContent = `${getProgramName(data.program)} - Year ${data.level} - Semester ${data.semester}`;
        container.appendChild(title);

        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-responsive');

        const table = document.createElement('table');
        table.classList.add('timetable', 'table-bordered');

        // Table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Time/Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table body
        const tbody = document.createElement('tbody');

        if (Array.isArray(data.entries)) {
            data.entries.forEach(entry => {
                const row = document.createElement('tr');

                const timeCell = document.createElement('td');
                timeCell.textContent = entry.time || '';
                row.appendChild(timeCell);

                ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
                    const cell = document.createElement('td');
                    cell.textContent = entry[day] || '';
                    // Optionally add class based on content type (lecture, lab, tutorial, break)
                    if (entry[day]) {
                        const lowerText = entry[day].toLowerCase();
                        if (lowerText.includes('lecture')) {
                            cell.classList.add('lecture');
                        } else if (lowerText.includes('lab')) {
                            cell.classList.add('lab');
                        } else if (lowerText.includes('tutorial')) {
                            cell.classList.add('tutorial');
                        } else if (lowerText.includes('break')) {
                            cell.classList.add('break');
                        }
                    }
                    row.appendChild(cell);
                });

                tbody.appendChild(row);
            });
        }

        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        container.appendChild(tableWrapper);

        return container;
    }

    // Helper to get program full name from code
    function getProgramName(code) {
        switch(code) {
            case 'ecp': return 'Extended Curriculum Program (ECP)';
            case 'dip': return 'Diploma in IT';
            case 'adv': return 'Advanced Diploma';
            case 'pg': return 'Postgraduate';
            default: return 'Unknown Program';
        }
    }
});

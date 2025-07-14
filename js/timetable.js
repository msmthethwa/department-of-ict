// Program and level selection functionality
document.addEventListener('DOMContentLoaded', function() {
    const programButtons = document.querySelectorAll('.program-btn');
    const levelButtons = document.querySelectorAll('.level-btn');
    const timetableSections = document.querySelectorAll('.timetable-section');
    const levelTimetables = document.querySelectorAll('.level-timetable');
    
    // Initially show all timetables
    showAllTimetables();
    
    // Program selection
    programButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all program buttons
            programButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const selectedProgram = this.dataset.program;
            filterTimetables(selectedProgram, getSelectedLevel());
        });
    });
    
    // Level selection
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all level buttons
            levelButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const selectedLevel = this.dataset.level;
            filterTimetables(getSelectedProgram(), selectedLevel);
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
    
    function showAllTimetables() {
        timetableSections.forEach(section => {
            section.style.display = 'block';
        });
        
        levelTimetables.forEach(timetable => {
            timetable.style.display = 'block';
        });
    }
    
    function filterTimetables(program, level) {
        if (program === 'all' && level === 'all') {
            showAllTimetables();
            return;
        }
        
        // Hide all timetable sections first
        timetableSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Hide all level timetables
        levelTimetables.forEach(timetable => {
            timetable.style.display = 'none';
        });
        
        // Show selected program sections
        if (program === 'all') {
            timetableSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            const programSection = document.getElementById(`${program}-timetable`);
            if (programSection) {
                programSection.style.display = 'block';
            }
        }
        
        // Show selected level timetables
        if (level === 'all') {
            levelTimetables.forEach(timetable => {
                if (program === 'all' || timetable.dataset.program === program) {
                    timetable.style.display = 'block';
                }
            });
        } else {
            levelTimetables.forEach(timetable => {
                if ((program === 'all' || timetable.dataset.program === program) && 
                    timetable.dataset.level === level) {
                    timetable.style.display = 'block';
                }
            });
        }
    }
});
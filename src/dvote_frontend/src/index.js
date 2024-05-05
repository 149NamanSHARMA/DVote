import { dvote_backend } from "../../declarations/dvote_backend";

let timeoutId; 

// Hide vote form by default
document.getElementById('vote-form').style.display = 'none';

//Register
document.getElementById('register-button').addEventListener('click', async () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    if (username && password) { // Check if username and password are not empty
        try {
            const status = await dvote_backend.registerUser(username, password);
            // Update the text content only after the promise resolves
            const registerStatus = document.getElementById('register-status');
            registerStatus.textContent = 'Done!'; // Neutral message
            setTimeout(() => registerStatus.textContent = '', 5000); // Clear the message after 5 seconds
        } catch (error) {
            // Handle any errors that occur during the registration process
            document.getElementById('register-status').textContent = 'Registration error!';
            console.error('Registration error:', error);
        }
    } else {
        // Prompt the user to enter both username and password
        document.getElementById('register-status').textContent = 'Please enter both username and password.';
    }
});

//Login

document.getElementById('login-button').addEventListener('click', async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    // Call loginUser from your dvote_backend
    const loginSuccessful = await dvote_backend.loginUser(username, password);

    if (loginSuccessful) {
        document.getElementById('login-status').textContent = 'Login successful!';
        showVoteForm(); // Show the vote form only if login is successful
        document.getElementById('logout-button').style.display = 'block'; // Also show the logout button
    } else {
        document.getElementById('login-status').textContent = 'Login failed!';
    }
});

// Function to show the voting form after a user logs in
function showVoteForm() {
    document.getElementById('vote-form').style.display = 'block';
}

// Function to handle casting a vote
document.getElementById('vote-button').addEventListener('click', async () => {
    const selectedPartyElement = document.querySelector('input[name="party"]:checked');
    if (selectedPartyElement) {
        const partyName = selectedPartyElement.value;
        // Map the user-friendly party names to the backend identifiers
        const partyIdentifier = partyName === "The Satoshi Faction" ? "Party A" : "Party B";
        const username = document.getElementById('login-username').value; // Assuming this is the logged-in user

        dvote_backend.castVote(username, partyIdentifier).then(voteStatus => {
            console.log("Vote status:", voteStatus); // Log the status for debugging
            document.getElementById('vote-status').textContent = voteStatus ? 'Vote cast successfully!' : 'You cast successfully!.';
        }).catch(error => {
            console.error('Error casting vote:', error);
            document.getElementById('vote-status').textContent = 'Error casting vote. Please try again.';
        });

        // Clear the selected party after casting the vote
        selectedPartyElement.checked = false;
    } else {
        document.getElementById('vote-status').textContent = 'Please wait......';
    }
    // Start the timer after the first vote is successfully cast
    if (!electionInterval) {
        startElectionTimer();
    }
});


// Function to handle logging out
function handleLogout() {
    // Hide the voting form and logout button
    document.getElementById('vote-form').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none';

    // Clear the login status message and reset the form
    document.getElementById('login-status').textContent = '';
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';

    // Optionally, you can also clear any other relevant status messages if they exist
    document.getElementById('register-status').textContent = '';
    document.getElementById('vote-status').textContent = '';
}

// Event listener for the logout button
document.getElementById('logout-button').addEventListener('click', () => {
    handleLogout();
});

// // Results Function
// document.getElementById('end-election-button').addEventListener('click', async () => {
//     try {
//         const results = await dvote_backend.getResults();
//         alert(results); // Keep the alert for immediate feedback

//         // Now also update the webpage with the results
//         document.getElementById('results-text').textContent = results;
//         document.getElementById('results-display').style.display = 'block'; // Show the results section
//     } catch (error) {
//         console.error('Error getting results:', error);
//         alert('Could not retrieve results.');
//         document.getElementById('results-text').textContent = 'Error retrieving results. Please check the console for more information.';
//         document.getElementById('results-display').style.display = 'block';
//     }
// });

// Results with timer
// Define the duration of the election in seconds
const electionDuration = 120; // 5 minutes
let electionTimer = electionDuration;
let electionInterval;

// Function to start the election timer
function startElectionTimer() {
    // Clear any existing intervals
    clearInterval(electionInterval);

    // Reset the timer to the full duration
    electionTimer = electionDuration;
    updateTimerDisplay();

    // Set up an interval to count down every second
    electionInterval = setInterval(() => {
        electionTimer--;
        updateTimerDisplay();

        if (electionTimer <= 0) {
            clearInterval(electionInterval);
            endElection();
        }
    }, 1000);
}

// Function to update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(electionTimer / 60);
    const seconds = electionTimer % 60;
    document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to end the election and display results
async function endElection() {
    try {
        const results = await dvote_backend.getResults();
        // Extract the number of votes from the results string (assuming it ends with "votes!")
        const votes = results.match(/(\d+) votes/)[1];

        // Update the page to show the winning party's name and logo based on the backend response
        if (results.includes("Party A")) {
            document.getElementById('results-text').textContent = `The Satoshi Faction wins with ${votes} votes!`;
            document.getElementById('satoshi-logo').style.display = 'block';
            document.getElementById('ether-logo').style.display = 'none';
        } else if (results.includes("Party B")) {
            document.getElementById('results-text').textContent = `The Ether Union wins with ${votes} votes!`;
            document.getElementById('satoshi-logo').style.display = 'none';
            document.getElementById('ether-logo').style.display = 'block';
        } else {
            // If it's a tie or another condition
            document.getElementById('results-text').textContent = results;
            document.getElementById('satoshi-logo').style.display = 'none';
            document.getElementById('ether-logo').style.display = 'none';
        }
        document.getElementById('results-display').style.display = 'block';
    } catch (error) {
        console.error('Error getting results:', error);
        document.getElementById('results-text').textContent = 'Error retrieving results. Please check the console for more information.';
        document.getElementById('results-display').style.display = 'block';
        document.getElementById('satoshi-logo').style.display = 'none';
        document.getElementById('ether-logo').style.display = 'none';
    }
}

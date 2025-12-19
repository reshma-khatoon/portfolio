// Function to fetch random user data
        const fetchRandomUser = async () => {
            try {
                const response = await fetch('https://randomuser.me/api/');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                const user = data.results[0]; // Get the first user from the results

                // Update HTML with random user data
                document.getElementById('user-image').src = user.picture.medium;
                document.getElementById('name').textContent = `Name: ${user.name.first} ${user.name.last}`;
                document.getElementById('email').textContent = `Email: ${user.email}`;
                document.getElementById('location').textContent = `Location: ${user.location.city}, ${user.location.country}`;

            } catch (error) {
                console.error('Error fetching random user:', error);
                alert('Something went wrong, please try again!');
            }
        };

        // Load the first random user when the page loads
        window.onload = fetchRandomUser;

        // Event listener for the button to generate a new random user
        document.getElementById('generate-button').addEventListener('click', fetchRandomUser);
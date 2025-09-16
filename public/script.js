// Import the Supabase client library. You must add the CDN link to your HTML file.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- IMPORTANT: REPLACE WITH YOUR SUPABASE DETAILS ---
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Pata hii kutoka kwenye Supabase project settings -> API
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Pata hii kutoka kwenye Supabase project settings -> API

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const formMessage = document.getElementById('formMessage');

    if (registrationForm) {
        // Use an 'async' function to handle the submission
        registrationForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Stop the form from reloading the page

            // Get values from the form using the CORRECT IDs
            const fullName = document.getElementById('fullName').value;
            const birthPlace = document.getElementById('birthPlace').value;
            const residence = document.getElementById('residence').value;
            const gender = document.getElementById('gender').value;
            const maritalStatus = document.getElementById('maritalStatus').value;
            const familyStatus = document.getElementById('familyStatus').value;

            // --- Send data to Supabase ---
            formMessage.textContent = 'Inatuma taarifa...';
            formMessage.style.color = 'blue';

            // Create an object where keys MATCH your database column names
            const memberData = {
                full_name: fullName,
                birth_place: birthPlace,
                residence: residence,
                gender: gender,
                marital_status: maritalStatus,
                family_status: familyStatus
            };

            // Use the Supabase client to insert the data
            const { data, error } = await supabase
                .from('members') // 'members' must be your table name
                .insert([memberData]);

            if (error) {
                // If there was an error, show it
                console.error('Supabase Error:', error);
                formMessage.textContent = `Kuna tatizo limetokea: ${error.message}`;
                formMessage.style.color = 'red';
            } else {
                // If successful, show a success message
                console.log('Success:', data);
                formMessage.textContent = 'Umefanikiwa kusajiliwa! Asante.';
                formMessage.style.color = 'green';
                registrationForm.reset(); // Clear the form
            }
        });
    }
});
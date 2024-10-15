
import { Groq } from 'groq-sdk';
import config from '../config/congif.js';

const groq = new Groq(config.Groq.apikey);



export async function getDietSchedule(req, res) {
    try {
        console.log('Request body:', req.body);
        const {
            age, gender, height, weight, goal, dietType, nationality, location,
            preferredFood, allergies, activityLevel, sleepHours, stressLevel,
            waterIntake, mealFrequency, medicalConditions, supplements, fitnessGoals
        } = req.body;

        const userProfile = `
            Age: ${age}
            Gender: ${gender}
            Height: ${height}
            Weight: ${weight}
            Goal: ${goal}
            Diet Type: ${dietType}
            Nationality: ${nationality}
            Location: ${location}
            Preferred Foods: ${preferredFood}
            Allergies: ${allergies}
            Activity Level: ${activityLevel}
            Sleep Hours: ${sleepHours}
            Stress Level: ${stressLevel}
            Water Intake: ${waterIntake}
            Meal Frequency: ${mealFrequency}
            Medical Conditions: ${medicalConditions}
            Supplements: ${supplements}
            Fitness Goals: ${fitnessGoals}
        `;

        console.log('User profile:', userProfile);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a nutrition expert that creates personalized weekly diet schedules based on individual profiles. Always return valid JSON for a full 7-day week."
                },
                {
                    role: "user",
                    content: `Create a personalized weekly diet schedule for the following user profile:

${userProfile}

Generate a JSON object containing the weekly diet schedule on the basis of avail ${userProfile.Location} and ${userProfile.Nationality}    in the following structure, without any explanation or text: 
[{ 
    day: string, 
    meals: [{ 
        time: string, 
        description: string, 
        calories: number 
    }] 
}]. 
Ensure you include all 7 days of the week. Only return valid JSON. Do not include any additional text or explanations.`
                }
            ],
            model: "llama3-8b-8192",
            temperature: 0.5,
            max_tokens: 1500,
        });

        let response = chatCompletion.choices[0].message.content.trim();


        // console.log('Raw AI response:', response);


        response = response.replace(/^[^[{]*/, '').replace(/[^\]}]*$/, '');


        if (!response.endsWith(']')) {

            if (response.includes('"day": "Saturday"')) {
                response += ',{"day":"Sunday","meals":[]}]';
            } else {

                response += ']';
            }
        }

        try {
            const dietSchedule = JSON.parse(response);


            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const completeDietSchedule = daysOfWeek.map(day => {
                const existingDay = dietSchedule.find(d => d.day === day);
                return existingDay || {
                    day,
                    meals: [
                        { time: "8:00 AM", description: "Placeholder breakfast", calories: 300 },
                        { time: "12:00 PM", description: "Placeholder lunch", calories: 400 },
                        { time: "6:00 PM", description: "Placeholder dinner", calories: 500 }
                    ]
                };
            });

            res.json(completeDietSchedule);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            console.error('Invalid JSON response:', response);
            res.status(500).json({ error: 'Failed to generate a valid JSON diet schedule.' });
        }
    } catch (error) {
        console.error('Error generating diet schedule:', error);
        res.status(500).json({ error: error.message });
    }
}


export async function getExerciseSchedule(req, res) {
    try {
        console.log('Request body:', req.body);
        const {
            age, gender, height, weight, goal, dietType, nationality, location,
            preferredFood, allergies, activityLevel, sleepHours, stressLevel,
            waterIntake, mealFrequency, medicalConditions, supplements, fitnessGoals
        } = req.body;

        const userProfile = `
            Age: ${age}
            Gender: ${gender}
            Height: ${height}
            Weight: ${weight}
            Goal: ${goal}
            Diet Type: ${dietType}
            Nationality: ${nationality}
            Location: ${location}
            Preferred Foods: ${preferredFood}
            Allergies: ${allergies}
            Activity Level: ${activityLevel}
            Sleep Hours: ${sleepHours}
            Stress Level: ${stressLevel}
            Water Intake: ${waterIntake}
            Meal Frequency: ${mealFrequency}
            Medical Conditions: ${medicalConditions}
            Supplements: ${supplements}
            Fitness Goals: ${fitnessGoals}
        `;

        console.log('User profile:', userProfile);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a certified fitness trainer that creates personalized weekly exercise schedules based on individual profiles. Always return valid JSON for a full 7-day week."
                },
                {
                    role: "user",
                    content: `Create a personalized weekly exercise schedule for the following user profile:

${userProfile}

Generate a JSON object containing the weekly exercise schedule based on the user's profile, location (${location}), and nationality (${nationality}) in the following structure, without any explanation or text:
[{
    day: string,
    exercises: [{
        name: string,
        duration: string,
        description: string,
        caloriesBurned: number,
        reps: number,
        sets: number,
        equipment: string
    }]
}].
Ensure you include all 7 days of the week. Only return valid JSON. Do not include any additional text or explanations.`
                }
            ],
            model: "llama3-8b-8192",
            temperature: 0.5,
            max_tokens: 1500,
        });

        let response = chatCompletion.choices[0].message.content.trim();


        response = response.replace(/^[^[{]*/, '').replace(/[^\]}]*$/, '');


        if (!response.startsWith('[')) response = '[' + response;
        if (!response.endsWith(']')) response += ']';

        let exerciseSchedule;
        try {
            exerciseSchedule = JSON.parse(response);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            console.error('Invalid JSON response:', response);
            return res.status(500).json({ error: 'Failed to generate a valid JSON exercise schedule.' });
        }

        if (!Array.isArray(exerciseSchedule)) {
            return res.status(500).json({ error: 'Invalid exercise schedule format.' });
        }

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const completeExerciseSchedule = daysOfWeek.map(day => {
            const existingDay = exerciseSchedule.find(d => d.day === day);
            return existingDay || {
                day,
                exercises: [
                    {
                        name: "Rest Day",
                        duration: "N/A",
                        description: "Take a day off to allow your body to recover",
                        caloriesBurned: 0,
                        reps: 0,
                        sets: 0,
                        equipment: "None"
                    }
                ]
            };
        });

        res.json(completeExerciseSchedule);
    } catch (error) {
        console.error('Error generating exercise schedule:', error);
        res.status(500).json({ error: 'An unexpected error occurred while generating the exercise schedule.' });
    }
}

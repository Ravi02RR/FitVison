import { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    dayTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCell: {
        margin: 'auto',
        marginTop: 5,
        fontSize: 10,
    },
    watermark: {
        position: 'absolute',
        opacity: 0.1,
        transform: 'rotate(-45deg)',
        fontSize: 60,
        top: '50%',
        left: '50%',
    },
});

const ExercisePlanPDF = ({ exercisePlan, user }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.watermark}>FitVision</Text>
            <Text style={styles.title}>Personalized Exercise Plan for {user}</Text>
            {exercisePlan.map((day) => (
                <View key={day.day} style={styles.section}>
                    <Text style={styles.dayTitle}>{day.day}</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Exercise</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Duration</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Sets x Reps</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Equipment</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Calories Burned</Text>
                            </View>
                        </View>
                        {day.exercises.map((exercise, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{exercise.name}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{exercise.duration}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{`${exercise.sets} x ${exercise.reps}`}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{exercise.equipment}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{exercise.caloriesBurned}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </Page>
    </Document>
);

const ExercisePlanner = () => {
    const [exercisePlan, setExercisePlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user.user);

    const [localData, setLocalData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('userSettings');
        if (savedData) {
            setLocalData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        const savedExercisePlan = localStorage.getItem('exercisePlan');
        if (savedExercisePlan) {
            setExercisePlan(JSON.parse(savedExercisePlan));
        }
    }, []);

    const generateExercisePlan = async () => {
        setLoading(true);
        setError(null);
        try {
            const userData = {
                age: localData?.age || '',
                gender: localData?.gender || '',
                height: localData?.height || '',
                weight: localData?.weight || '',
                goal: localData?.goal || '',
                dietType: localData?.dietType || '',
                nationality: localData?.nationality || '',
                location: localData?.location || '',
                preferredFood: localData?.preferredFood || '',
                allergies: localData?.allergies || '',
                activityLevel: localData?.activityLevel || '',
                sleepHours: localData?.sleepHours || '',
                stressLevel: localData?.stressLevel || '',
                waterIntake: localData?.waterIntake || '',
                mealFrequency: localData?.mealFrequency || '',
                medicalConditions: localData?.medicalConditions || '',
                supplements: localData?.supplements || '',
                fitnessGoals: localData?.fitnessGoals || '',
            };

            const response = await fetch('api/v1/planner/exercisepaln', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch exercise plan');
            }

            const data = await response.json();
            setExercisePlan(data);

            localStorage.setItem('exercisePlan', JSON.stringify(data));
        } catch (err) {
            setError(err.message);
            console.error('Error generating exercise plan:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-center">FitVision Exercise Planner</h1>

            <div className="flex justify-center space-x-4 mb-8">
                <button
                    onClick={generateExercisePlan}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </span>
                    ) : (
                        'Generate Exercise Plan'
                    )}
                </button>

                {exercisePlan && (
                    <PDFDownloadLink
                        document={<ExercisePlanPDF exercisePlan={exercisePlan} user={user.name} />}
                        fileName="exercise_plan.pdf"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {({ loading }) =>
                            loading ? 'Preparing PDF...' : 'Download as PDF'
                        }
                    </PDFDownloadLink>
                )}
            </div>

            {loading && (
                <div className="text-center text-xl font-semibold animate-pulse">
                    Generating your personalized exercise plan...
                </div>
            )}

            {error && (
                <div className="text-center text-xl font-semibold text-red-500">
                    {error}
                </div>
            )}

            {exercisePlan && (
                <div className="space-y-8">
                    {exercisePlan.map((day) => (
                        <div key={day.day} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-300">{day.day}</h2>
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-blue-200">
                                        <th className="py-2">Exercise</th>
                                        <th className="py-2">Duration</th>
                                        <th className="py-2">Sets x Reps</th>
                                        <th className="py-2">Equipment</th>
                                        <th className="py-2">Calories Burned</th>
                                        <th className="py-2">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.exercises.map((exercise, index) => (
                                        <tr key={index} className="border-t border-gray-700">
                                            <td className="py-3">{exercise.name}</td>
                                            <td className="py-3">{exercise.duration}</td>
                                            <td className="py-3">{`${exercise.sets} x ${exercise.reps}`}</td>
                                            <td className="py-3">{exercise.equipment}</td>
                                            <td className="py-3">{exercise.caloriesBurned}</td>
                                            <td className="py-3">{exercise.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExercisePlanner;
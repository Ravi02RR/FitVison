/* eslint-disable react/prop-types */
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
        width: '33%',
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

const DietPlanPDF = ({ dietPlan, user }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.watermark}>FitVision</Text>
            <Text style={styles.title}>Personalized Diet Plan for {user}</Text>
            {dietPlan.map((day) => (
                <View key={day.day} style={styles.section}>
                    <Text style={styles.dayTitle}>{day.day}</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Time</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Meal</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Calories</Text>
                            </View>
                        </View>
                        {day.meals.map((meal, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{meal.time}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{meal.description}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{meal.calories}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </Page>
    </Document>
);

const DietPlanner = () => {
    const [dietPlan, setDietPlan] = useState(null);
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

    console.log('Local data:', localData);

    useEffect(() => {
        const savedDietPlan = localStorage.getItem('dietPlan');
        if (savedDietPlan) {
            setDietPlan(JSON.parse(savedDietPlan));
        }
    }, []);

    const generateDietPlan = async () => {
        setLoading(true);
        setError(null);
        try {

            console.log(localStorage.getItem('age'));
            console.log(localStorage.getItem('gender'));
            console.log(localStorage.getItem('height'));
            

            const userData = {
                age: localData.age || '',
                gender: localData.gender || '',
                height: localData.height || '',
                weight: localData.weight || '',
                goal: localData.goal || '',
                dietType: localData.dietType || '',
                nationality: localData.nationality || '',
                location: localData.location || '',
                preferredFood: localData.preferredFood || '',
                allergies: localData.allergies || '',
                activityLevel: localData.activityLevel || '',
                sleepHours: localData.sleepHours || '',
                stressLevel: localData.stressLevel || '',
                waterIntake: localData.waterIntake || '',
                mealFrequency: localData.mealFrequency || '',
                medicalConditions: localData.medicalConditions || '',
                supplements: localData.supplements || '',
                fitnessGoals: localData.fitnessGoals || '',
            };


            console.log('User data:', userData);

            const response = await fetch('api/v1/planner/dietplan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch diet plan');
            }

            const data = await response.json();
            setDietPlan(data);

           
            localStorage.setItem('dietPlan', JSON.stringify(data));
        } catch (err) {
            setError(err.message);
            console.error('Error generating diet plan:', err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-center">FitVision Diet Planner</h1>

            <div className="flex justify-center space-x-4 mb-8">
                <button
                    onClick={generateDietPlan}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </span>
                    ) : (
                        'Generate Diet Plan'
                    )}
                </button>

                {dietPlan && (
                    <PDFDownloadLink
                        document={<DietPlanPDF dietPlan={dietPlan} user={user.name} />}
                        fileName="diet_plan.pdf"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {({ loading, }) =>
                            loading ? 'Preparing PDF...' : 'Download as PDF'
                        }
                    </PDFDownloadLink>
                )}
            </div>

            {loading && (
                <div className="text-center text-xl font-semibold animate-pulse">
                    Generating your personalized diet plan...
                </div>
            )}

            {error && (
                <div className="text-center text-xl font-semibold text-red-500">
                    {error}
                </div>
            )}

            {dietPlan && (
                <div className="space-y-8">
                    {dietPlan.map((day, index) => (
                        <div key={day.day} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-300">{day.day}</h2>
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-blue-200">
                                        <th className="py-2">Time</th>
                                        <th className="py-2">Meal</th>
                                        <th className="py-2">Calories</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.meals.map((meal, mealIndex) => (
                                        <tr key={mealIndex} className="border-t border-gray-700">
                                            <td className="py-3">{meal.time}</td>
                                            <td className="py-3">{meal.description}</td>
                                            <td className="py-3">{meal.calories}</td>
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

export default DietPlanner;
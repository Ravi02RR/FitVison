/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UploadCloud,
    Utensils,
    Battery,
    Apple,
    AlertTriangle,
    ChevronRight,
    Info,
    X
} from 'lucide-react';


const Card = ({ children, className = '' }) => (
    <div className={`bg-gray-800 bg-opacity-50 rounded-lg p-6 backdrop-blur-sm ${className}`}>
        {children}
    </div>
);

const LOCAL_STORAGE_KEY = 'nutritionAnalysisData';

const NutritionAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            try {
                const { analysisData, imageUrl } = JSON.parse(savedData);
                setData(analysisData);
                setPreviewUrl(imageUrl);
            } catch (err) {
                console.error('Error loading saved data:', err);
            }
        }
    }, []);


    useEffect(() => {
        if (data && previewUrl) {
            const saveData = {
                analysisData: data,
                imageUrl: previewUrl
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
        }
    }, [data, previewUrl]);

    async function getNutritionDetail(file) {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('foodImage', file);

            const res = await axios.post('/api/v1/foodnutrition/getfooddetail', formData);
            setData(res.data);
        } catch (err) {
            setError('Failed to analyze image. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);


            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            fileReader.readAsDataURL(file);

            getNutritionDetail(file);
        }
    };

    const handleClearImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setData(null);
        setError(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2">Nutrition Analysis</h1>
                    <p className="text-gray-300">Upload a food image to get detailed nutritional insights</p>
                </div>


                <Card className="mb-8">
                    <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-500 rounded-lg transition-colors relative 
                        ${!loading && 'cursor-pointer hover:border-blue-500'} 
                        ${loading && 'opacity-50 cursor-not-allowed'}`}>
                        {previewUrl ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={previewUrl}
                                    alt="Food preview"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                                {!loading && (
                                    <button
                                        onClick={handleClearImage}
                                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-12 h-12 mb-4 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 10MB)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/jpg"
                            disabled={loading}
                        />
                    </label>
                </Card>


                {loading && (
                    <div className="flex justify-center my-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}


                {error && (
                    <Card className="mb-8 bg-red-900 bg-opacity-50">
                        <div className="flex items-center">
                            <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
                            <p className="text-red-400">{error}</p>
                        </div>
                    </Card>
                )}

                {/* Results Section */}
                {data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Food Identification */}
                        <Card>
                            <div className="flex items-center mb-4">
                                <Utensils className="w-6 h-6 mr-2 text-blue-400" />
                                <h2 className="text-xl font-semibold">Food Information</h2>
                            </div>
                            <div className="space-y-3">
                                <p><span className="text-gray-400">Name:</span> {data.foodIdentification.name}</p>
                                <p><span className="text-gray-400">Category:</span> {data.foodIdentification.category}</p>
                                <div>
                                    <p className="text-gray-400 mb-2">Ingredients:</p>
                                    <ul className="list-disc list-inside pl-4 space-y-1">
                                        {data.foodIdentification.ingredients.map((ingredient, index) => (
                                            <li key={index} className="text-gray-300">{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>


                        <Card>
                            <div className="flex items-center mb-4">
                                <Battery className="w-6 h-6 mr-2 text-green-400" />
                                <h2 className="text-xl font-semibold">Nutritional Content</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400 mb-2">Macronutrients</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
                                            <p className="text-sm text-gray-400">Proteins</p>
                                            <p className="text-lg">{data.nutritionalAnalysis.macronutrients.proteins}</p>
                                        </div>
                                        <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
                                            <p className="text-sm text-gray-400">Carbs</p>
                                            <p className="text-lg">{data.nutritionalAnalysis.macronutrients.carbohydrates}</p>
                                        </div>
                                        <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
                                            <p className="text-sm text-gray-400">Fats</p>
                                            <p className="text-lg">{data.nutritionalAnalysis.macronutrients.fats}</p>
                                        </div>
                                        <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
                                            <p className="text-sm text-gray-400">Fiber</p>
                                            <p className="text-lg">{data.nutritionalAnalysis.macronutrients.fiber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>


                        <Card className="md:col-span-2">
                            <div className="flex items-center mb-4">
                                <Info className="w-6 h-6 mr-2 text-purple-400" />
                                <h2 className="text-xl font-semibold">Health Insights</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-400 mb-2">Nutritional Gaps</p>
                                    <ul className="space-y-2">
                                        {data.healthInsights.nutritionalGaps.map((gap, index) => (
                                            <li key={index} className="flex items-center">
                                                <ChevronRight className="w-4 h-4 mr-2 text-red-400" />
                                                {gap}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-2">Recommended Foods</p>
                                    <ul className="space-y-2">
                                        {data.healthInsights.recommendations.foodSuggestions.map((suggestion, index) => (
                                            <li key={index} className="flex items-center">
                                                <Apple className="w-4 h-4 mr-2 text-green-400" />
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NutritionAnalysis;
import { useEffect, useState } from 'react';
import { Fullscreen, Minimize2 } from 'lucide-react';
import axios from 'axios';

const PoseEstimation = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        const element = document.documentElement;

        if (!isFullscreen) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };
    const [link, setLink] = useState()
    const getLink = async () => {
        const res = await axios.get('/api/v2/posemodel')
        return res.data.data

    }

    useEffect(() => {
        let linktoEmbed = getLink().then((res)=>{
            setLink(res)
        })
        console.log(linktoEmbed)
        setLink()

    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
            <div className="container mx-auto p-4 relative">
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="flex justify-between items-center p-4 bg-gray-700">
                        <h1 className="text-xl font-bold text-white">Pose Estimation</h1>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white flex items-center gap-2"
                        >
                            {isFullscreen ? (
                                <>
                                    <Minimize2 size={20} />
                                    <span>Exit Fullscreen</span>
                                </>
                            ) : (
                                <>
                                    <Fullscreen size={20} />
                                    <span>Go Fullscreen</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className={`relative ${isFullscreen ? 'h-screen' : 'h-[80vh]'} w-full`}>
                        <iframe
                            src={link}
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allow="camera;microphone;fullscreen"
                            title="Pose Estimation"
                        />
                    </div>
                </div>

                {!isFullscreen && (
                    <div className="mt-6 bg-gray-800 rounded-lg p-6 text-white">
                        <h2 className="text-xl font-bold mb-4">Instructions</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Make sure you&apos;re in a well-lit area</li>
                            <li>Position yourself within the camera frame</li>
                            <li>Allow camera access when prompted</li>
                            <li>Follow the on-screen instructions for best results</li>
                            <li>Click the fullscreen button for a better experience</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PoseEstimation;
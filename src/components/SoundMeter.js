import React, { useState, useEffect, useRef } from 'react';

const SoundMeter = () => {
    const [isListening, setIsListening] = useState(false);
    const audioContext = useRef(null);
    const analyser = useRef(null);
    const dataArray = useRef(null);

    useEffect(() => {
        if (isListening) {
            // Get access to the microphone
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
                    analyser.current = audioContext.current.createAnalyser();
                    analyser.current.fftSize = 256; // Lower size for quicker response

                    const source = audioContext.current.createMediaStreamSource(stream);
                    source.connect(analyser.current);

                    dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
                    
                    const updateMeter = () => {
                        analyser.current.getByteFrequencyData(dataArray.current);
                        const max = Math.max(...dataArray.current); // Get the maximum frequency value
                        const opacity = max / 256; // Normalize to [0, 1]
                        
                        // Update the circle's opacity
                        const circleButton = document.querySelector('.circle-button');
                        circleButton.style.opacity = opacity;

                        requestAnimationFrame(updateMeter); // Schedule the next update
                    };
                    
                    updateMeter();
                })
                .catch((error) => {
                    console.error('Microphone access error:', error);
                    setIsListening(false);
                });

            return () => {
                if (audioContext.current) {
                    audioContext.current.close();
                }
            };
        }
    }, [isListening]);

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    return (
        <div>
            <button
                className={`w-[200px] h-[200px] rounded-full bg-white text-black active:bg-gray-200 circle-button ${
                    isListening ? 'opacity-100' : 'opacity-50'
                }`}
                onClick={toggleListening}
            >
                {isListening ? 'Listening...' : 'Start Listening'}
            </button>
        </div>
    );
};

export default SoundMeter;
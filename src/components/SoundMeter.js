import React, { useState, useEffect, useRef } from "react";
import "./SoundMeter.module.css";
import { MeshGradientRenderer } from "@johnn-e/react-mesh-gradient";

const SoundMeter = () => {
  const [isListening, setIsListening] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const animationFrameId = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isListening) {
      // Get access to the microphone
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          audioContext.current = new (window.AudioContext ||
            window.webkitAudioContext)();
          analyser.current = audioContext.current.createAnalyser();
          analyser.current.fftSize = 256; // Lower size for quicker response

          const source = audioContext.current.createMediaStreamSource(stream);
          source.connect(analyser.current);

          dataArray.current = new Uint8Array(
            analyser.current.frequencyBinCount
          );
          streamRef.current = stream;

          const updateMeter = () => {
            analyser.current.getByteFrequencyData(dataArray.current);
            const max = Math.max(...dataArray.current); // Get the maximum frequency value
            setOpacity(max / 256); // Normalize to [0, 1]
            animationFrameId.current = requestAnimationFrame(updateMeter); // Schedule the next update
          };

          updateMeter();
        })
        .catch((error) => {
          console.error("Microphone access error:", error);
          setIsListening(false);
        });

      return () => {
        // Cleanup audio context and stop the stream
        if (audioContext.current) {
          audioContext.current.close();
          audioContext.current = null;
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        setOpacity(1); // Reset opacity to 1 when not listening
      };
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div>
      <MeshGradientRenderer
        id="gradient-container"
        className="gradient"
        speed={isListening ? opacity * 0.25 : 0}
        colors={["#C3E4FF", "#6EC3F4", "#EAE2FF", "#B9BEFF", "#B3B8F9"]}
        wireframe={true}
      />
      <div className={`flex flex-col items-center gap-y-12`}>
      <button
        className={`w-[200px] h-[200px] rounded-full bg-black text-black active:bg-black circle-button`}
        onClick={toggleListening}
        style={{
          boxShadow: isListening
            ? `0 0 ${opacity * 50}px rgba(0, 0, 0, ${opacity})`
            : "none",
        }}
      ></button>
      <p className={``}>Let's imagine this is transcribed text.</p>
      </div>
    </div>
  );
};

export default SoundMeter;

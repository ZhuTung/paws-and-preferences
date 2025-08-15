import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CAT_API = "https://cataas.com/cat?width=400&height=600";

const App = () => {
  const [currentUserId] = useState(() => Math.floor(Math.random() * 100001));

  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const startX = useRef(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      const urls = Array.from(
        { length: 10 },
        (_, i) => `${CAT_API}&unique=${Date.now()}_${i}`
      );
      const images = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          return { image: objectUrl, blob }; // Store both
        })
      );
      setProfiles(images);
    };
    fetchImages();
  }, []);

  const currentProfile = profiles[currentIndex];

  const handleDragStart = (clientX) => {
    setIsDragging(true);
    startX.current = clientX;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - startX.current;
    setDragOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const threshold = 100;
    if (dragOffset > threshold) {
      handleUpload();
      nextCard();
    } else if (dragOffset < -threshold) {
      nextCard();
    } else {
      setDragOffset(0);
    }
    setIsDragging(false);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", currentProfile.blob, "cat.jpg");
    formData.append("userId", currentUserId);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.error("Error uploading image: ", err);
    }
  };

  const nextCard = () => {
    setDragOffset(0);
    if (currentIndex + 1 >= profiles.length) {
      navigate("/result", { state: { userId: currentUserId } });
    } else {
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    }
  };

  const onMouseDown = (e) => handleDragStart(e.clientX);
  const onMouseMove = (e) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();

  const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };
  const onTouchEnd = () => handleDragEnd();

  const rotation = dragOffset * 0.1;
  const opacity = 1 - Math.abs(dragOffset) * 0.001;

  // Show loading page until profiles are loaded
  if (profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-500 to-red-500">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading cat images...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-red-500 flex flex-col items-center justify-center p-4">
      <h3 className="text-2xl font-bold text-white mb-6">
        Swipe right to indicate like, left to skip
      </h3>
      <div className="relative w-full max-w-sm h-[500px] mb-8">
        <div
          ref={cardRef}
          className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden select-none cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={isDragging ? onMouseMove : undefined}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative">
            <img
              src={currentProfile.image}
              alt="Cat"
              className="w-full h-full object-cover"
              draggable={false}
            />
            {dragOffset > 50 && (
              <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg rotate-12">
                  LIKE
                </div>
              </div>
            )}
            {dragOffset < -50 && (
              <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg -rotate-12">
                  NOPE
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 text-white/80 text-sm">
        {currentIndex + 1} of {profiles.length}
      </div>
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `https://paws-and-preferences-server.onrender.com/images/${userId}`
        );
        setImages(res.data);
      } catch (err) {
        console.error("Failed to fetch images: ", err);
      }
    };
    if (userId) fetchImages();
  }, [userId]);

  const getImageSrc = (image) => {
    // Construct the full URL for the image
    return `https://paws-and-preferences-server.onrender.com${image.path}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-red-500 flex flex-col items-center justify-center p-4">
      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {images.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No images to display
            </h3>
            <p className="text-gray-500">Add some images to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getImageSrc(image, index)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x400/e5e7eb/9ca3af?text=Image+Not+Found";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button
          className="mt-8 px-6 py-2 bg-white text-purple-600 font-bold rounded-full shadow hover:bg-purple-100 transition"
          onClick={() => navigate("/")}
        >
          Back to Cat Swiping
        </button>
      </div>
    </div>
  );
};

export default Result;

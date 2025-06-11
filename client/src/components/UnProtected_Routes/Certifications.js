import { useEffect, useState } from "react";
import getImage from "../../Utils/GetImage";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

const certificationsData = [
  {
    name: "GOVERNMENT",
    image: getImage("GVT_Logo.png"),
    certifications: [getImage("GVT_Cert (2).jpg"), getImage("GVT_Cert (1).jpg")],
  },
  {
    name: "RCMC",
    image: getImage("RCMC_Logo.jpg"),
    certifications: [getImage("RCMC (1).jpg")],
  },
  {
    name: "FSSAI",
    image: getImage("FSSAI_Logo.png"),
    certifications: [
      getImage("FSSAI_Cert (1).jpg"), getImage("FSSAI_Cert (2).jpg"),
      getImage("FSSAI_Cert (3).jpg"), getImage("FSSAI_Cert (4).jpg"),
      getImage("FSSAI_Cert (5).jpg"), getImage("FSSAI_Cert (6).jpg"),
      getImage("FSSAI_Cert (7).jpg"), getImage("FSSAI_Cert (8).jpg")
    ],
  },
  {
    name: "BIOGROWTH",
    image: getImage("BioGrowth_Logo.png"),
    certifications: [getImage("BioGrowth_Cert.jpg")],
  },
];

const Certifications = () => {
  const [selected, setSelected] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (!selected) return;
    if (e.key === "ArrowRight") nextImage();
    else if (e.key === "ArrowLeft") prevImage();
    else if (e.key === "Escape") setSelected(null);
  };

  useEffect(() => {
    if (selected) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % selected.certifications.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + selected.certifications.length) % selected.certifications.length);
  };

  return (
    <div className="certifications-container">
      <h3 className="title" style={{textAlign:"center"}}>Certifications</h3>
      <div className="cert-grid">
        {certificationsData.map((cert, index) => (
          <div
            key={index}
            className="cert-logo"
            onClick={() => {
              setSelected(cert);
              setCurrentIndex(0);
            }}
            title={cert.name}
          >
            <img src={cert.image} alt={cert.name} />
          </div>
        ))}
      </div>

      {selected && (
        <div className="preview-overlay" onClick={() => setSelected(null)}>
          <div className="cert-carousel-container" onClick={(e) => e.stopPropagation()}>
            <button className="nav-button prev" onClick={prevImage} disabled={selected.certifications.length <= 1}>
              <FiChevronLeft />
            </button>
            
            <div className="preview-content">
              <button className="close-button" onClick={() => setSelected(null)}>
                <FiX />
              </button>
              <img
                src={selected.certifications[currentIndex]}
                alt={`Certificate ${currentIndex + 1}`}
                className="cert-preview"
              />
              {selected.certifications.length > 1 && (
                <div className="pagination" style={{fontSize:"0.7rem", fontWeight:"600"}}>
                  {currentIndex + 1} / {selected.certifications.length}
                </div>
              )}
            </div>

            <button className="nav-button next" onClick={nextImage} disabled={selected.certifications.length <= 1}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
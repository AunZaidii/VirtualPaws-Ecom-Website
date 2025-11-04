import { useState } from 'react';

export default function App() {
  const [selectedVet, setSelectedVet] = useState<number | null>(null);

  const vets = [
    {
      name: "Dr. Sarah Pawson",
      specialty: "Small Animal Specialist",
      phone: "+92 300 4567890",
      email: "sarahpawson@virtualpaws.com",
      location: "Virtual Paws Vet Clinic, Karachi",
      hours: "Mon–Sat: 9:00 AM – 6:00 PM",
      bio: "Dr. Sarah has over 10 years of experience caring for dogs, cats, and small mammals. She specializes in preventive care and emergency medicine, ensuring your furry friends receive the best treatment possible.",
      experience: "10+ years of veterinary experience",
      education: "DVM, University of Veterinary Sciences, Lahore"
    },
    {
      name: "Dr. Leo Barkwell",
      specialty: "Pet Nutrition Expert",
      phone: "+92 300 4567891",
      email: "leobarkwell@virtualpaws.com",
      location: "Virtual Paws Vet Clinic, Karachi",
      hours: "Mon–Sat: 9:00 AM – 6:00 PM",
      bio: "Dr. Leo focuses on creating customized nutrition plans for pets of all sizes and breeds. His expertise helps pets maintain optimal health through balanced diets and nutritional counseling.",
      experience: "8+ years specializing in pet nutrition",
      education: "DVM & MSc in Animal Nutrition, Sindh Agriculture University"
    },
    {
      name: "Dr. Mia Whiskerly",
      specialty: "Feline Health Specialist",
      phone: "+92 300 4567892",
      email: "miawhiskerly@virtualpaws.com",
      location: "Virtual Paws Vet Clinic, Karachi",
      hours: "Mon–Sat: 9:00 AM – 6:00 PM",
      bio: "Dr. Mia is passionate about feline health and behavior. With extensive training in cat-specific medicine, she provides gentle, expert care tailored to your cat's unique needs.",
      experience: "12+ years dedicated to feline medicine",
      education: "DVM & Advanced Feline Medicine Certificate, Cornell University"
    },
    {
      name: "Dr. Oliver Tailor",
      specialty: "Veterinary Surgeon",
      phone: "+92 300 4567893",
      email: "olivertailor@virtualpaws.com",
      location: "Virtual Paws Vet Clinic, Karachi",
      hours: "Mon–Sat: 9:00 AM – 6:00 PM",
      bio: "Dr. Oliver is a board-certified veterinary surgeon with expertise in soft tissue and orthopedic procedures. He combines surgical precision with compassionate care for optimal recovery.",
      experience: "15+ years of surgical experience",
      education: "DVM & Surgical Residency, Royal College of Veterinary Surgeons"
    }
  ];

  const closeModal = () => setSelectedVet(null);

  const bookAppointment = () => {
    alert('Booking system will be integrated here. For now, please call +92 300 4567890');
    closeModal();
  };

  const scrollToVets = () => {
    document.getElementById('vet-profiles')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getDirections = () => {
    window.open('https://maps.google.com/?q=Virtual+Paws+Vet+Hospital+Karachi', '_blank');
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        html {
          scroll-behavior: smooth;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .float-paw-1 {
          animation: float 6s ease-in-out infinite;
        }

        .float-paw-2 {
          animation: float 5s ease-in-out infinite reverse;
        }

        .modal-overlay {
          animation: fadeIn 0.3s ease;
        }

        .modal-content-animated {
          animation: slideDown 0.3s ease;
        }

        .vet-card-hover {
          transition: all 0.3s ease;
        }

        .vet-card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 40px rgba(141, 198, 63, 0.3);
        }

        .vet-card-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #8DC63F 0%, #6BA82F 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .vet-card-hover:hover::before {
          transform: scaleX(1);
        }

        .icon-circle-hover {
          transition: all 0.3s ease;
        }

        .icon-circle-hover:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(141, 198, 63, 0.5);
        }

        .button-hover {
          transition: all 0.3s ease;
        }

        .button-hover:hover {
          box-shadow: 0 6px 20px rgba(141, 198, 63, 0.4);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Page Title Section */}
      <section className="relative overflow-hidden py-20 px-5 text-center" style={{
        background: 'linear-gradient(135deg, #DFF6FF 0%, #B8E9FF 100%)'
      }}>
        <div className="absolute top-5 left-[10%] text-[120px] opacity-10 float-paw-1">🐾</div>
        <div className="absolute bottom-7 right-[15%] text-[100px] opacity-10 float-paw-2">🐾</div>
        <h1 className="text-5xl font-bold text-[#333333] mb-4 relative z-10">Our Veterinary Experts</h1>
        <p className="text-xl text-[#555555] max-w-[600px] mx-auto relative z-10">
          Meet our professional vets dedicated to keeping your pets healthy and happy.
        </p>
      </section>

      {/* Veterinarian Profiles Section */}
      <section id="vet-profiles" className="py-20 px-5 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          {vets.map((vet, index) => (
            <div
              key={index}
              onClick={() => setSelectedVet(index)}
              className="vet-card-hover bg-white rounded-2xl p-8 shadow-lg cursor-pointer relative overflow-hidden"
            >
              <h3 className="text-2xl font-semibold text-[#333333] mb-1">{vet.name}</h3>
              <div className="text-base text-[#8DC63F] font-medium mb-5">{vet.specialty}</div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-[#555555]">
                  <svg className="w-[18px] h-[18px] mr-3 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>{vet.phone}</span>
                </div>
                
                <div className="flex items-center text-sm text-[#555555]">
                  <svg className="w-[18px] h-[18px] mr-3 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>{vet.email}</span>
                </div>
                
                <div className="flex items-center text-sm text-[#555555]">
                  <svg className="w-[18px] h-[18px] mr-3 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>{vet.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-[#555555]">
                  <svg className="w-[18px] h-[18px] mr-3 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{vet.hours}</span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  bookAppointment();
                }}
                className="button-hover w-full py-3 px-6 mt-4 text-white border-none rounded-3xl font-semibold cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #8DC63F 0%, #7AB62F 100%)'
                }}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Appointment Information Section */}
      <section id="appointment-info" className="py-20 px-5 text-center" style={{ background: '#F8FFF9' }}>
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-4xl font-bold text-[#333333] mb-4">Need a Checkup for Your Pet?</h2>
          <p className="text-lg text-[#555555] mb-10">
            Call us or schedule an appointment with one of our vets.
          </p>
          
          <div className="flex justify-center gap-16 my-10 flex-wrap">
            <div className="flex flex-col items-center gap-3">
              <div className="icon-circle-hover w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{
                background: 'linear-gradient(135deg, #8DC63F 0%, #7AB62F 100%)'
              }}>
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-[#333333]">Phone</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="icon-circle-hover w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{
                background: 'linear-gradient(135deg, #8DC63F 0%, #7AB62F 100%)'
              }}>
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-[#333333]">Email</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="icon-circle-hover w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{
                background: 'linear-gradient(135deg, #8DC63F 0%, #7AB62F 100%)'
              }}>
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-[#333333]">Location</span>
            </div>
          </div>

          <button
            onClick={scrollToVets}
            className="button-hover py-4 px-12 text-white border-none rounded-3xl font-semibold cursor-pointer mt-5"
            style={{
              background: 'linear-gradient(135deg, #8DC63F 0%, #7AB62F 100%)'
            }}
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Emergency Contact Strip */}
      <section className="py-6 px-5 text-white flex justify-between items-center flex-wrap gap-5" style={{
        background: 'linear-gradient(135deg, #8DC63F 0%, #7AB62F 100%)'
      }}>
        <div className="text-lg font-medium">
          24/7 Emergency Helpline: +92 345 7894561 | Virtual Paws Vet Hospital, Karachi
        </div>
        <button
          onClick={getDirections}
          className="button-hover py-3 px-8 bg-transparent text-white border-2 border-white rounded-3xl font-semibold cursor-pointer"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#8DC63F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'white';
          }}
        >
          Get Directions
        </button>
      </section>

      {/* Modal */}
      {selectedVet !== null && (
        <div
          className="modal-overlay fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center pt-10 px-5"
          onClick={closeModal}
        >
          <div
            className="modal-content-animated bg-white rounded-2xl p-10 max-w-[600px] w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-5 top-5 text-4xl font-light text-gray-400 cursor-pointer hover:text-gray-700 leading-none border-none bg-transparent"
            >
              ×
            </button>
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#333333] mb-1">{vets[selectedVet].name}</h2>
              <div className="text-lg text-[#8DC63F] font-medium">{vets[selectedVet].specialty}</div>
            </div>
            
            <div className="bg-[#F8FFF9] p-5 rounded-xl my-5 text-sm text-[#555555] leading-relaxed">
              {vets[selectedVet].bio}
            </div>
            
            <div className="my-5 space-y-3">
              <div className="flex items-center text-sm text-[#555555]">
                <svg className="w-5 h-5 mr-3 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{vets[selectedVet].experience}</span>
              </div>
              
              <div className="flex items-center text-sm text-[#555555]">
                <svg className="w-5 h-5 mr-3 text-[#8DC63F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span>{vets[selectedVet].education}</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={bookAppointment}
                className="button-hover flex-1 py-4 px-6 text-white border-none rounded-3xl font-semibold cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #8DC63F 0%, #7AB62F 100%)'
                }}
              >
                Book Appointment
              </button>
              <button
                onClick={closeModal}
                className="flex-1 py-4 px-6 bg-transparent text-[#8DC63F] border-2 border-[#8DC63F] rounded-3xl font-semibold cursor-pointer hover:bg-[#8DC63F] hover:text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
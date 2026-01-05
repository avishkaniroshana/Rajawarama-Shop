import React from "react";

const services = [
  {
    title: "Traditional Wedding Attire",
    description: "Authentic Kandyan & Sinhala traditional wedding costumes.",
  },
  {
    title: "Poruwa Ceremony",
    description: "Complete traditional Kandyan wedding rituals.",
  },
  {
    title: "Ves Dance Troupes",
    description: "Professional Ves & cultural dance performances.",
  },
  {
    title: "Magul Bera",
    description: "Traditional wedding drumming performances.",
  },
  {
    title: "Jayamangala Gatha",
    description: "Traditional wedding verses chanted by professionals.",
  },
  {
    title: "Wedding & Event Planning",
    description: "End-to-end planning for weddings & cultural events.",
  },
];

function Home() {
  return (
    <div className="w-full">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-red-700 to-yellow-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Rajawarama Traditional Wedding & Cultural Services
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Preserving Sri Lankan traditions with elegance and authenticity
          </p>
          <button className="bg-white text-red-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Explore Our Services
          </button>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="text-red-700 font-medium hover:underline">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Make Your Special Day Truly Traditional
          </h2>
          <p className="text-gray-600 mb-8">
            Book our trusted traditional services and create unforgettable
            memories.
          </p>
          <button className="bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;

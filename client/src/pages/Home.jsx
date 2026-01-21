import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate= useNavigate();
  return (
    <div>
      {/* Hero */})
      <section className="relative py-24 px-6 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/Assets/backGround.jpg')" }}>
        <div className="max-w-3xl mx-auto text-center border border-white/20 bg-white/10 backdrop-blur-xl p-12 rounded-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Launch Your Tech Career Today</h1>
          <p className="text-xl text-slate-200 mb-8">Join Ignite. Learn with peers, build real projects, and launch your dream career.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="bg-brand hover:bg-brand-hover text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
          >
            Explore Courses
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ignite?</h2>
        <div className="grid md:grid-cols-3 gap-8">
           <FeatureCard icon="/Assets/computer.svg" title="Hands-on" desc="Build real-world projects." />
           <FeatureCard icon="/Assets/expert.svg" title="Mentors" desc="Learn from the best." />
           <FeatureCard icon="/Assets/careerLogo.svg" title="Career" desc="Land your dream job." />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-bg-card border border-border-dim rounded-2xl text-center">
    <img src={icon} className="w-16 mx-auto mb-4" alt={title} />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-text-muted">{desc}</p>
  </div>
);

export default Home;
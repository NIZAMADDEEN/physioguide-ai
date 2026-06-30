export default function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient py-xl md:py-32">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-xl flex flex-col md:flex-row items-center gap-xl scroll-reveal">
        <div className="flex-1 text-center md:text-left space-y-md">
          <div className="inline-flex items-center gap-xs bg-primary-container/10 text-primary px-sm py-xs rounded-full">
            <span className="material-symbols-outlined text-[18px]">
              verified_user
            </span>
            <span className="text-label-sm uppercase tracking-wider">
              Medical Grade AI Accuracy
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg md:text-[56px] leading-tight text-on-surface">
            Recover Smarter with{" "}
            <span className="text-primary">Realtime Physiotherapy</span>{" "}
            Guidance
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto md:mx-0">
            Professional rehabilitation from the comfort of home. Our AI
            monitors your form in real-time using computer vision to ensure
            every rep counts.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-md pt-md justify-center md:justify-start">
            <button className="w-full sm:w-auto bg-primary text-on-primary px-xl py-md rounded-xl font-label-md shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
              Start Recovery
            </button>
            <button className="w-full sm:w-auto border-2 border-secondary text-secondary px-xl py-md rounded-xl font-label-md hover:bg-secondary-container/10 transition-all flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>
        </div>
        <div className="flex-1 w-full max-w-2xl relative scroll-reveal">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              alt="Physiotherapy session with realtime overlay"
              className="w-full h-auto object-cover aspect-video"
              src="./hero.jpg"
            />
            {/* AI UI Overlay elements */}
            <div className="absolute top-4 right-4 glass-card p-sm rounded-lg flex items-center gap-xs animate-pulse">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-label-sm font-bold text-on-surface">
                AI ACTIVE
              </span>
            </div>
            <div className="absolute bottom-4 left-4 glass-card p-sm rounded-lg">
              <div className="text-label-sm text-secondary font-bold">
                Knee Angle: 92&deg;
              </div>
              <div className="w-32 h-1 bg-outline-variant rounded-full mt-1">
                <div className="w-3/4 h-full bg-secondary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

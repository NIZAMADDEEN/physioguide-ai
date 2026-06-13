export default function CtaSection() {
  return (
    <section className="py-xl scroll-reveal">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-xl">
        <div className="bg-primary rounded-3xl p-xl text-center text-on-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 space-y-md">
            <h2 className="text-display-lg font-display-lg">Ready to start your recovery?</h2>
            <p className="text-body-lg opacity-90 max-w-2xl mx-auto">Join thousands of patients using AI to heal faster and smarter. No commitment required.</p>
            <div className="flex flex-col sm:flex-row gap-md justify-center pt-md">
              <button className="bg-white text-primary px-xl py-md rounded-xl font-bold hover:bg-surface-container-low transition-all">Get Started Free</button>
              <button className="bg-transparent border-2 border-on-primary text-on-primary px-xl py-md rounded-xl font-bold hover:bg-white/10 transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

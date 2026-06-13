export default function FeaturesSection() {
  return (
    <section className="py-xl md:py-32 bg-white scroll-reveal" id="features">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-xl">
        <div className="text-center space-y-xs mb-xl scroll-reveal">
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Clinically Precise Features</h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">Our technology bridges the gap between clinic visits and home recovery.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* Feature 1 */}
          <div className="p-lg rounded-xl border border-outline-variant bg-surface hover:shadow-lg hover:border-primary/30 transition-all group scroll-reveal">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">accessibility_new</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Real-Time Pose Detection</h3>
            <p className="text-body-md text-on-surface-variant">Instantly identifies postural errors and provides immediate correction cues.</p>
          </div>
          {/* Feature 2 */}
          <div className="p-lg rounded-xl border border-outline-variant bg-surface hover:shadow-lg hover:border-primary/30 transition-all group scroll-reveal">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">track_changes</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Exercise Accuracy Tracking</h3>
            <p className="text-body-md text-on-surface-variant">Monitor range of motion and rep quality with sub-degree accuracy.</p>
          </div>
          {/* Feature 3 */}
          <div className="p-lg rounded-xl border border-outline-variant bg-surface hover:shadow-lg hover:border-primary/30 transition-all group scroll-reveal">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Progress Analytics</h3>
            <p className="text-body-md text-on-surface-variant">Data-driven insights into your recovery journey with predictive healing timelines.</p>
          </div>
          {/* Feature 4 */}
          <div className="p-lg rounded-xl border border-outline-variant bg-surface hover:shadow-lg hover:border-primary/30 transition-all group scroll-reveal">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">clinical_notes</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Therapist Reports</h3>
            <p className="text-body-md text-on-surface-variant">Seamlessly share recovery data with your clinic for expert review.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

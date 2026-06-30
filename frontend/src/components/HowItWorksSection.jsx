export default function HowItWorksSection() {
  return (
    <section
      className="py-xl md:py-32 bg-surface-container-lowest scroll-reveal"
      id="how-it-works"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-xl">
        <div className="flex flex-col lg:flex-row items-center gap-xl">
          <div className="lg:w-1/2 scroll-reveal">
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-lg">
              Simple Path to Recovery
            </h2>
            <div className="space-y-lg">
              {/* Step 1 */}
              <div className="flex gap-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md mb-xs">
                    Select Exercise
                  </h4>
                  <p className="text-on-surface-variant">
                    Choose from a library of personalized routines tailored to
                    your specific injury and fitness level.
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex gap-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md mb-xs">
                    Start Camera
                  </h4>
                  <p className="text-on-surface-variant">
                    No extra hardware needed, just your laptop or phone. Our AI
                    works directly through your browser.
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex gap-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md mb-xs">
                    Receive Feedback
                  </h4>
                  <p className="text-on-surface-variant">
                    Get audio and visual cues for correct form, just like having
                    a therapist standing beside you.
                  </p>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex gap-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md mb-xs">
                    Track Progress
                  </h4>
                  <p className="text-on-surface-variant">
                    Watch your mobility improve with every session through
                    interactive charts and strength metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="lg:w-1/2 w-full scroll-reveal"
            style={{ transitionDelay: "0.15s" }}
          >
            <div className="bg-primary/5 rounded-2xl p-lg relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              <img
                alt="User tracking progress on laptop"
                className="rounded-xl shadow-xl w-full object-cover"
                src="./hero.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

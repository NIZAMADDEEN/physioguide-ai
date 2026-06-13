export default function TestimonialsSection() {
  return (
    <section className="py-xl md:py-32 bg-white scroll-reveal" id="testimonials">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-xl">
        <h2 className="text-center text-headline-lg font-headline-lg mb-xl scroll-reveal">Trusted by Patients and Pros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Quote 1 */}
          <div className="bg-surface p-xl rounded-2xl border border-outline-variant relative scroll-reveal">
            <span className="material-symbols-outlined text-secondary absolute top-6 right-8 text-[48px] opacity-20">format_quote</span>
            <div className="flex gap-md items-center mb-md">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img alt="Patient" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrBQYrHecP0JUvOu8Obz5W4HZ33QANFHgw11vzDvE5d6qIOTEfkJuQjjv9hxvEx_SvdfUqC9l1ZAsRAKOuuO0q8uh7USv7qrb0IJc40plQYIaf_0wKDkAOLEQCCQ67UimEP2UtCmgc6gkgpWsVC1Fl4VeYXHZL8KRktBmReyNC9vwFkj0UAKJaop6Xd99tgkT7vR_b5f7Cg0h56UF3qE5T09wGwPzhPcSUq_ro3TrunOL1csIau9lm2DV9Xikzf5sca0chLs6URdlZ"/>
              </div>
              <div>
                <div className="font-bold text-on-surface">Sarah Johnson</div>
                <div className="text-label-sm text-secondary uppercase">ACL Recovery Patient</div>
              </div>
            </div>
            <p className="text-headline-md italic font-medium text-on-surface leading-relaxed">
              &quot;I was hesitant about home rehab, but PhysioGuide AI changed everything. I was back to running in half the time my surgeon expected!&quot;
            </p>
          </div>
          {/* Quote 2 */}
          <div className="bg-surface p-xl rounded-2xl border border-outline-variant relative scroll-reveal" style={{ transitionDelay: '0.15s' }}>
            <span className="material-symbols-outlined text-primary absolute top-6 right-8 text-[48px] opacity-20">format_quote</span>
            <div className="flex gap-md items-center mb-md">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img alt="Physiotherapist" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKxrHS9LGg9sTmhDEoWOjEYriiqn6GnegsOS5XffUKiP4kYWGYth8RmOS4UEf9_AdKWv8hLjbFz8M3nFC_151eLPchtDrYxawGEFpFRBE8YB2_CU4TfQRX-2eQCv7_CnNFc_K-VajeCDrsf_gj7YVdCqGpiJ2Rln2DzTM0rN_PJX87Z9rh5Z5BDDaeClyNu7IZgs9FfeRAYut6VRQS-1GIU8fz3DPpn_g6a35HDMxfxX8lglwPumF0gIyeAUnPpsk54OaB735Du8FH"/>
              </div>
              <div>
                <div className="font-bold text-on-surface">Dr. Marcus Chen</div>
                <div className="text-label-sm text-primary uppercase">DPT, Sports Specialist</div>
              </div>
            </div>
            <p className="text-headline-md italic font-medium text-on-surface leading-relaxed">
              &quot;The data precision helps me adjust treatments faster. Seeing exactly how my patients move between sessions is a complete game-changer.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

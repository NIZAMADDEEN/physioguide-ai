export default function Footer() {
  return (
    <footer className="w-full py-xl bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant scroll-reveal">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter px-margin-mobile md:px-xl max-w-container-max mx-auto">
        <div>
          <div className="text-headline-sm font-headline-sm text-gray-200 dark:text-inverse-on-surface font-bold mb-md">
            VirtuGym
          </div>
          <p className="text-label-sm font-label-sm text-white dark:text-surface-variant max-w-xs">
            &copy; 2026 VirtuGym.
          </p>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="text-label-md font-bold text-gray-200 dark:text-inverse-on-surface mb-xs">
            Product
          </span>
          <a
            className="text-white dark:text-surface-variant hover:text-primary transition-all hover:underline decoration-secondary"
            href="#"
          >
            Features
          </a>
          <a
            className="text-white dark:text-surface-variant hover:text-primary transition-all hover:underline decoration-secondary"
            href="#"
          >
            How it Works
          </a>
          <a
            className="text-white dark:text-surface-variant hover:text-primary transition-all hover:underline decoration-secondary"
            href="#"
          >
            Resources
          </a>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="text-label-md font-bold text-gray-200 dark:text-inverse-on-surface mb-xs">
            Company
          </span>
          <a
            className="text-white dark:text-surface-variant hover:text-primary transition-all hover:underline decoration-secondary"
            href="#"
          >
            About Us
          </a>
          <a
            className="text-white dark:text-surface-variant hover:text-primary transition-all hover:underline decoration-secondary"
            href="#"
          >
            Careers
          </a>
          <a
            className="text-white dark:text-surface-variant hover:text-primary transition-all hover:underline decoration-secondary"
            href="#"
          >
            Privacy Policy
          </a>
        </div>
        <div className="flex flex-col gap-xs">
          <span className="text-label-md font-bold text-gray-200 dark:text-inverse-on-surface mb-xs">
            Contact
          </span>
          <div className="text-white dark:text-surface-variant text-label-sm">
            support@virtugym.ai
          </div>
          <div className="flex gap-sm mt-xs">
            <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-[18px]">
                share
              </span>
            </button>
            <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-[18px]">
                alternate_email
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

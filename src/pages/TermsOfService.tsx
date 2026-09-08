const LAST_UPDATED = "September 8, 2026";

const TermsOfService = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-14">
      <div className="mb-14 animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white mb-3">
          Terms of Service
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Last updated {LAST_UPDATED}
        </p>
      </div>

      <div className="space-y-14 animate-fade-in-up animate-delay-100">
        <section>
          <div className="p-6 sm:p-8 bg-neutral-950 dark:bg-white">
            <h2 className="text-lg font-extrabold tracking-tight text-white dark:text-neutral-950 mb-2">
              This is a demonstration application
            </h2>
            <p className="text-neutral-300 dark:text-neutral-600 leading-relaxed">
              SubApp is a reference implementation built to demonstrate integrating the
              @ngelekanyo/payfast package with React and Supabase. It is not a fully lawyered,
              commercial production service, and these terms are written accordingly: they
              describe how the app actually behaves rather than promising service levels a demo
              cannot guarantee.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Acceptance of terms
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            By creating an account or using any part of this app, you agree to these terms. If
            you do not agree, please do not create an account or submit payment information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Subscriptions and billing
          </h2>
          <div className="space-y-4 text-neutral-500 dark:text-neutral-400 leading-relaxed">
            <p>
              Subscribing to a plan creates a recurring billing arrangement processed by PayFast.
              Your card or EFT payment is handled entirely on PayFast's payment page; we never see
              your full card details.
            </p>
            <p>
              <span className="font-bold text-neutral-950 dark:text-white">Cancellation.</span>{" "}
              Cancelling a subscription takes effect immediately: the subscription is cancelled
              with PayFast and access to premium features ends right away. There is no
              pro-rated refund for the unused portion of the current billing period.
            </p>
            <p>
              <span className="font-bold text-neutral-950 dark:text-white">Pausing.</span>{" "}
              Pausing a subscription does not cancel it — it delays future billing by the number
              of paused cycles, and PayFast extends the subscription end date accordingly.
              Unpausing early does not move your next billing date forward; billing resumes only
              after the full paused duration has elapsed. This app does not automatically restrict
              access to premium features during a pause; feature access is separately controlled
              by your plan.
            </p>
            <p>
              <span className="font-bold text-neutral-950 dark:text-white">Resuming.</span>{" "}
              Resuming a paused subscription reinstates the original billing schedule as described
              above.
            </p>
            <p>
              Prices are shown in South African Rand (ZAR) at the time of subscribing. As a demo
              application, plan pricing and features may change without the extended notice a
              commercial service would typically provide.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Acceptable use
          </h2>
          <ul className="space-y-3 text-neutral-500 dark:text-neutral-400 leading-relaxed list-disc pl-5">
            <li>You must provide accurate account and payment information.</li>
            <li>You may not attempt to bypass authentication, Row Level Security, or feature gating.</li>
            <li>You may not use the app to submit fraudulent payments or abuse the support contact form.</li>
            <li>You are responsible for keeping your login credentials confidential.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Account termination
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            You may stop using the app and request account deletion at any time by contacting us.
            We may suspend or terminate access to accounts found to be violating the acceptable
            use terms above, or that submit fraudulent payment activity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Limitation of liability
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            This app is provided as a working reference implementation, without warranty of any
            kind, express or implied. To the fullest extent permitted by law, we are not liable
            for any indirect, incidental, or consequential damages arising from your use of the
            app, including issues arising from PayFast's payment processing, which is governed by
            PayFast's own terms and is outside our control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Governing law
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            These terms are governed by the laws of the Republic of South Africa, consistent with
            PayFast's own jurisdiction as our payment processor.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Changes to these terms
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            We may update these terms as the app evolves. The "Last updated" date at the top of
            this page reflects the most recent revision. Continued use of the app after a change
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Contact us
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Questions about these terms can be sent through the{" "}
            <a href="/contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;

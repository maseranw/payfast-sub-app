import { Shield } from "lucide-react";

const LAST_UPDATED = "September 8, 2026";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-14">
      <div className="mb-14 animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Last updated {LAST_UPDATED}
        </p>
      </div>

      <div className="space-y-14 animate-fade-in-up animate-delay-100">
        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            What this policy covers
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            SubApp is a subscription management demo application built with React, Supabase, and
            PayFast. This policy explains exactly what personal data the app collects, why it is
            collected, who else processes it, and the choices available to you. It applies to
            every page of the app, including the dashboard, subscription, profile, and contact
            pages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Information we collect
          </h2>
          <div className="space-y-6">
            <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
              <h3 className="font-bold text-neutral-950 dark:text-white mb-2">
                Account credentials
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                When you register, your email address and password are stored by Supabase Auth.
                Passwords are hashed by Supabase and are never visible to this application in
                plain text.
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
              <h3 className="font-bold text-neutral-950 dark:text-white mb-2">Profile details</h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Your first name, last name, and an optional phone number are stored in the{" "}
                <code className="text-neutral-950 dark:text-white">user_profiles</code> table,
                linked to your account. These are used to personalize the app, pre-fill the
                contact form, and pass your name to PayFast when initiating a payment.
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
              <h3 className="font-bold text-neutral-950 dark:text-white mb-2">
                Subscription and billing data
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                The <code className="text-neutral-950 dark:text-white">subscriptions</code> table
                stores which plan you have chosen, its status (pending, active, paused, or
                cancelled), whether cancellation is scheduled at period end, your current billing
                period dates, and a PayFast subscription token used to manage the subscription
                with PayFast. We do not collect or store your card number, card expiry date, or
                CVV — those are entered directly on PayFast's own payment page.
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
              <h3 className="font-bold text-neutral-950 dark:text-white mb-2">
                Support messages
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                When you use the Contact page, your subject, message, chosen priority, name, and
                email address are stored in the{" "}
                <code className="text-neutral-950 dark:text-white">contact_messages</code> table
                so support staff can respond, along with a status field tracking whether the
                message is open, in progress, resolved, or closed.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Why we use this information
          </h2>
          <ul className="space-y-3 text-neutral-500 dark:text-neutral-400 leading-relaxed list-disc pl-5">
            <li>To authenticate you and keep your account secure.</li>
            <li>To display your name and contact details back to you in the Profile and Contact pages.</li>
            <li>To create, track, pause, resume, and cancel your subscription with PayFast.</li>
            <li>To route your recurring billing to the correct plan and billing period.</li>
            <li>To respond to support requests submitted through the Contact page.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Third parties involved
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-neutral-950 dark:text-white mb-2">Supabase</h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Supabase hosts our database, handles authentication, and stores every table
                described above. Supabase acts as our data processor and secures data in transit
                with HTTPS.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-neutral-950 dark:text-white mb-2">PayFast</h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                PayFast is a South African payment gateway that processes your card or EFT
                payment directly. PayFast is a separate, independent data controller for the
                payment details you enter on its site — this application never receives or stores
                your full card number. PayFast sends this app status updates (via ITN webhooks)
                confirming payment, pause, resume, or cancellation events, which is how our
                subscription records stay in sync.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            How your data is protected
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
            Every table in our database has Row Level Security (RLS) enabled. This means the
            database itself enforces that you can only read or write rows tied to your own user
            id — not a permission checked only in application code. Subscription status changes
            (moving a subscription to active, paused, or cancelled) can only be written by our
            backend using a service role key; your browser session is never able to set those
            values directly, which prevents tampering with billing state from the client.
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            For more detail on these technical safeguards, see our{" "}
            <a
              href="/security"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Security
            </a>{" "}
            page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Data retention and deletion
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            We retain your profile, subscription, and support message records for as long as your
            account exists, so that billing history and support conversations remain available to
            you. If you delete your account, your profile and subscription rows are removed
            automatically because they are linked to your Supabase Auth user with a cascading
            delete. To request deletion of your account and associated data, contact us using the
            details below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Your rights
          </h2>
          <ul className="space-y-3 text-neutral-500 dark:text-neutral-400 leading-relaxed list-disc pl-5">
            <li>Access and review the personal data we hold about you from your Profile page.</li>
            <li>Correct your name and phone number at any time from the Profile page.</li>
            <li>Request a copy of your data or its deletion by contacting us.</li>
            <li>Cancel your subscription at any time from the Profile page.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Contact us
          </h2>
          <div className="p-6 sm:p-8 bg-blue-600">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-white mt-1 shrink-0" strokeWidth={2} />
              <p className="text-blue-50 leading-relaxed">
                Questions about this policy or your data can be sent through the{" "}
                <a href="/contact" className="text-white font-semibold hover:underline">
                  Contact page
                </a>{" "}
                or to privacy@subapp.com.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

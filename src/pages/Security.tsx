import { Lock, Database, Webhook, KeyRound, Server } from "lucide-react";

const LAST_UPDATED = "September 8, 2026";

const Security = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-14">
      <div className="mb-14 animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white mb-3">
          Security
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Last updated {LAST_UPDATED}
        </p>
      </div>

      <div className="space-y-14 animate-fade-in-up animate-delay-100">
        <section>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            This page describes the concrete security measures actually implemented in this
            application's codebase and infrastructure — not generic promises. SubApp has not
            undergone a SOC 2, PCI DSS, or ISO 27001 audit, and makes no claim to any such
            certification.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-6">
            Database access control
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 shrink-0" strokeWidth={2} />
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Row Level Security (RLS) is enabled on every table — user profiles, subscription
                plans, subscriptions, subscription features, plan features, and contact messages.
                Policies restrict every read and write to rows matching the authenticated user's
                id, enforced by the database itself rather than by application code alone. This
                means even a bug in the frontend cannot expose one user's data to another.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-6">
            Server-controlled subscription state
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <KeyRound className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 shrink-0" strokeWidth={2} />
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                The client is only permitted to insert a new subscription row in a{" "}
                <code className="text-neutral-950 dark:text-white">pending</code> state. Every
                transition to active, paused, or cancelled is written exclusively by our backend
                using a Supabase service role key, which the browser never has access to. This
                closes off the most common way a client-writable billing table gets tampered with
                — a user's browser simply cannot flip its own subscription to active without
                paying.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-6">
            PayFast webhook verification
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Webhook className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 shrink-0" strokeWidth={2} />
              <div className="text-neutral-500 dark:text-neutral-400 leading-relaxed space-y-3">
                <p>
                  Payment status changes arrive from PayFast as Instant Transaction Notification
                  (ITN) webhooks, handled by the @ngelekanyo/payfast backend package before any
                  subscription state is updated:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>PayFast's signature is validated on every ITN before the payload is trusted.</li>
                  <li>The merchant id on the payload is checked against our configured merchant.</li>
                  <li>The request's source IP is verified against PayFast's published domains (skipped only in sandbox mode for local testing).</li>
                </ul>
                <p>
                  Only after all three checks pass does the backend update a subscription's status
                  using its service role key.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-6">
            Authentication and transport
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-amber-500 mt-1 shrink-0" strokeWidth={2} />
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Sign-in and session management are handled by Supabase Auth. Passwords are hashed
                by Supabase and are never stored or visible in application code. In production,
                the app and its API calls are served over HTTPS.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-6">
            PayFast as payment processor
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Server className="h-6 w-6 text-red-600 dark:text-red-400 mt-1 shrink-0" strokeWidth={2} />
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Card and EFT payment details are captured directly on PayFast's own hosted payment
                page, never by this application. PayFast is a PCI DSS Level 1 compliant payment
                processor — that certification belongs to PayFast as the payment gateway, and is
                separate from this demo application's own security posture described above.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4">
            Reporting a security issue
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            If you believe you have found a security issue in this application, please report it
            through the{" "}
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

export default Security;

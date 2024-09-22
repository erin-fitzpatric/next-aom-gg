export default function PrivacyPolicy() {

  return (
    <div className="text-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12">
          Privacy Policy
        </h1>

        <section className="mb-12">
          <p className="text-lg sm:text-xl text-center mb-6">
            <strong>Last Updated:</strong> {new Date('2024-09-20').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <p className="text-lg mb-6">
            At <span className="font-semibold">AoM.gg</span>, your
            privacy is important to us. This Privacy Policy outlines how we
            collect, use, and protect your personal information when you use our
            services.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">
            1. Information We Collect
          </h2>
          <p className="text-lg mb-4">
            We collect information from you when you:
          </p>
          <ul className="list-disc list-inside ml-6 mb-4">
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Communicate with us</li>
          </ul>
          <p className="text-lg">
            This information may include personal details such as your name,
            email address, and any other data you provide.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">
            2. How We Use Your Information
          </h2>
          <p className="text-lg mb-4">We use your information to:</p>
          <ul className="list-disc list-inside ml-6 mb-4">
            <li>Provide and improve our services</li>
            <li>Communicate with you about updates or changes</li>
            <li>Respond to your inquiries and support requests</li>
          </ul>
          <p className="text-lg">
            We do not sell or rent your personal information to third parties.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">3. Data Security</h2>
          <p className="text-lg mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal data from unauthorized access, use, or
            disclosure.
          </p>
          <p className="text-lg">
            Despite our efforts, no method of transmission over the internet or
            electronic storage is completely secure, so we cannot guarantee
            absolute security.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">4. Your Rights</h2>
          <p className="text-lg mb-4">You have the right to:</p>
          <ul className="list-disc list-inside ml-6 mb-4">
            <li>Access and update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of communications</li>
          </ul>
          <p className="text-lg">
            To exercise these rights, please contact us using the details
            provided below.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">
            5. Changes to This Policy
          </h2>
          <p className="text-lg mb-4">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with the &quot;Last Updated&quot; date.
          </p>
          <p className="text-lg">
            Your continued use of our services after any changes indicates your
            acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">6. Contact Us</h2>
          <p className="text-lg mb-4">
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:
          </p>
          <address className="not-italic text-lg">
            <a
              href="mailto:fitzbrogaming@gmail.com"
              className="text-blue-400 hover:text-blue-300"
            >
              fitzbrogaming@gmail.com
            </a>
            <br />
            <a
              href="https://discord.com/invite/Rvthxry"
              className="text-blue-400 hover:text-blue-300"
            >
              Discord
            </a>
          </address>
        </section>
      </div>
    </div>
  );
}

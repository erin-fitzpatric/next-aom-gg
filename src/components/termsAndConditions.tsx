export default function TermsAndConditions() {
  const currentDate = new Date().toISOString().split("T")[0];
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-10">
        Terms and Conditions
      </h1>

      <p className="mb-6">
        <strong>Last Updated:</strong> {currentDate}
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using our services, you agree to be bound by these
          Terms and Conditions (&quot;Terms&quot;). If you do not agree to these
          Terms, please refrain from using our services.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
        <p>
          You agree to use our services only for lawful purposes and in a manner
          consistent with all applicable laws and regulations. You are
          responsible for your use of the services, including any content you
          create or share.
        </p>
        <ul className="list-disc list-inside ml-6">
          <li>
            Using the service in violation of any applicable law or regulation.
          </li>
          <li>Distributing viruses or any other harmful code.</li>
          <li>Engaging in unauthorized access to our systems or services.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
        <p>
          You may be required to create an account to use certain features of
          our services. You agree to provide accurate and complete information
          during registration. You are responsible for maintaining the
          confidentiality of your account information and all activities that
          occur under your account.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
        <p>
          You retain ownership of any content you submit, post, or display on or
          through the services. However, by submitting content, you grant us a
          worldwide, non-exclusive, royalty-free license to use, display,
          reproduce, and distribute your content in connection with providing
          the services.
        </p>
        <p>
          <strong>Responsibility for User Content:</strong>
        </p>
        <ul className="list-disc list-inside ml-6">
          <li>
            You are solely responsible for any content you create or share.
          </li>
          <li>
            We do not endorse, guarantee, or assume responsibility for any user
            content.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          5. Intellectual Property
        </h2>
        <p>
          All content, including but not limited to text, images, graphics,
          logos, and software, is the property of fitzbrogaming or our licensors
          and is protected by copyright, trademark, and other intellectual
          property laws.
        </p>
        <p>
          You may not copy, reproduce, distribute, or create derivative works
          from any content provided through our services without our prior
          written consent.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">6. Third-Party Links</h2>
        <p>
          Our services may contain links to third-party websites or services
          that are not owned or controlled by us. We are not responsible for the
          content, privacy policies, or practices of any third-party sites.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          7. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, fitzbrogaming and its
          affiliates, officers, employees, and agents shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages,
          including but not limited to loss of profits, data, or goodwill,
          arising out of or related to your use of the services.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          8. Disclaimer of Warranties
        </h2>
        <p>
          Our services are provided &quot;as is&quot; and &quot;as
          available,&quot; without any warranties of any kind, express or
          implied. We do not warrant that the services will be error-free,
          uninterrupted, or free from viruses or other harmful components.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your access to the
          services at any time, without notice, for any reason, including
          violation of these Terms.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of USA, without regard to its conflict of law principles.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Any changes will be
          posted on this page with the &quot;Last Updated&quot; date. Your
          continued use of the services after the changes take effect
          constitutes your acceptance of the new Terms.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
        <p>
          If you have any questions or concerns about these Terms, please
          contact us at:
        </p>
        <address className="not-italic">
          <a
            href="https://discord.com/invite/Rvthxry"
            className="text-blue-500 hover:underline"
          >
            Discord
          </a>
          <br />
          fitzbrogaming@gmail.com
          <br />
        </address>
      </section>
    </div>
  );
}

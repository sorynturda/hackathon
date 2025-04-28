"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const TermsOfServicePage = () => {
  // Animation variants
  const titleVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7, delay: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-10 text-center"
            initial="initial"
            animate="animate"
            variants={titleVariants}
          >
            <h1 className="h1 text-white mb-2">Terms of Service</h1>
            <p className="body text-white/70">Last Updated: April 23, 2025</p>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            initial="initial"
            animate="animate"
            variants={contentVariants}
          >
            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">1. Agreement to Terms</h2>
              <p className="body-small text-white/80 mb-3">
                By accessing or using our recruitment platform ("the Platform"),
                you agree to be bound by these Terms of Service. If you disagree
                with any part of the terms, you may not access the Platform.
              </p>
              <p className="body-small text-white/80">
                We reserve the right to modify these Terms at any time. We will
                always post the most current version on our website and notify
                you of any significant changes. By continuing to use the
                Platform after changes are made, you agree to be bound by the
                updated Terms.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">
                2. Account Creation and Responsibilities
              </h2>
              <p className="body-small text-white/80 mb-3">
                When you create an account with us, you guarantee that the
                information you provide is accurate, complete, and current at
                all times. Inaccurate, incomplete, or obsolete information may
                result in the immediate termination of your account.
              </p>
              <p className="body-small text-white/80 mb-3">
                You are responsible for maintaining the confidentiality of your
                account and password, including but not limited to restricting
                access to your computer and/or account. You agree to accept
                responsibility for any and all activities that occur under your
                account and/or password.
              </p>
              <p className="body-small text-white/80">
                You must notify us immediately upon becoming aware of any breach
                of security or unauthorized use of your account.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">3. Platform Usage</h2>
              <p className="body-small text-white/80 mb-3">
                <strong>Permitted Use:</strong> The Platform is designed to
                facilitate recruitment processes and match employers with
                suitable candidates using AI technology. You may use the
                Platform solely for these legitimate purposes.
              </p>
              <p className="body-small text-white/80 mb-3">
                <strong>Prohibited Activities:</strong> You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 body-small text-white/80">
                <li>
                  Use the Platform to post false, inaccurate, misleading,
                  defamatory, or fraudulent content
                </li>
                <li>
                  Use the Platform to harass, abuse, or harm another person
                </li>
                <li>
                  Use the Platform to collect or store personal data about other
                  users without their permission
                </li>
                <li>
                  Impersonate another person or create a misleading
                  representation of your affiliation with any person or company
                </li>
                <li>
                  Attempt to access any portion of the Platform that you are not
                  authorized to access
                </li>
                <li>
                  Upload or transmit viruses or any other type of malicious code
                </li>
                <li>
                  Interfere with the security or functionality of the Platform
                </li>
              </ul>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">4. Intellectual Property</h2>
              <p className="body-small text-white/80 mb-3">
                The Platform and its original content, features, and
                functionality are and will remain the exclusive property of our
                company and its licensors. The Platform is protected by
                copyright, trademark, and other laws of both the United States
                and foreign countries.
              </p>
              <p className="body-small text-white/80">
                Our trademarks and trade dress may not be used in connection
                with any product or service without the prior written consent of
                our company.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">5. User Content</h2>
              <p className="body-small text-white/80 mb-3">
                By submitting content to the Platform, you grant us a worldwide,
                non-exclusive, royalty-free license to use, reproduce, adapt,
                publish, translate, and distribute your content in any existing
                or future media. You also grant us the right to sublicense these
                rights and the right to enforce these rights against third
                parties.
              </p>
              <p className="body-small text-white/80">
                You represent and warrant that you own or control all rights in
                and to the content you provide, and that the content does not
                infringe upon the rights of any third party.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">
                6. AI Technology and Data Usage
              </h2>
              <p className="body-small text-white/80 mb-3">
                Our Platform utilizes artificial intelligence to enhance the
                recruitment process. By using our Platform, you acknowledge and
                agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2 body-small text-white/80">
                <li>
                  Data you provide may be processed by our AI systems to improve
                  matching algorithms
                </li>
                <li>
                  AI matching results are intended as suggestions and not
                  definitive determinations
                </li>
                <li>
                  You maintain responsibility for your final recruitment
                  decisions
                </li>
                <li>
                  We continuously improve our AI technology and cannot guarantee
                  specific outcomes
                </li>
              </ul>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">
                7. Limitation of Liability
              </h2>
              <p className="body-small text-white/80">
                To the maximum extent permitted by law, we shall not be liable
                for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the Platform; any
                conduct or content of any third party on the Platform; or
                unauthorized access, use, or alteration of your transmissions or
                content.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">8. Termination</h2>
              <p className="body-small text-white/80">
                We may terminate or suspend your account and bar access to the
                Platform immediately, without prior notice or liability, at our
                sole discretion, for any reason whatsoever, including but not
                limited to a breach of the Terms. Upon termination, your right
                to use the Platform will immediately cease.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">9. Governing Law</h2>
              <p className="body-small text-white/80">
                These Terms shall be governed and construed in accordance with
                the laws of the United States, without regard to its conflict of
                law provisions. Our failure to enforce any right or provision of
                these Terms will not be considered a waiver of those rights.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">10. Contact Us</h2>
              <p className="body-small text-white/80">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <p className="body text-accent mt-2">
                terms@streamlinehiring.com
              </p>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
          >
            <Link
              href="/signup"
              className="inline-block bg-accent text-black body py-3 px-8 hover:bg-black hover:text-white transition-colors duration-300 border border-accent"
            >
              Back to Sign Up
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;

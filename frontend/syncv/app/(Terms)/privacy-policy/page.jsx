"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const PrivacyPolicyPage = () => {
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
            <h1 className="h1 text-white mb-2">Privacy Policy</h1>
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
              <h2 className="h4 text-accent mb-4">1. Introduction</h2>
              <p className="body-small text-white/80 mb-3">
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our recruitment
                platform. Please read this Privacy Policy carefully. By
                accessing or using the platform, you acknowledge that you have
                read, understood, and agree to be bound by all the terms of this
                Privacy Policy. If you do not agree with the terms of this
                policy, please do not access the platform.
              </p>
              <p className="body-small text-white/80">
                We reserve the right to make changes to this Privacy Policy at
                any time and for any reason. We will alert you about any changes
                by updating the "Last Updated" date of this Privacy Policy. You
                are encouraged to periodically review this Privacy Policy to
                stay informed of updates.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">2. Information We Collect</h2>
              <p className="body-small text-white/80 mb-3">
                <strong>Personal Data:</strong> We may collect personal
                identification information, including but not limited to your
                name, email address, phone number, resume information, work
                history, education, and skills.
              </p>
              <p className="body-small text-white/80 mb-3">
                <strong>Usage Data:</strong> We may also collect information
                about how the platform is accessed and used, including your
                computer's Internet Protocol address, browser type, the pages
                you visit, the time and date of your visit, and the time spent
                on those pages.
              </p>
              <p className="body-small text-white/80">
                <strong>AI Training Data:</strong> Our platform uses artificial
                intelligence to enhance the recruitment process. The data you
                provide may be used to train our AI systems to improve matching
                algorithms and user experience.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">
                3. How We Use Your Information
              </h2>
              <p className="body-small text-white/80 mb-2">
                We may use the information we collect from you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 body-small text-white/80">
                <li>
                  Facilitate the recruitment process and match candidates with
                  appropriate job opportunities
                </li>
                <li>Create and maintain your account</li>
                <li>Provide and deliver the services you request</li>
                <li>
                  Send you technical notices, updates, security alerts, and
                  support messages
                </li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Improve our platform and user experience</li>
                <li>Train and improve our AI algorithms</li>
              </ul>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="body-small text-white/80 mb-3">
                We may share your information with employers and recruiters who
                use our platform, but only to the extent necessary to facilitate
                the recruitment process.
              </p>
              <p className="body-small text-white/80">
                We may also share your information with third-party vendors,
                service providers, contractors, or agents who perform services
                for us or on our behalf and require access to such information
                to do that work.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">5. Data Security</h2>
              <p className="body-small text-white/80">
                We have implemented appropriate technical and organizational
                security measures designed to protect the security of any
                personal information we process. However, please also remember
                that we cannot guarantee that the internet itself is 100%
                secure. Although we will do our best to protect your personal
                information, transmission of personal information to and from
                our platform is at your own risk.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">6. Your Data Rights</h2>
              <p className="body-small text-white/80 mb-3">
                Depending on your location, you may have certain rights
                regarding your personal information, such as the right to
                access, correct, delete, or restrict processing of your personal
                data.
              </p>
              <p className="body-small text-white/80">
                To exercise these rights, please contact us using the
                information provided in the "Contact Us" section below.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="h4 text-accent mb-4">7. Contact Us</h2>
              <p className="body-small text-white/80">
                If you have questions or comments about this Privacy Policy,
                please contact us at:
              </p>
              <p className="body text-accent mt-2">
                privacy@streamlinehiring.com
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

export default PrivacyPolicyPage;

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - PLUCO GROUP SP. Z O.O.',
  description: 'Privacy policy for PLUCO GROUP SP. Z O.O. commercial and legal consultancy services.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-16 bg-gradient-to-b from-navy-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif text-navy-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            How we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Introduction</h2>
                <p className="leading-relaxed">
                  PLUCO GROUP SP. Z O.O. ("we," "us," or "our") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website and use our commercial and legal consultancy services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Information We Collect</h2>
                <p className="leading-relaxed mb-4">
                  We may collect several types of information from and about users of our website, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal identification information (Name, email address, phone number, etc.)</li>
                  <li>Business information (Company name, position, industry, etc.)</li>
                  <li>Technical information (IP address, browser type, device information)</li>
                  <li>Usage information (Pages visited, time spent, referral source)</li>
                  <li>Communication information (Messages, inquiries, consultation requests)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">How We Use Your Information</h2>
                <p className="leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain our commercial and legal consultancy services</li>
                  <li>Process and respond to your inquiries and consultation requests</li>
                  <li>Improve our website and services based on user feedback</li>
                  <li>Communicate with you about our services and updates</li>
                  <li>Comply with legal obligations and protect our rights</li>
                  <li>Analyze website usage and optimize user experience</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Information Sharing</h2>
                <p className="leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To service providers who assist in operating our website and business</li>
                  <li>To comply with legal requirements, court orders, or government regulations</li>
                  <li>To protect our rights, privacy, safety, or property</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. However, 
                  no method of transmission over the internet or method of electronic storage is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Cookies and Tracking</h2>
                <p className="leading-relaxed mb-4">
                  Our website may use cookies and similar tracking technologies to enhance user experience. 
                  Cookies are small files stored on your device that help us understand how you use our website.
                </p>
                <p className="leading-relaxed">
                  You can control cookie settings through your browser preferences. However, disabling cookies 
                  may affect your ability to use certain features of our website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Your Rights</h2>
                <p className="leading-relaxed mb-4">
                  Under applicable data protection laws, you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Data Retention</h2>
                <p className="leading-relaxed">
                  We retain your personal information only as long as necessary to fulfill the purposes 
                  for which it was collected, comply with legal obligations, resolve disputes, and enforce 
                  our agreements. Retention periods may vary based on the type of information and legal requirements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">International Data Transfers</h2>
                <p className="leading-relaxed">
                  As an international consultancy, we may transfer your personal information to countries 
                  other than your own. We ensure such transfers are conducted in accordance with applicable 
                  data protection laws and implement appropriate safeguards to protect your information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our website and services are not intended for individuals under the age of 18. We do not 
                  knowingly collect personal information from children under 18. If you become aware that 
                  we have collected information from a child, please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Contact Us</h2>
                <p className="leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, 
                  please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> contact@plucogroup.com</p>
                  <p><strong>Phone:</strong> +48 22 123 4567</p>
                  <p><strong>Address:</strong> Ksawerów 3, 02-656 Warsaw, Poland</p>
                  <p><strong>KRS:</strong> 0000564904</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-300">
                <p className="text-sm text-gray-500">
                  This Privacy Policy was last updated on {new Date().toLocaleDateString()}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

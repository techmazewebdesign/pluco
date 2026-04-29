import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - PLUCO GROUP SP. Z O.O.',
  description: 'Legal disclaimer for PLUCO GROUP SP. Z O.O. commercial and legal consultancy services.',
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-16 bg-gradient-to-b from-navy-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif text-navy-900 mb-6">
            Disclaimer
          </h1>
          <p className="text-xl text-gray-600">
            Important information about our services and limitations.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">General Disclaimer</h2>
                <p className="leading-relaxed">
                  The information provided on this website is for general informational purposes only. 
                  PLUCO GROUP SP. Z O.O. makes no representations or warranties of any kind, express or implied, 
                  about the completeness, accuracy, reliability, suitability or availability with respect to the 
                  website or the information, products, services, or related graphics contained on the website for any purpose.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Legal Services</h2>
                <p className="leading-relaxed mb-4">
                  PLUCO GROUP SP. Z O.O. provides commercial and legal consultancy services. The information on this 
                  website does not constitute legal advice and should not be treated as such. No attorney-client 
                  relationship is formed by accessing this website or by communicating with PLUCO GROUP SP. Z O.O. 
                  through this website.
                </p>
                <p className="leading-relaxed">
                  You should not act upon any information on this website without seeking professional legal counsel 
                  from an attorney licensed to practice law in your jurisdiction.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">No Warranty</h2>
                <p className="leading-relaxed">
                  Any reliance you place on such information is therefore strictly at your own risk. In no event will 
                  PLUCO GROUP SP. Z O.O. be liable for any loss or damage including without limitation, indirect or 
                  consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits 
                  arising out of, or in connection with, the use of this website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Professional Services</h2>
                <p className="leading-relaxed mb-4">
                  The provision of professional services by PLUCO GROUP SP. Z O.O. is subject to separate engagement 
                  agreements and terms of service. The scope of services, fees, and responsibilities will be clearly 
                  defined in such agreements.
                </p>
                <p className="leading-relaxed">
                  Past results or case studies mentioned on this website do not guarantee similar outcomes for future matters.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Jurisdictional Limitations</h2>
                <p className="leading-relaxed">
                  PLUCO GROUP SP. Z O.O. is registered in Poland (KRS: 0000564904) and operates in accordance with 
                  Polish law and applicable international regulations. Services may be subject to licensing requirements 
                  in certain jurisdictions, and we comply with all applicable legal and regulatory requirements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Website Availability</h2>
                <p className="leading-relaxed">
                  PLUCO GROUP SP. Z O.O. makes no guarantees about the availability of this website and does not 
                  guarantee that the website will be uninterrupted or error-free. The website may be temporarily 
                  unavailable due to technical issues beyond our control.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Third-Party Links</h2>
                <p className="leading-relaxed">
                  Through this website you may be able to link to other websites which are not under the control of 
                  PLUCO GROUP SP. Z O.O. We have no control over the nature, content and availability of those sites. 
                  The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Updates to This Disclaimer</h2>
                <p className="leading-relaxed">
                  We reserve the right to amend this disclaimer at any time. Any changes will be posted on this page 
                  and will take effect immediately upon posting. Your continued use of this website constitutes your 
                  acceptance of any such changes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-navy-900 mb-4">Contact Information</h2>
                <p className="leading-relaxed">
                  If you have any questions about this disclaimer, please contact us at:
                </p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> contact@plucogroup.com</p>
                  <p><strong>Phone:</strong> +48 22 123 4567</p>
                  <p><strong>Address:</strong> Ksawerów 3, 02-656 Warsaw, Poland</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-300">
                <p className="text-sm text-gray-500">
                  This disclaimer was last updated on {new Date().toLocaleDateString()}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

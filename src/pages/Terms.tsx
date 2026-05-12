import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0d1b2a] text-white selection:bg-gold/30">
      <div className="sticky top-0 z-50 bg-[#0d1b2a]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gold">Legal Documentation</span>
      </div>

      <div className="flex-1 max-w-3xl mx-auto px-6 py-12 pb-32 w-full space-y-12">
        
        <header className="space-y-6 border-b border-white/10 pb-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">TERMS AND CONDITIONS OF USE</h1>
          <p className="text-gold font-serif italic text-lg opacity-90">legal-help-kolkata</p>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
            Please read these Terms and Conditions ('Agreement') carefully before accessing or using the Legal Help Kolkata platform ('Platform', 'we', 'us', or 'our'), accessible at Legal Help Kolkata By accessing or using this Platform in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must immediately discontinue use of this Platform.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">I. ACCEPTANCE OF TERMS</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Legal Help Kolkata provides this Platform as an online directory and & Legal informational resource in Kolkata and across West Bengal. Your use of the Platform constitutes your unconditional acceptance of this Agreement in its entirety. This Agreement applies to all users, including visitors, registered users, and advocates listed on the Platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">II. NATURE OF THE PLATFORM</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Legal Help Kolkata is an online directory and legal information platform. It is NOT a law firm and does NOT provide legal advice, legal representation, or any legal services directly. The Platform:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Connects users with independent advocates and legal practitioners across Kolkata and West Bengal.</li>
            <li>Provides general legal information for educational and informational purposes only.</li>
            <li>Hosts a community forum for general legal queries, which do not constitute attorney-client advice.</li>
            <li>Operates in compliance with the Bar Council of India Rules, 1975, including Rule 36 governing advocates' solicitation of professional work.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4 italic">
            No attorney-client relationship is created between the user and Legal Help Kolkata, or between the user and any listed advocate, solely by virtue of use of this Platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">III. BCI RULE 36 COMPLIANCE</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            In accordance with Rule 36 of the Bar Council of India Rules, 1975, Legal Help Kolkata does not permit advocates listed on this Platform to advertise their services in any manner that is prohibited under applicable Bar Council rules. All advocate profiles on this Platform are informational in nature only. Advocates are listed for the purpose of facilitating public access to legal practitioners and shall not use this Platform to solicit work in contravention of applicable rules of professional conduct.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">IV. ELIGIBILITY AND REGISTRATION</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Certain sections of the Platform, including the legal Q&A forum and advocate directory submission, may require registration. By registering, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Provide accurate, current, and complete registration information.</li>
            <li>Notify Legal Help Kolkata promptly of any changes to your registration information.</li>
            <li>Maintain the confidentiality of your account credentials.</li>
            <li>Accept responsibility for all activities that occur under your account.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4">
            Each registration is for a single individual only. Legal Help Kolkata does not permit access through a single account made available to multiple users. Registration is open to persons who have attained the age of 18 years. If we find that unauthorized use is being made of the Platform, the right of any or all such users may be suspended or terminated without prior notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">V. ADVOCATE LISTINGS</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Advocates listed on this Platform are independent legal practitioners and are not employees, agents, or partners of Legal Help Kolkata. Legal Help Kolkata does not endorse, guarantee, or warrant the quality, competence, or conduct of any advocate listed on the Platform. Users are advised to independently verify the credentials, enrollment number, and standing of any advocate before engaging their services.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Advocates seeking to be listed on this Platform agree that:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>All information provided in their profile is accurate, complete, and compliant with Bar Council of India Rules.</li>
            <li>They hold a valid certificate of enrollment with the Bar Council of West Bengal or such other State Bar Council as applicable.</li>
            <li>They will not use the Platform to solicit work in a manner prohibited under the Bar Council of India Rules.</li>
            <li>They shall promptly notify Legal Help Kolkata of any suspension, disbarment, or disciplinary proceedings against them.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">VI. LEGAL FORUM AND Q&A</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The Platform hosts a legal Q&A forum where users may post general legal questions and advocates may provide general informational responses. Users and advocates acknowledge and agree that:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Responses posted on the forum do not constitute legal advice and do not create an attorney-client relationship.</li>
            <li>The forum is for general informational purposes only and should not be relied upon as a substitute for professional legal counsel.</li>
            <li>Legal Help Kolkata is not responsible for the accuracy, completeness, or legality of any question or response posted on the forum.</li>
            <li>Users should seek independent legal advice before acting on any information obtained through the forum.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">VII. CONFLICT OF INTEREST</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The user understands that advocates listed on this Platform will not be able to perform a conflict-of-interest check between the user and other clients of the advocate solely on the basis of information submitted through this Platform. Conflict checks require the provision of the user's full name, contact information, and details of opposing or related parties, which cannot adequately be conducted through the Platform's submission process alone. Users are advised to disclose all relevant information directly to the advocate they choose to engage.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">VIII. PROHIBITED CONDUCT</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Users of this Platform agree NOT to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Post false, misleading, defamatory, obscene, or unlawful content.</li>
            <li>Impersonate any person, advocate, or organization.</li>
            <li>Use the Platform for any purpose contrary to applicable Indian law or Bar Council rules.</li>
            <li>Attempt to gain unauthorized access to any part of the Platform or its servers.</li>
            <li>Upload or transmit any malicious code, virus, or harmful software.</li>
            <li>Use the Platform to harass, threaten, or intimidate other users or advocates.</li>
            <li>Collect or harvest personal information of other users without consent.</li>
            <li>Use automated tools, bots, or scripts to access or scrape the Platform.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">IX. THIRD PARTY CONTENT</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The Platform may contain links to third-party websites or display third-party content. Legal Help Kolkata is not responsible for and assumes no liability for any inaccuracies, misstatements of law, defamatory content, omissions, or falsehoods in any third-party content appearing on or accessible via this Platform. You understand that third-party content and opinions are neither endorsed by nor reflect the views of Legal Help Kolkata.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">X. ADVERTISERS AND SPONSORS</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The Platform may, from time to time, contain advertising or sponsorship content. Advertisers and sponsors are solely responsible for ensuring that their submitted materials are accurate and comply with all applicable laws, including Bar Council of India Rules. Legal Help Kolkata will not be responsible for any illegality, error, or inaccuracy in such materials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">XI. INTELLECTUAL PROPERTY AND OWNERSHIP</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            This Platform is owned and operated by Legal Help Kolkata. All right, title, and interest in and to the materials provided on this Platform, including but not limited to the name 'Legal Help Kolkata', its logo, design, graphics, text, and software, are the property of Legal Help Kolkata or its licensors.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Except as expressly permitted, no materials from this Platform may be copied, reproduced, republished, downloaded, uploaded, posted, displayed, transmitted, or distributed in any form or by any means without the prior written consent of Legal Help Kolkata. Nothing on this Platform shall be construed to confer any licence under any intellectual property rights of Legal Help Kolkata.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Users are welcome to share links to the Platform's homepage, provided they do not obscure, frame, or distort any portion of the Platform, and that they discontinue sharing links upon request by Legal Help Kolkata.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">XII. DISCLAIMER OF WARRANTIES</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The user expressly agrees that use of the Platform is at the user's sole risk. The Platform is provided on an 'AS IS' and 'AS AVAILABLE' basis. Legal Help Kolkata expressly disclaims all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Legal Help Kolkata makes no warranty that:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>The Platform will meet the user's requirements or be available at all times.</li>
            <li>The Platform will be uninterrupted, timely, secure, or error-free.</li>
            <li>The results obtained from use of the Platform will be accurate or reliable.</li>
            <li>Any defects in the Platform will be corrected.</li>
            <li>The Platform is free of viruses or other harmful components.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4 italic">
            No advice or information, whether oral or written, obtained by any user from Legal Help Kolkata or through the Platform shall create any warranty not expressly stated in this Agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">XIII. LIMITATION OF LIABILITY</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            To the fullest extent permitted by applicable law, Legal Help Kolkata shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>The use of or inability to use the Platform.</li>
            <li>Any information obtained through the Platform.</li>
            <li>Unauthorised access to or alteration of user data or transmissions.</li>
            <li>The conduct or content of any third party or advocate accessed through the Platform.</li>
            <li>Any errors, omissions, or inaccuracies in Platform content.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4">
            This limitation applies whether or not Legal Help Kolkata has been advised of the possibility of such damages and notwithstanding any failure of essential purpose.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">XIV. UNLAWFUL ACTIVITY</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Legal Help Kolkata reserves the right to investigate complaints or reported violations of this Agreement and to take such action as it deems appropriate, including reporting suspected unlawful activity to law enforcement officials, regulators, or other appropriate authorities, and disclosing any information necessary in relation to user profiles, email addresses, usage history, posted materials, IP addresses, and traffic information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">XV. REMEDIES FOR VIOLATIONS</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Legal Help Kolkata reserves the right to seek all remedies available at law and in equity for violations of this Agreement, including but not limited to blocking access to the Platform from any particular IP address.
          </p>
        </section>
      </div>
    </div>
  );
}

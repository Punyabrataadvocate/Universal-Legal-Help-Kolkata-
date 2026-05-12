import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">PRIVACY POLICY</h1>
          <p className="text-gold font-serif italic text-lg opacity-90">legal-help-kolkata</p>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
            Legal Help Kolkata ("we", "us", "our", or "the Platform") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you access or use our platform at https://legal-help-kolkata-rho.vercel.app (the "Platform").
          </p>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
            This Privacy Policy must be read in conjunction with our Terms and Conditions. By using the Platform, you consent to the data practices described in this Privacy Policy. If you do not agree with any part of this Policy, please discontinue your use of the Platform immediately.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">I. INFORMATION WE COLLECT</h2>
          
          <h3 className="text-lg font-bold font-serif text-white/90">A. Information You Provide Directly</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            We collect personal information that you voluntarily provide when using our Platform, including:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Full name, phone number, and legal query description when you submit a legal query through the Platform.</li>
            <li>Name, Bar Council enrollment number, court of practice, specialisation, phone number, and email address when you register as an advocate.</li>
            <li>Name (or anonymous identifier) and question or answer text when you participate in the Free Legal Blog or Q&A section.</li>
            <li>Email address and Google account information when you authenticate via Google Sign-In for advocate registration.</li>
          </ul>

          <h3 className="text-lg font-bold font-serif text-white/90 mt-6">B. Information Collected Automatically</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            When you access the Platform, we may automatically collect certain technical information, including:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Internet Protocol (IP) address and approximate geographic location.</li>
            <li>Browser type, version, and operating system.</li>
            <li>Pages visited, time spent on pages, and navigation patterns.</li>
            <li>Referring URL and exit pages.</li>
            <li>Device information including screen resolution and device type.</li>
          </ul>

          <h3 className="text-lg font-bold font-serif text-white/90 mt-6">C. Firebase and Google Authentication Data</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            The Platform uses Google Firebase for authentication and data storage. When you log in via Google Sign-In, Google may share your name, email address, and profile picture with us as part of the authentication process. This data is governed both by this Privacy Policy and by Google's Privacy Policy available at https://policies.google.com/privacy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">II. HOW WE USE YOUR INFORMATION</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We use the personal information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>To receive, process, and respond to legal queries submitted by users.</li>
            <li>To verify and display advocate profiles in the Advocate Directory upon admin approval.</li>
            <li>To facilitate the Free Legal Blog and Q&A forum for community legal awareness.</li>
            <li>To communicate with users and advocates regarding their submissions or registrations.</li>
            <li>To manage and improve the Platform's functionality, performance, and security.</li>
            <li>To comply with applicable legal obligations under Indian law.</li>
            <li>To investigate and address reported violations of our Terms and Conditions.</li>
            <li>To prevent fraudulent, abusive, or unlawful use of the Platform.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4 italic">
            We do not sell, rent, or trade your personal information to third parties for commercial or marketing purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">III. LEGAL BASIS FOR PROCESSING YOUR DATA</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We process your personal data on the following legal bases:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li><strong>Consent:</strong> Where you have given us your express consent, for example by submitting a query form or registering as an advocate.</li>
            <li><strong>Contractual Necessity:</strong> Where processing is necessary to provide you with services you have requested through the Platform.</li>
            <li><strong>Legitimate Interests:</strong> Where processing is necessary for our legitimate interests in operating and improving the Platform, provided those interests are not overridden by your rights.</li>
            <li><strong>Legal Compliance:</strong> Where processing is required by applicable law or regulatory obligation.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">IV. SHARING OF YOUR INFORMATION</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We do not share your personal information with third parties except in the following limited circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li><strong>Service Providers:</strong> We use Google Firebase (Firestore and Authentication) to store and manage data. Firebase processes data in accordance with Google's data processing terms.</li>
            <li><strong>Legal Obligations:</strong> We may disclose your information if required to do so by law, court order, or governmental authority, or where necessary to protect the rights, property, or safety of Legal Help Kolkata, its users, or the public.</li>
            <li><strong>Platform Administration:</strong> The designated Admin of the Platform (accessible only via authorised email addresses) has access to user query submissions and advocate registration data strictly for the purposes of platform management and quality control.</li>
            <li><strong>Advocate Profiles:</strong> Upon admin approval, basic advocate profile information (name, enrollment number, court of practice, and specialisation) will be displayed publicly in the Advocate Directory.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4">
            We do not share the content of legal queries submitted by users with any third party, including listed advocates, without the user's express consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">V. DATA STORAGE AND SECURITY</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Your personal data is stored on Google Firebase Firestore, which employs industry-standard security measures including encryption in transit (TLS/SSL) and at rest. Access to sensitive collections such as user queries and advocate registrations is restricted by Firebase Security Rules to authorised admin email addresses only.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            While we take all reasonable steps to protect your personal data, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee the absolute security of your data. You use the Platform at your own risk and are responsible for maintaining the security of your own account credentials.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Data is stored on servers that may be located outside the Republic of India, including in data centres operated by Google LLC. By using the Platform, you consent to such cross-border data transfers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">VI. DATA RETENTION</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy, and in accordance with applicable law.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li><strong>Legal query submissions:</strong> Retained for a period of 12 months from the date of submission, or until deleted by the Admin, whichever is earlier.</li>
            <li><strong>Advocate registration data:</strong> Retained for the duration of the advocate's active listing on the Platform, and for a period of 24 months following removal or rejection.</li>
            <li><strong>Blog questions and answers:</strong> Retained indefinitely unless deleted by the Admin or upon a valid deletion request from the author.</li>
            <li><strong>Google authentication data:</strong> Retained for the duration of your registered account and for a period of 6 months following account deletion.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4">
            Upon expiry of the applicable retention period, or upon a valid deletion request, we will securely delete or anonymise your personal data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">VII. YOUR DATA RIGHTS</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Subject to applicable law, you have the following rights in relation to your personal data held by us:
          </p>
          <h3 className="text-lg font-bold font-serif text-white/90">A. Right to Access</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            You have the right to request a copy of the personal data we hold about you. To exercise this right, please contact us at 1legalhelpkolkata@gmail.com with the subject line: "Data Access Request". We will respond within 30 days of receiving your request.
          </p>
          <h3 className="text-lg font-bold font-serif text-white/90 mt-4">B. Right to Correction</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            If any personal data we hold about you is inaccurate or incomplete, you have the right to request correction. Please contact us at 1legalhelpkolkata@gmail.com with the subject line: "Data Correction Request", specifying the information to be corrected.
          </p>
          <h3 className="text-lg font-bold font-serif text-white/90 mt-4">C. Right to Object</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            You have the right to object to the processing of your personal data where we are relying on legitimate interests as the legal basis for processing. We will consider your objection and cease processing unless we have compelling legitimate grounds to continue or processing is required for legal claims.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">VIII. DATA DELETION POLICY</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Legal Help Kolkata is fully committed to honouring your right to erasure of personal data. We provide both administrative and self-service deletion options as described below.
          </p>
          
          <h3 className="text-lg font-bold font-serif text-white/90">A. Admin-Initiated Deletion</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            The Platform Administrator has the authority and technical capability to delete the following categories of data at any time:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Any legal query submitted through the Platform.</li>
            <li>Any advocate registration record, whether pending, approved, or rejected.</li>
            <li>Any blog question or answer posted on the Free Legal Blog.</li>
            <li>Any user account data stored in Firebase Authentication or Firestore.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-2 italic">
            Admin deletion is permanent and irreversible. Data deleted by the Admin is removed from all Firebase Firestore collections and cannot be recovered.
          </p>

          <h3 className="text-lg font-bold font-serif text-white/90 mt-6">B. Self-Deletion: Advocate Registration</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Advocates who have registered on the Platform may request deletion of their own profile and associated registration data by:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Logging into the Platform via Google Sign-In on the Advocate Portal.</li>
            <li>Navigating to their profile or registration record.</li>
            <li>Selecting the 'Delete My Registration' or 'Remove My Profile' option where available.</li>
            <li>Alternatively, sending a deletion request by email to 1legalhelpkolkata@gmail.com from the email address used for registration, with the subject line: "Request for Data Deletion — Advocate Registration".</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-2">
            Upon a valid deletion request, we will permanently delete your advocate registration record and remove your profile from the Advocate Directory within 7 working days.
          </p>

          <h3 className="text-lg font-bold font-serif text-white/90 mt-6">C. Self-Deletion: Blog Posts and Answers</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Users who have posted questions or answers on the Free Legal Blog may request deletion of their content by:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Contacting us at 1legalhelpkolkata@gmail.com with the subject line: "Request for Content Deletion — Blog", providing the question or answer text and approximate date of posting.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-2">
            The Platform Administrator will review and process the deletion request within 7 working days.
            <br/><br/>
            Please note that anonymous posts may be more difficult to verify for the purpose of a deletion request. We may request additional information to confirm your identity before processing deletion of anonymous content.
          </p>

          <h3 className="text-lg font-bold font-serif text-white/90 mt-6">D. Self-Deletion: Legal Query Submissions</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Users who have submitted a legal query through the Platform may request deletion of their submission by:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Contacting us at 1legalhelpkolkata@gmail.com with the subject line: "Request for Data Deletion — Legal Query", providing your name, phone number, and approximate date of submission.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-2">
            The Platform Administrator will permanently delete your query record from Firestore within 7 working days of verifying your identity.
          </p>

          <h3 className="text-lg font-bold font-serif text-white/90 mt-6">E. Google Account and Firebase Authentication Data</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            If you wish to delete your Google authentication data associated with the Platform, you must:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>First submit a deletion request to us at 1legalhelpkolkata@gmail.com so that we can delete your associated Firestore records.</li>
            <li>Then separately revoke Legal Help Kolkata's access to your Google Account by visiting your Google Account settings at https://myaccount.google.com/permissions and removing the Platform's access.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-2 italic">
            Please note that revoking Google access alone does not delete data already stored in our Firestore database. You must contact us directly for complete data deletion.
          </p>

          <h3 className="text-lg font-bold font-serif text-white/90 mt-6">F. Right to Deletion: Play Store Users</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            If you have downloaded or accessed Legal Help Kolkata through the Google Play Store, you may also request deletion of your data directly by visiting:
            <br/>
            <span className="text-gold break-all block mt-2">https://legal-help-kolkata-rho.vercel.app/delete-data</span>
          </p>
          <p className="text-white/60 text-sm leading-relaxed mt-2">
            This page provides a dedicated data deletion request form as required by Google Play Store policy. Requests submitted through this form will be processed within 7 working days.
          </p>

          <h3 className="text-lg font-bold font-serif text-white/90 mt-6">G. Limitations on Deletion</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Please note that we may be unable to delete certain data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 text-sm">
            <li>Where retention is required by applicable Indian law, regulation, or court order.</li>
            <li>Where deletion would prejudice ongoing legal proceedings or investigations.</li>
            <li>Where the data has already been anonymised and can no longer be associated with your identity.</li>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-2">
            In such cases, we will inform you of the reason for any limitation on deletion and the expected period of continued retention.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">IX. COOKIES AND TRACKING TECHNOLOGIES</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The Platform may use essential cookies and browser local storage to maintain your session and remember your preferences. These are technically necessary for the Platform to function correctly. We do not use third-party advertising cookies or tracking pixels for commercial purposes.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            You may configure your browser to refuse cookies or to alert you when cookies are being sent. However, disabling cookies may affect the functionality of certain features of the Platform, including the authentication process.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">X. CHILDREN'S PRIVACY</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The Platform is not directed at persons under the age of 18 years. We do not knowingly collect personal information from minors. If you are a parent or guardian and believe that your child has provided personal information to us, please contact us immediately at 1legalhelpkolkata@gmail.com. We will take prompt steps to delete such information from our systems.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">XI. THIRD-PARTY LINKS AND SERVICES</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The Platform may contain links to third-party websites, including Google services, Bar Council of India resources, and other legal information platforms. This Privacy Policy applies solely to the Legal Help Kolkata Platform. We are not responsible for the privacy practices of any third-party website. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">XII. CHANGES TO THIS PRIVACY POLICY</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We reserve the right to amend this Privacy Policy at any time. Where we make material changes, we will notify users by posting a prominent notice on the Platform and updating the "Last Updated" date at the top of this document. Your continued use of the Platform following the posting of changes constitutes your acceptance of the revised Privacy Policy.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">XIII. GRIEVANCE OFFICER AND CONTACT</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            In accordance with applicable Indian information technology law, Legal Help Kolkata designates the following as the Grievance Officer for the purposes of receiving and addressing complaints regarding this Privacy Policy or the handling of personal data:
          </p>
          <div className="bg-white/5 p-4 rounded-xl text-sm text-white/80 space-y-2 mt-4 font-mono">
            <p><span className="text-gold font-bold">Grievance Officer:</span> Legal Help Kolkata Administration</p>
            <p><span className="text-gold font-bold">Email:</span> 1legalhelpkolkata@gmail.com</p>
            <p><span className="text-gold font-bold">Platform:</span> legal-help-kolkata app</p>
            <p><span className="text-gold font-bold">Response Time:</span> We will acknowledge your grievance within 48 hours and endeavour to resolve it within 30 days of receipt.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

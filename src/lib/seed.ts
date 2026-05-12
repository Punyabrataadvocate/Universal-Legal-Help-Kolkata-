import { db } from './firebase';
import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';

export async function seedDatabase() {
  const blogRef = collection(db, 'blog_posts');
  const advRef = collection(db, 'public_advocates');
  
  const batch = writeBatch(db);

  // Check if blog already seeded
  const blogSnap = await getDocs(blogRef);
  if (blogSnap.empty) {
    const articles = [
    {
      title: 'Tenant Rights in West Bengal: What Every Renter Should Know',
      category: 'Property & Land Dispute',
      content: 'Under the West Bengal Premises Tenancy Act, renters have specific protections against arbitrary eviction. A landlord must provide written notice and have valid grounds (such as non-payment or personal requirement) to initiate eviction. Always ensure your rental agreement is registered if it is for 12 months or longer.',
      author: 'Legal Help Kolkata Admin',
      isQnA: false,
      createdAt: new Date()
    },
    {
      title: 'How to File a Consumer Complaint in Kolkata — Step by Step',
      category: 'Consumer Complaint',
      content: 'If you have been sold a defective product or deficient service, you can approach the District Consumer Disputes Redressal Commission. You do not necessarily need an advocate. A well-drafted complaint with purchase proof (bills/receipts) and a legal notice previously sent to the seller is usually sufficient to start the process.',
      author: 'Legal Help Kolkata Admin',
      isQnA: false,
      createdAt: new Date()
    },
    {
      title: 'Your Rights During Police Arrest — Indian Law Explained',
      category: 'Criminal Matter',
      content: 'Article 22 of the Indian Constitution grants you the right to be informed of the grounds of arrest and the right to consult a legal practitioner. You must be produced before a magistrate within 24 hours of arrest. Women can generally only be arrested between sunrise and sunset, and by a female police officer.',
      author: 'Legal Help Kolkata Admin',
      isQnA: false,
      createdAt: new Date()
    },
    {
      title: 'Cyber Crime in India: How to File an FIR Online',
      category: 'Cyber Crime',
      content: 'If you are a victim of financial fraud, phishing, or identity theft, you can report it on the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call the helpline number 1930. Prompt reporting within the "golden hour" can help freeze the fraudster\'s accounts.',
      author: 'Legal Help Kolkata Admin',
      isQnA: false,
      createdAt: new Date()
    }
  ];

    for (const article of articles) {
      const docRef = doc(collection(db, 'blog_posts'));
      batch.set(docRef, article);
    }
  }
  
  // Check if advocates already seeded
  const advSnap = await getDocs(advRef);
  if (advSnap.empty) {
    // Seed some advocates
    const advocates = [
    {
      fullName: 'Mousumi Roy',
      experienceYears: 7,
      courtOfPractice: 'Sealdah Court',
      specialization: ['Civil Matter', 'Family & Matrimonial'],
      enrollmentNumber: 'WB/111/2016',
      updatedAt: new Date()
    },
    {
      fullName: 'Sutapa Mondal',
      experienceYears: 15,
      courtOfPractice: "Alipore Judge's Court",
      specialization: ['Criminal Matter', 'Family & Matrimonial'],
      enrollmentNumber: 'WB/222/2009',
      updatedAt: new Date()
    },
    {
      fullName: 'Aninda Sarkar',
      experienceYears: 23,
      courtOfPractice: 'High Court Calcutta',
      specialization: ['Civil Matter', 'Property Registration'],
      enrollmentNumber: 'WB/333/2001',
      updatedAt: new Date()
    },
    {
      fullName: 'Tarun Kanti Ghosh',
      experienceYears: 22,
      courtOfPractice: "Alipore Judge's Court",
      specialization: ['Criminal Matter', 'Civil Matter'],
      enrollmentNumber: 'WB/444/2002',
      updatedAt: new Date()
    },
    {
      fullName: 'Rajib Gangopadhyay',
      experienceYears: 21,
      courtOfPractice: "Alipore Judge's Court",
      specialization: ['Criminal Matter', 'Property & Land Dispute'],
      enrollmentNumber: 'WB/555/2003',
      updatedAt: new Date()
    },
    {
      fullName: 'Punyabrata Mukherjee',
      experienceYears: 22,
      courtOfPractice: 'High Court calcutta',
      specialization: ['Property & Land Dispute', 'Criminal Matter'],
      enrollmentNumber: 'WB/666/2002',
      updatedAt: new Date()
    }
  ];

    for (const adv of advocates) {
      const docRef = doc(collection(db, 'public_advocates'));
      batch.set(docRef, adv);
    }
  }

  await batch.commit();
  console.log("Seeding complete!");
}

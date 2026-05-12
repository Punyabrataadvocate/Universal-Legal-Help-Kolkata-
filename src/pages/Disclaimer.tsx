import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Disclaimer({ setAgreed }: { setAgreed: (agreed: boolean) => void }) {
  const navigate = useNavigate();

  const handleAgree = () => {
    localStorage.setItem('disclaimerAgreed', 'true');
    setAgreed(true);
    navigate('/');
  };

  return (
    <div className="flex flex-col justify-end min-h-[100dvh] md:min-h-full bg-black/60 backdrop-blur-sm p-4 pb-0 md:justify-center">
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="rounded-t-3xl md:rounded-3xl border-none shadow-2xl overflow-hidden bg-white">
          <div className="h-1.5 w-16 bg-gray-200 rounded-full mx-auto mt-4 md:hidden" />
          <CardHeader className="text-center pb-2 pt-6">
            <CardTitle className="text-2xl font-serif text-primary">Mandatory Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700 leading-relaxed px-6 py-4">
            <p className="font-semibold text-primary">As per Bar Council of India Rules:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>This platform is <strong>not a law firm</strong>.</li>
              <li>No legal advice is provided here. Information is for awareness purposes only.</li>
              <li>Advocates listed are independent professionals.</li>
              <li>This platform does not solicit clients or guarantee case outcomes.</li>
            </ul>
          </CardContent>
          <CardFooter className="pt-2 pb-8 px-6">
            <Button 
              onClick={handleAgree} 
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-14 text-lg tracking-wide rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              I Agree & Continue
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

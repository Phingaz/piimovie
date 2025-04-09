import { authClient } from '@/lib/auth';
import { clientToastError } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const SignInBtn = () => {
  const [loading, setLoading] = React.useState(false);

  const googleAuthSignIn = async () => {
    if (loading) return;
    try {
      const currentUrl = window.location.href;
      const redirectUrl = new URL(currentUrl);
      console.log({currentUrl, redirectUrl})
      setLoading(true);
      await authClient.signIn.social({ provider: 'google', callbackURL: redirectUrl.toString() });
    } catch (error: unknown) {
      clientToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      className="flex items-center gap-3 w-fit bg-[#000] hover:bg-blue-950 px-3 transition-all text-gray-100 h-[40px] rounded-full text-sm cursor-pointer"
      onClick={googleAuthSignIn}
    >
      {loading ? (
        <>
          Please wait ... <Loader2 size={17} className="animate-spin" />
        </>
      ) : (
        <>
          <Image
            width={20}
            height={20}
            src="/google.svg"
            alt="google-logo"
            className=" object-cover object-center min-w-fit size-[25px]"
          />
          Sign in with google
        </>
      )}
    </motion.button>
  );
};

export default SignInBtn;

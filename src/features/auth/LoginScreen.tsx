import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const handleMockGoogleLogin = async () => {
    setIsLoading(true);
    await login();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Premium Minimal Backdrop Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-slate-900/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-slate-900/30 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-900 rounded-lg p-8 shadow-2xl backdrop-blur-md z-10 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-950 font-extrabold text-lg tracking-widest shadow">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-wider text-slate-100 leading-none">ExecutiveOS</span>
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider mt-0.5">Private Terminal</span>
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">ExecutiveOS</h1>
          <p className="text-xs text-slate-400">
            Your AI executive operating assistant
          </p>
        </div>

        {/* Main Action */}
        <div className="w-full space-y-4">
          <Button
            onClick={handleMockGoogleLogin}
            isLoading={isLoading}
            variant="primary"
            className="w-full h-11 flex items-center justify-center gap-3 border-slate-200"
          >
            {/* Mock Google Icon SVG */}
            <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-900" />
            <span className="text-[10px] font-mono uppercase text-slate-500 px-3 tracking-widest">or sandbox access</span>
            <div className="flex-1 border-t border-slate-900" />
          </div>

          {/* Quick Mock Bypass */}
          <Button
            onClick={handleMockGoogleLogin}
            variant="secondary"
            className="w-full h-11 text-xs border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300"
          >
            <span>Launch Sandbox Console</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2 text-slate-400" />
          </Button>
        </div>

        {/* Security Statement Footer */}
        <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-500 border-t border-slate-900/50 pt-5 w-full justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="tracking-wide">End-to-End Encryption • Private Enclave</span>
        </div>

      </div>

      {/* Micro Info Note */}
      <span className="absolute bottom-5 text-[10px] text-slate-600 font-mono tracking-wider">
        EXECUTIVEOS • VERSION 1.0.0 (SECURE SANDBOX)
      </span>

    </div>
  );
};

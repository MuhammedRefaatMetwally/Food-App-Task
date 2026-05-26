'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const { register } = useAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
    } catch {
      toast.error('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/40">

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 18 }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30 mb-4"
            >
              <UtensilsCrossed className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">{t('register')}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create an account to start ordering
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                id: 'name',
                label: t('name'),
                type: 'text',
                value: name,
                onChange: setName,
                placeholder: 'John Doe',
                Icon: User,
              },
              {
                id: 'email',
                label: t('email'),
                type: 'email',
                value: email,
                onChange: setEmail,
                placeholder: 'you@example.com',
                Icon: Mail,
              },
              {
                id: 'password',
                label: t('password'),
                type: 'password',
                value: password,
                onChange: setPassword,
                placeholder: '••••••••',
                Icon: Lock,
              },
            ].map(({ id, label, type, value, onChange, placeholder, Icon }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="space-y-1.5"
              >
                <Label htmlFor={id} className="text-sm font-medium">
                  {label}
                </Label>
                <div className="relative group">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors duration-200" />
                  <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    className="pl-10 rounded-xl border-border/70 bg-background/60 h-11 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                  />
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="pt-1"
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 font-semibold text-base gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-orange-500/35 active:scale-[0.98]"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {t('registerBtn')}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            {t('haveAccount')}{' '}
            <Link
              href={`/${locale}/auth/login`}
              className="text-orange-500 hover:text-orange-600 font-semibold hover:underline underline-offset-2 transition-colors"
            >
              {t('login')}
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
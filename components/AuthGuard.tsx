'use client';

import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { User } from '@/lib/types';
import AuthForm from './AuthForm';
import OnboardingWizard from './OnboardingWizard';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const currentUser = storage.getUser();
    setUser(currentUser);

    if (currentUser && !currentUser.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }

    setIsLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    storage.saveUser(newUser);
    setUser(newUser);

    if (!newUser.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      storage.saveUser(updatedUser);
      setUser(updatedUser);
      setShowOnboarding(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--base03)',
        color: 'var(--base0)'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingWizard
        userName={user.name}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return <>{children}</>;
}

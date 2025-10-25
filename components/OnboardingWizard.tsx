'use client';

import { useState } from 'react';
import { Role } from '@/lib/types';
import { rolesApi } from '@/lib/api';
import LiahonaIcon from './LiahonaIcon';
import styles from './OnboardingWizard.module.css';

interface OnboardingWizardProps {
  userName: string;
  onComplete: () => void;
}

export default function OnboardingWizard({ userName, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles: Omit<Role, 'id' | 'order'>[] = [
    { label: 'Personal', icon: '👤', slug: 'personal' },
    { label: 'Spouse', icon: '💑', slug: 'spouse' },
    { label: 'Parent', icon: '👨‍👩‍👧‍👦', slug: 'parent' },
    { label: 'Church Calling', icon: '📞', slug: 'calling' },
    { label: 'Work/Career', icon: '💼', slug: 'work' },
    { label: 'Friend', icon: '👫', slug: 'friend' },
    { label: 'Student', icon: '🎓', slug: 'student' },
    { label: 'Teacher', icon: '📚', slug: 'teacher' },
  ];

  const toggleRole = (slug: string) => {
    if (selectedRoles.includes(slug)) {
      setSelectedRoles(selectedRoles.filter(r => r !== slug));
    } else {
      setSelectedRoles([...selectedRoles, slug]);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save selected roles using API
      const rolesToCreate = availableRoles
        .filter(role => selectedRoles.includes(role.slug))
        .map((role, index) => ({
          ...role,
          order: index + 1,
        }));

      for (const role of rolesToCreate) {
        await rolesApi.create(role);
      }

      onComplete();
    } catch (error) {
      console.error('Failed to create roles:', error);
      alert('Failed to save roles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (selectedRoles.length === 0) {
        alert('Please select at least one role to continue');
        return;
      }
      setStep(3);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className={styles.onboardingContainer}>
      <div className={styles.onboardingCard}>
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.welcomeIcon}>
              <LiahonaIcon size={80} />
            </div>
            <h1 className={styles.title}>Welcome, {userName}!</h1>
            <p className={styles.description}>
              We're excited to help you on your Book of Mormon study journey.
              Let's take a moment to personalize your experience.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📖</span>
                <div>
                  <h3>Topic-Based Study</h3>
                  <p>Organize your study by life topics and roles</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🔍</span>
                <div>
                  <h3>Smart Sources</h3>
                  <p>Get personalized scripture and conference references</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📊</span>
                <div>
                  <h3>Track Progress</h3>
                  <p>Monitor your study time and completed topics</p>
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={handleNext}>
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Roles */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Choose Your Roles</h1>
            <p className={styles.description}>
              Select the roles that matter most to you. These will help organize your study topics.
            </p>
            <div className={styles.rolesGrid}>
              {availableRoles.map((role) => (
                <button
                  key={role.slug}
                  className={`${styles.roleCard} ${
                    selectedRoles.includes(role.slug) ? styles.selected : ''
                  }`}
                  onClick={() => toggleRole(role.slug)}
                >
                  <span className={styles.roleIcon}>{role.icon}</span>
                  <span className={styles.roleLabel}>{role.label}</span>
                  {selectedRoles.includes(role.slug) && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              <button className={styles.secondaryButton} onClick={() => setStep(1)}>
                Back
              </button>
              <button className={styles.primaryButton} onClick={handleNext}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Ready to Start */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.successIcon}>🎉</div>
            <h1 className={styles.title}>You're All Set!</h1>
            <p className={styles.description}>
              You've selected {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''}.
              You can always add or edit roles later from the sidebar.
            </p>
            <div className={styles.tipBox}>
              <h3>💡 Quick Tip</h3>
              <p>
                Start by creating your first topic! Think about a question, challenge,
                or principle you'd like to study in the Book of Mormon.
              </p>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={handleComplete}
                disabled={isLoading}
              >
                {isLoading ? 'Setting up...' : 'Start Studying'}
              </button>
            </div>
          </div>
        )}

        <div className={styles.stepIndicator}>
          <div className={`${styles.stepDot} ${step >= 1 ? styles.active : ''}`} />
          <div className={`${styles.stepDot} ${step >= 2 ? styles.active : ''}`} />
          <div className={`${styles.stepDot} ${step >= 3 ? styles.active : ''}`} />
        </div>

        <button className={styles.skipButton} onClick={handleSkip}>
          Skip onboarding
        </button>
      </div>
    </div>
  );
}

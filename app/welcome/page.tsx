'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import LiahonaIcon from '@/components/LiahonaIcon';
import styles from './welcome.module.css';

export default function WelcomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (session?.user) {
      router.push('/');
    }
  }, [session, router]);

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className={styles.welcomeContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoSection}>
            <LiahonaIcon size={120} className={styles.heroIcon} />
            <h1 className={styles.heroTitle}>
              Liahona <span className={styles.highlight}>Everyday</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Your Personal Book of Mormon Study Companion
            </p>
          </div>

          <div className={styles.heroDescription}>
            <p>
              Organize your scripture study by life roles, discover relevant passages,
              and track your spiritual growth—all in one beautiful, focused platform.
            </p>
          </div>

          <button className={styles.ctaButton} onClick={handleGetStarted}>
            Get Started
            <span className={styles.arrow}>→</span>
          </button>
        </div>

        {/* Animated Background Elements */}
        <div className={styles.backgroundElements}>
          <div className={styles.glassOrb1}></div>
          <div className={styles.glassOrb2}></div>
          <div className={styles.glassOrb3}></div>
        </div>
      </section>

      {/* Quote Section */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteCard}>
          <div className={styles.quoteIcon}>📖</div>
          <blockquote className={styles.quote}>
            <p>
              "My dear brothers and sisters, I promise that as you prayerfully study
              the Book of Mormon every day, you will make better decisions—every day.
              I promise that as you ponder what you study, the windows of heaven will
              open, and you will receive answers to your own questions and direction
              for your own life."
            </p>
            <footer className={styles.quoteAuthor}>
              — President Russell M. Nelson
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Study Smarter, Grow Deeper</h2>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>Topic-Based Organization</h3>
            <p className={styles.featureDescription}>
              Create study topics organized by your life roles—Personal, Marriage,
              Parenting, Calling, and Work. Apply scriptures where they matter most.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3 className={styles.featureTitle}>Smart Scripture Discovery</h3>
            <p className={styles.featureDescription}>
              Automatically find relevant Book of Mormon passages and General Conference
              talks based on your study topics and life situations.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏱️</div>
            <h3 className={styles.featureTitle}>Track Your Progress</h3>
            <p className={styles.featureDescription}>
              Monitor study time, mark completed topics, and see your spiritual
              journey unfold with beautiful progress tracking.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✨</div>
            <h3 className={styles.featureTitle}>Beautiful Experience</h3>
            <p className={styles.featureDescription}>
              Study in a distraction-free, modern interface designed with
              Apple's Liquid Glass UI for a peaceful, focused experience.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📝</div>
            <h3 className={styles.featureTitle}>Custom Roles</h3>
            <p className={styles.featureDescription}>
              Create custom roles that reflect your unique life circumstances
              and organize topics that matter to you.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>Private & Secure</h3>
            <p className={styles.featureDescription}>
              Your study journey is personal. All your data is private and
              securely stored with modern authentication.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>

        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Choose Your Roles</h3>
              <p className={styles.stepDescription}>
                Select the roles that matter most in your life—Parent, Spouse,
                Leader, Student, or create your own.
              </p>
            </div>
          </div>

          <div className={styles.stepConnector}></div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Create Topics</h3>
              <p className={styles.stepDescription}>
                Describe real-life situations, questions, or principles you want
                to study in the Book of Mormon.
              </p>
            </div>
          </div>

          <div className={styles.stepConnector}></div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Study & Grow</h3>
              <p className={styles.stepDescription}>
                Explore suggested scriptures, track your time, and watch as the
                windows of heaven open in your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Begin Your Journey Today</h2>
          <p className={styles.ctaDescription}>
            Join others who are making the Book of Mormon a daily part of their lives
          </p>
          <button className={styles.ctaButtonLarge} onClick={handleGetStarted}>
            Get Started Free
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Built with love for Book of Mormon study
        </p>
        <p className={styles.footerNote}>
          Not affiliated with The Church of Jesus Christ of Latter-day Saints
        </p>
      </footer>
    </div>
  );
}

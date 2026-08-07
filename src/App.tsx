import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { PageTransition } from '@/components/shared/page-transition';
import { AppLayout } from '@/layouts/app-layout';
import { ProtectedRoute } from '@/features/auth/protected-route';
import { AuthPage } from '@/features/auth/auth-page';
import { OnboardingPage } from '@/features/onboarding/onboarding-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { BirthChartPage } from '@/features/birth-chart/birth-chart-page';
import { AiAstrologerPage } from '@/features/ai-astrologer/ai-astrologer-page';
import { ProfilePage } from '@/features/profile/profile-page';
import { KundaliPage } from '@/features/kundali/kundali-page';
import { PricingPage } from '@/features/pricing/pricing-page';
import { MarriageMatchingPage } from '@/features/marriage-matching/marriage-matching-page';

function App() {
  return (
    <QueryProvider>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <Routes>
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/birth-chart" element={<BirthChartPage />} />
                    <Route path="/astrologer" element={<AiAstrologerPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/kundali" element={<KundaliPage />} />
                    <Route path="/marriage-matching" element={<MarriageMatchingPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </QueryProvider>
  );
}

export default App;

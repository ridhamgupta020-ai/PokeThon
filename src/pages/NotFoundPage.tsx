import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer maxWidth="sm">
      <div className="py-20 text-center space-y-6">
        <div className="text-7xl font-black font-mono text-[#FFD83D] tracking-tighter">
          404
        </div>
        <h2 className="text-3xl font-black text-[#F5F7FC]">Route Not Found</h2>
        <p className="text-base text-[#B9C7D9] max-w-md mx-auto">
          The requested coordinate does not exist in the PokeThon network. Navigate back to the main stage.
        </p>
        <div className="pt-4 flex justify-center">
          <Link to="/">
            <PrimaryButton variant="yellow" icon={<Zap className="w-4 h-4 fill-current" />}>
              Return to Main Stage
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

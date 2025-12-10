import ParentNavbar from '../../../components/navigation/ParentNavbar';
import Footer from '../../../components/Footer';

import BusInformationCard from '../../../components/BusInformationCard';

import RecentUpdates from '../../../components/RecentUpdates';


export default function ParentDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ParentNavbar />
      <main className='flex-1 p-4 md:p-6'>
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column */}
          <div className="lg:w-2/5">
            
            <BusInformationCard />
            
          </div>

          {/* Right Column - Map Area */}
          <div className="lg:w-3/5">
            
          </div>
        </div>

        {/* Recent Updates Section */}
         <RecentUpdates/>
      </main>
      <Footer />
    </div>
  );
}